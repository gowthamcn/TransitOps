const DashboardFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">

      <h2 className="text-white text-xl font-semibold mb-5">
        Dashboard Filters
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <select
          name="vehicleType"
          value={filters.vehicleType}
          onChange={handleChange}
          className="bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700"
        >
          <option value="">Vehicle Type</option>
          <option value="Truck">Truck</option>
          <option value="Bus">Bus</option>
          <option value="Van">Van</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700"
        >
          <option value="">Status</option>
          <option value="Available">Available</option>
          <option value="In Transit">In Transit</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <select
          name="region"
          value={filters.region}
          onChange={handleChange}
          className="bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700"
        >
          <option value="">Region</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
        </select>

      </div>

    </div>
  );
};

export default DashboardFilters;