import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import MaintenanceForm from '../components/MaintenanceForm';
import MaintenanceTable from '../components/MaintenanceTable';

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  /**
   * Fetches all maintenance records from the backend.
   * Wrapped in useCallback for a stable reference in useEffect's
   * dependency array and safe reuse after create/update/delete/close.
   */
  const loadMaintenance = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/maintenance');
      setRecords(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMaintenance();
  }, [loadMaintenance]);

  const openCreateForm = () => {
    setSelectedMaintenance(null);
    setActionError('');
    setIsFormOpen(true);
  };

  /**
   * Opens the form in "edit" mode. MaintenanceTable is responsible
   * for only showing Edit when the record is Open; this handler
   * just opens the form.
   */
  const handleEdit = (record) => {
    setSelectedMaintenance(record);
    setActionError('');
    setIsFormOpen(true);
  };

  /**
   * Handles both create and update, called by MaintenanceForm's onSubmit.
   * Decides POST vs PUT based on whether a record is currently selected.
   */
  const handleCreate = async (formData) => {
    setActionError('');
    try {
      if (selectedMaintenance) {
        await api.put(`/maintenance/${selectedMaintenance._id}`, formData);
      } else {
        await api.post('/maintenance', formData);
      }
      setIsFormOpen(false);
      setSelectedMaintenance(null);
      await loadMaintenance();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (recordId) => {
    const confirmed = window.confirm('Are you sure you want to delete this maintenance record?');
    if (!confirmed) return;

    setActionError('');
    try {
      await api.delete(`/maintenance/${recordId}`);
      await loadMaintenance();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleClose = async (recordId) => {
    const confirmed = window.confirm(
      'Close this maintenance record? The vehicle will become Available unless it is Retired.'
    );
    if (!confirmed) return;

    setActionError('');
    try {
      await api.patch(`/maintenance/${recordId}/close`);
      await loadMaintenance();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedMaintenance(null);
    setActionError('');
  };

  return (
    <div className="maintenance-page">
      <div className="maintenance-page-header">
        <h1>Maintenance Management</h1>
        <button onClick={openCreateForm} disabled={isFormOpen}>
          + New Maintenance Record
        </button>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          {error}
          <button onClick={loadMaintenance}>Retry</button>
        </div>
      )}

      {actionError && (
        <div className="error-banner" role="alert">
          {actionError}
        </div>
      )}

      {isFormOpen && (
        <MaintenanceForm
          selectedMaintenance={selectedMaintenance}
          onSubmit={handleCreate}
          onCancel={closeForm}
        />
      )}

      {loading ? (
        <div className="loading-indicator">Loading maintenance records...</div>
      ) : (
        <MaintenanceTable
          records={records}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default Maintenance;