import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api';
import Nav from '../components/Nav';

interface CategoryTotal {
  category: string;
  total: number;
}

interface DashboardSummary {
  month_total: number;
  by_category: CategoryTotal[];
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7', '#ec4899'];

function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/summary').then((data) => {
      setSummary(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  if (!summary) {
    return <p className="p-4">Could not load dashboard.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p className="text-sm text-gray-500">This month</p>
        <p className="text-3xl font-bold">${summary.month_total.toFixed(2)}</p>
      </div>

      {summary.by_category.length === 0 ? (
        <p className="text-gray-500">No entries this month yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">
          <p className="font-medium mb-2">By category</p>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={summary.by_category}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => entry.name}
              >
                {summary.by_category.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <ul className="mt-4 space-y-1">
            {summary.by_category.map((cat, index) => (
              <li key={cat.category} className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {cat.category}
                </span>
                <span className="font-medium">${cat.total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
}

export default Dashboard;