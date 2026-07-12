const STATUS_ACTIONS = {
  Draft: ['edit', 'delete', 'dispatch'],
  Dispatched: ['complete', 'cancel'],
  Completed: [],
  Cancelled: [],
};

/**
 * Formats an ISO date string into a readable local date + time.
 * Returns a placeholder for null/undefined dates (e.g. completedAt
 * on a trip that hasn't completed yet).
 */
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
 * Resolves a display label for vehicle/driver fields, which may
 * arrive either populated (an object from Mongoose .populate())
 * or as a raw ObjectId string, depending on which endpoint supplied
 * the data.
 */
const resolveLabel = (value, fallbackField) => {
  if (!value) return '—';
  if (typeof value === 'object') {
    return value[fallbackField] || value._id || '—';
  }
  return value;
};

const TripTable = ({ trips, onEdit, onDelete, onDispatch, onComplete, onCancel }) => {
  if (!trips || trips.length === 0) {
    return (
      <div className="trip-table-empty">
        <p>No trips found. Create a new trip to get started.</p>
      </div>
    );
  }

  const renderActions = (trip) => {
    const actions = STATUS_ACTIONS[trip.status] || [];

    if (actions.length === 0) {
      // Completed / Cancelled — no actions, just a status label
      return <span className={`status-label status-${trip.status.toLowerCase()}`}>{trip.status}</span>;
    }

    return (
      <div className="trip-actions">
        {actions.includes('edit') && (
          <button onClick={() => onEdit(trip)} className="action-btn">
            Edit
          </button>
        )}
        {actions.includes('delete') && (
          <button onClick={() => onDelete(trip._id)} className="action-btn action-btn-danger">
            Delete
          </button>
        )}
        {actions.includes('dispatch') && (
          <button onClick={() => onDispatch(trip._id)} className="action-btn action-btn-primary">
            Dispatch
          </button>
        )}
        {actions.includes('complete') && (
          <button onClick={() => onComplete(trip._id)} className="action-btn action-btn-primary">
            Complete
          </button>
        )}
        {actions.includes('cancel') && (
          <button onClick={() => onCancel(trip._id)} className="action-btn action-btn-danger">
            Cancel
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="trip-table-wrapper">
      <table className="trip-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Destination</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Cargo Weight</th>
            <th>Planned Distance</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Completed At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip._id}>
              <td data-label="Source">{trip.source}</td>
              <td data-label="Destination">{trip.destination}</td>
              <td data-label="Vehicle">{resolveLabel(trip.vehicle, 'registrationNumber')}</td>
              <td data-label="Driver">{resolveLabel(trip.driver, 'name')}</td>
              <td data-label="Cargo Weight">{trip.cargoWeight} kg</td>
              <td data-label="Planned Distance">{trip.plannedDistance} km</td>
              <td data-label="Status">
                <span className={`status-badge status-${trip.status.toLowerCase()}`}>
                  {trip.status}
                </span>
              </td>
              <td data-label="Created At">{formatDate(trip.createdAt)}</td>
              <td data-label="Completed At">{formatDate(trip.completedAt)}</td>
              <td data-label="Actions">{renderActions(trip)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TripTable;