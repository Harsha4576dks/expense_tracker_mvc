import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./pages/login/LoginForm";
import Home from "./pages/home/Home";
import "./App.css";
import UserManagement from "./pages/users/UserManagement";
import ExpenseManagement from "./pages/expenses/ExpenseManagement";
import PdfManagement from "./pages/pdf/PdfManagement";
import EmailManagement from "./pages/email/EmailManagement";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<LoginForm />} />
                <Route path="/logout" element={<LoginForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/expenses" element={<ExpenseManagement />} />
                <Route path="/expenses/user" element={<PdfManagement />} />
                <Route path="/email/send-expense-report" element={<EmailManagement />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;