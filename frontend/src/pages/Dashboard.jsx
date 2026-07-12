import { useState, useEffect, useMemo } from 'react';
import { getDashboard } from '../services/api';

const styles = {
  page: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1f2937',
  },
  header: {
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
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  kpiCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  kpiIcon: (bg) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    flexShrink: 0,
  }),
  kpiValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    lineHeight: 1.2,
  },
  kpiLabel: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '2px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
  },
  chartRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  chartCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  barChart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    height: '160px',
    paddingTop: '10px',
  },
  barWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: (height, color) => ({
    width: '100%',
    maxWidth: '48px',
    height: `${Math.max(height, 4)}%`,
    background: color,
    borderRadius: '6px 6px 0 0',
    transition: 'height 0.4s ease',
  }),
  barLabel: {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '6px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  barValue: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
  },
  donutContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    justifyContent: 'center',
    padding: '10px 0',
  },
  donutLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#374151',
  },
  legendDot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  tableCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    marginBottom: '24px',
  },
  tableHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
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
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #f3f4f6',
    color: '#374151',
  },
  statusBadge: (status) => {
    const colors = {
      Active: { bg: '#dcfce7', text: '#166534' },
      Pending: { bg: '#fef9c3', text: '#854d0e' },
      Completed: { bg: '#dbeafe', text: '#1e40af' },
      Cancelled: { bg: '#fee2e2', text: '#991b1b' },
    };
    const c = colors[status] || { bg: '#f3f4f6', text: '#374151' };
    return {
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: '600',
      background: c.bg,
      color: c.text,
    };
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
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    fontSize: '16px',
    color: '#6b7280',
  },
  spinner: {
    width: '32px',
    height: '32px',
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
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
};

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function Spinner() {
  return (
    <div style={styles.loading}>
      <div style={styles.spinner} />
      Loading dashboard...
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div style={styles.errorBox}>
      <p style={{ margin: '0 0 12px', fontWeight: '600' }}>Failed to load dashboard</p>
      <p style={{ margin: '0 0 16px', fontSize: '14px' }}>{message}</p>
      <button
        onClick={onRetry}
        style={{
          padding: '8px 20px',
          borderRadius: '8px',
          border: '1px solid #fecaca',
          background: '#fff',
          color: '#991b1b',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
        }}
      >
        Retry
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>&#x1F6AB;</div>
      <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>No data available</p>
      <p style={{ fontSize: '14px' }}>Add vehicles, trips, and fuel logs to see dashboard stats.</p>
    </div>
  );
}

function KPICard({ icon, value, label, color }) {
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiIcon(color)}>{icon}</div>
      <div>
        <div style={styles.kpiValue}>{value}</div>
        <div style={styles.kpiLabel}>{label}</div>
      </div>
    </div>
  );
}

function BarChart({ data, labelKey, valueKey, color, maxValue }) {
  const max = maxValue || Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div style={styles.barChart}>
      {data.map((item, i) => (
        <div key={i} style={styles.barWrapper}>
          <div style={styles.barValue}>
            {typeof item[valueKey] === 'number' ? item[valueKey].toLocaleString() : item[valueKey]}
          </div>
          <div style={styles.bar((item[valueKey] / max) * 100, color || COLORS[i % COLORS.length])} />
          <div style={styles.barLabel}>{item[labelKey]}</div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  const segments = useMemo(() => {
    const result = [];
    let cum = 0;
    for (let i = 0; i < data.length; i++) {
      const pct = (data[i].count / total) * 100;
      result.push({ ...data[i], start: cum, pct, color: COLORS[i % COLORS.length] });
      cum += pct;
    }
    return result;
  }, [data, total]);

  const gradientStops = segments
    .map((s) => `${s.color} ${s.start}% ${s.start + s.pct}%`)
    .join(', ');

  return (
    <div style={styles.donutContainer}>
      <div
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: `conic-gradient(${gradientStops})`,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: '700',
            color: '#111827',
          }}
        >
          {total}
        </div>
      </div>
      <div style={styles.donutLegend}>
        {segments.map((s, i) => (
          <div key={i} style={styles.legendItem}>
            <div style={styles.legendDot(s.color)} />
            <span>
              {s.status}: {s.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Table({ title, columns, rows, emptyMessage }) {
  return (
    <div style={styles.tableCard}>
      <div style={styles.tableHeader}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>{title}</h3>
      </div>
      {rows.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
          {emptyMessage}
        </div>
      ) : (
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
              {rows.map((row, i) => (
                <tr key={row.id || i}>
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
      )}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboard();
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message || 'Failed to load data');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getDashboard();
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || 'Failed to load data');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div style={styles.page}><Spinner /></div>;
  if (error) return <div style={styles.page}><ErrorState message={error} onRetry={fetchData} /></div>;
  if (!data) return <div style={styles.page}><EmptyState /></div>;

  const hasData =
    data.kpi.activeVehicles > 0 ||
    data.kpi.availableVehicles > 0 ||
    data.kpi.activeTrips > 0 ||
    data.recentFuelLogs.length > 0;

  if (!hasData) return <div style={styles.page}><EmptyState /></div>;

  const tripColumns = [
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <span style={styles.statusBadge(row.status)}>{row.status}</span>,
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => new Date(row.date).toLocaleDateString(),
    },
  ];

  const fuelColumns = [
    { key: 'vehicle', label: 'Vehicle' },
    {
      key: 'fuelLiters',
      label: 'Fuel (L)',
      render: (row) => row.fuelLiters.toLocaleString(),
    },
    {
      key: 'fuelCost',
      label: 'Cost',
      render: (row) => `$${row.fuelCost.toLocaleString()}`,
    },
    {
      key: 'distance',
      label: 'Distance (km)',
      render: (row) => row.distance.toLocaleString(),
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => new Date(row.date).toLocaleDateString(),
    },
  ];

  return (
    <div style={styles.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.header}>
        <h1 style={styles.title}>TransitOps Dashboard</h1>
        <p style={styles.subtitle}>Fleet overview and key performance metrics</p>
      </div>

      <div style={styles.kpiGrid}>
        <KPICard icon="&#x1F69B;" value={data.kpi.activeVehicles} label="Active Vehicles" color="#dbeafe" />
        <KPICard icon="&#x2705;" value={data.kpi.availableVehicles} label="Available Vehicles" color="#dcfce7" />
        <KPICard icon="&#x1F527;" value={data.kpi.vehiclesInMaintenance} label="In Maintenance" color="#fef3c7" />
        <KPICard icon="&#x1F68C;" value={data.kpi.activeTrips} label="Active Trips" color="#ede9fe" />
        <KPICard icon="&#x23F3;" value={data.kpi.pendingTrips} label="Pending Trips" color="#fff7ed" />
        <KPICard icon="&#x1F464;" value={data.kpi.driversOnDuty} label="Drivers On Duty" color="#fce7f3" />
        <KPICard icon="&#x1F4CA;" value={`${data.kpi.fleetUtilization}%`} label="Fleet Utilization" color="#e0e7ff" />
      </div>

      <div style={styles.chartRow}>
        <div style={styles.chartCard}>
          <h3 style={styles.sectionTitle}>Vehicle Status</h3>
          {data.vehicleStatusChart.length > 0 ? (
            <DonutChart data={data.vehicleStatusChart} />
          ) : (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No vehicle data</p>
          )}
        </div>
        <div style={styles.chartCard}>
          <h3 style={styles.sectionTitle}>Monthly Fuel Cost</h3>
          {data.monthlyFuelCost.length > 0 ? (
            <BarChart data={data.monthlyFuelCost} labelKey="month" valueKey="cost" color="#6366f1" />
          ) : (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No fuel cost data</p>
          )}
        </div>
      </div>

      <div style={styles.chartRow}>
        <div style={styles.chartCard}>
          <h3 style={styles.sectionTitle}>Monthly Total Expenses</h3>
          {data.monthlyExpense.length > 0 ? (
            <BarChart data={data.monthlyExpense} labelKey="month" valueKey="cost" color="#f59e0b" />
          ) : (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No expense data</p>
          )}
        </div>
      </div>

      <div style={styles.grid2}>
        <Table
          title="Recent Trips"
          columns={tripColumns}
          rows={data.recentTrips}
          emptyMessage="No recent trips found"
        />
        <Table
          title="Recent Fuel Logs"
          columns={fuelColumns}
          rows={data.recentFuelLogs}
          emptyMessage="No fuel logs found"
        />
      </div>
    </div>
  );
}
