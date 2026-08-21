import { useEffect, useState } from 'react';
import { api } from '../api';
import Nav from '../components/Nav';

interface Entry {
  id: number;
  amount: number;
  category: string;
  date: string;
  note: string | null;
}

function Entries() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
  
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [note, setNote] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
  
    function loadEntries() {
      api.get('/entries/').then((data) => {
        setEntries(data);
        setLoading(false);
      });
    }
  
    useEffect(() => {
      loadEntries();
    }, []);
  
    function resetForm() {
      setAmount('');
      setCategory('');
      setDate('');
      setNote('');
      setEditingId(null);
    }
  
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
  
      const payload = {
        amount: parseFloat(amount),
        category,
        date,
        note: note || null,
      };
  
      if (editingId !== null) {
        await api.put(`/entries/${editingId}`, payload);
      } else {
        await api.post('/entries/', payload);
      }
  
      resetForm();
      loadEntries();
    }
  
    function handleEditClick(entry: Entry) {
      setEditingId(entry.id);
      setAmount(String(entry.amount));
      setCategory(entry.category);
      setDate(entry.date);
      setNote(entry.note || '');
    }
  
    async function handleDelete(id: number) {
      await api.delete(`/entries/${id}`);
      loadEntries();
    }

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-surface">
      <Nav />
      <div className="px-4 py-6 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl text-ink-900 mb-4">Entries</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-surface-card rounded-xl shadow-sm border border-ink-400/10 p-5 mb-6 space-y-3"
      >
        <div className="flex gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border border-ink-400/30 rounded-lg px-3 py-2 outline-none focus:border-brand-600 transition-colors"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 border border-ink-400/30 rounded-lg px-3 py-2 outline-none focus:border-brand-600 transition-colors"
            required
          />
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-ink-400/30 rounded-lg px-3 py-2 outline-none focus:border-brand-600 transition-colors"
          required
        />

        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border border-ink-400/30 rounded-lg px-3 py-2 outline-none focus:border-brand-600 transition-colors"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            {editingId !== null ? 'Update Entry' : 'Add Entry'}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-lg border border-ink-400/30 text-ink-600 hover:bg-surface transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {entries.length === 0 ? (
        <p className="text-ink-400 text-sm text-center py-8">
          No entries yet — add your first one above.
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="bg-surface-card rounded-xl shadow-sm border border-ink-400/10 p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-ink-900">{entry.category}</p>
                <p className="text-sm text-ink-400">
                  {entry.date} {entry.note ? `· ${entry.note}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-ink-900">${entry.amount.toFixed(2)}</p>
                <button
                  onClick={() => handleEditClick(entry)}
                  className="text-sm text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-sm text-danger-600 hover:text-danger-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}

export default Entries;