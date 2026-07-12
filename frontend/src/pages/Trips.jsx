import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import TripForm from '../components/TripForm';
import TripTable from '../components/TripTable';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadTrips = useCallback(async () => {
    try {
      const response = await api.get('/trips');
      setTrips(response.data.data || response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadVehiclesAndDrivers = async () => {
    try {
      const vehicleRes = await api.get('/vehicles');
      const driverRes = await api.get('/drivers');

      setVehicles(vehicleRes.data.data || vehicleRes.data);
      setDrivers(driverRes.data.data || driverRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTrips();
    loadVehiclesAndDrivers();
  }, [loadTrips]);

  const openCreateForm = () => {
    setSelectedTrip(null);
    setActionError('');
    setIsFormOpen(true);
  };

  const handleEdit = (trip) => {
    setSelectedTrip(trip);
    setActionError('');
    setIsFormOpen(true);
  };

  const handleCreate = async (formData) => {
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
    if (!window.confirm('Delete this trip?')) return;

    try {
      await api.delete(`/trips/${tripId}`);
      await loadTrips();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDispatch = async (tripId) => {
    try {
      await api.patch(`/trips/${tripId}/dispatch`);
      await loadTrips();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleComplete = async (tripId) => {
    try {
      await api.patch(`/trips/${tripId}/complete`);
      await loadTrips();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleCancel = async (tripId) => {
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

        <button onClick={openCreateForm}>
          + New Trip
        </button>
      </div>

      {error && <div>{error}</div>}
      {actionError && <div>{actionError}</div>}

      {isFormOpen && (
        <TripForm
          selectedTrip={selectedTrip}
          vehicles={vehicles}
          drivers={drivers}
          onSubmit={handleCreate}
          onCancel={closeForm}
        />
      )}

      {loading ? (
        <p>Loading...</p>
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