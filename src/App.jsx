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
