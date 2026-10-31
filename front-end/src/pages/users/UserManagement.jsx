import { useEffect, useRef, useState } from 'react';
import { UserDetails } from '../../hooks/userHook';
import { DataTable } from '../../components/DataTable';
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
    fetchUsers,
    invalidateUserSearch,
  } = UserDetails();

  useEffect(() => {
    const name = searchTerm.trim();
    invalidateUserSearch();

    if (!name) {
      fetchUsers();
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      fetchUsers(name);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchUsers, invalidateUserSearch]);

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

  const handleUserSubmit = async (event) => {
    const savedUser = await handleSubmit(event);
    if (savedUser) {
      if (savedUser.fullName.trim().toLowerCase() === searchTerm.trim().toLowerCase()) {
        await fetchUsers(savedUser.fullName);
      } else {
        setSearchTerm(savedUser.fullName);
      }
      setIsFormOpen(false);
    }
  };

  return (
    <div className="user-management-container">
      <h2>User & Expense Management</h2>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div className="user-toolbar">
        <div className="user-search">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by user name"
            aria-label="Search users by name"
            className="form-input"
          />
        </div>

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

        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'fullName', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'salary', label: 'Salary' },
          ]}
          data={userList}
          loading={loading && userList.length === 0}
          emptyMessage={
            searchTerm.trim()
              ? `No users found for ${searchTerm}.`
              : 'Search by a user name to view matching records.'
          }
        />
      </div>
    </div>
  );
}