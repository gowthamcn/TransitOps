import { useState, useEffect } from 'react';
import { getReports, exportCSV } from '../services/api';

const styles = {
  page: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1f2937',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  filtersBar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '20px',
    padding: '16px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#374151',
    outline: 'none',
    minWidth: '160px',
    background: '#fff',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#374151',
    outline: 'none',
    background: '#fff',
    cursor: 'pointer',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  btn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  exportBtn: {
    background: '#6366f1',
    color: '#fff',
  },
  resetBtn: {
    background: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
  },
  tableCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontWeight: '600',
    color: '#6b7280',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #f3f4f6',
    color: '#374151',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    fontSize: '16px',
    color: '#6b7280',
  },
  spinner: {
    width: '28px',
    height: '28px',
    border: '3px solid #e5e7eb',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: '12px',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    color: '#991b1b',
    marginBottom: '24px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#9ca3af',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  summaryRow: {
    display: 'flex',
    gap: '24px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  summaryCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px 24px',
    minWidth: '160px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  summaryValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '2px',
  },
  efficiencyBadge: (value) => {
    const color = value > 10 ? '#166534' : value > 5 ? '#854d0e' : '#991b1b';
    const bg = value > 10 ? '#dcfce7' : value > 5 ? '#fef9c3' : '#fee2e2';
    return {
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: '600',
      background: bg,
      color: color,
    };
  },
};

function Spinner() {
  return (
    <div style={styles.loading}>
      <div style={styles.spinner} />
      Loading reports...
    </div>
  );
}

function EmptyState() {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>&#x1F4CB;</div>
      <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>No reports found</p>
      <p style={{ fontSize: '14px' }}>Add fuel logs and vehicle data to generate reports.</p>
    </div>
  );
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [vehicles, setVehicles] = useState([]);

  const fetchReportsWith = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReports(params);
      if (res.success) {
        setReports(res.data);

        const uniqueVehicles = [];
        const seen = new Set();
        for (const r of res.data) {
          if (!seen.has(r.vehicle.id)) {
            seen.add(r.vehicle.id);
            uniqueVehicles.push(r.vehicle);
          }
        }
        setVehicles(uniqueVehicles);
      } else {
        setError(res.message || 'Failed to load reports');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getReports({});
        if (cancelled) return;
        if (res.success) {
          setReports(res.data);
          const uniqueVehicles = [];
          const seen = new Set();
          for (const r of res.data) {
            if (!seen.has(r.vehicle.id)) {
              seen.add(r.vehicle.id);
              uniqueVehicles.push(r.vehicle);
            }
          }
          setVehicles(uniqueVehicles);
        } else {
          setError(res.message || 'Failed to load reports');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Network error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (vehicle) params.vehicle = vehicle;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    fetchReportsWith(params);
  };

  const handleReset = () => {
    setSearch('');
    setVehicle('');
    setStartDate('');
    setEndDate('');
    fetchReportsWith({});
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (vehicle) params.vehicle = vehicle;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await exportCSV(params);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vehicle-reports.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const totalFuelUsed = reports.reduce((sum, r) => sum + r.fuelUsed, 0);
  const totalFuelCost = reports.reduce((sum, r) => sum + r.fuelCost, 0);
  const totalMaintCost = reports.reduce((sum, r) => sum + r.maintenanceCost, 0);
  const totalOperCost = reports.reduce((sum, r) => sum + r.operationalCost, 0);
  const avgEfficiency = reports.length > 0
    ? reports.reduce((sum, r) => sum + r.fuelEfficiency, 0) / reports.length
    : 0;

  const columns = [
    {
      key: 'registrationNumber',
      label: 'Vehicle',
      render: (r) => (
        <div>
          <div style={{ fontWeight: '600', color: '#111827' }}>{r.vehicle.registrationNumber}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{r.vehicle.name}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (r) => r.vehicle.type,
    },
    {
      key: 'fuelUsed',
      label: 'Fuel Used (L)',
      render: (r) => r.fuelUsed.toLocaleString(),
    },
    {
      key: 'fuelCost',
      label: 'Fuel Cost',
      render: (r) => `$${r.fuelCost.toLocaleString()}`,
    },
    {
      key: 'maintenanceCost',
      label: 'Maintenance',
      render: (r) => `$${r.maintenanceCost.toLocaleString()}`,
    },
    {
      key: 'operationalCost',
      label: 'Operational Cost',
      render: (r) => `$${r.operationalCost.toLocaleString()}`,
    },
    {
      key: 'fuelEfficiency',
      label: 'Efficiency (km/L)',
      render: (r) => <span style={styles.efficiencyBadge(r.fuelEfficiency)}>{r.fuelEfficiency}</span>,
    },
    {
      key: 'roi',
      label: 'ROI (%)',
      render: (r) => `${r.roi}%`,
    },
  ];

  return (
    <div style={styles.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Vehicle Reports</h1>
          <p style={styles.subtitle}>Analyze fuel efficiency, costs, and ROI per vehicle</p>
        </div>
        <button
          style={{ ...styles.btn, ...styles.exportBtn }}
          onClick={handleExport}
          disabled={loading || reports.length === 0}
        >
          &#x1F4E5; Export CSV
        </button>
      </div>

      <form onSubmit={handleSearch} style={styles.filtersBar}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Search</label>
          <input
            type="text"
            placeholder="Registration or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Vehicle</label>
          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            style={styles.select}
          >
            <option value="">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNumber} - {v.name}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
          <button type="submit" style={{ ...styles.btn, ...styles.exportBtn }}>
            &#x1F50D; Search
          </button>
          <button
            type="button"
            style={{ ...styles.btn, ...styles.resetBtn }}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>

      {!loading && reports.length > 0 && (
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryValue}>{reports.length}</div>
            <div style={styles.summaryLabel}>Vehicles</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryValue}>{totalFuelUsed.toLocaleString()} L</div>
            <div style={styles.summaryLabel}>Total Fuel</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryValue}>${totalFuelCost.toLocaleString()}</div>
            <div style={styles.summaryLabel}>Total Fuel Cost</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryValue}>${totalMaintCost.toLocaleString()}</div>
            <div style={styles.summaryLabel}>Total Maintenance</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryValue}>${totalOperCost.toLocaleString()}</div>
            <div style={styles.summaryLabel}>Total Operational</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryValue}>{avgEfficiency.toFixed(1)} km/L</div>
            <div style={styles.summaryLabel}>Avg Efficiency</div>
          </div>
        </div>
      )}

      {loading && <Spinner />}
      {!loading && error && (
        <div style={styles.errorBox}>
          <p style={{ margin: 0, fontWeight: '600' }}>Error loading reports</p>
          <p style={{ margin: '8px 0 0', fontSize: '14px' }}>{error}</p>
        </div>
      )}
      {!loading && !error && reports.length === 0 && <EmptyState />}

      {!loading && !error && reports.length > 0 && (
        <div style={styles.tableCard}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {columns.map((col, i) => (
                    <th key={i} style={styles.th}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((row, i) => (
                  <tr key={row.vehicle.id || i}>
                    {columns.map((col, j) => (
                      <td key={j} style={styles.td}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
