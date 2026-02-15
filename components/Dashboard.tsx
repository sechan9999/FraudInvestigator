"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import ApiKeyModal from "./ApiKeyModal";
import ClaimAnalysis from "./ClaimAnalysis";
import ChatPanel from "./ChatPanel";
import AiReportSummary from "./AiReportSummary";
import { checkServerKey } from "@/lib/openai";

// Icon components
const Shield = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const Activity = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const TrendingUp = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const Bell = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const FileText = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const Zap = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const Brain = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);
const Download = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
const Settings = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Types
interface Claim {
  id: string;
  age: number;
  income: number;
  creditMonths: number;
  accounts: number;
  debtRatio: number;
  latePayments: number;
  risk: string;
  score: number;
  status: string;
  isFraud: boolean;
}

interface LiveActivity {
  id: number;
  time: string;
  claim: string;
  provider: string;
  amount: number;
  risk: number;
  status: string;
  agent: string;
}

interface DashboardData {
  kpis: { total: number; fraudDetected: number; rejected: number; approved: number; avgIncome: number };
  riskDistribution: { name: string; value: number; color: string }[];
  agentContribution: { name: string; rate: number; color: string }[];
  fraudByCategory: { category: string; pct: number }[];
  ageDistribution: { age: string; total: number; fraud: number; fraudRate: number }[];
  incomeDistribution: { income: string; total: number; fraud: number; fraudRate: number }[];
  modelPerformance: { name: string; accuracy: number; f1: number; drift: number }[];
  recentClaims: Claim[];
  pagination: { page: number; limit: number; totalFiltered: number; totalPages: number };
}

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
`;

const tooltipStyle = { backgroundColor: "#ffffff", borderColor: "#e5e7eb", borderRadius: "8px", color: "#1f2937" };

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [serverKeyConfigured, setServerKeyConfigured] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [claimSearch, setClaimSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [page, setPage] = useState(1);
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [lastRefresh, setLastRefresh] = useState("");

  // Realtime tab state
  const [throughputHistory, setThroughputHistory] = useState<{time: string; value: number}[]>([]);
  const [liveActivity, setLiveActivity] = useState<LiveActivity[]>([
    { id: 1, time: "14:23:45", claim: "CLM-1847", provider: "PRV032", amount: 2400, risk: 0.23, status: "processing", agent: "Statistical" },
    { id: 2, time: "14:23:43", claim: "CLM-1846", provider: "PRV089", amount: 8900, risk: 0.87, status: "flagged", agent: "ML Pattern" },
    { id: 3, time: "14:23:41", claim: "CLM-1845", provider: "PRV012", amount: 450, risk: 0.12, status: "approved", agent: "Rule" },
  ]);
  const [throughput, setThroughput] = useState({ current: 73, peak: 95, avg: 68 });

  const hasAI = apiKey || serverKeyConfigured;

  useEffect(() => { checkServerKey().then(setServerKeyConfigured); }, []);

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        risk: riskFilter,
        search: claimSearch,
      });
      const res = await fetch(`/api/dashboard?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDashData(data);
        setLastRefresh(new Date().toLocaleTimeString("en-US", { hour12: false }));
      }
    } catch { /* retry on next interval */ }
  }, [page, riskFilter, claimSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Realtime simulation
  useEffect(() => {
    if (activeNav !== "realtime") return;
    const interval = setInterval(() => {
      const newClaim: LiveActivity = {
        id: Date.now(),
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
        claim: `CLM-${Math.floor(Math.random() * 7000) + 1}`,
        provider: `AGE-${Math.floor(Math.random() * 40) + 20}`,
        amount: Math.floor(Math.random() * 800) + 166,
        risk: Math.random(),
        status: Math.random() > 0.7 ? "flagged" : Math.random() > 0.3 ? "processing" : "approved",
        agent: ["Statistical", "ML Pattern", "Rule", "Feature", "Graph"][Math.floor(Math.random() * 5)],
      };
      setLiveActivity((prev) => [newClaim, ...prev.slice(0, 19)]);
      const val = Math.floor(Math.random() * 30) + 60;
      setThroughput((prev) => ({
        current: val,
        peak: Math.max(prev.peak, prev.current),
        avg: Math.floor(prev.avg * 0.9 + prev.current * 0.1),
      }));
      setThroughputHistory((prev) => [
        ...prev.slice(-19),
        { time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), value: val },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, [activeNav]);

  const kpis = dashData?.kpis ?? { total: 0, fraudDetected: 0, rejected: 0, approved: 0, avgIncome: 0 };
  const claims = dashData?.recentClaims ?? [];
  const pagination = dashData?.pagination ?? { page: 1, limit: 20, totalFiltered: 0, totalPages: 0 };

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-orange-100 text-orange-700",
      critical: "bg-red-100 text-red-700",
    };
    return colors[risk] || "bg-gray-100 text-gray-500";
  };

  const getStatusBadge = (status: string, isFraud: boolean) => {
    if (isFraud) return <span className="text-red-500 font-bold">FRAUD</span>;
    if (status === "approved") return <span className="text-green-600">&#10003;</span>;
    if (status === "rejected") return <span className="text-red-400">&#10007;</span>;
    return null;
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", Icon: Activity },
    { id: "realtime", label: "Real-time Analysis", Icon: Zap },
    { id: "agents", label: "Agent Status", Icon: Brain },
    { id: "reports", label: "Reports", Icon: FileText },
  ];

  const dashboardContext = {
    totalApplications: kpis.total,
    fraudDetected: kpis.fraudDetected,
    rejected: kpis.rejected,
    avgIncome: kpis.avgIncome,
    riskDistribution: dashData?.riskDistribution,
    fraudByCategory: dashData?.fraudByCategory,
    ageDistribution: dashData?.ageDistribution,
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gray-50 flex text-sm">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div className={`w-52 bg-white border-r border-gray-200 p-3 flex-shrink-0 fixed lg:static h-full z-40 transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Shield />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm">Fraud Detection</h1>
              <p className="text-xs text-gray-400">Telecom Credit AI</p>
            </div>
          </div>
          <nav className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Navigation</p>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                  activeNav === item.id ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <item.Icon />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-5 p-3 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">System Online</span>
            </div>
            <p className="text-xs text-green-600/70">{kpis.total.toLocaleString()} records loaded</p>
          </div>
          <div className={`mt-3 p-3 rounded-xl border ${hasAI ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-700">OpenAI API</p>
                <p className={`text-xs ${hasAI ? "text-blue-600" : "text-gray-400"}`}>
                  {apiKey ? "Key configured" : serverKeyConfigured ? "Server key active" : "Not configured"}
                </p>
              </div>
              <button onClick={() => setShowApiKeyModal(true)} className="text-gray-400 hover:text-gray-600">
                <Settings />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeNav === "dashboard" && "Credit Fraud Detection Dashboard"}
                {activeNav === "agents" && "MLOps Agent Monitoring"}
                {activeNav === "realtime" && "Real-time Analysis"}
                {activeNav === "reports" && "Reports & Analytics"}
              </h2>
              <p className="text-xs text-gray-500">
                {activeNav === "dashboard" && `Real telecom credit data (${kpis.total.toLocaleString()} records)${lastRefresh ? ` | Refreshed: ${lastRefresh}` : ""}`}
                {activeNav === "agents" && "Model performance, drift detection, and health monitoring"}
                {activeNav === "realtime" && "Live claim processing and analysis"}
                {activeNav === "reports" && "Historical data and trend analysis"}
              </p>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 relative">
              <Bell />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {kpis.fraudDetected}
              </span>
            </button>
          </div>

          {/* DASHBOARD TAB */}
          {activeNav === "dashboard" && (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                {[
                  { title: "Total Applications", value: kpis.total.toLocaleString(), color: "text-gray-900" },
                  { title: "Fraud Detected", value: kpis.fraudDetected.toLocaleString(), color: "text-red-500" },
                  { title: "Approved", value: kpis.approved.toLocaleString(), color: "text-green-600" },
                  { title: "Rejected", value: kpis.rejected.toLocaleString(), color: "text-orange-500" },
                  { title: "Avg Income", value: `$${kpis.avgIncome.toLocaleString()}`, color: "text-blue-600" },
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">{kpi.title}</p>
                    <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                    {kpi.title === "Fraud Detected" && (
                      <p className="text-xs mt-1 flex items-center gap-1 text-red-400">
                        <TrendingUp /> {((kpis.fraudDetected / kpis.total) * 100).toFixed(1)}% rate
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Charts row 1: Risk + Fraud Category */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Risk Distribution</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={dashData?.riskDistribution ?? []}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`}
                        labelLine={{ strokeWidth: 1, stroke: "#9ca3af" }}
                      >
                        {(dashData?.riskDistribution ?? []).map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "#6b7280" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Fraud by Risk Factor</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={dashData?.fraudByCategory ?? []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#6b7280" }} unit="%" />
                      <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: "#6b7280" }} width={130} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
                      <Bar dataKey="pct" fill="#EF4444" radius={[0, 6, 6, 0]} name="Fraud %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Charts row 2: Age + Income distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Fraud Rate by Age Group</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={dashData?.ageDistribution ?? []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="age" tick={{ fontSize: 10, fill: "#6b7280" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} unit="%" />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="fraudRate" fill="#F97316" radius={[6, 6, 0, 0]} name="Fraud Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Fraud Rate by Income Band</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={dashData?.incomeDistribution ?? []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="income" tick={{ fontSize: 10, fill: "#6b7280" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} unit="%" />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="fraudRate" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Fraud Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Claims Table */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Applications ({pagination.totalFiltered.toLocaleString()} results)
                  </h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={riskFilter}
                      onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}
                      className="px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Risks</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                    <div className="relative">
                      <input
                        type="text"
                        value={claimSearch}
                        onChange={(e) => { setClaimSearch(e.target.value); setPage(1); }}
                        placeholder="Search ID, income..."
                        className="pl-7 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                      />
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <SearchIcon />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table header */}
                <div className="hidden md:grid grid-cols-10 gap-1 px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                  <span>ID</span>
                  <span>Age</span>
                  <span>Income</span>
                  <span>Credit Mo.</span>
                  <span>Accounts</span>
                  <span>Debt Ratio</span>
                  <span>Late Pmts</span>
                  <span>Risk</span>
                  <span>Score</span>
                  <span>Status</span>
                </div>

                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                  {claims.map((claim, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-3 md:grid-cols-10 gap-1 p-2 md:px-3 md:py-2 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors border border-gray-100 hover:border-blue-200 items-center"
                      onClick={() => setSelectedClaim(claim)}
                    >
                      <span className="text-xs font-medium text-gray-900">{claim.id}</span>
                      <span className="text-xs text-gray-600 hidden md:block">{claim.age}</span>
                      <span className="text-xs text-gray-600">${claim.income}</span>
                      <span className="text-xs text-gray-600 hidden md:block">{claim.creditMonths}</span>
                      <span className="text-xs text-gray-600 hidden md:block">{claim.accounts}</span>
                      <span className="text-xs text-gray-600 hidden md:block">{(claim.debtRatio * 100).toFixed(1)}%</span>
                      <span className="text-xs text-gray-600 hidden md:block">{claim.latePayments}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${getRiskColor(claim.risk)}`}>
                        {claim.risk.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 font-mono hidden md:block">{(claim.score * 100).toFixed(0)}%</span>
                      <span className="text-xs hidden md:block">{getStatusBadge(claim.status, claim.isFraud)}</span>
                    </div>
                  ))}
                  {claims.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">No records match your filter</p>
                  )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
                      >
                        Prev
                      </button>
                      {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                        const start = Math.max(1, Math.min(page - 2, pagination.totalPages - 4));
                        const p = start + i;
                        if (p > pagination.totalPages) return null;
                        return (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1 text-xs rounded-lg ${p === page ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                          >
                            {p}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                        disabled={page === pagination.totalPages}
                        className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* REALTIME TAB */}
          {activeNav === "realtime" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-2">Current Throughput</p>
                  <p className="text-2xl font-bold text-gray-900">{throughput.current}</p>
                  <p className="text-xs text-gray-500">claims/min</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-2">Peak Throughput</p>
                  <p className="text-2xl font-bold text-blue-600">{throughput.peak}</p>
                  <p className="text-xs text-gray-500">claims/min</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-2">Avg Response</p>
                  <p className="text-2xl font-bold text-green-600">247ms</p>
                  <p className="text-xs text-green-500">&darr; 12ms</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-2">Active Processing</p>
                  <p className="text-2xl font-bold text-orange-500">8</p>
                  <p className="text-xs text-gray-500">in pipeline</p>
                </div>
              </div>

              {throughputHistory.length > 1 && (
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Throughput Trend (claims/min)</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={throughputHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#6b7280" }} />
                      <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} domain={[40, 100]} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F633" name="Throughput" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">Live Activity Stream</h3>
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Auto-updating every 2s
                  </span>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {liveActivity.map((activity) => (
                    <div key={activity.id} className="p-2 bg-gray-50 rounded-lg animate-fadeIn border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-gray-400">{activity.time}</span>
                          <span className="text-xs font-medium text-gray-900">{activity.claim}</span>
                          <span className="text-xs text-gray-500">{activity.provider}</span>
                          <span className="text-xs font-medium text-gray-700">${activity.amount}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          activity.status === "flagged" ? "bg-red-100 text-red-700"
                            : activity.status === "processing" ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* AGENTS TAB */}
          {activeNav === "agents" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                {(dashData?.modelPerformance ?? []).map((model, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">{model.name}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Accuracy</span>
                        <span className="font-medium text-green-600">{model.accuracy}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">F1</span>
                        <span className="font-medium text-blue-600">{model.f1}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Drift</span>
                        <span className={`font-medium ${model.drift > 0.1 ? "text-orange-500" : "text-green-600"}`}>
                          {model.drift.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Agent Contribution (Detection Rate %)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={dashData?.agentContribution ?? []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} unit="%" />
                      <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
                      <Bar dataKey="rate" name="Detection Rate" radius={[6, 6, 0, 0]}>
                        {(dashData?.agentContribution ?? []).map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Drift Detection</h3>
                  <div className="space-y-3">
                    {[
                      { metric: "PSI", value: 0.12, status: "warning", threshold: 0.1 },
                      { metric: "Feature Drift", value: 0.08, status: "good", threshold: 0.15 },
                      { metric: "Prediction Drift", value: 0.15, status: "warning", threshold: 0.1 },
                    ].map((metric, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-500">{metric.metric}</span>
                          <span className={`text-xs font-medium ${metric.status === "good" ? "text-green-600" : "text-orange-500"}`}>
                            {metric.value.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${metric.status === "good" ? "bg-green-500" : "bg-orange-500"}`}
                            style={{ width: `${(metric.value / (metric.threshold * 2)) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* REPORTS TAB */}
          {activeNav === "reports" && (
            <div>
              <AiReportSummary
                apiKey={apiKey}
                dashboardData={{ kpis, riskDistribution: dashData?.riskDistribution, fraudByCategory: dashData?.fraudByCategory, ageDistribution: dashData?.ageDistribution }}
                onConfigureApi={() => setShowApiKeyModal(true)}
              />

              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Analytics Report</h3>
                    <p className="text-xs text-gray-500">Based on {kpis.total.toLocaleString()} real credit applications</p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-500 flex items-center gap-2"
                  >
                    <Download /> Export PDF
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{kpis.total.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Fraud Cases</p>
                  <p className="text-2xl font-bold text-red-500">{kpis.fraudDetected.toLocaleString()}</p>
                  <p className="text-xs text-red-500 mt-1">{((kpis.fraudDetected / kpis.total) * 100).toFixed(1)}% rate</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Avg Income</p>
                  <p className="text-2xl font-bold text-blue-600">${kpis.avgIncome.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Rejection Rate</p>
                  <p className="text-2xl font-bold text-orange-500">{((kpis.rejected / kpis.total) * 100).toFixed(1)}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Fraud Rate by Age Group</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dashData?.ageDistribution ?? []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="age" tick={{ fontSize: 10, fill: "#6b7280" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} unit="%" />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="fraudRate" fill="#F97316" radius={[4, 4, 0, 0]} name="Fraud Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Fraud Rate by Income Band</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dashData?.incomeDistribution ?? []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="income" tick={{ fontSize: 10, fill: "#6b7280" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} unit="%" />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="fraudRate" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Fraud Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Fraud by Risk Factor</h3>
                <div className="space-y-3">
                  {(dashData?.fraudByCategory ?? []).map((cat, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{cat.category}</span>
                        <span className="text-xs font-medium text-gray-500">{cat.pct}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Claim Detail Modal */}
          {selectedClaim && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedClaim(null)}>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900">Application Detail — {selectedClaim.id}</h3>
                  <button onClick={() => setSelectedClaim(null)} className="text-gray-400 hover:text-gray-600 text-lg">x</button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Age</p>
                      <p className="font-medium text-sm text-gray-900">{selectedClaim.age}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Income</p>
                      <p className="font-medium text-sm text-gray-900">${selectedClaim.income}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Credit History</p>
                      <p className="font-medium text-sm text-gray-900">{selectedClaim.creditMonths} months</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Accounts</p>
                      <p className="font-medium text-sm text-gray-900">{selectedClaim.accounts}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Debt Ratio</p>
                      <p className="font-medium text-sm text-gray-900">{(selectedClaim.debtRatio * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Late Payments</p>
                      <p className="font-medium text-sm text-gray-900">{selectedClaim.latePayments}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Risk Score</p>
                      <p className="font-bold text-lg text-red-500">{(selectedClaim.score * 100).toFixed(0)}%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="font-medium text-sm">
                        {selectedClaim.isFraud ? (
                          <span className="text-red-600 font-bold">FRAUD</span>
                        ) : (
                          <span className={selectedClaim.status === "approved" ? "text-green-600" : "text-orange-500"}>
                            {selectedClaim.status.toUpperCase()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <ClaimAnalysis
                    claim={{
                      id: selectedClaim.id,
                      provider: `Age ${selectedClaim.age}`,
                      amount: selectedClaim.income,
                      risk: selectedClaim.risk,
                      score: selectedClaim.score,
                      status: selectedClaim.status,
                    }}
                    apiKey={apiKey}
                    onConfigureApi={() => setShowApiKeyModal(true)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <ChatPanel
          apiKey={apiKey}
          dashboardContext={dashboardContext}
          onConfigureApi={() => setShowApiKeyModal(true)}
        />
      </div>

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        apiKey={apiKey}
        onSave={setApiKey}
      />
    </>
  );
}
