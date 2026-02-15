import fs from "fs";
import path from "path";

export interface Row {
  age: number;
  income: number;
  creditHistoryMonths: number;
  numCreditAccounts: number;
  debtRatio: number;
  numLatePayments: number;
  target: number | null; // 1=fraud, 0=not fraud, null=unknown (rejected)
  status: string;
}

export interface ClaimRow extends Row {
  id: string;
  riskScore: number;
  riskLevel: string;
}

function computeRiskScore(row: Row): number {
  const s =
    row.debtRatio * 0.4 +
    (Math.min(row.numLatePayments, 5) / 5) * 0.3 +
    (1 - Math.min(row.creditHistoryMonths, 120) / 120) * 0.2 +
    (Math.min(row.numCreditAccounts, 8) / 8) * 0.1;
  return Math.max(0, Math.min(1, s));
}

function riskLevel(score: number): string {
  if (score < 0.3) return "low";
  if (score < 0.5) return "medium";
  if (score < 0.7) return "high";
  return "critical";
}

let cachedRows: Row[] | null = null;

export function parseCSV(): Row[] {
  if (cachedRows) return cachedRows;

  const csvPath = path.join(process.cwd(), "data", "telecom_data.csv");
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.trim().split("\n");

  cachedRows = lines.slice(1).map((line) => {
    const [age, income, creditHistoryMonths, numCreditAccounts, debtRatio, numLatePayments, target, status] = line.split(",");
    return {
      age: parseInt(age),
      income: parseInt(income),
      creditHistoryMonths: parseInt(creditHistoryMonths),
      numCreditAccounts: parseInt(numCreditAccounts),
      debtRatio: parseFloat(debtRatio),
      numLatePayments: parseInt(numLatePayments),
      target: target.trim() === "" ? null : parseFloat(target),
      status: status.trim(),
    };
  });

  return cachedRows;
}

export function computeStats(page = 1, limit = 20, riskFilter = "all", search = "") {
  const rows = parseCSV();

  // KPIs
  const total = rows.length;
  const fraudDetected = rows.filter((r) => r.target === 1).length;
  const rejected = rows.filter((r) => r.status === "rejected").length;
  const approved = rows.filter((r) => r.status === "approved").length;
  const avgIncome = Math.round(rows.reduce((s, r) => s + r.income, 0) / total);

  // Risk distribution (based on computed risk score)
  const claims: ClaimRow[] = rows.map((r, i) => {
    const score = computeRiskScore(r);
    return { ...r, id: `CLM-${String(i + 1).padStart(4, "0")}`, riskScore: score, riskLevel: riskLevel(score) };
  });

  const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };
  claims.forEach((c) => { riskCounts[c.riskLevel as keyof typeof riskCounts]++; });
  const riskDistribution = [
    { name: "Low", value: +((riskCounts.low / total) * 100).toFixed(1), color: "#10B981" },
    { name: "Medium", value: +((riskCounts.medium / total) * 100).toFixed(1), color: "#FBBF24" },
    { name: "High", value: +((riskCounts.high / total) * 100).toFixed(1), color: "#F97316" },
    { name: "Critical", value: +((riskCounts.critical / total) * 100).toFixed(1), color: "#EF4444" },
  ];

  // Fraud by category (dominant risk factor among fraud cases)
  const fraudRows = rows.filter((r) => r.target === 1);
  const highDebt = fraudRows.filter((r) => r.debtRatio > 0.4).length;
  const latePayments = fraudRows.filter((r) => r.numLatePayments >= 3).length;
  const lowCredit = fraudRows.filter((r) => r.creditHistoryMonths < 12).length;
  const multiAccounts = fraudRows.filter((r) => r.numCreditAccounts >= 5).length;
  const catTotal = highDebt + latePayments + lowCredit + multiAccounts || 1;
  const fraudByCategory = [
    { category: "High Debt Ratio", pct: +((highDebt / catTotal) * 100).toFixed(1) },
    { category: "Late Payments (3+)", pct: +((latePayments / catTotal) * 100).toFixed(1) },
    { category: "Low Credit History", pct: +((lowCredit / catTotal) * 100).toFixed(1) },
    { category: "Multiple Accounts (5+)", pct: +((multiAccounts / catTotal) * 100).toFixed(1) },
  ];

  // Age distribution with fraud rate
  const ageBands = [
    { band: "20-29", min: 20, max: 29 },
    { band: "30-39", min: 30, max: 39 },
    { band: "40-49", min: 40, max: 49 },
    { band: "50+", min: 50, max: 99 },
  ];
  const ageDistribution = ageBands.map((b) => {
    const inBand = rows.filter((r) => r.age >= b.min && r.age <= b.max);
    const fraud = inBand.filter((r) => r.target === 1).length;
    return { age: b.band, total: inBand.length, fraud, fraudRate: +(inBand.length ? (fraud / inBand.length) * 100 : 0).toFixed(1) };
  });

  // Income bands with fraud rate
  const incomeBands = [
    { band: "<200", min: 0, max: 199 },
    { band: "200-399", min: 200, max: 399 },
    { band: "400-599", min: 400, max: 599 },
    { band: "600+", min: 600, max: 99999 },
  ];
  const incomeDistribution = incomeBands.map((b) => {
    const inBand = rows.filter((r) => r.income >= b.min && r.income <= b.max);
    const fraud = inBand.filter((r) => r.target === 1).length;
    return { income: b.band, total: inBand.length, fraud, fraudRate: +(inBand.length ? (fraud / inBand.length) * 100 : 0).toFixed(1) };
  });

  // Filter + paginate claims
  let filtered = claims;
  if (riskFilter !== "all") {
    filtered = filtered.filter((c) => c.riskLevel === riskFilter);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((c) =>
      c.id.toLowerCase().includes(q) ||
      c.status.includes(q) ||
      c.riskLevel.includes(q) ||
      String(c.income).includes(q)
    );
  }
  const totalFiltered = filtered.length;
  const totalPages = Math.ceil(totalFiltered / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const recentClaims = paginated.map((c) => ({
    id: c.id,
    age: c.age,
    income: c.income,
    creditMonths: c.creditHistoryMonths,
    accounts: c.numCreditAccounts,
    debtRatio: +c.debtRatio.toFixed(3),
    latePayments: c.numLatePayments,
    risk: c.riskLevel,
    score: +c.riskScore.toFixed(3),
    status: c.status,
    isFraud: c.target === 1,
  }));

  // Agent contribution (keep synthetic — these are model names)
  const agentContribution = [
    { name: "Statistical", rate: 15, color: "#3B82F6" },
    { name: "ML Pattern", rate: 25, color: "#60A5FA" },
    { name: "Rule Engine", rate: 40, color: "#EF4444" },
    { name: "Feature", rate: 8, color: "#FCA5A5" },
    { name: "Graph", rate: 12, color: "#14B8A6" },
  ];

  // Model performance (keep synthetic)
  const modelPerformance = [
    { name: "Statistical", accuracy: 94.2, f1: 90.6, drift: 0.03 },
    { name: "ML Pattern", accuracy: 97.8, f1: 95.6, drift: 0.12 },
    { name: "Rule Engine", accuracy: 99.9, f1: 99.3, drift: 0.01 },
    { name: "Feature", accuracy: 96.1, f1: 93.8, drift: 0.08 },
    { name: "Graph", accuracy: 91.5, f1: 88.6, drift: 0.15 },
  ];

  return {
    timestamp: new Date().toISOString(),
    kpis: { total, fraudDetected, rejected, approved, avgIncome },
    riskDistribution,
    agentContribution,
    fraudByCategory,
    ageDistribution,
    incomeDistribution,
    modelPerformance,
    recentClaims,
    pagination: { page, limit, totalFiltered, totalPages },
  };
}
