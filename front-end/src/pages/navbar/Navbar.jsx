import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Receipt, 
  PieChart, 
  LogOut, 
  Wallet,
  Mail,
  User,
  LayoutDashboard
} from 'lucide-react'; 
import { logoutUser } from "../../services/loginService";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, path: '/home' },
    { name: 'Users', icon: <User size={20} />, path: '/users' },
    { name: 'Expenses', icon: <Receipt size={20} />, path: '/expenses' },
    { name: 'PDF reports', icon: <PieChart size={20} />, path: '/expenses/user' },
    { name: 'Email reports', icon: <Mail size={20} />, path: '/email/send-expense-report' },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    try {      
        await logoutUser();
        navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo">
          <Wallet className="logo-icon" size={24} />
          <span className="brand-name">ExpenseTracker</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                title={item.name}
              >
                <span className="icon-wrapper">{item.icon}</span>
                <span className="link-text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-link logout-link" onClick={handleLogout}>
          <span className="icon-wrapper"><LogOut size={20} /></span>
          <span className="link-text">Logout</span>
        </button>
      </div>
    </aside>
  );
}