import { useModel } from '../../context/ModelContext';

const FundingWC = () => {
  const { activeData, updateScenarioData } = useModel();

  const handleFundingChange = (type, yearKey, value) => {
    updateScenarioData(`funding.${type}.${yearKey}`, value);
  };

  const handleWcChange = (type, unitKey, yearKey, value) => {
    updateScenarioData(`${type}.${unitKey}.${yearKey}`, value);
  };

  const equity = activeData.funding?.equityRaised || { y1: 0, y2: 0, y3: 0 };
  const debt = activeData.funding?.debtRaised || { y1: 0, y2: 0, y3: 0 };
  const recDays = activeData.receivableDays?.bu1 || { y1: 0, y2: 0, y3: 0 };
  const payDays = activeData.payableDays?.bu1 || { y1: 0, y2: 0, y3: 0 };

  return (
    <div>
      <div className="summary-card" style={{backgroundColor: '#fffbeb', borderColor: '#fef3c7'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.2rem', color: '#b45309'}}>
          <span>🔒</span> 💰 Funding & Working Capital
        </div>
      </div>

      <div className="item-card">
        <h4 style={{fontSize: '1.1rem', marginBottom: '1rem', color: '#0f172a'}}>Funding Raised (₹)</h4>
        <table className="mini-table">
          <thead>
            <tr>
              <th style={{textAlign: 'left'}}>Type</th>
              <th>Year 1</th>
              <th>Year 2</th>
              <th>Year 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{textAlign: 'left'}}>Equity Raised</td>
              <td><input type="number" value={equity.y1 || 0} onChange={(e) => handleFundingChange('equityRaised', 'y1', Number(e.target.value))} /></td>
              <td><input type="number" value={equity.y2 || 0} onChange={(e) => handleFundingChange('equityRaised', 'y2', Number(e.target.value))} /></td>
              <td><input type="number" value={equity.y3 || 0} onChange={(e) => handleFundingChange('equityRaised', 'y3', Number(e.target.value))} /></td>
            </tr>
            <tr>
              <td style={{textAlign: 'left'}}>Debt Raised</td>
              <td><input type="number" value={debt.y1 || 0} onChange={(e) => handleFundingChange('debtRaised', 'y1', Number(e.target.value))} /></td>
              <td><input type="number" value={debt.y2 || 0} onChange={(e) => handleFundingChange('debtRaised', 'y2', Number(e.target.value))} /></td>
              <td><input type="number" value={debt.y3 || 0} onChange={(e) => handleFundingChange('debtRaised', 'y3', Number(e.target.value))} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="item-card">
        <h4 style={{fontSize: '1.1rem', marginBottom: '1rem', color: '#0f172a'}}>Working Capital (Days)</h4>
        <div className="info-box-yellow">⚠️ Used to calculate AR (Accounts Receivable) from Revenue and AP (Accounts Payable) from COGS.</div>
        <table className="mini-table">
          <thead>
            <tr>
              <th style={{textAlign: 'left'}}>Metric</th>
              <th>Year 1</th>
              <th>Year 2</th>
              <th>Year 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{textAlign: 'left'}}>Receivable Days (AR)</td>
              <td><input type="number" value={recDays.y1 || 0} onChange={(e) => handleWcChange('receivableDays', 'bu1', 'y1', Number(e.target.value))} /></td>
              <td><input type="number" value={recDays.y2 || 0} onChange={(e) => handleWcChange('receivableDays', 'bu1', 'y2', Number(e.target.value))} /></td>
              <td><input type="number" value={recDays.y3 || 0} onChange={(e) => handleWcChange('receivableDays', 'bu1', 'y3', Number(e.target.value))} /></td>
            </tr>
            <tr>
              <td style={{textAlign: 'left'}}>Payable Days (AP)</td>
              <td><input type="number" value={payDays.y1 || 0} onChange={(e) => handleWcChange('payableDays', 'bu1', 'y1', Number(e.target.value))} /></td>
              <td><input type="number" value={payDays.y2 || 0} onChange={(e) => handleWcChange('payableDays', 'bu1', 'y2', Number(e.target.value))} /></td>
              <td><input type="number" value={payDays.y3 || 0} onChange={(e) => handleWcChange('payableDays', 'bu1', 'y3', Number(e.target.value))} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FundingWC;
