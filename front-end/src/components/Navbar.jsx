import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { 
  Receipt, 
  PieChart, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Wallet,
  Mail,
  User
} from 'lucide-react'; 
import { logoutUser } from '../services/loginService';
import '../styles/Navbar.css'; 

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Expenses');
  const navigate = useNavigate(); 

  const navItems = [
    { name: 'User', icon: <User size={20} />, path: '/users' },
    { name: 'Expenses', icon: <Receipt size={20} />, path: '#expenses' },
    { name: 'Graph', icon: <PieChart size={20} />, path: '#Graph' },
    { name: 'Mail', icon: <Mail size={20} />, path: '#Email' },
  ];

  
  const handleLogout = async (e) => {
    e.preventDefault(); 
    try {      
        await logoutUser();
        localStorage.removeItem('token'); 
        navigate('/login'); 
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      
      <div className="sidebar-header">
        <div className="brand-logo">
          <Wallet className="logo-icon" size={24} />
          {!isCollapsed && <span className="brand-name">ExpenseTracker</span>}
        </div>
        <button 
          className="collapse-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`nav-link ${activeItem === item.name ? 'active' : ''}`}
                onClick={() => setActiveItem(item.name)}
              >
                <span className="icon-wrapper">{item.icon}</span>
                {!isCollapsed && <span className="link-text">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

    
      <div className="sidebar-footer">
        <button className="nav-link logout-link" onClick={handleLogout}>
          <span className="icon-wrapper"><LogOut size={20} /></span>
          {!isCollapsed && <span className="link-text">Logout</span>}
        </button>
      </div>
    </aside>
  );
}