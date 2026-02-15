"use client";

import React, { useState, useEffect } from "react";
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
const TrendingDown = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
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
  provider: string;
  amount: number;
  risk: string;
  score: number;
  status: string;
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

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
`;

const tooltipStyle = { backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f1f5f9" };

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [serverKeyConfigured, setServerKeyConfigured] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [claimSearch, setClaimSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [throughputHistory, setThroughputHistory] = useState<{time: string; value: number}[]>([]);
  const [liveActivity, setLiveActivity] = useState<LiveActivity[]>([
    { id: 1, time: "14:23:45", claim: "CLM-1847", provider: "PRV032", amount: 2400, risk: 0.23, status: "processing", agent: "Statistical" },
    { id: 2, time: "14:23:43", claim: "CLM-1846", provider: "PRV089", amount: 8900, risk: 0.87, status: "flagged", agent: "ML Pattern" },
    { id: 3, time: "14:23:41", claim: "CLM-1845", provider: "PRV012", amount: 450, risk: 0.12, status: "approved", agent: "Rule" },
  ]);
  const [throughput, setThroughput] = useState({ current: 73, peak: 95, avg: 68 });
  const [kpis, setKpis] = useState({ totalClaims: 1250, fraudDetected: 45, pendingReview: 12, savingsAmount: 450000 });
  const [lastRefresh, setLastRefresh] = useState<string>("");

  const hasAI = apiKey || serverKeyConfigured;

  // Check if server has env key
  useEffect(() => {
    checkServerKey().then(setServerKeyConfigured);
  }, []);

  // Fetch dashboard data from API with auto-refresh every 10s
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setKpis(data.kpis);
          setLastRefresh(new Date().toLocaleTimeString("en-US", { hour12: false }));
        }
      } catch { /* silently retry on next interval */ }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeNav !== "realtime") return;
    const interval = setInterval(() => {
      const newClaim: LiveActivity = {
        id: Date.now(),
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
        claim: `CLM-${Math.floor(Math.random() * 9000) + 1000}`,
        provider: `PRV${String(Math.floor(Math.random() * 200)).padStart(3, "0")}`,
        amount: Math.floor(Math.random() * 10000) + 100,
        risk: Math.random(),
        status: Math.random() > 0.9 ? "flagged" : Math.random() > 0.7 ? "review" : Math.random() > 0.3 ? "processing" : "approved",
        agent: ["Statistical", "ML Pattern", "Rule", "Feature", "Graph"][Math.floor(Math.random() * 5)],
      };
      setLiveActivity((prev) => [newClaim, ...prev.slice(0, 19)]);
      const newThroughputValue = Math.floor(Math.random() * 30) + 60;
      setThroughput((prev) => ({
        current: newThroughputValue,
        peak: Math.max(prev.peak, prev.current),
        avg: Math.floor(prev.avg * 0.9 + prev.current * 0.1),
      }));
      setThroughputHistory((prev) => [
        ...prev.slice(-19),
        { time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), value: newThroughputValue },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, [activeNav]);

  // Data
  const riskDistribution = [
    { name: "Low", value: 72, color: "#10B981" },
    { name: "Medium", value: 20, color: "#FBBF24" },
    { name: "High", value: 6.4, color: "#F97316" },
    { name: "Critical", value: 1.6, color: "#EF4444" },
  ];

  const agentContribution = [
    { name: "Statistical", rate: 15, color: "#3B82F6" },
    { name: "ML Pattern", rate: 25, color: "#60A5FA" },
    { name: "Rule", rate: 40, color: "#EF4444" },
    { name: "Feature", rate: 8, color: "#FCA5A5" },
    { name: "Graph", rate: 12, color: "#14B8A6" },
  ];

  const recentClaims: Claim[] = [
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
  ];

  const filteredClaims = recentClaims.filter((claim) => {
    if (riskFilter !== "all" && claim.risk !== riskFilter) return false;
    if (!claimSearch) return true;
    const q = claimSearch.toLowerCase();
    return claim.id.toLowerCase().includes(q) || claim.provider.toLowerCase().includes(q) || claim.risk.includes(q);
  });

  const modelPerformance = [
    { name: "Statistical", accuracy: 94.2, f1: 90.6, drift: 0.03 },
    { name: "ML Pattern", accuracy: 97.8, f1: 95.6, drift: 0.12 },
    { name: "Rule", accuracy: 99.9, f1: 99.3, drift: 0.01 },
    { name: "Feature", accuracy: 96.1, f1: 93.8, drift: 0.08 },
    { name: "Graph", accuracy: 91.5, f1: 88.6, drift: 0.15 },
  ];

  const performanceTrend = [
    { date: "01/08", accuracy: 96.5, f1: 94.2 },
    { date: "01/10", accuracy: 97.1, f1: 94.8 },
    { date: "01/12", accuracy: 97.3, f1: 95.1 },
    { date: "01/14", accuracy: 97.8, f1: 95.6 },
  ];

  const driftMetrics = [
    { metric: "PSI", value: 0.12, status: "warning", threshold: 0.1 },
    { metric: "Feature Drift", value: 0.08, status: "good", threshold: 0.15 },
    { metric: "Prediction Drift", value: 0.15, status: "warning", threshold: 0.1 },
  ];

  const monthlyTrend = [
    { month: "Aug", claims: 19456, fraud: 178, savings: 485000 },
    { month: "Sep", claims: 20123, fraud: 165, savings: 445000 },
    { month: "Oct", claims: 21045, fraud: 189, savings: 512000 },
    { month: "Nov", claims: 22389, fraud: 201, savings: 548000 },
    { month: "Dec", claims: 23567, fraud: 215, savings: 587000 },
    { month: "Jan", claims: 24012, fraud: 228, savings: 615000 },
  ];

  const fraudByCategory = [
    { category: "Billing Abuse", pct: 39.0 },
    { category: "Upcoding", pct: 29.4 },
    { category: "Unbundling", pct: 19.7 },
    { category: "Phantom Billing", pct: 11.9 },
  ];

  const dashboardContext = {
    totalClaims: kpis.totalClaims,
    fraudDetected: kpis.fraudDetected,
    pendingReview: kpis.pendingReview,
    savings: `$${Math.round(kpis.savingsAmount / 1000)}K`,
    recentClaims,
    riskDistribution,
    agentContribution,
    monthlyTrend,
    fraudByCategory,
    modelPerformance,
  };

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      low: "bg-green-500/20 text-green-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      high: "bg-orange-500/20 text-orange-400",
      critical: "bg-red-500/20 text-red-400",
    };
    return colors[risk] || "bg-slate-700 text-slate-400";
  };

  const getStatusIcon = (status: string) => {
    if (status === "approved") return <span className="text-green-400">&#10003;</span>;
    if (status === "flagged") return <span className="text-red-400">&#9888;</span>;
    if (status === "review") return <span className="text-yellow-400">&#9203;</span>;
    return null;
  };

  const formatCurrency = (value: number) => `${value.toLocaleString()}`;
  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", Icon: Activity },
    { id: "realtime", label: "Real-time Analysis", Icon: Zap },
    { id: "agents", label: "Agent Status", Icon: Brain },
    { id: "reports", label: "Reports", Icon: FileText },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-slate-950 flex text-sm">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-slate-800 rounded-lg shadow-md border border-slate-700"
        >
          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div className={`w-52 bg-slate-900 border-r border-slate-800 p-3 flex-shrink-0 fixed lg:static h-full z-40 transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Shield />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">Fraud Detection</h1>
              <p className="text-xs text-slate-500">Compound AI</p>
            </div>
          </div>
          <nav className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Navigation</p>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                  activeNav === item.id ? "bg-blue-500/20 text-blue-400 font-medium" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <item.Icon />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-5 p-3 bg-green-500/10 rounded-xl border border-green-500/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-400">System Online</span>
            </div>
            <p className="text-xs text-green-500/70">5 Agents Active</p>
          </div>
          {/* API Key Status */}
          <div className={`mt-3 p-3 rounded-xl border ${hasAI ? "bg-blue-500/10 border-blue-500/30" : "bg-slate-800/50 border-slate-700"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-300">OpenAI API</p>
                <p className={`text-xs ${hasAI ? "text-blue-400" : "text-slate-500"}`}>
                  {apiKey ? "Key configured" : serverKeyConfigured ? "Server key active" : "Not configured"}
                </p>
              </div>
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="text-slate-500 hover:text-slate-300"
              >
                <Settings />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto" id={activeNav === "reports" ? "report-content" : undefined}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                {activeNav === "dashboard" && "Fraud Detection Dashboard"}
                {activeNav === "agents" && "MLOps Agent Monitoring"}
                {activeNav === "realtime" && "Real-time Analysis"}
                {activeNav === "reports" && "Reports & Analytics"}
              </h2>
              <p className="text-xs text-slate-500">
                {activeNav === "dashboard" && `Real-time monitoring powered by Compound AI${lastRefresh ? ` | Last refresh: ${lastRefresh}` : ""}`}
                {activeNav === "agents" && "Model performance, drift detection, and health monitoring"}
                {activeNav === "realtime" && "Live claim processing and analysis"}
                {activeNav === "reports" && "Historical data and trend analysis"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={simulateAnalysis}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-500 flex items-center gap-1"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <SearchIcon /> Analyze New
                  </>
                )}
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-200 relative">
                <Bell />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>

          {/* DASHBOARD TAB */}
          {activeNav === "dashboard" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {[
                  { title: "Total Claims", value: kpis.totalClaims.toLocaleString(), change: "+25", trend: "up", color: "text-white" },
                  { title: "Fraud Detected", value: kpis.fraudDetected.toString(), change: "+2", trend: "up", color: "text-red-400" },
                  { title: "Pending Review", value: kpis.pendingReview.toString(), change: "-5", trend: "down", color: "text-orange-400" },
                  { title: "Savings", value: `$${Math.round(kpis.savingsAmount / 1000)}K`, change: "+$15k", trend: "up", color: "text-green-400" },
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-xs text-slate-500 mb-1">{kpi.title}</p>
                    <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                    <p className={`text-xs mt-1 flex items-center gap-1 ${kpi.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {kpi.trend === "up" ? <TrendingUp /> : <TrendingDown />}
                      {kpi.change}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-semibold text-white mb-3 text-sm">Risk Distribution</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`}
                        labelLine={{ strokeWidth: 1, stroke: "#64748b" }}
                      >
                        {riskDistribution.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "#94a3b8" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-semibold text-white mb-3 text-sm">Agent Contribution (Detection Rate %)</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={agentContribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} unit="%" />
                      <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
                      <Legend wrapperStyle={{ color: "#94a3b8" }} />
                      <Bar dataKey="rate" name="Detection Rate" radius={[6, 6, 0, 0]}>
                        {agentContribution.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                  <h3 className="font-semibold text-white text-sm">Recent Claims</h3>
                  <div className="flex items-center gap-2">
                    {/* Risk filter dropdown */}
                    <select
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value)}
                      className="px-2 py-1.5 bg-slate-900 border border-slate-600 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Risks</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                    {/* Search */}
                    <div className="relative">
                      <input
                        type="text"
                        value={claimSearch}
                        onChange={(e) => setClaimSearch(e.target.value)}
                        placeholder="Search by ID, provider..."
                        className="pl-7 pr-3 py-1.5 bg-slate-900 border border-slate-600 rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                      />
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                        <SearchIcon />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredClaims.map((claim, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-900/50 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors border border-slate-700/50 hover:border-blue-500/30"
                      onClick={() => setSelectedClaim(claim)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(claim.status)}
                          <span className="text-xs font-medium text-white">{claim.id}</span>
                          <span className="text-xs text-slate-500">{claim.provider}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-300">${formatCurrency(claim.amount)}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(claim.risk)}`}>
                            {claim.risk.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">{(claim.score * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredClaims.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4">No claims match your filter</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* REALTIME TAB */}
          {activeNav === "realtime" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-xs text-slate-500 mb-2">Current Throughput</p>
                  <p className="text-2xl font-bold text-white">{throughput.current}</p>
                  <p className="text-xs text-slate-500">claims/min</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-xs text-slate-500 mb-2">Peak Throughput</p>
                  <p className="text-2xl font-bold text-blue-400">{throughput.peak}</p>
                  <p className="text-xs text-slate-500">claims/min</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-xs text-slate-500 mb-2">Avg Response</p>
                  <p className="text-2xl font-bold text-green-400">247ms</p>
                  <p className="text-xs text-green-500">&darr; 12ms</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-xs text-slate-500 mb-2">Active Processing</p>
                  <p className="text-2xl font-bold text-orange-400">8</p>
                  <p className="text-xs text-slate-500">in pipeline</p>
                </div>
              </div>

              {/* Throughput Chart */}
              {throughputHistory.length > 1 && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-4">
                  <h3 className="font-semibold text-white mb-3 text-sm">Throughput Trend (claims/min)</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={throughputHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#94a3b8" }} />
                      <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} domain={[40, 100]} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F633" name="Throughput" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white text-sm">Live Activity Stream</h3>
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Auto-updating every 2s
                  </span>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {liveActivity.map((activity) => (
                    <div key={activity.id} className="p-2 bg-slate-900/50 rounded-lg animate-fadeIn border border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-500">{activity.time}</span>
                          <span className="text-xs font-medium text-white">{activity.claim}</span>
                          <span className="text-xs text-slate-500">{activity.provider}</span>
                          <span className="text-xs font-medium text-slate-300">${activity.amount.toLocaleString()}</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            activity.status === "flagged"
                              ? "bg-red-500/20 text-red-400"
                              : activity.status === "review"
                                ? "bg-orange-500/20 text-orange-400"
                                : activity.status === "processing"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-green-500/20 text-green-400"
                          }`}
                        >
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
                {modelPerformance.map((model, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                    <h4 className="text-xs font-semibold text-white mb-2">{model.name}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Accuracy</span>
                        <span className="font-medium text-green-400">{model.accuracy}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">F1</span>
                        <span className="font-medium text-blue-400">{model.f1}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Drift</span>
                        <span className={`font-medium ${model.drift > 0.1 ? "text-orange-400" : "text-green-400"}`}>
                          {model.drift.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-semibold text-white mb-3 text-sm">Performance Trend (7 Days)</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#94a3b8" }} />
                      <YAxis domain={[90, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="accuracy" stroke="#10B981" fill="#10B98133" name="Accuracy" />
                      <Area type="monotone" dataKey="f1" stroke="#3B82F6" fill="#3B82F633" name="F1 Score" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-semibold text-white mb-3 text-sm">Drift Detection</h3>
                  <div className="space-y-3">
                    {driftMetrics.map((metric, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-slate-400">{metric.metric}</span>
                          <span className={`text-xs font-medium ${metric.status === "good" ? "text-green-400" : "text-orange-400"}`}>
                            {metric.value.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
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
                dashboardData={{ monthlyTrend, fraudByCategory, modelPerformance }}
                onConfigureApi={() => setShowApiKeyModal(true)}
              />

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Analytics Report</h3>
                    <p className="text-xs text-slate-500">Generated: {new Date().toLocaleDateString()}</p>
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
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-xs text-slate-500 mb-1">Total Claims</p>
                  <p className="text-2xl font-bold text-white">24,012</p>
                  <p className="text-xs text-green-500 mt-1">&uarr; 1.9%</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-xs text-slate-500 mb-1">Fraud Detected</p>
                  <p className="text-2xl font-bold text-red-400">228</p>
                  <p className="text-xs text-red-400 mt-1">0.95% rate</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-xs text-slate-500 mb-1">Total Savings</p>
                  <p className="text-2xl font-bold text-green-400">$615K</p>
                  <p className="text-xs text-green-500 mt-1">&uarr; 4.8%</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-xs text-slate-500 mb-1">System ROI</p>
                  <p className="text-2xl font-bold text-blue-400">5.1x</p>
                  <p className="text-xs text-blue-400 mt-1">$5.10 per $1</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-semibold text-white mb-3 text-sm">Monthly Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="claims" stroke="#3B82F6" fill="#3B82F633" name="Claims" />
                      <Area type="monotone" dataKey="fraud" stroke="#EF4444" fill="#EF444433" name="Fraud" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-semibold text-white mb-3 text-sm">Savings Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="savings" fill="#10B981" radius={[4, 4, 0, 0]} name="Savings ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-4">
                <h3 className="font-semibold text-white mb-3 text-sm">Fraud by Category</h3>
                <div className="space-y-3">
                  {fraudByCategory.map((cat, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-slate-300">{cat.category}</span>
                        <span className="text-xs font-medium text-slate-400">{cat.pct}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="font-semibold text-white mb-3 text-sm">Key Insights</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-xs font-medium text-green-400 mb-1">Strong Performance</p>
                    <p className="text-xs text-green-500/80">Model accuracy improved by 2.2% over 7 months, reaching 97.4%.</p>
                  </div>
                  <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <p className="text-xs font-medium text-orange-400 mb-1">High-Risk Providers</p>
                    <p className="text-xs text-orange-500/80">5 providers account for 28% of detected fraud.</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-xs font-medium text-blue-400 mb-1">ROI Trend</p>
                    <p className="text-xs text-blue-500/80">System ROI increased from 4.2x to 5.1x.</p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-xs font-medium text-red-400 mb-1">Action Required</p>
                    <p className="text-xs text-red-500/80">Graph Agent showing drift of 0.15. Schedule retraining.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Claim Detail Modal */}
          {selectedClaim && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedClaim(null)}>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Claim Detail</h3>
                  <button onClick={() => setSelectedClaim(null)} className="text-slate-400 hover:text-white text-lg">
                    x
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <p className="text-xs text-slate-500">Claim ID</p>
                      <p className="font-medium text-sm text-white">{selectedClaim.id}</p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <p className="text-xs text-slate-500">Provider</p>
                      <p className="font-medium text-sm text-white">{selectedClaim.provider}</p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <p className="text-xs text-slate-500">Amount</p>
                      <p className="font-medium text-sm text-white">${formatCurrency(selectedClaim.amount)}</p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <p className="text-xs text-slate-500">Risk Score</p>
                      <p className="font-bold text-lg text-red-400">{(selectedClaim.score * 100).toFixed(0)}%</p>
                    </div>
                  </div>

                  <ClaimAnalysis
                    claim={selectedClaim}
                    apiKey={apiKey}
                    onConfigureApi={() => setShowApiKeyModal(true)}
                  />

                  <div className="flex gap-2">
                    <button onClick={() => setSelectedClaim(null)} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-500">
                      Approve
                    </button>
                    <button onClick={() => setSelectedClaim(null)} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-500">
                      Flag
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <ChatPanel
          apiKey={apiKey}
          dashboardContext={dashboardContext}
          onConfigureApi={() => setShowApiKeyModal(true)}
        />
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        apiKey={apiKey}
        onSave={setApiKey}
      />
    </>
  );
}
