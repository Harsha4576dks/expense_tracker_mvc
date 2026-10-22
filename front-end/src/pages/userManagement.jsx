import { useEffect } from 'react';
import { UserDetails } from '../hooks/userHook';
import '../styles/userManagement.css'; 

export default function UserManagement() {
  const {
    formData,
    handleChange,
    handleDelete,
    handleSubmit,
    loading,
    success,
    error,
    userList,
    fetchAllUSers
  } = UserDetails();


  useEffect(() => {
    fetchAllUSers();
  }, []);

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
        <h3>Registered Users</h3>
        
        {loading && userList.length === 0 ? (
          <p>Loading users...</p>
        ) : userList.length === 0 ? (
          <p className="no-users-text">No user records found.</p>
        ) : (
          <table className="user-list-table">
            <thead>
              <tr className="table-header-row">
                <th>Name</th>
                <th>Email</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id} className="table-body-row">
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.salary}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="delete-action-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}