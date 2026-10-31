import { useEffect, useRef, useState } from "react";
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
    fetchExpensesByUserName,
    invalidateExpenseSearch,
    loading,
    success,
    error: hookError,
    expenseData,
    setExpenseData,
  } = ExpenseDetails();

  const [searchName, setSearchName] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const addExpenseButtonRef = useRef(null);
  const drawerCloseButtonRef = useRef(null);
  const wasFormOpenRef = useRef(false);

  useEffect(() => {
    const userName = searchName.trim();
    invalidateExpenseSearch();
    setExpenseData(null);

    if (!userName) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      fetchExpensesByUserName(userName);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchName, fetchExpensesByUserName, invalidateExpenseSearch, setExpenseData]);

  useEffect(() => {
    if (!isFormOpen) {
      if (wasFormOpenRef.current) {
        addExpenseButtonRef.current?.focus();
        wasFormOpenRef.current = false;
      }
      return undefined;
    }

    wasFormOpenRef.current = true;
    drawerCloseButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsEditing(false);
        setSelectedExpense(null);
        setIsFormOpen(false);
        setFormData(emptyFormData);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFormOpen, setFormData]);

  const handleAddExpense = () => {
    const userIds = [...new Set((expenseData || []).map((expense) => expense.user_id))];
    setFormData({
      ...emptyFormData,
      user_id: userIds.length === 1 ? userIds[0] : "",
    });
    setIsEditing(false);
    setSelectedExpense(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (expense) => {
    if (!expense) return;
    setIsEditing(true);
    setSelectedExpense(expense);
    setIsFormOpen(true);
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
        setIsFormOpen(false);
        setFormData(emptyFormData);
        setExpenseData((currentExpenses) =>
          (currentExpenses || [])
            .filter((expense) => expense.id !== selectedExpense.id)
            .concat(Number(updatedExpense.user_id) === Number(selectedExpense.user_id)
              ? [updatedExpense]
              : []),
        );
      }
    } else {
      const newExpense = await handleSubmit(e);
      if (newExpense) {
        if (newExpense.user_name.trim().toLowerCase() === searchName.trim().toLowerCase()) {
          await fetchExpensesByUserName(newExpense.user_name);
        } else {
          setSearchName(newExpense.user_name);
        }
        setIsFormOpen(false);
        setFormData(emptyFormData);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedExpense(null);
    setIsFormOpen(false);
    setFormData(emptyFormData);
  };

  return (
    <div className="expense-management-container">
      <h2>Expense Management</h2>

      <div className="expense-toolbar">
        <div className="lookup-form">
          <input
            type="search"
            aria-label="Search expenses by user name"
            placeholder="Search expenses by user name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="form-input"
          />
        </div>
        <button
          ref={addExpenseButtonRef}
          type="button"
          className="submit-btn"
          onClick={handleAddExpense}
          disabled={loading}
        >
          Add Expense
        </button>
      </div>

      {hookError && <div className="alert-error">{hookError}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div
        className={`side-drawer${isFormOpen ? " is-open" : ""}`}
        aria-hidden={!isFormOpen}
        inert={!isFormOpen}
      >
        <button
          type="button"
          className="side-drawer-backdrop"
          aria-label="Close expense form"
          tabIndex={-1}
          onClick={handleCancelEdit}
        />
        <aside
          className="side-drawer-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="expense-drawer-title"
        >
          <div className="side-drawer-header">
            <h3 id="expense-drawer-title">
              {isEditing ? `Edit Expense ID: ${selectedExpense?.id}` : "Add New Expense"}
            </h3>
            <button
              ref={drawerCloseButtonRef}
              type="button"
              className="cancel-btn side-drawer-close"
              aria-label="Close expense form"
              onClick={handleCancelEdit}
            >
              Close
            </button>
          </div>

          <form onSubmit={onSubmitAction} className="expense-form-card expense-drawer-form">
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
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                {isEditing ? "Cancel Edit" : "Cancel"}
              </button>
            </div>
          </form>
        </aside>
      </div>

      {expenseData && expenseData.length === 0 && !hookError && (
        <p className="no-expenses-text">No expenses found for {searchName}.</p>
      )}
      {loading && expenseData === null && (
        <p className="no-expenses-text">Searching expenses...</p>
      )}
      {expenseData?.length > 0 && !isEditing && (
        <div className="search-results">
          <h3>Expenses for {searchName}</h3>
          <div className="expense-table-wrapper">
            <table className="expense-list-table">
              <thead>
                <tr className="table-header-row">
                  <th>ID</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>User Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenseData.map((expense) => (
                  <tr className="table-body-row" key={expense.id}>
                    <td>{expense.id}</td>
                    <td>{expense.date}</td>
                    <td>{expense.description}</td>
                    <td>{expense.category}</td>
                    <td>{expense.payment_method}</td>
                    <td>{expense.amount_spent}</td>
                    <td>{expense.user_name}</td>
                    <td>
                      <div className="expense-row-actions">
                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() => handleEditClick(expense)}
                          disabled={loading}
                        >
                          Edit
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
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}