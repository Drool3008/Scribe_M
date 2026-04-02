import { Link } from 'react-router-dom';

const ResearchDashboard = () => {
  // Sample metrics (in production these would come from survey data)
  const metrics = {
    totalDocs: 42,
    avgDailyTime: 47,
    avgPatients: 12,
    afterHoursLoad: 68,
    avgSatisfaction: 3.2,
  };

  const satisfactionDistribution = [
    { label: 'Very Satisfied', value: 8, color: '#22c55e' },
    { label: 'Satisfied', value: 12, color: '#84cc16' },
    { label: 'Neutral', value: 10, color: '#eab308' },
    { label: 'Dissatisfied', value: 8, color: '#f97316' },
    { label: 'Very Dissatisfied', value: 4, color: '#ef4444' },
  ];

  const painPoints = [
    { issue: 'Documentation time burden', count: 38, pct: 90 },
    { issue: 'After-hours charting', count: 32, pct: 76 },
    { issue: 'EHR complexity', count: 28, pct: 67 },
    { issue: 'Multi-language patients', count: 24, pct: 57 },
    { issue: 'Template limitations', count: 18, pct: 43 },
  ];

  return (
    <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <Link to="/" style={{color: '#6366f1', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block'}}>
            ← Back to Portal
          </Link>
          <h1 style={{fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: 0}}>
            📊 ScribeHealth Research Dashboard
          </h1>
          <p style={{color: '#64748b', marginTop: '0.25rem'}}>Primary research insights from {metrics.totalDocs} physician surveys</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
        <div style={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem'}}>
          <div style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem'}}>Total Responses</div>
          <div style={{fontSize: '2rem', fontWeight: '700', color: '#6366f1'}}>{metrics.totalDocs}</div>
          <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>physicians surveyed</div>
        </div>
        <div style={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem'}}>
          <div style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem'}}>Avg. Daily Doc Time</div>
          <div style={{fontSize: '2rem', fontWeight: '700', color: '#f59e0b'}}>{metrics.avgDailyTime} min</div>
          <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>per physician</div>
        </div>
        <div style={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem'}}>
          <div style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem'}}>Avg. Patients/Day</div>
          <div style={{fontSize: '2rem', fontWeight: '700', color: '#0d9488'}}>{metrics.avgPatients}</div>
          <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>patients seen</div>
        </div>
        <div style={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem'}}>
          <div style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem'}}>After-Hours Load</div>
          <div style={{fontSize: '2rem', fontWeight: '700', color: '#dc2626'}}>{metrics.afterHoursLoad}%</div>
          <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>work after clinic</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
        {/* Satisfaction Distribution */}
        <div style={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem'}}>
          <h3 style={{fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem'}}>
            Current Documentation Satisfaction
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            {satisfactionDistribution.map((item, i) => (
              <div key={i}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                  <span style={{fontSize: '0.85rem', color: '#475569'}}>{item.label}</span>
                  <span style={{fontSize: '0.85rem', fontWeight: '600', color: '#1e293b'}}>{item.value}</span>
                </div>
                <div style={{background: '#f1f5f9', borderRadius: '4px', height: '8px', overflow: 'hidden'}}>
                  <div style={{
                    background: item.color,
                    height: '100%',
                    width: `${(item.value / metrics.totalDocs) * 100}%`,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '8px', fontSize: '0.85rem', color: '#92400e'}}>
            ⚠️ Only 48% report being satisfied with current documentation workflow
          </div>
        </div>

        {/* Pain Points */}
        <div style={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem'}}>
          <h3 style={{fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem'}}>
            Top Documentation Pain Points
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            {painPoints.map((item, i) => (
              <div key={i}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                  <span style={{fontSize: '0.85rem', color: '#475569'}}>{item.issue}</span>
                  <span style={{fontSize: '0.85rem', fontWeight: '600', color: '#1e293b'}}>{item.pct}%</span>
                </div>
                <div style={{background: '#f1f5f9', borderRadius: '4px', height: '8px', overflow: 'hidden'}}>
                  <div style={{
                    background: i === 0 ? '#ef4444' : i === 1 ? '#f97316' : '#6366f1',
                    height: '100%',
                    width: `${item.pct}%`,
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px', fontSize: '0.85rem', color: '#991b1b'}}>
            🔥 90% cite documentation time as their #1 frustration
          </div>
        </div>
      </div>

      {/* Research Questions Links */}
      <div style={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem'}}>
        <h3 style={{fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem'}}>
          📋 Research Questions Deep-Dive
        </h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem'}}>
          {[
            { id: 'RQ1', title: 'Current Workflow Analysis', desc: 'How do physicians currently handle documentation?', color: '#3b82f6' },
            { id: 'RQ2', title: 'Pain Point Identification', desc: 'What are the biggest documentation frustrations?', color: '#ef4444' },
            { id: 'RQ3', title: 'AI Readiness Assessment', desc: 'How open are physicians to AI-assisted scribing?', color: '#8b5cf6' },
            { id: 'RQ4', title: 'Feature Prioritization', desc: 'Which capabilities matter most to users?', color: '#10b981' },
            { id: 'RQ5', title: 'Adoption Barriers', desc: 'What prevents uptake of new solutions?', color: '#f59e0b' },
          ].map(rq => (
            <div key={rq.id} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = rq.color; e.currentTarget.style.background = '#fafafa'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                <span style={{
                  background: rq.color,
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px'
                }}>{rq.id}</span>
                <span style={{fontWeight: '600', color: '#1e293b'}}>{rq.title}</span>
              </div>
              <p style={{fontSize: '0.85rem', color: '#64748b', margin: 0}}>{rq.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem'}}>
        Data based on primary research conducted with solo practitioners and small clinic physicians. Full methodology available in research documentation.
      </div>
    </div>
  );
};

export default ResearchDashboard;
