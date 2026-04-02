import { useModel } from '../../context/ModelContext';

const Overheads = () => {
  const { activeData, updateScenarioData, calculateFinancials } = useModel();

  const handleArrayChange = (arrayName, index, field, value) =>
    updateScenarioData(`${arrayName}[${index}].${field}`, isNaN(Number(value)) ? value : Number(value));

  const gaItems = activeData.gaExpenseItems || [];
  const investmentItems = activeData.investmentItems || [];
  const y3Data = calculateFinancials('y3');

  const formatL = (val) => (Math.abs(val) / 100000).toFixed(2) + ' L';

  const inputStyle = {
    width: '100%', padding: '0.4rem 0.6rem', border: '1px solid #e2e8f0',
    borderRadius: '6px', fontSize: '0.9rem', textAlign: 'right', background: '#f8fafc'
  };

  const renderItemCard = (item, index, arrayName) => {
    const y1Amount = (item.y1Units || 0) * (item.y1Rate || 0);
    const y2Amount = (item.y2Units || 0) * (item.y2Rate || 0);
    const y3Amount = (item.y3Units || 0) * (item.y3Rate || 0);
    const isManual = (item.linkMode || 'manual') === 'manual';

    return (
      <div key={index} style={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'}}>
          <span style={{fontWeight: '600', color: '#1e293b', fontSize: '0.95rem'}}>{item.name || item.itemName || 'Line Item'}</span>
          <select
            value={item.linkMode || 'manual'}
            onChange={(e) => handleArrayChange(arrayName, index, 'linkMode', e.target.value)}
            style={{padding: '0.3rem 0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem', background: '#f8fafc'}}
          >
            <option value="manual">Manual Entry</option>
            <option value="linked">Linked to Revenue Units</option>
          </select>
        </div>

        {item.remark && (
          <div style={{background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.5rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#166534'}}>
            ✓ {item.remark}
          </div>
        )}

        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem'}}>
          <thead>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <th style={{textAlign: 'left', padding: '0.4rem', color: '#64748b'}}></th>
              <th style={{textAlign: 'right', padding: '0.4rem', color: '#64748b'}}>Year 1</th>
              <th style={{textAlign: 'right', padding: '0.4rem', color: '#64748b'}}>Year 2</th>
              <th style={{textAlign: 'right', padding: '0.4rem', color: '#64748b'}}>Year 3</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.4rem', color: '#64748b'}}># Units</td>
              {['y1', 'y2', 'y3'].map(yk => (
                <td key={yk} style={{padding: '0.4rem'}}>
                  <input type="number" style={inputStyle} value={item[`${yk}Units`] || 0}
                    onChange={e => handleArrayChange(arrayName, index, `${yk}Units`, e.target.value)} />
                </td>
              ))}
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.4rem', color: '#64748b'}}>Rate (₹)</td>
              {['y1', 'y2', 'y3'].map(yk => (
                <td key={yk} style={{padding: '0.4rem'}}>
                  <input type="number" style={inputStyle} value={item[`${yk}Rate`] || 0}
                    onChange={e => handleArrayChange(arrayName, index, `${yk}Rate`, e.target.value)} />
                </td>
              ))}
            </tr>
            <tr style={{background: '#f0fdf4', borderTop: '1px solid #bbf7d0'}}>
              <td style={{padding: '0.4rem 0.5rem', fontWeight: '600', color: '#1e293b'}}>Amount (₹ L)</td>
              <td style={{textAlign: 'right', padding: '0.4rem 0.5rem', fontWeight: '600', color: '#0d9488'}}>{formatL(y1Amount)}</td>
              <td style={{textAlign: 'right', padding: '0.4rem 0.5rem', fontWeight: '600', color: '#0d9488'}}>{formatL(y2Amount)}</td>
              <td style={{textAlign: 'right', padding: '0.4rem 0.5rem', fontWeight: '600', color: '#0d9488'}}>{formatL(y3Amount)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const totalGA = gaItems.reduce((s, item) => s + (item.y3Units || 0) * (item.y3Rate || 0), 0);
  const totalCapex = investmentItems.reduce((s, item) => s + (item.y3Units || 0) * (item.y3Rate || 0), 0);

  return (
    <div>
      {/* Header */}
      <div style={{background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', border: '1px solid #99f6e4', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <div style={{fontWeight: '700', fontSize: '1.1rem', color: '#0f766e'}}>💼 G&A / Operating Expenses</div>
          <div style={{fontSize: '0.85rem', color: '#0d9488', marginTop: '0.25rem'}}>General & Administrative overhead costs (not linked to revenue units)</div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: '0.8rem', color: '#64748b'}}>Y3 Total G&A</div>
          <div style={{fontSize: '1.4rem', fontWeight: '700', color: '#0f766e'}}>₹{formatL(y3Data.ga)}</div>
        </div>
      </div>

      <h4 style={{fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #ccfbf1'}}>
        G&A Expenses (₹ L)
      </h4>

      {gaItems.length > 0
        ? gaItems.map((item, i) => renderItemCard(item, i, 'gaExpenseItems'))
        : <div style={{background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', color: '#94a3b8'}}>No G&A items defined.</div>
      }

      {/* Totals row */}
      {gaItems.length > 0 && (
        <div style={{background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '8px', padding: '0.75rem 1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{fontWeight: '600', color: '#0f766e'}}>Total G&A (Year 3)</span>
          <span style={{fontWeight: '700', color: '#0f766e', fontSize: '1.05rem'}}>₹{formatL(totalGA)}</span>
        </div>
      )}

      {/* Investments / CAPEX */}
      <h4 style={{fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem', marginTop: '2rem', paddingBottom: '0.5rem', borderBottom: '2px solid #dbeafe'}}>
        🏗️ Investments / Capital Expenditure (Capex)
      </h4>

      {investmentItems.length > 0
        ? investmentItems.map((item, i) => renderItemCard(item, i, 'investmentItems'))
        : (
          <div style={{background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '2rem', textAlign: 'center'}}>
            <div style={{color: '#94a3b8', marginBottom: '0.5rem'}}>No investment / CAPEX items defined.</div>
            <div style={{fontSize: '0.8rem', color: '#cbd5e1'}}>Total Capex Y1–Y3: ₹0.00 L | Depreciation rate: 20% per year (straight-line)</div>
          </div>
        )
      }

      {investmentItems.length > 0 && (
        <div style={{background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem 1.25rem', marginTop: '0.5rem'}}>
          <div style={{fontWeight: '600', color: '#1e40af', marginBottom: '0.25rem'}}>Depreciation Note</div>
          <div style={{fontSize: '0.85rem', color: '#3730a3'}}>
            Total Capex (Y3): ₹{formatL(totalCapex)} | Depreciation: 20% p.a. straight-line | Y3 Dep: ₹{formatL(totalCapex * 0.2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overheads;
