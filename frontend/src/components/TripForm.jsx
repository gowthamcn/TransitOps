import { useState, useEffect } from "react";

const initialFormState = {
  source: "",
  destination: "",
  vehicle: "",
  driver: "",
  cargoWeight: "",
  plannedDistance: "",
};

const TripForm = ({ selectedTrip, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/vehicles")
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5000/api/drivers")
      .then((res) => res.json())
      .then((data) => setDrivers(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedTrip) {
      setFormData({
        source: selectedTrip.source || "",
        destination: selectedTrip.destination || "",
        vehicle: selectedTrip.vehicle?._id || selectedTrip.vehicle || "",
        driver: selectedTrip.driver?._id || selectedTrip.driver || "",
        cargoWeight: selectedTrip.cargoWeight || "",
        plannedDistance: selectedTrip.plannedDistance || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [selectedTrip]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.source) newErrors.source = "Source is required";
    if (!formData.destination)
      newErrors.destination = "Destination is required";
    if (!formData.vehicle) newErrors.vehicle = "Vehicle is required";
    if (!formData.driver) newErrors.driver = "Driver is required";

    if (Number(formData.cargoWeight) <= 0) {
      newErrors.cargoWeight = "Cargo Weight must be greater than 0";
    }

    if (Number(formData.plannedDistance) <= 0) {
      newErrors.plannedDistance = "Distance must be greater than 0";
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
        cargoWeight: Number(formData.cargoWeight),
        plannedDistance: Number(formData.plannedDistance),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <h2>{selectedTrip ? "Edit Trip" : "New Trip"}</h2>

      <input
        type="text"
        name="source"
        placeholder="Source"
        value={formData.source}
        onChange={handleChange}
      />
      {errors.source && <p>{errors.source}</p>}

      <input
        type="text"
        name="destination"
        placeholder="Destination"
        value={formData.destination}
        onChange={handleChange}
      />
      {errors.destination && <p>{errors.destination}</p>}

      {/* Vehicle Dropdown */}
      <select
        name="vehicle"
        value={formData.vehicle}
        onChange={handleChange}
      >
        <option value="">Select Vehicle</option>

        {vehicles.map((vehicle) => (
          <option key={vehicle._id} value={vehicle._id}>
            {vehicle.registrationNumber}
          </option>
        ))}
      </select>
      {errors.vehicle && <p>{errors.vehicle}</p>}

      {/* Driver Dropdown */}
      <select
        name="driver"
        value={formData.driver}
        onChange={handleChange}
      >
        <option value="">Select Driver</option>

        {drivers.map((driver) => (
          <option key={driver._id} value={driver._id}>
            {driver.name}
          </option>
        ))}
      </select>
      {errors.driver && <p>{errors.driver}</p>}

      <input
        type="number"
        name="cargoWeight"
        placeholder="Cargo Weight"
        value={formData.cargoWeight}
        onChange={handleChange}
      />
      {errors.cargoWeight && <p>{errors.cargoWeight}</p>}

      <input
        type="number"
        name="plannedDistance"
        placeholder="Planned Distance"
        value={formData.plannedDistance}
        onChange={handleChange}
      />
      {errors.plannedDistance && <p>{errors.plannedDistance}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Saving..."
          : selectedTrip
          ? "Update Trip"
          : "Create Trip"}
      </button>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default TripForm;