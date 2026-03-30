import { useMemo, useState } from "react";
import {
  Wallet,
  TrendingDown,
  DollarSign,
  Calendar,
  LayoutDashboard,
  Receipt,
  Settings,
  User,
  Plus,
  Trash2,
  X,
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
} from "recharts";

const initialExpenses = [
  {
    id: 1,
    name: "Coffee Shop",
    category: "Food",
    method: "Cash",
    date: "2026-03-29",
    amount: 6.5,
  },
  {
    id: 2,
    name: "Grocery Shopping",
    category: "Food",
    method: "Card",
    date: "2026-03-28",
    amount: 85.5,
  },
  {
    id: 3,
    name: "Uber to Work",
    category: "Transport",
    method: "E-wallet",
    date: "2026-03-27",
    amount: 15.0,
  },
  {
    id: 4,
    name: "Netflix",
    category: "Entertainment",
    method: "Card",
    date: "2026-03-26",
    amount: 45.9,
  },
  {
    id: 5,
    name: "Electric Bill",
    category: "Bills",
    method: "Bank Transfer",
    date: "2026-03-25",
    amount: 120.0,
  },
  {
    id: 6,
    name: "Pharmacy",
    category: "Health",
    method: "Card",
    date: "2026-03-24",
    amount: 30.0,
  },
  {
    id: 7,
    name: "Online Shopping",
    category: "Shopping",
    method: "Card",
    date: "2026-03-23",
    amount: 131.59,
  },
];

const categoryColors = {
  Food: "#FF6B6B",
  Transport: "#4ECDC4",
  Entertainment: "#FFE66D",
  Shopping: "#95D5C0",
  Bills: "#F28482",
  Health: "#C9C9E8",
};

const categoryIcons = {
  Food: "🍔",
  Transport: "🚗",
  Entertainment: "🎬",
  Shopping: "🛍️",
  Bills: "📄",
  Health: "💊",
};

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
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

function getTodayDateInput() {
  return new Date().toISOString().split("T")[0];
}
function NavBar({ currentPage, setCurrentPage }) {
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
      </div>

      <div className="flex items-center gap-5 text-purple-200">
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

        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center">
          <User size={20} />
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, value, subtitle, iconBg }) {
  return (
    <div className="bg-[#2A1D3D] rounded-3xl p-5">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: iconBg }}
      >
        {icon}
      </div>

      <p className="text-[#D0B0F8] text-lg">{title}</p>
      <h2 className="text-white text-3xl md:text-4xl font-bold mt-3 leading-none">
  {value}
</h2>
      <p className="text-[#8E6BB8] text-base mt-2">{subtitle}</p>
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

function DashboardPage({ totalExpenses, spendableBalance, dailyBudget, pieData, barData }) {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold">Dashboard</h1>
      <p className="text-[#C9A9F5] text-2xl mt-3 mb-10">
        Track your spending and stay on budget
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card
          icon={<Wallet size={28} />}
          title="Total Income"
          value="$4,500.00"
          subtitle="Monthly income"
          iconBg="linear-gradient(135deg, #4F46E5, #9333EA)"
        />
        <Card
          icon={<TrendingDown size={28} />}
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          subtitle={`${((totalExpenses / 4500) * 100).toFixed(1)}% of budget`}
          iconBg="linear-gradient(135deg, #FF2D55, #E11D48)"
        />
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
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Spending by Category">
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
        </ChartCard>

        <ChartCard title="Daily Spending">
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3C2756" />
                <XAxis dataKey="day" stroke="#A78BFA" />
                <YAxis stroke="#A78BFA" />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "#241735",
                    border: "1px solid #4C2F6D",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="amount" fill="#C155B8" radius={[10, 10, 0, 0]} />
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
  defaultCategory,
  defaultMethod,
}) {
  const [formData, setFormData] = useState({
  name: "",
  amount: "",
  category: defaultCategory,
  method: defaultMethod,
  date: getTodayDateInput(),
});

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleAdd() {
    if (!formData.name.trim() || !formData.amount || Number(formData.amount) <= 0) {
      return;
    }

    onAddExpense({
      id: Date.now(),
      name: formData.name.trim(),
      amount: Number(formData.amount),
      category: formData.category,
      method: formData.method,
      date: formData.date,
    });

    // 🔥 reset form but KEEP modal open
    setFormData({
      name: "",
      amount: "",
      category: defaultCategory,
      method: defaultMethod,
      date: getTodayDateInput(),
    });
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
                <option>Food</option>
                <option>Transport</option>
                <option>Entertainment</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Health</option>
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
                <option>Cash</option>
                <option>Card</option>
                <option>E-wallet</option>
                <option>Bank Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#D0B0F8] mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-[#181126] border border-[#3C2A55] rounded-2xl px-4 py-3 text-white outline-none"
            />
          </div>

          {/* 🔥 NEW BUTTON DESIGN */}
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

function ExpensesPage({
  expenses,
  setExpenses,
  defaultCategory,
  defaultMethod,
}) {
  const [showModal, setShowModal] = useState(false);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const groupedExpenses = useMemo(() => {
    const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    const groups = {};
    sorted.forEach((expense) => {
      if (!groups[expense.date]) {
        groups[expense.date] = [];
      }
      groups[expense.date].push(expense);
    });

    return Object.entries(groups).map(([date, items]) => ({
      date,
      items,
      total: items.reduce((sum, item) => sum + item.amount, 0),
    }));
  }, [expenses]);

  function handleAddExpense(newExpense) {
    setExpenses((prev) => [newExpense, ...prev]);
  }

  function handleDeleteExpense(id) {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }

  const latestDate = expenses.length > 0 ? expenses[0].date : getTodayDateInput();
  const monthLabel = formatMonthYear(latestDate);

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold">Expense Tracker</h1>

      <div className="bg-[#2A1D3D] rounded-3xl p-7 mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-4">
          <Calendar className="text-[#C9A9F5]" />
          <div className="bg-[#181126] rounded-2xl px-5 py-3 min-w-[230px]">
            <p className="text-2xl">{monthLabel}</p>
          </div>
        </div>

        <div className="text-left md:text-right">
          <p className="text-[#D0B0F8] text-lg">Total Expenses</p>
          <h2 className="text-5xl font-bold">{formatCurrency(totalExpenses)}</h2>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4 rounded-3xl text-2xl font-semibold hover:opacity-90"
        >
          <Plus size={24} />
          Add New Expense
        </button>
      </div>

      <div className="mt-8 space-y-6">
        {groupedExpenses.map((group) => (
          <div key={group.date} className="bg-[#2A1D3D] rounded-3xl p-5">
            <div className="flex items-center justify-between border-b border-[#3B2754] pb-5">
              <div className="flex items-center gap-3 text-[#D8C1F4]">
                <Calendar size={18} />
                <span className="text-2xl font-semibold">
                  {formatDateHeading(group.date)}
                </span>
              </div>
              <span className="text-2xl font-bold">{formatCurrency(group.total)}</span>
            </div>

            <div className="mt-5 space-y-4">
              {group.items.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between bg-transparent py-3"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#3A2953] flex items-center justify-center text-3xl">
                      {categoryIcons[expense.category]}
                    </div>

                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold">{expense.name}</h3>
                      <p className="text-[#D0B0F8] text-lg mt-1">
                        {expense.category} <span className="mx-2">•</span> {expense.method}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xl md:text-2xl font-bold">
                      {formatCurrency(expense.amount)}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
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

      {showModal && (
        <AddExpenseModal
          onClose={() => setShowModal(false)}
          onAddExpense={handleAddExpense}
          defaultCategory={defaultCategory}
          defaultMethod={defaultMethod}
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
}) {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold">Settings</h1>
      <p className="text-[#C9A9F5] text-2xl mt-3 mb-10">
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
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Health</option>
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
            <option>Cash</option>
            <option>Card</option>
            <option>E-wallet</option>
            <option>Bank Transfer</option>
          </select>
        </div>
      </div>
    </>
  );
}
function App() {
  const [currentPage, setCurrentPage] = useState("expenses");
  const [expenses, setExpenses] = useState(initialExpenses);

  const [defaultCategory, setDefaultCategory] = useState("Food");
  const [defaultMethod, setDefaultMethod] = useState("Cash");

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const totalIncome = 4500;
  const spendableBalance = totalIncome - totalExpenses;
  const dailyBudget = spendableBalance / 30;

  const pieData = useMemo(() => {
    const totals = {};

    expenses.forEach((expense) => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name],
    }));
  }, [expenses]);

  const barData = useMemo(() => {
    const byDate = {};

    expenses.forEach((expense) => {
      byDate[expense.date] = (byDate[expense.date] || 0) + expense.amount;
    });

    return Object.entries(byDate)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, amount]) => ({
        day: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amount,
      }));
  }, [expenses]);

  return (
    <div className="min-h-screen bg-[#140F23] text-white">
      <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="px-6 py-8 max-w-6xl mx-auto">
        {currentPage === "dashboard" && (
          <DashboardPage
            totalExpenses={totalExpenses}
            spendableBalance={spendableBalance}
            dailyBudget={dailyBudget}
            pieData={pieData}
            barData={barData}
          />
        )}

        {currentPage === "expenses" && (
          <ExpensesPage
            expenses={expenses}
            setExpenses={setExpenses}
            defaultCategory={defaultCategory}
            defaultMethod={defaultMethod}
          />
        )}

        {currentPage === "settings" && (
          <SettingsPage
            defaultCategory={defaultCategory}
            setDefaultCategory={setDefaultCategory}
            defaultMethod={defaultMethod}
            setDefaultMethod={setDefaultMethod}
          />
        )}
      </div>
    </div>
  );
}

export default App;