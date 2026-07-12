const DashboardFilters = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">

      <h2 className="text-white text-xl font-semibold mb-5">
        Dashboard Filters
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <select className="bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700">

          <option>Vehicle Type</option>
          <option>Truck</option>
          <option>Bus</option>
          <option>Van</option>

        </select>

        <select className="bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700">

          <option>Status</option>
          <option>Available</option>
          <option>In Transit</option>
          <option>Maintenance</option>

        </select>

        <select className="bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700">

          <option>Region</option>
          <option>North</option>
          <option>South</option>
          <option>East</option>
          <option>West</option>

        </select>

      </div>

    </div>
  );
};

export default DashboardFilters;