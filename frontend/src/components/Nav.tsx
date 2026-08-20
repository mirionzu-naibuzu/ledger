import { Link, useNavigate } from 'react-router-dom';
import { clearToken } from '../api';

function Nav() {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate('/');
  }

  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/entries" className="font-medium">Entries</Link>
        <Link to="/dashboard" className="font-medium">Dashboard</Link>
      </div>
      <button onClick={handleLogout} className="text-sm text-red-500">
        Log out
      </button>
    </nav>
  );
}

export default Nav;