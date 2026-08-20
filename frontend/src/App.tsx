import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Entries from './pages/Entries';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/entries" element={<Entries />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;