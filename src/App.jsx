import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ResearchDashboard from './components/ResearchDashboard';
import BusinessModel from './components/BusinessModel';
import { ModelProvider } from './context/ModelContext';

// Default project data - skip setup form
const defaultProjectData = {
  name: 'ScribeHealth',
  members: [{ name: 'Team', regNo: '' }],
  displayMetric: 'Lakhs (L)'
};

function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <Link to="/" style={{textDecoration: 'none'}}>
          <div className="header-logo">
            <div style={{fontWeight: 'bold', fontSize: '18px', color: 'var(--primary)'}}>
              INTERNATIONAL INSTITUTE OF INFORMATION TECHNOLOGY
              <br />
              <span style={{fontSize: '12px', fontWeight: '500', color: '#666'}}>H Y D E R A B A D</span>
            </div>
          </div>
        </Link>
        <nav className="header-nav">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/business-model">Business Model</Link>
        </nav>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<ResearchDashboard />} />
          <Route path="/business-model" element={
            <ModelProvider projectData={defaultProjectData}>
              <BusinessModel projectData={defaultProjectData} />
            </ModelProvider>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
