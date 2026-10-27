import { useState } from "react";
import { ExpenseDetails } from "../../hooks/expenseHook";
import "./ExpenseManagement.css";

const emptyFormData = {
  date: "",
  description: "",
  category: "",
  payment_method: "",
  amount_spent: "",
  user_id: "",
};

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
    error: hookError,
    expenseData,
    setExpenseData,
  } = ExpenseDetails();

  const [searchId, setSearchId] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const userId = searchId.trim();
    if (!userId) return;

    setExpenseData([]);
    setIsEditing(false);
    setSelectedExpense(null);

    await fetchExpensebyId(userId);
  };

  const handleEditClick = (expense) => {
    if (!expense) return;
    setIsEditing(true);
    setSelectedExpense(expense);
    setFormData({
      date: expense.date || "",
      description: expense.description || "",
      category: expense.category || "",
      payment_method: expense.payment_method || "",
      amount_spent: expense.amount_spent ?? "",
      user_id: expense.user_id ?? "",
    });
  };

  const onSubmitAction = async (e) => {
    e.preventDefault();
    if (isEditing) {
      if (!selectedExpense) return;
      const updated = await handleUpdate(selectedExpense.id, e);
      if (updated) {
        const updatedExpense = {
          ...selectedExpense,
          ...formData,
          id: selectedExpense.id,
        };
        setIsEditing(false);
        setSelectedExpense(null);
        setFormData(emptyFormData);
        setExpenseData((currentExpenses) =>
          (currentExpenses || [])
            .filter((expense) => expense.id !== selectedExpense.id)
            .concat(
              Number(updatedExpense.user_id) === Number(searchId)
                ? [updatedExpense]
                : [],
            ),
        );
      }
    } else {
      const newExpense = await handleSubmit(e);
      if (newExpense) {
        const created = {
          ...formData,
          ...newExpense,
          id: newExpense.id,
        };
        setSearchId(String(created.user_id));
        setExpenseData((currentExpenses) =>
          Number(searchId) === Number(created.user_id)
            ? [...(currentExpenses || []).filter((expense) => expense.id !== created.id), created]
            : [created],
        );
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedExpense(null);
    setFormData(emptyFormData);
  };

  return (
    <div className="expense-management-container">
      <h2>Expense Management</h2>

      {/* Lookup Bar Form */}
      <form onSubmit={handleSearch} className="lookup-form">
        <input
          type="number"
          min="1"
          required
          aria-label="Search expenses by user ID"
          placeholder="Search expenses by user ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="form-input"
        />
        <button type="submit" disabled={loading} className="secondary-btn">
          Search
        </button>
      </form>

      {hookError && <div className="alert-error">{hookError}</div>}
      {success && <div className="alert-success">{success}</div>}

      {/* Expense Form (Handles both Create and Update) */}
      <form onSubmit={onSubmitAction} className="expense-form-card">
        <h3>{isEditing ? `Edit Expense ID: ${expenseData?.id}` : "Add New Expense"}</h3>

        <div className="form-field-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={loading || isEditing}
            className="form-input"
          />
          {isEditing && <small className="field-hint">Date cannot be changed by the current API.</small>}
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
            disabled={loading || isEditing}
            placeholder="e.g., Food, Travel"
            className="form-input"
          />
          {isEditing && <small className="field-hint">Category cannot be changed by the current API.</small>}
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
            min="0"
            step="1"
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
              className="cancel-btn"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Searched Record Details Card */}
      {expenseData && expenseData.length === 0 && !hookError && (
        <p className="no-expenses-text">No expenses found for user ID {searchId}.</p>
      )}
      {expenseData?.length > 0 && !isEditing && (
        <div className="search-results">
          <h3>Expenses for User ID {searchId}</h3>
          {expenseData.map((expense) => (
            <div className="search-result-card" key={expense.id}>
              <h4>Expense ID: {expense.id}</h4>
              <p><strong>Description:</strong> {expense.description}</p>
              <p><strong>Category:</strong> {expense.category}</p>
              <p><strong>Payment Method:</strong> {expense.payment_method}</p>
              <p><strong>Amount:</strong> {expense.amount_spent}</p>
              <p><strong>Date:</strong> {expense.date}</p>
              <p><strong>User ID:</strong> {expense.user_id}</p>

              <div className="card-actions">
                <button type="button" className="secondary-btn" onClick={() => handleEditClick(expense)} disabled={loading}>
                  Edit Record
                </button>
                <button
                  type="button"
                  className="delete-action-btn"
                  onClick={async () => {
                    const deleted = await handleDelete(expense.id);
                    if (deleted) {
                      setExpenseData((currentExpenses) =>
                        (currentExpenses || []).filter((item) => item.id !== expense.id),
                      );
                    }
                  }}
                  disabled={loading}
                >
                  Delete Record
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}