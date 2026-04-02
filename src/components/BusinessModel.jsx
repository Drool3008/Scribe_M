import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProfitAndLoss from './tabs/ProfitAndLoss';
import BalanceSheet from './tabs/BalanceSheet';
import CashFlow from './tabs/CashFlow';
import BusinessUnit from './tabs/BusinessUnit';
import Overheads from './tabs/Overheads';
import FundingWC from './tabs/FundingWC';
import { useModel } from '../context/ModelContext';

const BusinessModel = ({ projectData }) => {
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
      {/* Back to Portal Link */}
      <Link to="/" style={{color: '#6366f1', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block'}}>
        ← Back to Portal
      </Link>

      {/* Top Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{color: '#6366f1', fontSize: '2rem', marginBottom: '0.2rem'}}>{projectData.name || 'ScribeHealth'}</h2>
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

export default BusinessModel;
