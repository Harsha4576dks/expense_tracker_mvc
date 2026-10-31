import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./pages/navbar/Navbar";
import LoginForm from "./pages/login/LoginForm";
import Home from "./pages/home/Home";
import "./App.css";
import UserManagement from "./pages/users/UserManagement";
import ExpenseManagement from "./pages/expenses/ExpenseManagement";
import PdfManagement from "./pages/pdf/PdfManagement";
import EmailManagement from "./pages/email/EmailManagement";

function AppLayout() {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<LoginForm />} />
                <Route path="/logout" element={<LoginForm />} />
                <Route element={<AppLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/expenses" element={<ExpenseManagement />} />
                    <Route path="/expenses/user" element={<PdfManagement />} />
                    <Route path="/email/send-expense-report" element={<EmailManagement />} />
                </Route>
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;