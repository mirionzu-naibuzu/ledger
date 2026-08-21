import { Link, useNavigate } from 'react-router-dom';
import { clearToken } from '../api';

function Nav() {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate('/');
  }

  return (
    <nav className="bg-surface-card border-b border-ink-400/10 px-4 py-3 flex justify-between items-center">
      <div className="flex gap-5">
        <Link
          to="/entries"
          className="font-medium text-ink-900 hover:text-brand-600 transition-colors"
        >
          Entries
        </Link>
        <Link
          to="/dashboard"
          className="font-medium text-ink-900 hover:text-brand-600 transition-colors"
        >
          Dashboard
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-danger-600 hover:text-danger-700 transition-colors"
      >
        Log out
      </button>
    </nav>
  );
}

export default Nav;