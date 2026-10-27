import { useState } from "react";
import { usePdfDetails } from "../../hooks/pdfHook";
import "./PdfManagement.css";

export default function PdfManagement() {
  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { handleDownloadPdf, loading, error, success } = usePdfDetails();

  const onSubmitAction = async (e) => {
    e.preventDefault();
    if (!userId || !startDate || !endDate) return;

    await handleDownloadPdf(userId, startDate, endDate);
  };

  return (
    <div className="pdf-management-container">
      <h2>Download User Expense PDF Report</h2>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <form onSubmit={onSubmitAction} className="pdf-form-card">
        <h3>Report Parameters</h3>

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

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Generating PDF..." : "Download PDF"}
        </button>
      </form>
    </div>
  );
}