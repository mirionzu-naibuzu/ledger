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

const COLORS = ['#0f6e5c', '#b3402f', '#c9a227', '#5b6b8c', '#8a5a44', '#6b8f71'];

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
    <div className="min-h-screen bg-surface">
      <Nav />
      <div className="px-4 py-6 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl text-ink-900 mb-4">Dashboard</h1>

      <div className="bg-surface-card rounded-xl shadow-sm border border-ink-400/10 p-5 mb-6">
        <p className="text-sm text-ink-600">This month</p>
        <p className="font-display text-3xl text-ink-900 mt-1">
          ${summary.month_total.toFixed(2)}
        </p>
      </div>

      {summary.by_category.length === 0 ? (
        <p className="text-ink-400 text-sm text-center py-8">
          No entries this month yet.
        </p>
      ) : (
        <div className="bg-surface-card rounded-xl shadow-sm border border-ink-400/10 p-5">
          <p className="font-medium text-ink-900 mb-2">By category</p>

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

          <ul className="mt-4 space-y-2">
            {summary.by_category.map((cat, index) => (
              <li key={cat.category} className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-ink-600">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {cat.category}
                </span>
                <span className="font-medium text-ink-900">${cat.total.toFixed(2)}</span>
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