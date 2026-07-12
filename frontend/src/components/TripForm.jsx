import { useState, useEffect } from 'react';

const initialFormState = {
  source: '',
  destination: '',
  vehicle: '',
  driver: '',
  cargoWeight: '',
  plannedDistance: '',
};

const TripForm = ({ selectedTrip, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(selectedTrip);

  /**
   * Pre-fills the form when editing, or resets it when switching
   * back to create mode. Runs whenever the parent changes which
   * trip is selected (e.g. clicking Edit on a different row).
   */
  useEffect(() => {
    if (selectedTrip) {
      setFormData({
        source: selectedTrip.source || '',
        destination: selectedTrip.destination || '',
        // vehicle/driver may arrive populated (objects) or as raw IDs,
        // depending on which endpoint supplied selectedTrip
        vehicle: selectedTrip.vehicle?._id || selectedTrip.vehicle || '',
        driver: selectedTrip.driver?._id || selectedTrip.driver || '',
        cargoWeight: selectedTrip.cargoWeight ?? '',
        plannedDistance: selectedTrip.plannedDistance ?? '',
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [selectedTrip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the field's error as soon as the user starts fixing it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validates all required fields plus the two numeric business rules
   * requested: cargoWeight > 0 and plannedDistance > 0.
   * Returns true if valid, and populates `errors` otherwise.
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.source.trim()) {
      newErrors.source = 'Source is required';
    }
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    if (!formData.vehicle.trim()) {
      newErrors.vehicle = 'Vehicle is required';
    }
    if (!formData.driver.trim()) {
      newErrors.driver = 'Driver is required';
    }

    if (formData.cargoWeight === '' || formData.cargoWeight === null) {
      newErrors.cargoWeight = 'Cargo weight is required';
    } else if (Number(formData.cargoWeight) <= 0) {
      newErrors.cargoWeight = 'Cargo weight must be greater than 0';
    }

    if (formData.plannedDistance === '' || formData.plannedDistance === null) {
      newErrors.plannedDistance = 'Planned distance is required';
    } else if (Number(formData.plannedDistance) <= 0) {
      newErrors.plannedDistance = 'Planned distance must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Normalize numeric fields before handing off to the parent —
      // this component's job is to produce clean data, not to call the API.
      await onSubmit({
        ...formData,
        cargoWeight: Number(formData.cargoWeight),
        plannedDistance: Number(formData.plannedDistance),
      });
    } finally {
      // Parent decides whether to close the form on success; this just
      // ensures the button re-enables if onSubmit throws/rejects.
      setIsSubmitting(false);
    }
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit} noValidate>
      <h2>{isEditMode ? 'Edit Trip' : 'New Trip'}</h2>

      <div className="form-field">
        <label htmlFor="source">Source</label>
        <input
          id="source"
          name="source"
          type="text"
          value={formData.source}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.source && <span className="field-error">{errors.source}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          name="destination"
          type="text"
          value={formData.destination}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.destination && <span className="field-error">{errors.destination}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="vehicle">Vehicle ID</label>
        <input
          id="vehicle"
          name="vehicle"
          type="text"
          value={formData.vehicle}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Vehicle ObjectId"
        />
        {errors.vehicle && <span className="field-error">{errors.vehicle}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="driver">Driver ID</label>
        <input
          id="driver"
          name="driver"
          type="text"
          value={formData.driver}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Driver ObjectId"
        />
        {errors.driver && <span className="field-error">{errors.driver}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="cargoWeight">Cargo Weight (kg)</label>
        <input
          id="cargoWeight"
          name="cargoWeight"
          type="number"
          step="any"
          value={formData.cargoWeight}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.cargoWeight && <span className="field-error">{errors.cargoWeight}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="plannedDistance">Planned Distance (km)</label>
        <input
          id="plannedDistance"
          name="plannedDistance"
          type="number"
          step="any"
          value={formData.plannedDistance}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.plannedDistance && <span className="field-error">{errors.plannedDistance}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Trip' : 'Create Trip'}
        </button>
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TripForm;