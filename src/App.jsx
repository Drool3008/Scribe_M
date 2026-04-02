import { useState } from 'react';
import SetupForm from './components/SetupForm';
import Dashboard from './components/Dashboard';
import { ModelProvider } from './context/ModelContext';

function App() {
  const [isPlanning, setIsPlanning] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    members: [{ name: '', regNo: '' }],
    displayMetric: 'Lakhs (L)'
  });

  const handleStartPlanning = (data) => {
    setProjectData(data);
    setIsPlanning(true);
  };

  return (
    <>
      <header className="app-header">
        <div className="header-logo">
          <div style={{fontWeight: 'bold', fontSize: '18px', color: 'var(--primary)'}}>
            INTERNATIONAL INSTITUTE OF INFORMATION TECHNOLOGY
            <br />
            <span style={{fontSize: '12px', fontWeight: '500', color: '#666'}}>H Y D E R A B A D</span>
          </div>
        </div>
        <nav className="header-nav">
          <a href="#">Home</a>
          <a href="#">Dashboard</a>
          <a href="#">My courses</a>
        </nav>
      </header>
      
      <main>
        {!isPlanning ? (
          <SetupForm initialData={projectData} onStart={handleStartPlanning} />
        ) : (
          <ModelProvider projectData={projectData}>
            <Dashboard projectData={projectData} />
          </ModelProvider>
        )}
      </main>
    </>
  );
}

export default App;
