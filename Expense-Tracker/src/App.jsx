import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Calendar,
  LayoutDashboard,
  Receipt,
  Settings,
  User,
  Plus,
  Trash2,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { supabase } from "./supabase";

const EXCLUDED_BUDGET_CATEGORIES = ["Necessity", "Savings"];

const categoryColors = {
  Food: "#FF6B6B",
  Transport: "#4ECDC4",
  Entertainment: "#FFE66D",
  Shopping: "#95D5C0",
  Bills: "#F28482",
  Health: "#C9C9E8",
  Necessity: "#6A0572",
  Savings: "#6A0572",
};

const categoryIcons = {
  Food: "🍔",
  Drinks: "☕",
  Transport: "🚗",
  Entertainment: "🎬",
  Shopping: "🛍️",
  Bills: "📄",
  Health: "💊",
  Necessity: "🧾",
  Savings: "💰",
};

const builtInCategories = [
  "Food",
  "Drinks",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Health",
  "Necessity",
];

const builtInMethods = [
  "Cash",
  "Card",
  "E-wallet",
  "Bank Transfer",
];

function formatCurrency(amount) {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  return `RM${safeAmount.toFixed(2)}`;
}

function formatDateHeading(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMonthYear(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayDateInput() {
  return formatDateInputValue(new Date());
}

function isExcludedBudgetCategory(category) {
  return EXCLUDED_BUDGET_CATEGORIES.includes(category);
}

function getCategoryLabel(category) {
  return category === "Savings" ? "Necessity" : category;
}

function groupEntriesByDate(entries) {
  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
  const groups = {};

  sorted.forEach((entry) => {
    if (!groups[entry.date]) {
      groups[entry.date] = [];
    }
    groups[entry.date].push(entry);
  });

  return Object.entries(groups).map(([date, items]) => ({
    date,
    items,
    total: items.reduce((sum, item) => sum + Number(item.amount), 0),
  }));
}

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isResetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMessage("Password reset email sent. Check your inbox.");
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Account created. You can now sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#140F23] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#2A1D3D] rounded-3xl p-8 border border-[#3B2754]">
        <h1 className="text-3xl font-bold mb-2">
          {isResetMode ? "Reset Password" : isSignUp ? "Create Account" : "Sign In"}
        </h1>
        <p className="text-[#C9A9F5] mb-6">
          {isResetMode
            ? "Enter your email and we will send you a password reset link."
            : "Use your account to keep your own expense data."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#D0B0F8] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
              required
            />
          </div>

          {!isResetMode && (
            <div>
              <label className="block text-[#D0B0F8] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
                required
              />
            </div>
          )}

          {message && (
            <p className="text-sm text-pink-300">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isResetMode
                ? "Send Reset Email"
                : isSignUp
                  ? "Create Account"
                  : "Sign In"}
          </button>
        </form>

        {!isResetMode && (
          <button
            onClick={() => {
              setIsResetMode(true);
              setMessage("");
            }}
            className="mt-4 text-[#C9A9F5] hover:text-white"
          >
            Forgot password?
          </button>
        )}

        <button
          onClick={() => {
            setIsResetMode(false);
            setIsSignUp((prev) => !prev);
            setMessage("");
          }}
          className="mt-4 text-[#C9A9F5] hover:text-white"
        >
          {isResetMode
            ? "Back to sign in"
            : isSignUp
            ? "Already have an account? Sign in"
            : "No account yet? Create one"}
        </button>
      </div>
    </div>
  );
}

function ResetPasswordPage({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMessage("Password updated successfully.");
      window.history.replaceState({}, document.title, window.location.pathname);
      onDone();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#140F23] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#2A1D3D] rounded-3xl p-8 border border-[#3B2754]">
        <h1 className="text-3xl font-bold mb-2">Set New Password</h1>
        <p className="text-[#C9A9F5] mb-6">
          Choose a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#D0B0F8] mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[#D0B0F8] mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
              required
            />
          </div>

          {message && (
            <p className="text-sm text-pink-300">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function NavBar({ currentPage, setCurrentPage, onSignOut }) {
  return (
    <div className="w-full bg-[#241735] border-b border-[#34214A] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
          <DollarSign size={22} />
        </div>
        <span className="text-3xl font-bold">FinanceTracker</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setCurrentPage("dashboard")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition ${
            currentPage === "dashboard"
              ? "bg-[#3A204F] text-pink-300 border-pink-500/30"
              : "text-purple-200 border-transparent hover:bg-[#2B1D3F]"
          }`}
        >
          <LayoutDashboard size={18} />
          <span className="font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentPage("expenses")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition ${
            currentPage === "expenses"
              ? "bg-[#3A204F] text-pink-300 border-pink-500/30"
              : "text-purple-200 border-transparent hover:bg-[#2B1D3F]"
          }`}
        >
          <Receipt size={18} />
          <span className="font-medium">Expenses</span>
        </button>

        <button
          onClick={() => setCurrentPage("investments")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition ${
            currentPage === "investments"
              ? "bg-[#3A204F] text-pink-300 border-pink-500/30"
              : "text-purple-200 border-transparent hover:bg-[#2B1D3F]"
          }`}
        >
          <TrendingUp size={18} />
          <span className="font-medium">Investments</span>
        </button>
      </div>

      

      <div className="flex items-center gap-4 text-purple-200">
        <button
          onClick={() => setCurrentPage("settings")}
          className={`p-2 rounded-xl transition ${
            currentPage === "settings"
              ? "bg-[#3A204F] text-pink-300"
              : "hover:bg-[#2B1D3F]"
          }`}
        >
          <Settings size={22} />
        </button>

        <button
          onClick={onSignOut}
          className="p-2 rounded-xl hover:bg-[#2B1D3F]"
          title="Sign out"
        >
          <LogOut size={22} />
        </button>

        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center">
          <User size={20} />
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, value, subtitle, iconBg }) {
  return (
    <div className="bg-[#2A1D3D] rounded-3xl p-6">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: iconBg }}
      >
        {icon}
      </div>

      <p className="text-[#D0B0F8] text-base">{title}</p>
      <h2 className="text-white text-3xl md:text-4xl font-bold mt-3 leading-none">
        {value}
      </h2>
      <p className="text-[#8E6BB8] text-sm mt-2">{subtitle}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-[#2A1D3D] rounded-3xl p-8">
      <h3 className="text-2xl font-bold mb-8">{title}</h3>
      {children}
    </div>
  );
}

function MonthYearSelector({
  selectedYear,
  setSelectedYear,
  selectedMonthIndex,
  setSelectedMonthIndex,
}) {
  const currentYear = new Date().getFullYear();
  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="bg-[#181126] rounded-2xl px-5 py-3 min-w-[320px] flex items-center gap-3">
      <button
        type="button"
        onClick={() => {
          if (selectedMonthIndex === 0) {
            setSelectedMonthIndex(11);
            setSelectedYear((year) => year - 1);
          } else {
            setSelectedMonthIndex((month) => month - 1);
          }
        }}
        className="px-3 py-2 rounded-xl bg-[#2A1D3D] hover:bg-[#3A2953]"
      >
        ←
      </button>

      <select
        value={selectedMonthIndex}
        onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
        className="bg-transparent text-white outline-none text-xl"
      >
        {monthOptions.map((month, index) => (
          <option key={month} value={index} className="text-black">
            {month}
          </option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
        className="bg-transparent text-white outline-none text-xl"
      >
        {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((year) => (
          <option key={year} value={year} className="text-black">
            {year}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => {
          if (selectedMonthIndex === 11) {
            setSelectedMonthIndex(0);
            setSelectedYear((year) => year + 1);
          } else {
            setSelectedMonthIndex((month) => month + 1);
          }
        }}
        className="px-3 py-2 rounded-xl bg-[#2A1D3D] hover:bg-[#3A2953]"
      >
        →
      </button>
    </div>
  );
}

function DashboardPage({
  totalIncome,
  totalExpenses,
  spendableBalance,
  dailyBudget,
  extraBudget,
  pieData,
  barData,
  selectedYear,
  setSelectedYear,
  selectedMonthIndex,
  setSelectedMonthIndex,
}) {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold">Dashboard</h1>
      <p className="text-[#C9A9F5] text-xl mt-3 mb-10">
        Track your spending and stay on budget
      </p>

      <div className="mb-8">
        <MonthYearSelector
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonthIndex={selectedMonthIndex}
          setSelectedMonthIndex={setSelectedMonthIndex}
        />
      </div>

      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            icon={<Wallet size={28} />}
            title="Total Income"
            value={formatCurrency(totalIncome)}
            subtitle="Monthly income"
            iconBg="linear-gradient(135deg, #4F46E5, #9333EA)"
          />
          <Card
            icon={<TrendingDown size={28} />}
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            subtitle={`${totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : "0.0"}% of Income`}
            iconBg="linear-gradient(135deg, #FF2D55, #E11D48)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            icon={<DollarSign size={28} />}
            title="Spendable Balance"
            value={formatCurrency(spendableBalance)}
            subtitle="Remaining this month"
            iconBg="linear-gradient(135deg, #10B981, #14B8A6)"
          />
          <Card
            icon={<Calendar size={28} />}
            title="Daily Budget"
            value={formatCurrency(dailyBudget)}
            subtitle="Estimated daily budget"
            iconBg="linear-gradient(135deg, #7C3AED, #8B5CF6)"
          />
          <Card
            icon={<TrendingUp size={28} />}
            title="Extra"
            value={formatCurrency(extraBudget)}
            subtitle="Unused budget from earlier days"
            iconBg="linear-gradient(135deg, #F59E0B, #FB7185)"
          />
        </div>
      </div>

      <div className="space-y-6">
        <ChartCard title="Spending by Category">
          <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-8 items-center">
            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="48%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }) =>
                      percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between bg-[#181126] rounded-2xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[#D0B0F8]">{item.name}</span>
                  </div>

                  <span className="font-semibold text-white">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Daily Spending">
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3C2756" />
                <XAxis
                  dataKey="day"
                  stroke="#A78BFA"
                  interval={0}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  stroke="#A78BFA"
                  domain={[
                    0,
                    (dataMax) => {
                      const budgetCeiling = dailyBudget * 1.5;
                      return Math.max(
                        Number.isFinite(dataMax) ? dataMax : 0,
                        Number.isFinite(budgetCeiling) ? budgetCeiling : 0
                      );
                    },
                  ]}
                />
                <ReferenceLine
                  y={dailyBudget}
                  stroke="#F9A8D4"
                  strokeDasharray="8 8"
                  strokeWidth={2}
                  label={{
                    value: "Daily Budget",
                    position: "right",
                    offset: 12,
                    fill: "#F9A8D4",
                  }}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "#241735",
                    border: "1px solid #4C2F6D",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="amount" fill="#C155B8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </>
  );
}

function AddExpenseModal({
  onClose,
  onAddExpense,
  defaultDate,
  defaultCategory,
  defaultMethod,
  allCategories,
  allMethods,
}) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: defaultCategory,
    method: defaultMethod,
    date: defaultDate,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleAdd() {
    if (!formData.name.trim() || !formData.amount || Number(formData.amount) <= 0) {
      return;
    }

    await onAddExpense({
      name: formData.name.trim(),
      amount: Number(formData.amount),
      category: formData.category,
      method: formData.method,
      date: formData.date,
    });

    setFormData((prev) => ({
      ...prev,
      name: "",
      amount: "",
    }));
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-xl bg-[#241735] rounded-3xl p-8 border border-[#3B2754]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Add New Expense</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#2F2145] flex items-center justify-center hover:bg-[#3A2953]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[#D0B0F8] mb-2">Expense Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter expense name"
              className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[#D0B0F8] mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D0B0F8] mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
              >
                {allCategories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#D0B0F8] mb-2">Payment Method</label>
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
              >
                {allMethods.map((method) => (
                  <option key={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#D0B0F8] mb-2">Date</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const current = new Date(formData.date);
                  current.setDate(current.getDate() - 1);
                  setFormData((prev) => ({
                    ...prev,
                    date: formatDateInputValue(current),
                  }));
                }}
                className="px-3 py-3 rounded-2xl bg-[#2F2145] hover:bg-[#3A2953] text-white"
              >
                <ChevronLeft size={18} />
              </button>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="flex-1 bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
              />

              <button
                type="button"
                onClick={() => {
                  const current = new Date(formData.date);
                  current.setDate(current.getDate() + 1);
                  setFormData((prev) => ({
                    ...prev,
                    date: formatDateInputValue(current),
                  }));
                }}
                className="px-3 py-3 rounded-2xl bg-[#2F2145] hover:bg-[#3A2953] text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl text-lg font-semibold bg-[#2F2145] hover:bg-[#3A2953]"
            >
              Done
            </button>

            <button
              onClick={handleAdd}
              className="px-6 py-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90"
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function AddIncomeModal({ onClose, onAddIncome, defaultDate }) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: defaultDate,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleAdd() {
    if (!formData.name.trim() || !formData.amount || Number(formData.amount) <= 0) {
      return;
    }

    await onAddIncome({
      name: formData.name.trim(),
      amount: Number(formData.amount),
      date: formData.date,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-xl bg-[#241735] rounded-3xl p-8 border border-[#3B2754]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Add Income</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#2F2145] flex items-center justify-center hover:bg-[#3A2953]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[#D0B0F8] mb-2">Income Source</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter income source"
              className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[#D0B0F8] mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[#D0B0F8] mb-2">Date</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const current = new Date(formData.date);
                  current.setDate(current.getDate() - 1);
                  setFormData((prev) => ({
                    ...prev,
                    date: formatDateInputValue(current),
                  }));
                }}
                className="px-3 py-3 rounded-2xl bg-[#2F2145] hover:bg-[#3A2953] text-white"
              >
                <ChevronLeft size={18} />
              </button>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="flex-1 bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
              />

              <button
                type="button"
                onClick={() => {
                  const current = new Date(formData.date);
                  current.setDate(current.getDate() + 1);
                  setFormData((prev) => ({
                    ...prev,
                    date: formatDateInputValue(current),
                  }));
                }}
                className="px-3 py-3 rounded-2xl bg-[#2F2145] hover:bg-[#3A2953] text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl text-lg font-semibold bg-[#2F2145] hover:bg-[#3A2953]"
            >
              Done
            </button>

            <button
              onClick={handleAdd}
              className="px-6 py-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
            >
              Add Income
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpensesPage({
  expenses,
  income,
  onAddExpense,
  onDeleteExpense,
  onAddIncome,
  onDeleteIncome,
  defaultEntryDate,
  defaultCategory,
  defaultMethod,
  allCategories,
  allMethods,
  selectedYear,
  setSelectedYear,
  selectedMonthIndex,
  setSelectedMonthIndex,
}) {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState("expenses");

  const selectedMonth = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, "0")}`;

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => expense.date?.slice(0, 7) === selectedMonth);
  }, [expenses, selectedMonth]);

  const filteredRegularExpenses = useMemo(() => {
    return filteredExpenses.filter(
      (expense) => !isExcludedBudgetCategory(expense.category)
    );
  }, [filteredExpenses]);

  const filteredNecessities = useMemo(() => {
    return filteredExpenses.filter((expense) =>
      isExcludedBudgetCategory(expense.category)
    );
  }, [filteredExpenses]);

  const filteredIncome = useMemo(() => {
    return income.filter((item) => item.date?.slice(0, 7) === selectedMonth);
  }, [income, selectedMonth]);

  const groupedExpenses = useMemo(
    () => groupEntriesByDate(filteredRegularExpenses),
    [filteredRegularExpenses]
  );

  const groupedNecessities = useMemo(
    () => groupEntriesByDate(filteredNecessities),
    [filteredNecessities]
  );

  const groupedIncome = useMemo(() => groupEntriesByDate(filteredIncome), [filteredIncome]);

  

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold">Expense Tracker</h1>

      <MonthYearSelector
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonthIndex={selectedMonthIndex}
        setSelectedMonthIndex={setSelectedMonthIndex}
      />

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setShowIncomeModal(true)}
          className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 rounded-3xl text-lg font-semibold hover:opacity-90"
        >
          <Plus size={24} />
          Add Income
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 rounded-3xl text-lg font-semibold hover:opacity-90"
        >
          <Plus size={24} />
          Add Expense
        </button>
      </div>

      <div className="mt-8">
        <div className="inline-flex flex-wrap gap-3 rounded-3xl bg-[#1E1530] p-3 border border-[#332149]">
          <button
            type="button"
            onClick={() => setActiveSection("expenses")}
            className={`px-5 py-3 rounded-2xl font-semibold transition ${
              activeSection === "expenses"
                ? "bg-[#3A204F] text-pink-300"
                : "text-purple-200 hover:bg-[#2A1D3D]"
            }`}
          >
            Expenses
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("necessities")}
            className={`px-5 py-3 rounded-2xl font-semibold transition ${
              activeSection === "necessities"
                ? "bg-[#5A4030] text-[#FFD089]"
                : "text-[#F6C177] hover:bg-[#3A2A1F]"
            }`}
          >
            Necessities
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("income")}
            className={`px-5 py-3 rounded-2xl font-semibold transition ${
              activeSection === "income"
                ? "bg-[#21453B] text-[#86EFAC]"
                : "text-[#A7F3D0] hover:bg-[#1F3A33]"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {activeSection === "expenses" && (
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-6 text-white">Expenses</h2>

          <div className="space-y-6">
            {groupedExpenses.map((group) => (
              <div key={group.date} className="bg-[#2A1D3D] rounded-3xl p-5">
                <div className="flex items-center justify-between border-b border-[#3B2754] pb-5">
                  <div className="flex items-center gap-3 text-[#D8C1F4]">
                    <Calendar size={18} />
                    <span className="text-2xl font-semibold">{formatDateHeading(group.date)}</span>
                  </div>
                  <span className="text-2xl font-bold">{formatCurrency(group.total)}</span>
                </div>

                <div className="mt-5 space-y-4">
                  {group.items.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between bg-transparent py-3">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-[#3A2953] flex items-center justify-center text-3xl">
                          {categoryIcons[expense.category] || "🧾"}
                        </div>

                        <div>
                          <h3 className="text-xl md:text-2xl font-semibold">{expense.name}</h3>
                          <p className="text-[#D0B0F8] text-lg mt-1">
                            {getCategoryLabel(expense.category)} <span className="mx-2">•</span> {expense.method}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xl md:text-2xl font-bold">{formatCurrency(expense.amount)}</span>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className="w-11 h-11 rounded-full bg-[#3A204F] hover:bg-[#512E6C] flex items-center justify-center text-pink-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "necessities" && (
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-6 text-[#F6C177]">Necessities</h2>

          <div className="space-y-6">
            {groupedNecessities.map((group) => (
              <div key={group.date} className="bg-[#3A2A1F] rounded-3xl p-5">
                <div className="flex items-center justify-between border-b border-[#5A4030] pb-5">
                  <div className="flex items-center gap-3 text-[#F9D8A8]">
                    <Calendar size={18} />
                    <span className="text-2xl font-semibold">{formatDateHeading(group.date)}</span>
                  </div>
                  <span className="text-2xl font-bold text-[#FFD089]">{formatCurrency(group.total)}</span>
                </div>

                <div className="mt-5 space-y-4">
                  {group.items.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between bg-transparent py-3">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-[#5A4030] flex items-center justify-center text-3xl">
                          {categoryIcons[expense.category] || "🧾"}
                        </div>

                        <div>
                          <h3 className="text-xl md:text-2xl font-semibold">{expense.name}</h3>
                          <p className="text-[#F6C177] text-lg mt-1">
                            {getCategoryLabel(expense.category)} <span className="mx-2">•</span> {expense.method}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xl md:text-2xl font-bold text-[#FFD089]">{formatCurrency(expense.amount)}</span>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className="w-11 h-11 rounded-full bg-[#5A4030] hover:bg-[#70503D] flex items-center justify-center text-[#FFD089]"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "income" && (
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-6 text-[#A7F3D0]">Income History</h2>

          <div className="space-y-6">
            {groupedIncome.map((group) => (
              <div key={group.date} className="bg-[#1F3A33] rounded-3xl p-5">
                <div className="flex items-center justify-between border-b border-[#2E5A4E] pb-5">
                  <div className="flex items-center gap-3 text-[#D1FAE5]">
                    <Calendar size={18} />
                    <span className="text-2xl font-semibold">{formatDateHeading(group.date)}</span>
                  </div>
                  <span className="text-2xl font-bold text-[#86EFAC]">{formatCurrency(group.total)}</span>
                </div>

                <div className="mt-5 space-y-4">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-[#2E5A4E] flex items-center justify-center text-3xl">
                          💵
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold">{item.name}</h3>
                          <p className="text-[#A7F3D0] text-lg mt-1">Income</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-[#86EFAC]">{formatCurrency(item.amount)}</span>
                        <button
                          onClick={() => onDeleteIncome(item.id)}
                          className="w-11 h-11 rounded-full bg-[#21453B] hover:bg-[#2E5A4E] flex items-center justify-center text-[#A7F3D0]"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <AddExpenseModal
          onClose={() => setShowModal(false)}
          onAddExpense={onAddExpense}
          defaultDate={defaultEntryDate}
          defaultCategory={defaultCategory}
          defaultMethod={defaultMethod}
          allCategories={allCategories}
          allMethods={allMethods}
        />
      )}
      {showIncomeModal && (
        <AddIncomeModal
          onClose={() => setShowIncomeModal(false)}
          onAddIncome={onAddIncome}
          defaultDate={defaultEntryDate}
        />
      )}
    </>
  );
}
function SettingsPage({
  defaultCategory,
  setDefaultCategory,
  defaultMethod,
  setDefaultMethod,
  builtInCategories,
  builtInMethods,
  customCategories,
  customMethods,
  onAddCategory,
  onDeleteCategory,
  onAddMethod,
  onDeleteMethod,
}) {
  const [newCategory, setNewCategory] = useState("");
  const [newMethod, setNewMethod] = useState("");

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold">Settings</h1>
      <p className="text-[#C9A9F5] text-xl mt-3 mb-10">
        Choose your default expense preferences
      </p>

      <div className="max-w-2xl bg-[#2A1D3D] rounded-3xl p-8 space-y-6">
        <div>
          <label className="block text-[#D0B0F8] mb-3 text-lg">
            Default Category
          </label>
          <select
            value={defaultCategory}
            onChange={(e) => setDefaultCategory(e.target.value)}
            className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-4 text-white outline-none text-lg"
          >
            {[...builtInCategories, ...customCategories].map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#D0B0F8] mb-3 text-lg">
            Default Payment Method
          </label>
          <select
            value={defaultMethod}
            onChange={(e) => setDefaultMethod(e.target.value)}
            className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-4 text-white outline-none text-lg"
          >
            {[...builtInMethods, ...customMethods].map((method) => (
              <option key={method}>{method}</option>
            ))}
          </select>
        </div>

        <div className="border-t border-[#3B2754] pt-6">
          <h2 className="text-2xl font-bold mb-4">Custom Categories</h2>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add new category"
              className="flex-1 bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
            />
            <button
              onClick={() => {
                onAddCategory(newCategory);
                setNewCategory("");
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 font-semibold"
            >
              Add
            </button>
          </div>

          <div className="space-y-3">
            {customCategories.map((category) => (
              <div
                key={category}
                className="flex items-center justify-between bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3"
              >
                <span>{category}</span>
                <button
                  onClick={() => onDeleteCategory(category)}
                  className="text-pink-300 hover:text-pink-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#3B2754] pt-6">
          <h2 className="text-2xl font-bold mb-4">Custom Payment Methods</h2>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newMethod}
              onChange={(e) => setNewMethod(e.target.value)}
              placeholder="Add new payment method"
              className="flex-1 bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
            />
            <button
              onClick={() => {
                onAddMethod(newMethod);
                setNewMethod("");
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 font-semibold"
            >
              Add
            </button>
          </div>

          <div className="space-y-3">
            {customMethods.map((method) => (
              <div
                key={method}
                className="flex items-center justify-between bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3"
              >
                <span>{method}</span>
                <button
                  onClick={() => onDeleteMethod(method)}
                  className="text-pink-300 hover:text-pink-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


function InvestmentsPage({
  totalSavings,
  totalInvested,
  totalGrowth,
  totalAssets,
  allocationData,
  contributionHistory,
  growthHistory,
  onAddContribution,
  onAddGrowth,
  onDeleteContribution,
  onDeleteGrowth,
}) {
  const [contributionAmount, setContributionAmount] = useState("");
  const [allocationName, setAllocationName] = useState("");
  const [contributionType, setContributionType] = useState("Savings");
  const [historyFilter, setHistoryFilter] = useState("Savings");

  const [growthAmount, setGrowthAmount] = useState("");
  const [growthSource, setGrowthSource] = useState("Bank Interest");
  const [growthDate, setGrowthDate] = useState(getTodayDateInput());

  const [stockPrice, setStockPrice] = useState("");
  const [lots, setLots] = useState("");

  const [fees, setFees] = useState("");

  const filteredContributionHistory = useMemo(() => {
    return contributionHistory.filter((item) => item.type === historyFilter);
  }, [contributionHistory, historyFilter]);

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold">Investment & Savings</h1>
      <p className="text-[#C9A9F5] text-xl mt-3 mb-10">
        Grow your wealth and track your progress
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <Card
          icon={<Wallet size={28} />}
          title="Total Savings"
          value={formatCurrency(totalSavings)}
          subtitle='Money under "Savings" type'
          iconBg="linear-gradient(135deg, #7C3AED, #A855F7)"
        />
        <Card
          icon={<Plus size={28} />}
          title="Total Invested"
          value={formatCurrency(totalInvested)}
          subtitle='Money under "Investment" type'
          iconBg="linear-gradient(135deg, #0EA5E9, #2563EB)"
        />
        <Card
          icon={<Wallet size={28} />}
          title="Total Assets"
          value={formatCurrency(totalAssets)}
          subtitle="Savings plus investments"
          iconBg="linear-gradient(135deg, #F59E0B, #F97316)"
        />
        <Card
          icon={<TrendingUp size={28} />}
          title="Growth Earned"
          value={formatCurrency(totalGrowth)}
          subtitle="Passive growth"
          iconBg="linear-gradient(135deg, #10B981, #14B8A6)"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8 mb-10">
        <div className="bg-[#2A1D3D] rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-8">Record Where Savings Went</h2>

          <div className="space-y-6">
  <div>
    <label className="block text-[#D0B0F8] mb-3 text-lg">Asset / Destination</label>
    <input
      type="text"
      value={allocationName}
      onChange={(e) => setAllocationName(e.target.value)}
      placeholder="e.g. GXBank, VOO, Bitcoin"
      className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-4 text-white outline-none"
    />
  </div>

  <div>
    <label className="block text-[#D0B0F8] mb-3 text-lg">Type</label>
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => setContributionType("Savings")}
        className={`py-4 rounded-2xl font-semibold ${
          contributionType === "Savings"
            ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
            : "bg-[#181126] border border-[#3C2A55] text-white"
        }`}
      >
        Savings
      </button>
      <button
        type="button"
        onClick={() => setContributionType("Investment")}
        className={`py-4 rounded-2xl font-semibold ${
          contributionType === "Investment"
            ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
            : "bg-[#181126] border border-[#3C2A55] text-white"
        }`}
      >
        Investment
      </button>
    </div>
  </div>

  {contributionType === "Savings" && (
    <div>
      <label className="block text-[#D0B0F8] mb-3 text-lg">Amount</label>
      <div className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-4 flex items-center gap-3">
        <span className="text-white">RM</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={contributionAmount}
          onChange={(e) => setContributionAmount(e.target.value)}
          placeholder="0.00"
          className="bg-transparent w-full text-white outline-none"
        />
      </div>
    </div>
  )}

  {contributionType === "Investment" && (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

    
      <div>
        <label className="block text-[#D0B0F8] mb-3 text-lg">Stock Price</label>
        <div className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-4 flex items-center gap-3">
          <span className="text-white">RM</span>
          <input
            type="number"
            min="0"
            step="0.0001"
            value={stockPrice}
            onChange={(e) => setStockPrice(e.target.value)}
            placeholder="0.00"
            className="bg-transparent w-full text-white outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[#D0B0F8] mb-3 text-lg">Lots</label>
        <input
          type="number"
          min="0"
          step="1"
          value={lots}
          onChange={(e) => setLots(e.target.value)}
          placeholder="100"
          className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-4 text-white outline-none"
        />
      </div>

      <div>
        <label className="block text-[#D0B0F8] mb-3 text-lg">Fees</label>
        <div className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-4 flex items-center gap-3">
          <span className="text-white">RM</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            placeholder="0.00"
            className="bg-transparent w-full text-white outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[#D0B0F8] mb-3 text-lg">Amount (auto) </label>
        <div className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-4 flex items-center gap-3">
          <span className="text-white">RM</span>
          <input
            type="number"
            value={
              stockPrice !== "" && lots !== ""
                ? (
                    Number(stockPrice) * Number(lots) +
                    Number(fees || 0)
                  ).toFixed(2)
                : ""
            }
            readOnly
            placeholder="0.00"
            className="bg-transparent w-full text-white outline-none"
          />
        </div>
      </div>

    
    </div>
  )}

  <button
    onClick={() => {
      const finalAmount =
        contributionType === "Investment"
          ? Number(stockPrice || 0) * Number(lots || 0) + Number(fees || 0)
          : Number(contributionAmount || 0);

      if (!allocationName.trim() || finalAmount <= 0) return;

      onAddContribution({
        amount: finalAmount,
        category: allocationName.trim(),
        type: contributionType,
        date: getTodayDateInput(),
        stock_price: contributionType === "Investment" ? Number(stockPrice || 0) : null,
        lots: contributionType === "Investment" ? Number(lots || 0) : null,
      });

      setContributionAmount("");
      setAllocationName("");
      setStockPrice("");
      setLots("");
      setFees("");
    }}
    className="w-full py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90"
  >
    + Add Allocation
  </button>

  <div className="border border-[#4C2F6D] rounded-2xl px-4 py-4 text-[#D0B0F8]">
    ⓘ Record where your saved money was placed, such as GXBank, VOO, or Bitcoin
  </div>
</div>
        </div>

        <div className="bg-[#2A1D3D] rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-8">Record Growth</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-[#D0B0F8] mb-3 text-lg">Amount</label>
              <div className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-4 flex items-center gap-3">
                <span className="text-white">RM</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={growthAmount}
                  onChange={(e) => setGrowthAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent w-full text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#D0B0F8] mb-3 text-lg">Source</label>
              <select
                value={growthSource}
                onChange={(e) => setGrowthSource(e.target.value)}
                className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-4 text-white outline-none"
              >
                <option>Bank Interest</option>
                <option>Dividend</option>
                <option>Capital Gain</option>
                <option>ETF Dividend</option>
              </select>
            </div>

            <div>
              <label className="block text-[#D0B0F8] mb-3 text-lg">Date</label>
              <input
                type="date"
                value={growthDate}
                onChange={(e) => setGrowthDate(e.target.value)}
                className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-4 text-white outline-none"
              />
            </div>

            <button
              onClick={() => {
                if (!growthAmount) return;

                onAddGrowth({
                  amount: Number(growthAmount),
                  source: growthSource,
                  date: growthDate,
                });

                setGrowthAmount("");
              }}
              className="w-full py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90"

            >
              Add Growth
            </button>

            <div className="border border-[#1E6B62] rounded-2xl px-4 py-4 text-[#B6F5E7]">
              ↗ Track returns earned from your savings and investments
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-8 mb-10">
        <div className="bg-[#2A1D3D] rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-8">Allocation Distribution</h2>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="48%"
                  outerRadius={95}
                  dataKey="value"
                  label={({ percent }) =>
                    percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""
                  }
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {allocationData.map((item) => (
              <div key={item.name} className="flex items-center gap-3 text-[#D0B0F8]">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#2A1D3D] rounded-3xl p-8">
          <div className="flex items-start justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold">Where Your Money Goes</h2>

            <div className="inline-flex gap-3 rounded-2xl bg-[#181126] p-2 border border-[#3C2A55]">
              <button
                type="button"
                onClick={() => setHistoryFilter("Savings")}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  historyFilter === "Savings"
                    ? "bg-[#3A204F] text-pink-300"
                    : "text-purple-200 hover:bg-[#2A1D3D]"
                }`}
              >
                Savings
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter("Investment")}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  historyFilter === "Investment"
                    ? "bg-[#1E3A5F] text-sky-300"
                    : "text-purple-200 hover:bg-[#2A1D3D]"
                }`}
              >
                Investment
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
            {filteredContributionHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-[#181126] rounded-2xl px-5 py-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#2B1D3F] flex items-center justify-center text-2xl">
                    {item.category === "Emergency Fund" && "🛡️"}
                    {item.category === "Stocks / ETFs" && "📈"}
                    {item.category === "Crypto" && "₿"}
                    {item.category === "Fixed Deposit" && "🏦"}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">{item.category}</h3>

                    <p className="text-[#D0B0F8] text-sm mt-1">
                      {item.type} <span className="mx-2">•</span>
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    {item.type === "Investment" && (
                      <p className="text-[#BFA6E8] text-sm mt-1">
                        Stock Price: {item.stock_price ? formatCurrency(item.stock_price) : "-"}
                        <span className="mx-2">•</span>
                        Lots: {item.lots ?? "-"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold">
                    {formatCurrency(item.amount)}
                  </div>

                  <button
                    onClick={() => onDeleteContribution(item.id)}
                    className="w-11 h-11 rounded-full bg-[#3A204F] hover:bg-[#512E6C] flex items-center justify-center text-pink-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#2A1D3D] rounded-3xl p-8">
        <div className="flex items-start justify-between mb-8">
          <h2 className="text-2xl font-bold">Growth History</h2>
          <div className="text-right">
            <p className="text-[#C9A9F5] text-sm">Total Growth</p>
            <p className="text-3xl font-bold text-[#18E7B2]">
              +{formatCurrency(totalGrowth)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {growthHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-[#181126] rounded-2xl px-5 py-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#123B39] flex items-center justify-center text-2xl">
                  ✨
                </div>

                <div>
                  <h3 className="text-xl font-semibold">{item.source}</h3>
                  <p className="text-[#D0B0F8] text-sm mt-1">
                    📅 {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-[#18E7B2]">
                  +{formatCurrency(item.amount)}
                </div>

                <button
                  onClick={() => onDeleteGrowth(item.id)}
                  className="w-11 h-11 rounded-full bg-[#1B4742] hover:bg-[#236158] flex items-center justify-center text-[#7EF0CD]"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AppShell({ session }) {
  const now = new Date();

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  const [defaultCategory, setDefaultCategory] = useState("Food");
  const [defaultMethod, setDefaultMethod] = useState("Cash");

  const [income, setIncome] = useState([]);
  const [loadingIncome, setLoadingIncome] = useState(true);

  const [customCategories, setCustomCategories] = useState([]);
  const [customMethods, setCustomMethods] = useState([]);
  const [entryDate, setEntryDate] = useState(getTodayDateInput());

  const [investmentContributions, setInvestmentContributions] = useState([]);
  const [investmentGrowth, setInvestmentGrowth] = useState([]);
  const [loadingInvestments, setLoadingInvestments] = useState(true);

  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(now.getMonth());

  const allCategories = [...builtInCategories, ...customCategories];
  const allMethods = [...builtInMethods, ...customMethods];

  const selectedMonth = `${selectedYear}-${String(
    selectedMonthIndex + 1
  ).padStart(2, "0")}`;

  const dashboardFilteredExpenses = useMemo(() => {
    return expenses.filter(
      (expense) => expense.date?.slice(0, 7) === selectedMonth
    );
  }, [expenses, selectedMonth]);

  const dashboardFilteredIncome = useMemo(() => {
    return income.filter(
      (item) => item.date?.slice(0, 7) === selectedMonth
    );
  }, [income, selectedMonth]);

  const totalIncome = useMemo(() => {
    return dashboardFilteredIncome.reduce((sum, item) => sum + Number(item.amount), 0);
  }, [dashboardFilteredIncome]);

  const totalSavedFromExpenses = useMemo(() => {
    return dashboardFilteredExpenses
      .filter((expense) => isExcludedBudgetCategory(expense.category))
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [dashboardFilteredExpenses]);

  const totalExpenses = useMemo(() => {
    return dashboardFilteredExpenses
      .filter((expense) => !isExcludedBudgetCategory(expense.category))
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [dashboardFilteredExpenses]);

  const spendableBalance = totalIncome - totalExpenses - totalSavedFromExpenses;
  const dailyBudgetBase = totalIncome - totalSavedFromExpenses;

  const daysInMonth = new Date(
    selectedYear,
    selectedMonthIndex + 1,
    0
  ).getDate();

  const dailyBudget = Number.isFinite(dailyBudgetBase / daysInMonth)
    ? dailyBudgetBase / daysInMonth
    : 0;

  const isPastSelectedMonth =
    selectedYear < now.getFullYear() ||
    (selectedYear === now.getFullYear() && selectedMonthIndex < now.getMonth());
  const isCurrentSelectedMonth =
    selectedYear === now.getFullYear() && selectedMonthIndex === now.getMonth();
  const elapsedDays = isPastSelectedMonth
    ? daysInMonth
    : isCurrentSelectedMonth
      ? now.getDate()
      : 0;
  const cutoffDate = elapsedDays
    ? formatDateInputValue(new Date(selectedYear, selectedMonthIndex, elapsedDays))
    : null;

  const spendingToDate = useMemo(() => {
    if (!cutoffDate) {
      return 0;
    }

    return dashboardFilteredExpenses
      .filter(
        (expense) =>
          !isExcludedBudgetCategory(expense.category) &&
          expense.date &&
          expense.date <= cutoffDate
      )
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [cutoffDate, dashboardFilteredExpenses]);

  const extraBudget = elapsedDays > 0
    ? (Number.isFinite(dailyBudget * elapsedDays - spendingToDate)
        ? dailyBudget * elapsedDays - spendingToDate
        : 0)
    : 0;

  const pieData = useMemo(() => {
    const totals = {};

    dashboardFilteredExpenses
      .filter((expense) => !isExcludedBudgetCategory(expense.category))
      .forEach((expense) => {
        totals[expense.category] =
          (totals[expense.category] || 0) + Number(expense.amount);
      });

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || "#A855F7",
    }));
  }, [dashboardFilteredExpenses]);

  const barData = useMemo(() => {
    const byDate = {};
    const totalDaysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();

    dashboardFilteredExpenses
      .filter((expense) => !isExcludedBudgetCategory(expense.category))
      .forEach((expense) => {
        byDate[expense.date] =
          (byDate[expense.date] || 0) + Number(expense.amount);
      });

    return Array.from({ length: totalDaysInMonth }, (_, index) => {
      const date = formatDateInputValue(
        new Date(selectedYear, selectedMonthIndex, index + 1)
      );

      return {
        day: new Date(date).toLocaleDateString("en-US", {
          day: "numeric",
        }),
        amount: byDate[date] || 0,
      };
    });
  }, [dashboardFilteredExpenses, selectedMonthIndex, selectedYear]);

  const totalSavings = useMemo(() => {
    return investmentContributions.reduce(
      (sum, item) =>
        item.type === "Savings" ? sum + Number(item.amount || 0) : sum,
      0
    );
  }, [investmentContributions]);

  const totalInvested = useMemo(() => {
    return investmentContributions.reduce(
      (sum, item) =>
        item.type === "Investment" ? sum + Number(item.amount || 0) : sum,
      0
    );
  }, [investmentContributions]);

  const totalGrowth = useMemo(() => {
    return investmentGrowth.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
  }, [investmentGrowth]);

  const totalAssets = totalSavings + totalInvested;

  const allocationData = useMemo(() => {
    const totals = {};

    investmentContributions.forEach((item, index) => {
      const category = item.category || "Uncategorized";
      totals[category] = {
        value: (totals[category]?.value || 0) + Number(item.amount || 0),
        color:
          totals[category]?.color ||
          Object.values(categoryColors)[index % Object.values(categoryColors).length] ||
          "#A855F7",
      };
    });

    return Object.entries(totals).map(([name, details]) => ({
      name,
      value: details.value,
      color: details.color,
    }));
  }, [investmentContributions]);














  async function fetchInvestmentContributions() {
    const { data, error } = await supabase
      .from("investment_contributions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch contributions failed:", error);
      return;
    }

    setInvestmentContributions(data || []);
  }

  async function fetchInvestmentGrowth() {
    const { data, error } = await supabase
      .from("investment_growth")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch growth failed:", error);
      return;
    }

    setInvestmentGrowth(data || []);
  }
  async function fetchUserOptions() {
    const { data, error } = await supabase
      .from("user_options")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch user options failed:", error);
      return;
    }

    const categories = [...new Set(data
      .filter((item) => item.type === "category")
      .map((item) => item.value))];

    const methods = [...new Set(data
      .filter((item) => item.type === "method")
      .map((item) => item.value))];

    setCustomCategories(categories);
    setCustomMethods(methods);
  } 

  async function handleAddCategory(newCategory) {
    const trimmed = newCategory.trim();
    if (!trimmed || allCategories.includes(trimmed)) return;

    const { error } = await supabase.from("user_options").insert([
      {
        user_id: session.user.id,
        type: "category",
        value: trimmed,
      },
    ]);

    if (error) {
      console.error("Add category failed:", error);
      alert(error.message);
      return;
    }

    setCustomCategories((prev) => [...prev, trimmed]);
  }

  async function handleDeleteCategory(categoryToDelete) {
    const { error } = await supabase
      .from("user_options")
      .delete()
      .eq("user_id", session.user.id)
      .eq("type", "category")
      .eq("value", categoryToDelete);

    if (error) {
      console.error("Delete category failed:", error);
      alert(error.message);
      return;
    }

    setCustomCategories((prev) =>
      prev.filter((item) => item !== categoryToDelete)
    );

    if (defaultCategory === categoryToDelete) {
      await handleDefaultCategoryChange("Food");
    }
  }

  async function fetchIncome() {
    setLoadingIncome(true);

    const { data, error } = await supabase
      .from("income")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error && data) {
      setIncome(data);
    }

    setLoadingIncome(false);
  }
  useEffect(() => {
    async function loadAll() {
      setLoadingInvestments(true);

      await Promise.all([
        fetchExpenses(),
        fetchIncome(),
        fetchUserOptions(),
        fetchUserSettings(),
        fetchInvestmentContributions(),
        fetchInvestmentGrowth(),
      ]);

      setLoadingInvestments(false);
    }

    loadAll();
  }, []);

  async function handleAddContribution(newContribution) {
    const { data, error } = await supabase
      .from("investment_contributions")
      .insert([newContribution])
      .select();

    if (error) {
      alert(error.message);
      return;
    }

    if (data && data.length > 0) {
      setInvestmentContributions((prev) => [data[0], ...prev]);
    }
  }

  async function handleAddGrowth(newGrowth) {
    const { data, error } = await supabase
      .from("investment_growth")
      .insert([newGrowth])
      .select();

    if (error) {
      alert(error.message);
      return;
    }

    if (data && data.length > 0) {
      setInvestmentGrowth((prev) => [data[0], ...prev]);
    }
  }

  async function handleDeleteContribution(id) {
    const { error } = await supabase
      .from("investment_contributions")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setInvestmentContributions((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleDeleteGrowth(id) {
    const { error } = await supabase
      .from("investment_growth")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setInvestmentGrowth((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleAddMethod(newMethod) {
    const trimmed = newMethod.trim();
    if (!trimmed || allMethods.includes(trimmed)) return;

    const { error } = await supabase.from("user_options").insert([
      {
        user_id: session.user.id,
        type: "method",
        value: trimmed,
      },
    ]);

    if (error) {
      console.error("Add method failed:", error);
      alert(error.message);
      return;
    }

    setCustomMethods((prev) => [...prev, trimmed]);
  }

  async function handleDeleteMethod(methodToDelete) {
    const { error } = await supabase
      .from("user_options")
      .delete()
      .eq("user_id", session.user.id)
      .eq("type", "method")
      .eq("value", methodToDelete);

    if (error) {
      console.error("Delete method failed:", error);
      alert(error.message);
      return;
    }

    setCustomMethods((prev) =>
      prev.filter((item) => item !== methodToDelete)
    );

    if (defaultMethod === methodToDelete) {
      await handleDefaultMethodChange("Cash");
    }
  }

  async function saveUserSettings(category, method) {
    const { error } = await supabase
      .from("user_settings")
      .upsert(
        {
          user_id: session.user.id,
          default_category: category,
          default_method: method,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      console.error("Failed to save settings:", error);
      alert(error.message);
    }
  }

  async function handleDefaultCategoryChange(value) {
    setDefaultCategory(value);
    await saveUserSettings(value, defaultMethod);
  }

  async function handleDefaultMethodChange(value) {
    setDefaultMethod(value);
    await saveUserSettings(defaultCategory, value);
  }

  async function handleAddIncome(newIncome) {
    const { error } = await supabase.from("income").insert([newIncome]);

    if (error) {
      console.error("Add income failed:", error);
      alert(error.message);
      return;
    }

    setEntryDate(newIncome.date);
    await fetchIncome();
  }

  async function handleDeleteIncome(id) {
    const { error } = await supabase.from("income").delete().eq("id", id);
    if (!error) {
      setIncome((prev) => prev.filter((item) => item.id !== id));
    }
  }

  async function fetchUserSettings() {
    const { data, error } = await supabase
      .from("user_settings")
      .select("default_category, default_method")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch settings:", error);
      return;
    }

    if (data) {
      setDefaultCategory(
        data.default_category === "Savings"
          ? "Necessity"
          : data.default_category || "Food"
      );
      setDefaultMethod(data.default_method || "Cash");
    }
  }

  async function fetchExpenses() {
    setLoadingExpenses(true);

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    console.log("fetched expenses:", data);
    console.log("fetch expenses error:", error);

    if (!error && data) {
      setExpenses(data);
    }

    setLoadingExpenses(false);
  }

  async function handleAddExpense(newExpense) {
    const { data, error } = await supabase
      .from("expenses")
      .insert([newExpense])
      .select();

    if (error) {
      alert(error.message);
      return;
    }

    // 🔥 instant UI update (no reload, modal stays open)
    if (data && data.length > 0) {
      setEntryDate(newExpense.date);
      setExpenses((prev) => [data[0], ...prev]);
    }
  }

  async function handleDeleteExpense(id) {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete expense failed:", error);
      alert(error.message);
      return;
    }

    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }


  return (
    <div className="min-h-screen bg-[#140F23] text-white">
      <NavBar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onSignOut={handleSignOut}
      />

      <div className="px-6 py-8 max-w-6xl mx-auto">
        <>
          {loadingExpenses && (
            <p className="text-[#C9A9F5] mb-4">Loading expenses...</p>
          )}

          {currentPage === "dashboard" && (
            <DashboardPage
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              spendableBalance={spendableBalance}
              dailyBudget={dailyBudget}
              extraBudget={extraBudget}
              pieData={pieData}
              barData={barData}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedMonthIndex={selectedMonthIndex}
              setSelectedMonthIndex={setSelectedMonthIndex}
            />
          )}

          {currentPage === "expenses" && (
            <ExpensesPage
              expenses={expenses}
              income={income}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
              onAddIncome={handleAddIncome}
              onDeleteIncome={handleDeleteIncome}
              defaultEntryDate={entryDate}
              defaultCategory={defaultCategory}
              defaultMethod={defaultMethod}
              allCategories={allCategories}
              allMethods={allMethods}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedMonthIndex={selectedMonthIndex}
              setSelectedMonthIndex={setSelectedMonthIndex}
            />
          )}

          {currentPage === "investments" && (
          <InvestmentsPage
            totalSavings={totalSavings}
            totalInvested={totalInvested}
            totalGrowth={totalGrowth}
            totalAssets={totalAssets}
            allocationData={allocationData}
            contributionHistory={investmentContributions}
            growthHistory={investmentGrowth}
            onAddContribution={handleAddContribution}
            onAddGrowth={handleAddGrowth}
            onDeleteContribution={handleDeleteContribution}
            onDeleteGrowth={handleDeleteGrowth}
            />
          )}


          {currentPage === "settings" && (
            <SettingsPage
              defaultCategory={defaultCategory}
              setDefaultCategory={handleDefaultCategoryChange}
              defaultMethod={defaultMethod}
              setDefaultMethod={handleDefaultMethodChange}
              builtInCategories={builtInCategories}
              builtInMethods={builtInMethods}
              customCategories={customCategories}
              customMethods={customMethods}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onAddMethod={handleAddMethod}
              onDeleteMethod={handleDeleteMethod}
            />
          )}
        </>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) {
      setIsRecoveryMode(true);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveryMode(true);
      }
      setSession(session);
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#140F23] text-white flex items-center justify-center">
        Checking session...
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  if (isRecoveryMode) {
    return <ResetPasswordPage onDone={() => setIsRecoveryMode(false)} />;
  }

  return <AppShell session={session} />;
}
