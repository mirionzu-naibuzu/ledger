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
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Entries</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 mb-6 space-y-3"
      >
        <div className="flex gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            required
          />
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded font-medium"
          >
            {editingId !== null ? 'Update Entry' : 'Add Entry'}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {entries.length === 0 ? (
        <p className="text-gray-500">No entries yet.</p>
      ) : (
        <ul className="space-y-2">
                    {entries.map((entry) => (
            <li
              key={entry.id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{entry.category}</p>
                <p className="text-sm text-gray-500">
                  {entry.date} {entry.note ? `· ${entry.note}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">${entry.amount.toFixed(2)}</p>
                <button
                  onClick={() => handleEditClick(entry)}
                  className="text-blue-500 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-500 text-sm"
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