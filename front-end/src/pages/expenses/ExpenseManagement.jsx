import { useEffect, useRef, useState } from "react";
import { ExpenseDetails } from "../../hooks/expenseHook";
import { DataTable } from "../../components/DataTable";
import "./ExpenseManagement.css";

const emptyFormData = {
  date: "",
  description: "",
  category: "",
  payment_method: "",
  amount_spent: "",
  user_id: "",
  user_name: "",
};

export default function ExpenseManagement() {
  const {
    formData,
    setFormData,
    handleChange,
    handleDelete,
    handleSubmit,
    handleUpdate,
    fetchExpenses,
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
      fetchExpenses();
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      fetchExpenses(userName);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchName, fetchExpenses, invalidateExpenseSearch, setExpenseData]);

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
      user_name: userIds.length === 1
        ? expenseData.find((expense) => expense.user_id === userIds[0])?.user_name || ""
        : "",
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
      user_name: expense.user_name || "",
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
        await fetchExpenses(searchName.trim());
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
              <label>User Name:</label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
                disabled={loading || isEditing}
                placeholder="Enter exact user name"
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

      {!isEditing && (
        <div className="search-results">
          <h3>{searchName.trim() ? `Expenses for ${searchName}` : "All Expenses"}</h3>
          <DataTable
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'date', label: 'Date' },
              { key: 'description', label: 'Description' },
              { key: 'category', label: 'Category' },
              { key: 'payment_method', label: 'Payment Method' },
              { key: 'amount_spent', label: 'Amount' },
              { key: 'user_name', label: 'User Name' },
            ]}
            data={expenseData || []}
            loading={loading && expenseData === null}
            emptyMessage={
              searchName.trim()
                ? `No expenses found for ${searchName}.`
                : "No expenses found."
            }
            renderActions={(expense) => (
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
            )}
          />
        </div>
      )}
    </div>
  );
}