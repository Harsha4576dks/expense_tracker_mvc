import { useState } from "react";
import { useEmailDetails } from "../../hooks/emailHook";
import "./EmailManagement.css";

export default function EmailManagement() {
  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [comment, setComment] = useState("");

  const { handleSendEmail, loading, error, success } = useEmailDetails();

  const onSubmitAction = async (e) => {
    e.preventDefault();
    if (!userId || !startDate || !endDate) return;

    await handleSendEmail(userId, startDate, endDate, comment);
  };

  return (
    <div className="email-management-container">
      <h2>Send Expense Report Email</h2>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <form onSubmit={onSubmitAction} className="email-form-card">
        <h3>Email Parameters</h3>

        <div className="form-field-group">
          <label>User ID:</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            placeholder="Enter User ID"
            className="form-input"
          />
        </div>

        <div className="form-row">
          <div className="form-field-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-field-group">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-field-group">
          <label>Comment (Optional):</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional custom remarks"
            className="form-input"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Sending Email..." : "Send Email Report"}
        </button>
      </form>
    </div>
  );
}