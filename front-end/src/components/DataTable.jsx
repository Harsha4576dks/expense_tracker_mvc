import "./DataTable.css";

export function TableLoader({ columnsCount, rowCount = 5, hasActions = false }) {
  const totalColumns = columnsCount + (hasActions ? 1 : 0);

  return (
    <div className="data-table-shell data-table-loader-shell" aria-live="polite" aria-busy="true">
      <table className="data-table">
        <thead>
          <tr>
            {Array.from({ length: totalColumns }).map((_, index) => (
              <th key={`loader-head-${index}`}>
                <span className="loader-bar loader-bar-short" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <tr key={`loader-row-${rowIndex}`}>
              {Array.from({ length: totalColumns }).map((__, columnIndex) => (
                <td key={`loader-cell-${rowIndex}-${columnIndex}`}>
                  <span className="loader-bar" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DataTable({
  columns,
  data = [],
  loading = false,
  emptyMessage,
  renderActions,
  className = "",
}) {
  const hasActions = Boolean(renderActions);

  if (loading) {
    return <TableLoader columnsCount={columns.length} rowCount={5} hasActions={hasActions} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="data-table-empty">
        <p>{emptyMessage || "No records found."}</p>
      </div>
    );
  }

  return (
    <div className={`data-table-shell ${className}`.trim()}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key ?? column.label} scope="col">
                {column.label}
              </th>
            ))}
            {hasActions && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id ?? `${rowIndex}-${JSON.stringify(row)}`}>
              {columns.map((column) => (
                <td key={`${row.id ?? rowIndex}-${column.key ?? column.label}`}>
                  {column.render ? column.render(row) : row[column.key] ?? "-"}
                </td>
              ))}
              {hasActions && <td>{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
