import {  useState } from "react";
import { ExpenseDetails } from "../hooks/expenseHook"; 
import "../styles/ExpenseManagement.css";

export default function ExpenseManagement() {
  const {
    formData,
    setFormData,
    handleChange,
    handleDelete,
    handleSubmit,
    handleUpdate,
    fetchExpensebyId,
    loading,
    success,
    error,
    expenseData,    
  } = ExpenseDetails();

  const [isEditing, setIsEditing] = useState(false);
  const [searchId, setSearchId] = useState("");

  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return;
    const data = await fetchExpensebyId(searchId);
    if (data) {
      setFormData({
        date: data.date || "",
        description: data.description || "",
        category: data.category || "",
        payment_method: data.payment_method || "",
        amount_spent: data.amount_spent || "",
        user_id: data.user_id || "",
      });
      setIsEditing(true);
    }
  };

  const resetFormToCreate = () => {
    setIsEditing(false);
    setSearchId("");
    setFormData({
      date: "",
      description: "",
      category: "",
      payment_method: "",
      amount_spent: "",
      user_id: "",
    });
  };

  return (
    <div className="expense-management-container">
      <h2>Expense Management</h2>

      
      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      
      <div className="lookup-card">
        <h3>Find Expense by ID</h3>
        <form onSubmit={handleSearch} className="lookup-form">
          <input
            type="number"
            placeholder="Enter Expense ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="form-input"
          />
          <button type="submit" disabled={loading} className="secondary-btn">
            Search
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetFormToCreate}
              className="cancel-btn"
            >
              Switch to Create New
            </button>
          )}
        </form>

        {expenseData && (
          <div className="search-result-card" style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <h4>Found Expense Details:</h4>
            <p><strong>ID:</strong> {expenseData.id}</p>
            <p><strong>Description:</strong> {expenseData.description}</p>
            <p><strong>Category:</strong> {expenseData.category}</p>
            <p><strong>Amount:</strong> {expenseData.amount_spent}</p>
            <p><strong>Date:</strong> {expenseData.date}</p>
          </div>
        )}
      </div>

      
      <form
        onSubmit={isEditing ? (e) => handleUpdate(searchId, e) : handleSubmit}
        className="expense-form-card"
      >
        <h3>{isEditing ? `Edit Expense ID: ${searchId}` : "Add New Expense"}</h3>

        <div className="form-field-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-field-group">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter description"
            className="form-input"
          />
        </div>

        <div className="form-field-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="e.g., Food, Travel"
            className="form-input"
          />
        </div>

        <div className="form-field-group">
          <label>Payment Method:</label>
          <input
            type="text"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            required
            placeholder="e.g., Credit Card, Cash"
            className="form-input"
          />
        </div>

        <div className="form-field-group">
          <label>Amount Spent:</label>
          <input
            type="number"
            step="0.01"
            name="amount_spent"
            value={formData.amount_spent}
            onChange={handleChange}
            required
            placeholder="Enter amount"
            className="form-input"
          />
        </div>

        <div className="form-field-group">
          <label>User ID:</label>
          <input
            type="number"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            placeholder="Enter User ID"
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Processing..." : isEditing ? "Update Expense" : "Save Expense"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={() => handleDelete(searchId)}
              className="delete-action-btn"
              disabled={loading}
            >
              Delete Record
            </button>
          )}
        </div>
      </form>
    </div>
  );
}