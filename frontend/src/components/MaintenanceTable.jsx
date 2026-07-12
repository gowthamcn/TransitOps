const STATUS_ACTIONS = {
  Open: ['edit', 'delete', 'close'],
  Closed: [],
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Resolves a display label for the vehicle field, which may arrive
 * either populated (an object from Mongoose .populate()) or as a
 * raw ObjectId string, depending on which endpoint supplied the data.
 */
const resolveVehicleLabel = (value) => {
  if (!value) return '—';
  if (typeof value === 'object') {
    return value.registrationNumber || value._id || '—';
  }
  return value;
};

const MaintenanceTable = ({ records, onEdit, onDelete, onClose }) => {
  if (!records || records.length === 0) {
    return (
      <div className="maintenance-table-empty">
        <p>No maintenance records found. Create one to get started.</p>
      </div>
    );
  }

  const renderActions = (record) => {
    const actions = STATUS_ACTIONS[record.status] || [];

    if (actions.length === 0) {
      return (
        <span className={`status-label status-${record.status.toLowerCase()}`}>
          {record.status}
        </span>
      );
    }

    return (
      <div className="maintenance-actions">
        {actions.includes('edit') && (
          <button onClick={() => onEdit(record)} className="action-btn">
            Edit
          </button>
        )}
        {actions.includes('delete') && (
          <button onClick={() => onDelete(record._id)} className="action-btn action-btn-danger">
            Delete
          </button>
        )}
        {actions.includes('close') && (
          <button onClick={() => onClose(record._id)} className="action-btn action-btn-primary">
            Close
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="maintenance-table-wrapper">
      <table className="maintenance-table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Issue</th>
            <th>Description</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td data-label="Vehicle">{resolveVehicleLabel(record.vehicle)}</td>
              <td data-label="Issue">{record.issue}</td>
              <td data-label="Description">{record.description}</td>
              <td data-label="Status">
                <span className={`status-badge status-${record.status.toLowerCase()}`}>
                  {record.status}
                </span>
              </td>
              <td data-label="Start Date">{formatDate(record.startDate)}</td>
              <td data-label="End Date">{formatDate(record.endDate)}</td>
              <td data-label="Actions">{renderActions(record)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceTable;