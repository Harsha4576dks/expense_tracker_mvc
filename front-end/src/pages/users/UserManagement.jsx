import { useEffect, useRef, useState } from 'react';
import { UserDetails } from '../../hooks/userHook';
import "./UserManagement.css";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const addUserButtonRef = useRef(null);
  const drawerCloseButtonRef = useRef(null);
  const wasFormOpenRef = useRef(false);
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    success,
    error,
    userList,
    fetchUserById
  } = UserDetails();

  useEffect(() => {
    if (!isFormOpen) {
      if (wasFormOpenRef.current) {
        addUserButtonRef.current?.focus();
        wasFormOpenRef.current = false;
      }
      return undefined;
    }

    wasFormOpenRef.current = true;
    drawerCloseButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsFormOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFormOpen]);

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchUserById(searchTerm);
  };

  const handleUserSubmit = async (event) => {
    const savedUser = await handleSubmit(event);
    if (savedUser) {
      setIsFormOpen(false);
    }
  };

  return (
    <div className="user-management-container">
      <h2>User & Expense Management</h2>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div className="user-toolbar">
        <form className="user-search" onSubmit={handleSearch}>
          <input
            type="number"
            min="1"
            step="1"
            required
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by user ID"
            aria-label="Search users by ID"
            className="form-input"
          />
          <button type="submit" className="secondary-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <button
          ref={addUserButtonRef}
          type="button"
          className="submit-btn"
          onClick={() => setIsFormOpen(true)}
          disabled={loading}
        >
          Add User
        </button>
      </div>

      <div
        className={`side-drawer${isFormOpen ? ' is-open' : ''}`}
        aria-hidden={!isFormOpen}
        inert={!isFormOpen}
      >
        <button
          type="button"
          className="side-drawer-backdrop"
          aria-label="Close user form"
          tabIndex={-1}
          onClick={() => setIsFormOpen(false)}
        />
        <aside
          className="side-drawer-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-drawer-title"
        >
          <div className="side-drawer-header">
            <h3 id="user-drawer-title">Add New User</h3>
            <button
              ref={drawerCloseButtonRef}
              type="button"
              className="cancel-btn side-drawer-close"
              aria-label="Close user form"
              onClick={() => setIsFormOpen(false)}
            >
              Close
            </button>
          </div>

          <form onSubmit={handleUserSubmit} className="user-form user-drawer-form">
            <div className="form-field-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="form-input"
              />
            </div>

            <div className="form-field-group">
              <label>Salary:</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                placeholder="Enter salary"
                className="form-input"
              />
            </div>

            <div className="form-field-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Saving...' : 'Save User'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsFormOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </aside>
      </div>

      <div className="user-table-card">
        <div className="user-list-header">
          <h3>Registered Users</h3>
        </div>

        {loading && userList.length === 0 ? (
          <p>Loading users...</p>
        ) : userList.length === 0 ? (
          <p className="no-users-text">Search by a user ID to view the matching record.</p>
        ) : (
          <table className="user-list-table">
            <thead>
              <tr className="table-header-row">
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id} className="table-body-row">
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}