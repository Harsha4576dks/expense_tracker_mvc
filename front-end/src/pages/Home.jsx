import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/loginService";
import Button from "../components/Button";
import '../styles/Home.css';

export default function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };


    return (
        <div>
            <div className="Home-container">
                <h1>Welcome to the Expense Tracker Site</h1>
                <p>you have successffully logged in to track your Expenses</p>


                <div className="logout-wrapper">
                    <Button
                    onClick={handleLogout}
                    variant="danger"
                    >
                        Logout
                    </Button>

                </div>
            </div>
        </div>
    );
}