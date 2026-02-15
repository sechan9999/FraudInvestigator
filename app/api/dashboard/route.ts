import { NextResponse } from "next/server";

function jitter(base: number, pct: number) {
  return Math.round(base * (1 + (Math.random() - 0.5) * 2 * pct));
}

export async function GET() {
  const now = new Date().toISOString();

  return NextResponse.json({
    timestamp: now,
    kpis: {
      totalClaims: jitter(1250, 0.02),
      fraudDetected: jitter(45, 0.05),
      pendingReview: jitter(12, 0.1),
      savingsAmount: jitter(450000, 0.03),
    },
    riskDistribution: [
      { name: "Low", value: jitter(72, 0.02), color: "#10B981" },
      { name: "Medium", value: jitter(20, 0.05), color: "#FBBF24" },
      { name: "High", value: +(6.4 + (Math.random() - 0.5)).toFixed(1), color: "#F97316" },
      { name: "Critical", value: +(1.6 + (Math.random() - 0.5) * 0.4).toFixed(1), color: "#EF4444" },
    ],
    agentContribution: [
      { name: "Statistical", rate: jitter(15, 0.05), color: "#3B82F6" },
      { name: "ML Pattern", rate: jitter(25, 0.04), color: "#60A5FA" },
      { name: "Rule", rate: jitter(40, 0.02), color: "#EF4444" },
      { name: "Feature", rate: jitter(8, 0.08), color: "#FCA5A5" },
      { name: "Graph", rate: jitter(12, 0.06), color: "#14B8A6" },
    ],
    recentClaims: [
      { id: "CLM-001", provider: "PRV001", amount: 9500, risk: "critical", score: 0.92, status: "flagged" },
      { id: "CLM-002", provider: "PRV045", amount: 450, risk: "low", score: 0.15, status: "approved" },
      { id: "CLM-003", provider: "PRV002", amount: 2300, risk: "high", score: 0.78, status: "review" },
      { id: "CLM-004", provider: "PRV078", amount: 180, risk: "low", score: 0.08, status: "approved" },
      { id: "CLM-005", provider: "PRV032", amount: 5600, risk: "high", score: 0.81, status: "flagged" },
      { id: "CLM-006", provider: "PRV089", amount: 320, risk: "low", score: 0.12, status: "approved" },
      { id: "CLM-007", provider: "PRV015", amount: 7800, risk: "critical", score: 0.95, status: "flagged" },
      { id: "CLM-008", provider: "PRV056", amount: 1100, risk: "medium", score: 0.45, status: "review" },
      { id: "CLM-009", provider: "PRV003", amount: 4200, risk: "high", score: 0.73, status: "review" },
      { id: "CLM-010", provider: "PRV091", amount: 290, risk: "low", score: 0.06, status: "approved" },
    ],
    modelPerformance: [
      { name: "Statistical", accuracy: +(94.2 + Math.random() * 0.3).toFixed(1), f1: 90.6, drift: +(0.03 + Math.random() * 0.02).toFixed(3) },
      { name: "ML Pattern", accuracy: +(97.8 + Math.random() * 0.2).toFixed(1), f1: 95.6, drift: +(0.12 + (Math.random() - 0.5) * 0.04).toFixed(3) },
      { name: "Rule", accuracy: 99.9, f1: 99.3, drift: +(0.01 + Math.random() * 0.01).toFixed(3) },
      { name: "Feature", accuracy: +(96.1 + Math.random() * 0.2).toFixed(1), f1: 93.8, drift: +(0.08 + (Math.random() - 0.5) * 0.02).toFixed(3) },
      { name: "Graph", accuracy: +(91.5 + Math.random() * 0.4).toFixed(1), f1: 88.6, drift: +(0.15 + (Math.random() - 0.5) * 0.04).toFixed(3) },
    ],
    monthlyTrend: [
      { month: "Aug", claims: 19456, fraud: 178, savings: 485000 },
      { month: "Sep", claims: 20123, fraud: 165, savings: 445000 },
      { month: "Oct", claims: 21045, fraud: 189, savings: 512000 },
      { month: "Nov", claims: 22389, fraud: 201, savings: 548000 },
      { month: "Dec", claims: 23567, fraud: 215, savings: 587000 },
      { month: "Jan", claims: 24012, fraud: 228, savings: 615000 },
    ],
    fraudByCategory: [
      { category: "Billing Abuse", pct: 39.0 },
      { category: "Upcoding", pct: 29.4 },
      { category: "Unbundling", pct: 19.7 },
      { category: "Phantom Billing", pct: 11.9 },
    ],
  });
}
