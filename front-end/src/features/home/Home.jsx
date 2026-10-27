import Navbar from "../components/Navbar";
import '../styles/Home.css';

export default function Home() {
    
    return (
        <div className="layout-container">
            <Navbar />
            <div className="Home-container">
                <h1>Welcome to the Expense Tracker Site</h1>
                <p>you have successffully logged in to track your Expenses</p>



                </div>
            </div>
        
    );
}