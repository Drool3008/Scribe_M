import { useModel } from '../../context/ModelContext';

const BusinessUnit = ({ id, title }) => {
  const { activeData, updateScenarioData, calculateFinancials } = useModel();

  // Map id (bu1/bu2/bu3) → data keys (unit1/unit2/unit3)
  const unitNum = id === 'bu1' ? 1 : id === 'bu2' ? 2 : 3;
  const revKey = `unit${unitNum}Revenue`;
  const cogsKey = `unit${unitNum}CogsItems`;
  const cacKey = `unit${unitNum}CacItems`;

  const revData = activeData[revKey] || {};
  const cogsItems = activeData[cogsKey] || [];
  const cacItems = activeData[cacKey] || [];

  const handleRevChange = (field, val) => updateScenarioData(`${revKey}.${field}`, Number(val));
  const handleArrayChange = (arrayName, index, field, value) =>
    updateScenarioData(`${arrayName}[${index}].${field}`, isNaN(Number(value)) ? value : Number(value));

  const formatL = (val) => (Math.abs(val) / 100000).toFixed(2) + ' L';
  const formatCr = (val) => (Math.abs(val) / 10000000).toFixed(3) + ' Cr';

  const y1fin = calculateFinancials('y1');
  const y2fin = calculateFinancials('y2');
  const y3fin = calculateFinancials('y3');

  const rev = { y1: unitNum === 1 ? y1fin.rev1 : unitNum === 2 ? y1fin.rev2 : y1fin.rev3,
                y2: unitNum === 1 ? y2fin.rev1 : unitNum === 2 ? y2fin.rev2 : y2fin.rev3,
                y3: unitNum === 1 ? y3fin.rev1 : unitNum === 2 ? y3fin.rev2 : y3fin.rev3 };

  const totalCogs = { y1: unitNum === 1 ? y1fin.totalCogs : 0, y2: unitNum === 1 ? y2fin.totalCogs : 0, y3: unitNum === 1 ? y3fin.totalCogs : 0 };
  const totalCac = { y1: unitNum === 1 ? y1fin.totalCac : 0, y2: unitNum === 1 ? y2fin.totalCac : 0, y3: unitNum === 1 ? y3fin.totalCac : 0 };
  const contrib = {
    y1: rev.y1 - totalCogs.y1 - totalCac.y1,
    y2: rev.y2 - totalCogs.y2 - totalCac.y2,
    y3: rev.y3 - totalCogs.y3 - totalCac.y3,
  };

  const isSubscription = revData.type === 'annual';

  const inputStyle = {
    width: '100%', padding: '0.4rem 0.6rem', border: '1px solid #e2e8f0',
    borderRadius: '6px', fontSize: '0.9rem', textAlign: 'right', background: '#f8fafc'
  };

  const renderItemCard = (item, index, arrayName) => {
    const y1Amt = (item.linkMode === 'linked' ? (revData.y1Units || 0) : (item.y1Units || 0)) * (item.y1Rate || 0);
    const y2Amt = (item.linkMode === 'linked' ? (revData.y2Units || 0) : (item.y2Units || 0)) * (item.y2Rate || 0);
    const y3Amt = (item.linkMode === 'linked' ? (revData.y3Units || 0) : (item.y3Units || 0)) * (item.y3Rate || 0);
    const isLinked = item.linkMode === 'linked';

    return (
      <div key={index} style={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'}}>
          <span style={{fontWeight: '600', color: '#1e293b', fontSize: '0.95rem'}}>{item.name || item.itemName || 'Line Item'}</span>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            {isLinked && <span style={{fontSize: '0.75rem', color: '#059669', background: '#f0fdf4', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #bbf7d0'}}>🔗 Linked to {activeData[`unit${unitNum}Name`] || `BU${unitNum}`} Units</span>}
            <select
              value={item.linkMode || 'manual'}
              onChange={(e) => handleArrayChange(arrayName, index, 'linkMode', e.target.value)}
              style={{padding: '0.3rem 0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem', background: '#f8fafc'}}
            >
              <option value="manual">Manual Entry</option>
              <option value="linked">Linked to Revenue Units</option>
            </select>
          </div>
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
              <td style={{padding: '0.4rem', color: '#64748b'}}># Units {isLinked ? <span style={{color: '#94a3b8', fontSize: '0.8rem'}}>(auto)</span> : ''}</td>
              {['y1', 'y2', 'y3'].map(yk => (
                <td key={yk} style={{padding: '0.4rem'}}>
                  {isLinked
                    ? <span style={{display: 'block', textAlign: 'right', color: '#64748b'}}>{revData[`${yk}Units`] || 0}</span>
                    : <input type="number" style={inputStyle} value={item[`${yk}Units`] || 0} onChange={e => handleArrayChange(arrayName, index, `${yk}Units`, e.target.value)} />
                  }
                </td>
              ))}
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.4rem', color: '#64748b'}}>Rate (₹)</td>
              {['y1', 'y2', 'y3'].map(yk => (
                <td key={yk} style={{padding: '0.4rem'}}>
                  <input type="number" style={inputStyle} value={item[`${yk}Rate`] || 0} onChange={e => handleArrayChange(arrayName, index, `${yk}Rate`, e.target.value)} />
                </td>
              ))}
            </tr>
            <tr style={{background: '#f0fdf4'}}>
              <td style={{padding: '0.4rem 0.5rem', fontWeight: '600', color: '#1e293b'}}>Amount (₹ L)</td>
              <td style={{textAlign: 'right', padding: '0.4rem 0.5rem', fontWeight: '600', color: '#0d9488'}}>{formatL(y1Amt)}</td>
              <td style={{textAlign: 'right', padding: '0.4rem 0.5rem', fontWeight: '600', color: '#0d9488'}}>{formatL(y2Amt)}</td>
              <td style={{textAlign: 'right', padding: '0.4rem 0.5rem', fontWeight: '600', color: '#0d9488'}}>{formatL(y3Amt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      {/* Header summary card */}
      <div style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <div style={{fontWeight: '700', fontSize: '1.1rem', color: '#166534'}}>{title}</div>
          <div style={{fontSize: '0.85rem', color: '#4ade80', marginTop: '0.25rem'}}>
            {isSubscription ? 'Annual Subscription Model' : 'Lumpsum / One-Time Revenue'}
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: '0.8rem', color: '#64748b'}}>Y3 Contribution</div>
          <div style={{fontSize: '1.4rem', fontWeight: '700', color: contrib.y3 >= 0 ? '#059669' : '#ef4444'}}>
            ₹{formatL(contrib.y3)}
          </div>
        </div>
      </div>

      {/* Revenue block */}
      <h4 style={{fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #e2e8f0'}}>
        📈 Revenue — {revData.name || (isSubscription ? 'Subscription Revenue' : 'Revenue')}
      </h4>

      {revData.remark && (
        <div style={{background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#166534'}}>
          ✓ {revData.remark}
        </div>
      )}

      <div style={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #e2e8f0'}}>
              <th style={{textAlign: 'left', padding: '0.5rem', color: '#64748b', fontWeight: '600'}}>Metric</th>
              <th style={{textAlign: 'right', padding: '0.5rem', color: '#64748b', fontWeight: '600'}}>Year 1</th>
              <th style={{textAlign: 'right', padding: '0.5rem', color: '#64748b', fontWeight: '600'}}>Year 2</th>
              <th style={{textAlign: 'right', padding: '0.5rem', color: '#64748b', fontWeight: '600'}}>Year 3</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.5rem', color: '#475569'}}># {isSubscription ? 'Doctors / Subscribers' : 'Customers / Units'}</td>
              {['y1', 'y2', 'y3'].map(yk => (
                <td key={yk} style={{padding: '0.5rem'}}>
                  <input type="number" style={inputStyle} value={revData[`${yk}Units`] || 0}
                    onChange={e => handleRevChange(`${yk}Units`, e.target.value)} />
                </td>
              ))}
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.5rem', color: '#475569'}}>Rate / {isSubscription ? 'ARPU (₹/yr)' : 'Purchase (₹)'}</td>
              {['y1', 'y2', 'y3'].map(yk => (
                <td key={yk} style={{padding: '0.5rem'}}>
                  <input type="number" style={inputStyle} value={revData[`${yk}Rate`] || 0}
                    onChange={e => handleRevChange(`${yk}Rate`, e.target.value)} />
                </td>
              ))}
            </tr>
            <tr style={{background: '#f0fdf4', borderTop: '1px solid #bbf7d0'}}>
              <td style={{padding: '0.5rem 0.6rem', fontWeight: '700', color: '#059669'}}>Recognized Revenue (₹ L)</td>
              <td style={{textAlign: 'right', padding: '0.5rem 0.6rem', fontWeight: '700', color: '#0d9488'}}>{formatL(rev.y1)}</td>
              <td style={{textAlign: 'right', padding: '0.5rem 0.6rem', fontWeight: '700', color: '#0d9488'}}>{formatL(rev.y2)}</td>
              <td style={{textAlign: 'right', padding: '0.5rem 0.6rem', fontWeight: '700', color: '#0d9488'}}>{formatL(rev.y3)}</td>
            </tr>
            {isSubscription && (
              <tr style={{background: '#eff6ff'}}>
                <td style={{padding: '0.5rem 0.6rem', color: '#1e40af', fontSize: '0.85rem'}}>ARR (₹ Cr)</td>
                <td style={{textAlign: 'right', padding: '0.5rem 0.6rem', color: '#1e40af', fontSize: '0.85rem'}}>{formatCr(rev.y1)}</td>
                <td style={{textAlign: 'right', padding: '0.5rem 0.6rem', color: '#1e40af', fontSize: '0.85rem'}}>{formatCr(rev.y2)}</td>
                <td style={{textAlign: 'right', padding: '0.5rem 0.6rem', color: '#1e40af', fontSize: '0.85rem'}}>{formatCr(rev.y3)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* COGS items */}
      <h4 style={{fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem', marginTop: '2rem', paddingBottom: '0.5rem', borderBottom: '2px solid #fee2e2'}}>
        ⚙️ COGS (Direct Costs)
      </h4>
      {cogsItems.length > 0
        ? cogsItems.map((item, i) => renderItemCard(item, i, cogsKey))
        : <div style={{background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', color: '#94a3b8'}}>No COGS items defined for this unit.</div>
      }

      {/* CAC items */}
      <h4 style={{fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem', marginTop: '2rem', paddingBottom: '0.5rem', borderBottom: '2px solid #fde68a'}}>
        📣 CAC / Marketing &amp; Sales
      </h4>
      {cacItems.length > 0
        ? cacItems.map((item, i) => renderItemCard(item, i, cacKey))
        : <div style={{background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', color: '#94a3b8'}}>No CAC items defined for this unit.</div>
      }

      {/* Unit Contribution Summary */}
      <div style={{background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem 1.5rem', marginTop: '2rem'}}>
        <div style={{fontWeight: '700', color: '#059669', marginBottom: '0.75rem', fontSize: '1rem'}}>Unit Contribution Summary (₹ L)</div>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem'}}>
          <tbody>
            <tr style={{borderBottom: '1px solid #bbf7d0'}}>
              <td style={{padding: '0.5rem', color: '#475569'}}>Revenue</td>
              <td style={{textAlign: 'right', padding: '0.5rem', color: '#0d9488', fontWeight: '600'}}>{formatL(rev.y1)}</td>
              <td style={{textAlign: 'right', padding: '0.5rem', color: '#0d9488', fontWeight: '600'}}>{formatL(rev.y2)}</td>
              <td style={{textAlign: 'right', padding: '0.5rem', color: '#0d9488', fontWeight: '600'}}>{formatL(rev.y3)}</td>
            </tr>
            <tr style={{borderBottom: '1px solid #bbf7d0'}}>
              <td style={{padding: '0.5rem', color: '#475569'}}>COGS</td>
              <td style={{textAlign: 'right', padding: '0.5rem', color: '#ef4444'}}>{totalCogs.y1 > 0 ? `-${formatL(totalCogs.y1)}` : formatL(totalCogs.y1)}</td>
              <td style={{textAlign: 'right', padding: '0.5rem', color: '#ef4444'}}>{totalCogs.y2 > 0 ? `-${formatL(totalCogs.y2)}` : formatL(totalCogs.y2)}</td>
              <td style={{textAlign: 'right', padding: '0.5rem', color: '#ef4444'}}>{totalCogs.y3 > 0 ? `-${formatL(totalCogs.y3)}` : formatL(totalCogs.y3)}</td>
            </tr>
            <tr style={{borderBottom: '1px solid #bbf7d0'}}>
              <td style={{padding: '0.5rem', color: '#475569'}}>CAC</td>
              <td style={{textAlign: 'right', padding: '0.5rem', color: '#ef4444'}}>{totalCac.y1 > 0 ? `-${formatL(totalCac.y1)}` : formatL(totalCac.y1)}</td>
              <td style={{textAlign: 'right', padding: '0.5rem', color: '#ef4444'}}>{totalCac.y2 > 0 ? `-${formatL(totalCac.y2)}` : formatL(totalCac.y2)}</td>
              <td style={{textAlign: 'right', padding: '0.5rem', color: '#ef4444'}}>{totalCac.y3 > 0 ? `-${formatL(totalCac.y3)}` : formatL(totalCac.y3)}</td>
            </tr>
            <tr style={{fontWeight: '700'}}>
              <td style={{padding: '0.5rem', color: '#059669'}}>Contribution</td>
              <td style={{textAlign: 'right', padding: '0.5rem', color: contrib.y1 >= 0 ? '#059669' : '#ef4444', fontWeight: '700'}}>{contrib.y1 < 0 ? `-${formatL(contrib.y1)}` : formatL(contrib.y1)}</td>
              <td style={{textAlign: 'right', padding: '0.5rem', color: contrib.y2 >= 0 ? '#059669' : '#ef4444', fontWeight: '700'}}>{contrib.y2 < 0 ? `-${formatL(contrib.y2)}` : formatL(contrib.y2)}</td>
              <td style={{textAlign: 'right', padding: '0.5rem', color: contrib.y3 >= 0 ? '#059669' : '#ef4444', fontWeight: '700'}}>{contrib.y3 < 0 ? `-${formatL(contrib.y3)}` : formatL(contrib.y3)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusinessUnit;
