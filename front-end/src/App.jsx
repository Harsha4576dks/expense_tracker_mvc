import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./pages/loginForm";
import Home from "./pages/Home";
import "./App.css";
import UserManagement from "./pages/userManagement";
import ExpenseManagement from "./pages/expenseManagement";
import PdfManagement from "./pages/pdfManagement";
import EmailManagement from "./pages/emailManagement";

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