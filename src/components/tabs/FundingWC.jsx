import { useModel } from '../../context/ModelContext';

const FundingWC = () => {
  const { activeData, updateScenarioData, calculateFinancials } = useModel();

  const fmt = (v) => (Math.abs(v) / 100000).toFixed(2) + ' L';

  const handleFunding = (type, yk, val) => updateScenarioData(`funding.${type}.${yk}`, Number(val));
  const handleWc = (type, unit, yk, val) => updateScenarioData(`${type}.${unit}.${yk}`, Number(val));

  const equity = activeData.funding?.equityRaised || { y1: 0, y2: 0, y3: 0 };
  const debt = activeData.funding?.debtRaised || { y1: 0, y2: 0, y3: 0 };
  const repay = activeData.funding?.debtRepayment || { y1: 0, y2: 0, y3: 0 };
  const intRate = activeData.funding?.interestRate || 0;

  const netInflow = {
    y1: (equity.y1 || 0) + (debt.y1 || 0) - (repay.y1 || 0),
    y2: (equity.y2 || 0) + (debt.y2 || 0) - (repay.y2 || 0),
    y3: (equity.y3 || 0) + (debt.y3 || 0) - (repay.y3 || 0),
  };

  const units = [
    { key: 'bu1', label: activeData.unit1Name || 'Solo Doctors' },
    { key: 'bu2', label: activeData.unit2Name || 'BU2' },
    { key: 'bu3', label: activeData.unit3Name || 'BU3' },
  ];

  const y1fin = calculateFinancials('y1');
  const y2fin = calculateFinancials('y2');
  const y3fin = calculateFinancials('y3');

  const getAR = (fin, yk) => {
    const bu1Days = activeData.receivableDays?.bu1?.[yk] || 0;
    const bu2Days = activeData.receivableDays?.bu2?.[yk] || 0;
    const bu3Days = activeData.receivableDays?.bu3?.[yk] || 0;
    return (fin.rev1 / 365) * bu1Days + (fin.rev2 / 365) * bu2Days + (fin.rev3 / 365) * bu3Days;
  };
  const getAP = (fin, yk) => {
    const bu1Days = activeData.payableDays?.bu1?.[yk] || 0;
    return (fin.totalCogs / 365) * bu1Days;
  };

  const ar1 = getAR(y1fin, 'y1'), ar2 = getAR(y2fin, 'y2'), ar3 = getAR(y3fin, 'y3');
  const ap1 = getAP(y1fin, 'y1'), ap2 = getAP(y2fin, 'y2'), ap3 = getAP(y3fin, 'y3');
  const nwc1 = ar1 - ap1, nwc2 = ar2 - ap2, nwc3 = ar3 - ap3;

  const inputStyle = {
    width: '100%', padding: '0.4rem 0.6rem', border: '1px solid #e2e8f0',
    borderRadius: '6px', fontSize: '0.9rem', textAlign: 'right', background: '#f8fafc'
  };

  const thStyle = { padding: '0.75rem', fontWeight: '600', color: '#64748b', textAlign: 'right', background: '#f8fafc' };
  const tdL = { padding: '0.6rem 0.75rem', color: '#1e293b', fontWeight: '500' };
  const tdR = { padding: '0.6rem 0.75rem', textAlign: 'right' };

  return (
    <div>
      <h3 style={{fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem'}}>Funding & Working Capital</h3>

      <div style={{background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '2rem'}}>
        <div style={{fontWeight: '700', color: '#b45309', marginBottom: '0.25rem'}}>💰 Funding & Capital Structure</div>
        <div style={{fontSize: '0.85rem', color: '#92400e'}}>Enter all amounts in ₹ (Indian Rupees). Displayed as ₹ L in summaries.</div>
      </div>

      <div style={{overflowX: 'auto', marginBottom: '2.5rem'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', border: '1px solid #e2e8f0'}}>
          <thead>
            <tr>
              <th style={{...thStyle, textAlign: 'left'}}>Item</th>
              <th style={thStyle}>Year 1</th>
              <th style={thStyle}>Year 2</th>
              <th style={thStyle}>Year 3</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={tdL}>Equity Raised (₹)</td>
              <td style={tdR}><input type="number" style={inputStyle} value={equity.y1 || 0} onChange={e => handleFunding('equityRaised', 'y1', e.target.value)} /></td>
              <td style={tdR}><input type="number" style={inputStyle} value={equity.y2 || 0} onChange={e => handleFunding('equityRaised', 'y2', e.target.value)} /></td>
              <td style={tdR}><input type="number" style={inputStyle} value={equity.y3 || 0} onChange={e => handleFunding('equityRaised', 'y3', e.target.value)} /></td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={tdL}>Debt Raised (₹)</td>
              <td style={tdR}><input type="number" style={inputStyle} value={debt.y1 || 0} onChange={e => handleFunding('debtRaised', 'y1', e.target.value)} /></td>
              <td style={tdR}><input type="number" style={inputStyle} value={debt.y2 || 0} onChange={e => handleFunding('debtRaised', 'y2', e.target.value)} /></td>
              <td style={tdR}><input type="number" style={inputStyle} value={debt.y3 || 0} onChange={e => handleFunding('debtRaised', 'y3', e.target.value)} /></td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={tdL}>Debt Repayment (₹)</td>
              <td style={tdR}><input type="number" style={inputStyle} value={repay.y1 || 0} onChange={e => handleFunding('debtRepayment', 'y1', e.target.value)} /></td>
              <td style={tdR}><input type="number" style={inputStyle} value={repay.y2 || 0} onChange={e => handleFunding('debtRepayment', 'y2', e.target.value)} /></td>
              <td style={tdR}><input type="number" style={inputStyle} value={repay.y3 || 0} onChange={e => handleFunding('debtRepayment', 'y3', e.target.value)} /></td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={tdL}>Interest Rate (%)</td>
              <td colSpan="3" style={tdR}>
                <input type="number" style={{...inputStyle, width: '100px'}} value={intRate} onChange={e => updateScenarioData('funding.interestRate', Number(e.target.value))} />
                <span style={{color: '#64748b', marginLeft: '0.5rem', fontSize: '0.85rem'}}>% p.a.</span>
              </td>
            </tr>
            <tr style={{fontWeight: '700', background: '#f0fdf4', borderTop: '2px solid #bbf7d0'}}>
              <td style={{...tdL, color: '#059669'}}>Net Funding Inflow (₹ L)</td>
              <td style={{...tdR, color: '#059669'}}>{fmt(netInflow.y1)}</td>
              <td style={{...tdR, color: '#059669'}}>{fmt(netInflow.y2)}</td>
              <td style={{...tdR, color: '#059669'}}>{fmt(netInflow.y3)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '2rem'}}>
        <div style={{fontWeight: '700', color: '#0369a1', marginBottom: '0.25rem'}}>📅 Working Capital Assumptions (Days)</div>
        <div style={{fontSize: '0.85rem', color: '#0c4a6e'}}>
          AR Days: revenue collected after this many days. AP Days: supplier payments deferred by this many days.
        </div>
      </div>

      <div style={{overflowX: 'auto', marginBottom: '2rem'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', border: '1px solid #e2e8f0'}}>
          <thead>
            <tr>
              <th style={{...thStyle, textAlign: 'left'}}>Business Unit</th>
              <th style={{...thStyle, textAlign: 'center'}}>Metric</th>
              <th style={thStyle}>Year 1</th>
              <th style={thStyle}>Year 2</th>
              <th style={thStyle}>Year 3</th>
            </tr>
          </thead>
          <tbody>
            {units.map(({key, label}) => {
              const rec = activeData.receivableDays?.[key] || {y1:0, y2:0, y3:0};
              const pay = activeData.payableDays?.[key] || {y1:0, y2:0, y3:0};
              return (
                <>
                  <tr key={key + '-rec'} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td rowSpan={2} style={{...tdL, borderBottom: '2px solid #e2e8f0', verticalAlign: 'middle', fontWeight: '600'}}>{label}</td>
                    <td style={{...tdR, color: '#0369a1', fontWeight: '500', textAlign: 'center'}}>Receivable Days</td>
                    <td style={tdR}><input type="number" style={inputStyle} value={rec.y1 || 0} onChange={e => handleWc('receivableDays', key, 'y1', e.target.value)} /></td>
                    <td style={tdR}><input type="number" style={inputStyle} value={rec.y2 || 0} onChange={e => handleWc('receivableDays', key, 'y2', e.target.value)} /></td>
                    <td style={tdR}><input type="number" style={inputStyle} value={rec.y3 || 0} onChange={e => handleWc('receivableDays', key, 'y3', e.target.value)} /></td>
                  </tr>
                  <tr key={key + '-pay'} style={{borderBottom: '2px solid #e2e8f0'}}>
                    <td style={{...tdR, color: '#d97706', fontWeight: '500', textAlign: 'center'}}>Payable Days</td>
                    <td style={tdR}><input type="number" style={inputStyle} value={pay.y1 || 0} onChange={e => handleWc('payableDays', key, 'y1', e.target.value)} /></td>
                    <td style={tdR}><input type="number" style={inputStyle} value={pay.y2 || 0} onChange={e => handleWc('payableDays', key, 'y2', e.target.value)} /></td>
                    <td style={tdR}><input type="number" style={inputStyle} value={pay.y3 || 0} onChange={e => handleWc('payableDays', key, 'y3', e.target.value)} /></td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <h3 style={{fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem'}}>Working Capital Summary (₹ L)</h3>
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', border: '1px solid #e2e8f0'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #e2e8f0', background: '#f8fafc'}}>
              <th style={{textAlign: 'left', padding: '0.75rem', color: '#64748b', fontWeight: '600'}}>Metric</th>
              <th style={{textAlign: 'right', padding: '0.75rem', color: '#64748b', fontWeight: '600'}}>Year 1</th>
              <th style={{textAlign: 'right', padding: '0.75rem', color: '#64748b', fontWeight: '600'}}>Year 2</th>
              <th style={{textAlign: 'right', padding: '0.75rem', color: '#64748b', fontWeight: '600'}}>Year 3</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.6rem 0.75rem', color: '#0369a1'}}>Total AR (₹ L)</td>
              <td style={{textAlign: 'right', padding: '0.6rem 0.75rem'}}>{fmt(ar1)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 0.75rem'}}>{fmt(ar2)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 0.75rem'}}>{fmt(ar3)}</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.6rem 0.75rem', color: '#d97706'}}>Total AP (₹ L)</td>
              <td style={{textAlign: 'right', padding: '0.6rem 0.75rem'}}>{fmt(ap1)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 0.75rem'}}>{fmt(ap2)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 0.75rem'}}>{fmt(ap3)}</td>
            </tr>
            <tr style={{fontWeight: '700', background: '#f0fdf4'}}>
              <td style={{padding: '0.6rem 0.75rem', color: '#059669'}}>Net Working Capital (₹ L)</td>
              <td style={{textAlign: 'right', padding: '0.6rem 0.75rem', color: nwc1 < 0 ? '#ef4444' : '#059669'}}>{fmt(nwc1)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 0.75rem', color: nwc2 < 0 ? '#ef4444' : '#059669'}}>{fmt(nwc2)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 0.75rem', color: nwc3 < 0 ? '#ef4444' : '#059669'}}>{fmt(nwc3)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FundingWC;
