import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem'
    }}>
      <div style={{maxWidth: '900px', width: '100%', textAlign: 'center', marginBottom: '3rem'}}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          color: '#1e293b',
          marginBottom: '0.75rem',
          letterSpacing: '-0.025em'
        }}>
          ScribeHealth Central Portal
        </h1>
        <p style={{fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto'}}>
          Welcome to the unified analytics platform. Please select the tool you wish to access below.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '900px'
      }}>
        {/* Business Model Calculator Card */}
        <Link to="/business-model" style={{textDecoration: 'none'}}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(59,130,246,0.15)';
            e.currentTarget.style.borderColor = '#93c5fd';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}>
            <div style={{
              background: '#eff6ff',
              width: '64px',
              height: '64px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '1.5rem'
            }}>
              📈
            </div>
            <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem'}}>
              Business Unit Economics
            </h2>
            <p style={{color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.6'}}>
              Calculate P&L, Cash Flow, and scenario-based margin projections across all ScribeHealth Business Units.
            </p>
            <div style={{display: 'flex', alignItems: 'center', color: '#3b82f6', fontWeight: '600'}}>
              Open Calculator <span style={{marginLeft: '0.5rem'}}>→</span>
            </div>
          </div>
        </Link>

        {/* Dashboard Card */}
        <Link to="/dashboard" style={{textDecoration: 'none'}}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(99,102,241,0.15)';
            e.currentTarget.style.borderColor = '#a5b4fc';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}>
            <div style={{
              background: '#eef2ff',
              width: '64px',
              height: '64px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '1.5rem'
            }}>
              📊
            </div>
            <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem'}}>
              ScribeHealth Dashboard
            </h2>
            <p style={{color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.6'}}>
              View primary research insights, demographic surveys, and core clinical analytics.
            </p>
            <div style={{display: 'flex', alignItems: 'center', color: '#6366f1', fontWeight: '600'}}>
              Open Dashboard <span style={{marginLeft: '0.5rem'}}>→</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
