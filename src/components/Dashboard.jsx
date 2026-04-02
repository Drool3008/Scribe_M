import { useState, useRef } from 'react';
import ProfitAndLoss from './tabs/ProfitAndLoss';
import BalanceSheet from './tabs/BalanceSheet';
import CashFlow from './tabs/CashFlow';
import BusinessUnit from './tabs/BusinessUnit';
import Overheads from './tabs/Overheads';
import FundingWC from './tabs/FundingWC';
import { useModel } from '../context/ModelContext';

const Dashboard = ({ projectData }) => {
  const [activeTab, setActiveTab] = useState('P&L');
  const fileInputRef = useRef(null);
  
  const { 
    models, activeModelKey, setActiveModelKey, isBaseLocked, 
    addScenario, resetAll, loadJSON 
  } = useModel();

  const tabs = [
    { id: 'P&L', label: '📈 P&L', Component: ProfitAndLoss },
    { id: 'Balance', label: '🏦 Balance Sheet', Component: BalanceSheet },
    { id: 'Cash', label: '💸 Cash Flow', Component: CashFlow },
    { id: 'BU1', label: '🎓 Solo Doctors', Component: () => <BusinessUnit id="bu1" title="Solo Doctors" /> },
    { id: 'BU2', label: '🏫 BU2', Component: () => <BusinessUnit id="bu2" title="BU 2" /> },
    { id: 'BU3', label: '📚 BU3', Component: () => <BusinessUnit id="bu3" title="BU 3" /> },
    { id: 'Overheads', label: '💼 G&A, Investment', Component: Overheads },
    { id: 'Funding', label: '💰 Funding & WC', Component: FundingWC },
    { id: 'Compare', label: '⚖️ Compare', Component: () => <div>Compare scenarios feature coming soon.</div> },
  ];

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ models, activeModelKey }));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "business_model_data.json");
    dlAnchorElem.click();
  };

  const handleImportJSONClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonObj = JSON.parse(event.target.result);
          loadJSON(jsonObj);
          alert('Model imported successfully!');
        } catch (error) {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportExcel = () => {
    // Basic CSV mock for Excel export
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Exported data for " + activeModelKey + " scenario\n";
    // Real implementation would pull calculated rows from Context.
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "financial_model.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.Component;

  return (
    <div className="dashboard-container">
      {/* Top Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{color: '#6366f1', fontSize: '2rem', marginBottom: '0.2rem'}}>{projectData.name || 'My Replicated Startup'}</h2>
          <p>Team: {projectData.members.map(m => `${m.name} (${m.regNo})`).join(', ')}</p>
          <p style={{fontSize: '0.8rem', marginTop: '0.5rem', color: '#94a3b8'}}>
            💾 Auto-saved | ₹ Indian Rupees | Amounts in {projectData.displayMetric} | 🔗 = Linked field | Tab/Enter = Next cell
          </p>
        </div>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <span style={{fontSize: '0.9rem', color: '#64748b'}}>Display:</span>
          <select disabled value={projectData.displayMetric} style={{padding: '0.4rem', width: 'auto'}}>
            <option>{projectData.displayMetric}</option>
          </select>
          
          <button className="btn btn-sm" style={{backgroundColor: '#dcfce7', color: '#166534'}} onClick={handleExportExcel}>📊 Excel</button>
          <button className="btn btn-sm" style={{backgroundColor: '#f1f5f9', color: '#475569'}} onClick={handleExportJSON}>📤 JSON</button>
          <input type="file" style={{display: 'none'}} ref={fileInputRef} onChange={handleFileChange} accept=".json"/>
          <button className="btn btn-sm" style={{backgroundColor: '#e0e7ff', color: '#4338ca'}} onClick={handleImportJSONClick}>📥 Import</button>
          <button className="btn btn-sm" style={{backgroundColor: '#ccfbf1', color: '#0f766e'}} onClick={() => alert('Saved!')}>💾 Save</button>
          <button className="btn btn-sm" style={{backgroundColor: '#fee2e2', color: '#b91c1c'}} onClick={() => { if(window.confirm('Reset all?')) resetAll() }}>🔄 Reset</button>
        </div>
      </div>

      {/* Model scenarios container */}
      <div className="card" style={{margin: '1rem 0', maxWidth: '100%', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
        <span style={{fontWeight: 'bold'}}>Model: </span>
        <button 
          className={`btn ${activeModelKey === 'target' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveModelKey('target')}
          style={{padding: '0.5rem 1rem'}}
        >
          {isBaseLocked ? '🔒 Business Model' : 'Business Model'}
        </button>
        
        {models['best'] && (
           <button 
             className={`btn ${activeModelKey === 'best' ? 'btn-primary' : 'btn-outline'}`}
             onClick={() => setActiveModelKey('best')}
             style={{padding: '0.5rem 1rem'}}
           >
             Aggressive Model
           </button>
        )}

        {!models['best'] ? (
          <button 
            className="btn" 
            style={{backgroundColor: '#dcfce7', color: '#166534', padding: '0.5rem 1rem'}}
            onClick={() => addScenario('best')}
          >
            + Add Aggressive Model
          </button>
        ) : !models['worst'] ? (
          <button 
            className="btn" 
            style={{backgroundColor: '#fef08a', color: '#854d0e', padding: '0.5rem 1rem'}}
            onClick={() => addScenario('worst')}
          >
            + Add Defensive Model
          </button>
        ) : (
          <button 
             className={`btn ${activeModelKey === 'worst' ? 'btn-primary' : 'btn-outline'}`}
             onClick={() => setActiveModelKey('worst')}
             style={{padding: '0.5rem 1rem'}}
           >
             Defensive Model
           </button>
        )}
      </div>
      
      <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem'}}>
        {isBaseLocked 
          ? "Base model is locked. You are viewing/editing a scenario." 
          : "Complete your Business Model, then add Aggressive/Defensive models. Once added, the base model will be locked."}
      </p>

      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="tab-content">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default Dashboard;
