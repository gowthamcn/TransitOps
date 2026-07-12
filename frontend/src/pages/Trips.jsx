import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import TripForm from '../components/TripForm';
import TripTable from '../components/TripTable';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  /**
   * Fetches all trips from the backend.
   * Wrapped in useCallback so it has a stable reference for useEffect's
   * dependency array and can safely be reused after create/update/delete.
   */
  const loadTrips = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/trips');
      setTrips(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  /**
   * Opens the form in "create" mode.
   */
  const openCreateForm = () => {
    setSelectedTrip(null);
    setActionError('');
    setIsFormOpen(true);
  };

  /**
   * Opens the form in "edit" mode, pre-filled with the selected trip.
   * Only meaningful for Draft trips — TripTable is responsible for
   * only showing the Edit button when appropriate, this handler just
   * opens the form.
   */
  const handleEdit = (trip) => {
    setSelectedTrip(trip);
    setActionError('');
    setIsFormOpen(true);
  };

  /**
   * Handles both create and update, called by TripForm's onSubmit.
   * Decides POST vs PUT based on whether a trip is currently selected.
   */
  const handleCreate = async (formData) => {
    setActionError('');
    try {
      if (selectedTrip) {
        await api.put(`/trips/${selectedTrip._id}`, formData);
      } else {
        await api.post('/trips', formData);
      }
      setIsFormOpen(false);
      setSelectedTrip(null);
      await loadTrips();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (tripId) => {
    const confirmed = window.confirm('Are you sure you want to delete this trip?');
    if (!confirmed) return;

    setActionError('');
    try {
      await api.delete(`/trips/${tripId}`);
      await loadTrips();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDispatch = async (tripId) => {
    const confirmed = window.confirm('Dispatch this trip? This will mark the vehicle and driver as On Trip.');
    if (!confirmed) return;

    setActionError('');
    try {
      await api.patch(`/trips/${tripId}/dispatch`);
      await loadTrips();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleComplete = async (tripId) => {
    const confirmed = window.confirm('Mark this trip as completed?');
    if (!confirmed) return;

    setActionError('');
    try {
      await api.patch(`/trips/${tripId}/complete`);
      await loadTrips();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleCancel = async (tripId) => {
    const confirmed = window.confirm('Cancel this trip?');
    if (!confirmed) return;

    setActionError('');
    try {
      await api.patch(`/trips/${tripId}/cancel`);
      await loadTrips();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedTrip(null);
    setActionError('');
  };

  return (
    <div className="trips-page">
      <div className="trips-page-header">
        <h1>Trip Management</h1>
        <button onClick={openCreateForm} disabled={isFormOpen}>
          + New Trip
        </button>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          {error}
          <button onClick={loadTrips}>Retry</button>
        </div>
      )}

      {actionError && (
        <div className="error-banner" role="alert">
          {actionError}
        </div>
      )}

      {isFormOpen && (
        <TripForm
          selectedTrip={selectedTrip}
          onSubmit={handleCreate}
          onCancel={closeForm}
        />
      )}

      {loading ? (
        <div className="loading-indicator">Loading trips...</div>
      ) : (
        <TripTable
          trips={trips}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDispatch={handleDispatch}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Trips;