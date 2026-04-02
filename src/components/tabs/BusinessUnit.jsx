import { useModel } from '../../context/ModelContext';

const BusinessUnit = ({ id, title }) => {
  const { activeData, updateScenarioData, calculateFinancials } = useModel();

  const handleInputChange = (path, value) => {
    updateScenarioData(path, value);
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    updateScenarioData(`${arrayName}[${index}].${field}`, value);
  };

  // Get active arrays mapping for this unit
  const revItems = activeData[`${id}RevItems`] || [];
  const cogsItems = activeData[`${id}CogsItems`] || [];
  const cacItems = activeData[`${id}CacItems`] || [];

  const y3Data = calculateFinancials('y3');
  // Identify contribution specific to this unit.
  // For BU1, rev1 - totalCogs - totalCac (simplified mapping)
  const y3Contrib = id === 'bu1' ? (y3Data.rev1 - y3Data.totalCogs - y3Data.totalCac) : 0; 

  const formatL = (val) => {
    return (Math.abs(val) / 100000).toFixed(2) + ' L';
  };

  const renderVal = (val, isNegativeExpected = false) => {
    const isActuallyNegative = isNegativeExpected ? true : val < 0;
    const str = formatL(val);
    return isActuallyNegative && val !== 0 ? `-${str}` : str;
  };

  const renderItemCard = (item, index, arrayName, isNegative = false) => {
    const y1Amount = (item.y1Units || 0) * (item.y1Rate || 0);
    const y2Amount = (item.y2Units || 0) * (item.y2Rate || 0);
    const y3Amount = (item.y3Units || 0) * (item.y3Rate || 0);

    return (
      <div key={index} className="item-card">
        <div style={{display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #e2e8f0', marginBottom: '1rem'}}>
          <span style={{fontWeight: '600'}}>{item.modelName || item.itemName || 'Line Item'}</span>
          <select 
            value={item.linkMode || 'manual'}
            onChange={(e) => handleArrayChange(arrayName, index, 'linkMode', e.target.value)}
            style={{width: 'auto', padding: '0.2rem 0.5rem'}}
          >
            <option value="manual">Manual Entry</option>
            <option value="linked">Annual Subscription</option>
          </select>
        </div>

        {item.remark && (
          <div className={item.remark.includes('assumes') ? "info-box-green" : "info-box-yellow"}>
            {item.remark.includes('assumes') ? '✓ ' : '⚠️ '} {item.remark}
          </div>
        )}

        <table className="mini-table" style={{marginTop: '1.5rem'}}>
          <thead>
            <tr>
              <th style={{textAlign: 'left'}}></th>
              <th>Year 1</th>
              <th>Year 2</th>
              <th>Year 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{textAlign: 'left'}}># Units</td>
              <td>
                <input 
                  type="number" 
                  value={item.y1Units || 0}
                  onChange={(e) => handleArrayChange(arrayName, index, 'y1Units', Number(e.target.value))}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={item.y2Units || 0}
                  onChange={(e) => handleArrayChange(arrayName, index, 'y2Units', Number(e.target.value))}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={item.y3Units || 0}
                  onChange={(e) => handleArrayChange(arrayName, index, 'y3Units', Number(e.target.value))}
                />
              </td>
            </tr>
            <tr>
              <td style={{textAlign: 'left'}}>Rate (₹)</td>
              <td>
                <input 
                  type="number" 
                  value={item.y1Rate || 0}
                  onChange={(e) => handleArrayChange(arrayName, index, 'y1Rate', Number(e.target.value))}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={item.y2Rate || 0}
                  onChange={(e) => handleArrayChange(arrayName, index, 'y2Rate', Number(e.target.value))}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={item.y3Rate || 0}
                  onChange={(e) => handleArrayChange(arrayName, index, 'y3Rate', Number(e.target.value))}
                />
              </td>
            </tr>
            <tr style={{backgroundColor: '#f0fdf4'}}>
              <td style={{textAlign: 'left', fontWeight: '600', color: '#0f172a'}}>Amount (L)</td>
              <td className="text-teal">{renderVal(y1Amount, isNegative)}</td>
              <td className="text-teal">{renderVal(y2Amount, isNegative)}</td>
              <td className="text-teal">{renderVal(y3Amount, isNegative)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="summary-card">
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.2rem', color: '#166534'}}>
          <span>🔒</span> 🎓 {title}
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: '0.85rem', color: '#475569'}}>Y3 Contribution</div>
          <div style={{fontSize: '1.4rem', fontWeight: '700', color: '#166534'}}>₹{formatL(y3Contrib)}</div>
        </div>
      </div>

      <h4 style={{fontSize: '1.1rem', marginBottom: '1rem', color: '#0f172a'}}>Revenue</h4>
      {revItems.length > 0 ? (
        revItems.map((item, i) => renderItemCard(item, i, `${id}RevItems`, false))
      ) : (
        <div className="item-card"><p>No revenue items defined for this unit.</p></div>
      )}

      <h4 style={{fontSize: '1.1rem', marginBottom: '1rem', marginTop: '2rem', color: '#0f172a'}}>COGS (Direct Costs)</h4>
      {cogsItems.length > 0 ? (
        cogsItems.map((item, i) => renderItemCard(item, i, `${id}CogsItems`, true))
      ) : (
        <div className="item-card"><p>No COGS items defined for this unit.</p></div>
      )}

      <h4 style={{fontSize: '1.1rem', marginBottom: '1rem', marginTop: '2rem', color: '#0f172a'}}>CAC (Marketing & Sales)</h4>
      {cacItems.length > 0 ? (
        cacItems.map((item, i) => renderItemCard(item, i, `${id}CacItems`, true))
      ) : (
        <div className="item-card"><p>No CAC items defined for this unit.</p></div>
      )}
    </div>
  );
};

export default BusinessUnit;
