import { useState, useEffect } from 'react';

const initialFormState = {
  vehicle: '',
  issue: '',
  description: '',
  startDate: '',
};

/**
 * Converts an ISO date string (from the backend) into the
 * yyyy-MM-dd format required by <input type="date">.
 */
const toDateInputValue = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toISOString().split('T')[0];
};

const MaintenanceForm = ({ selectedMaintenance, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(selectedMaintenance);

  /**
   * Pre-fills the form when editing, or resets it when switching
   * back to create mode.
   */
  useEffect(() => {
    if (selectedMaintenance) {
      setFormData({
        vehicle: selectedMaintenance.vehicle?._id || selectedMaintenance.vehicle || '',
        issue: selectedMaintenance.issue || '',
        description: selectedMaintenance.description || '',
        startDate: toDateInputValue(selectedMaintenance.startDate),
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [selectedMaintenance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validates all required fields: vehicle, issue, description, startDate.
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.vehicle.trim()) {
      newErrors.vehicle = 'Vehicle is required';
    }
    if (!formData.issue.trim()) {
      newErrors.issue = 'Issue is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        // startDate arrives as a yyyy-MM-dd string from the date input;
        // convert to a real Date so it matches the backend's expected type
        startDate: new Date(formData.startDate),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="maintenance-form" onSubmit={handleSubmit} noValidate>
      <h2>{isEditMode ? 'Edit Maintenance Record' : 'New Maintenance Record'}</h2>

      <div className="form-field">
        <label htmlFor="vehicle">Vehicle ID</label>
        <input
          id="vehicle"
          name="vehicle"
          type="text"
          value={formData.vehicle}
          onChange={handleChange}
          disabled={isSubmitting || isEditMode}
          placeholder="Vehicle ObjectId"
        />
        {errors.vehicle && <span className="field-error">{errors.vehicle}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="issue">Issue</label>
        <input
          id="issue"
          name="issue"
          type="text"
          value={formData.issue}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.issue && <span className="field-error">{errors.issue}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
          rows={4}
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="startDate">Start Date</label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.startDate && <span className="field-error">{errors.startDate}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Record' : 'Create Record'}
        </button>
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MaintenanceForm;