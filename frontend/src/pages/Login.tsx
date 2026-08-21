import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const data = await api.post('/login', { email, password });
      setToken(data.access_token);
      navigate('/entries');
    } catch (err) {
      setError('Invalid email or password');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface-card p-8 rounded-xl shadow-sm border border-ink-400/10"
      >
        <h1 className="font-display text-3xl text-ink-900 mb-1">Ledger</h1>
        <p className="text-sm text-ink-600 mb-6">Track spending, without the noise.</p>

        {error && (
          <p className="bg-danger-50 text-danger-600 text-sm px-3 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium text-ink-600 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-ink-400/30 rounded-lg px-3 py-2 mb-4 outline-none focus:border-brand-600 transition-colors"
          required
        />

        <label className="block text-sm font-medium text-ink-600 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-ink-400/30 rounded-lg px-3 py-2 mb-6 outline-none focus:border-brand-600 transition-colors"
          required
        />

        <button
          type="submit"
          className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg font-medium transition-colors"
        >
          Log in
        </button>
      </form>
    </div>
  );
}

export default Login;