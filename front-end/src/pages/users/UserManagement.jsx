import { useState } from 'react';
import { UserDetails } from '../../hooks/userHook';
import "./UserManagement.css";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchUserById(searchTerm);
  };

  return (
    <div className="user-management-container">
      <h2>User & Expense Management</h2>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="user-form">
        <h3>Add New User</h3>
        
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

        <button 
          type="submit" 
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Saving...' : 'Save User'}
        </button>
      </form>


      <div className="user-table-card">
        <div className="user-list-header">
          <h3>Registered Users</h3>
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
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
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