import { useModel } from '../../context/ModelContext';

const ProfitAndLoss = () => {
  const { calculateFinancials, activeData } = useModel();
  
  const y1 = calculateFinancials('y1');
  const y2 = calculateFinancials('y2');
  const y3 = calculateFinancials('y3');

  const formatL = (val) => (Math.abs(val) / 100000).toFixed(2) + ' L';

  const formatPct = (val, rev) => {
    if (!rev || rev === 0) return '0.0%';
    return ((Math.abs(val) / rev) * 100).toFixed(1) + '%';
  };

  const renderVal = (val, isNegativeExpected = false) => {
    const neg = val < 0 || (isNegativeExpected && val !== 0);
    const str = formatL(val);
    return <span style={{ color: neg && val !== 0 ? '#ef4444' : 'inherit' }}>{neg && val !== 0 ? `(${str})` : str}</span>;
  };

  const renderValMinus = (val) => {
    const neg = val < 0;
    const str = formatL(val);
    return <span style={{ color: neg ? '#ef4444' : 'inherit' }}>{neg ? `-${str}` : str}</span>;
  };

  const renderPct = (val, rev, isNeg = false) => {
    const neg = val < 0 || isNeg;
    const pct = formatPct(Math.abs(val), rev);
    return <span style={{ color: neg && val !== 0 ? '#ef4444' : '#64748b', fontSize: '0.85rem' }}>{neg && val !== 0 ? `-${pct}` : pct}</span>;
  };

  const contrib1 = y1.grossMargin - y1.totalCac;
  const contrib2 = y2.grossMargin - y2.totalCac;
  const contrib3 = y3.grossMargin - y3.totalCac;

  return (
    <div>
      <h3 style={{fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem'}}>Profit &amp; Loss Statement (₹ L)</h3>
      
      <div style={{overflowX: 'auto', marginBottom: '3rem'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid #e2e8f0'}}>
              <th style={{textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: '600'}}>Line Item</th>
              <th style={{textAlign: 'right', padding: '1rem', color: '#64748b', fontWeight: '600'}}>Year 1</th>
              <th style={{textAlign: 'right', padding: '1rem', color: '#64748b', fontWeight: '600'}}>%</th>
              <th style={{textAlign: 'right', padding: '1rem', color: '#64748b', fontWeight: '600'}}>Year 2</th>
              <th style={{textAlign: 'right', padding: '1rem', color: '#64748b', fontWeight: '600'}}>%</th>
              <th style={{textAlign: 'right', padding: '1rem', color: '#64748b', fontWeight: '600'}}>Year 3</th>
              <th style={{textAlign: 'right', padding: '1rem', color: '#64748b', fontWeight: '600'}}>%</th>
            </tr>
          </thead>
          <tbody style={{fontSize: '0.95rem'}}>
            <tr style={{fontWeight: '700', color: '#0d9488'}}>
              <td style={{padding: '1rem'}}>Revenue</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{formatL(y1.totalRev)}</td>
              <td style={{textAlign: 'right', padding: '1rem', color: '#64748b', fontSize: '0.85rem'}}>100%</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{formatL(y2.totalRev)}</td>
              <td style={{textAlign: 'right', padding: '1rem', color: '#64748b', fontSize: '0.85rem'}}>100%</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{formatL(y3.totalRev)}</td>
              <td style={{textAlign: 'right', padding: '1rem', color: '#64748b', fontSize: '0.85rem'}}>100%</td>
            </tr>
            <tr style={{color: '#475569'}}>
              <td style={{padding: '0.75rem 1rem 0.75rem 2rem'}}>{activeData.unit1Name || 'Solo Doctors'}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y1.rev1)}</td><td></td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y2.rev1)}</td><td></td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y3.rev1)}</td><td></td>
            </tr>
            <tr style={{color: '#475569'}}>
              <td style={{padding: '0.75rem 1rem 0.75rem 2rem'}}>{activeData.unit2Name || 'BU2'}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y1.rev2)}</td><td></td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y2.rev2)}</td><td></td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y3.rev2)}</td><td></td>
            </tr>
            <tr style={{color: '#475569'}}>
              <td style={{padding: '0.75rem 1rem 0.75rem 2rem'}}>{activeData.unit3Name || 'BU3'}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y1.rev3)}</td><td></td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y2.rev3)}</td><td></td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y3.rev3)}</td><td></td>
            </tr>
            <tr style={{fontWeight: '700', color: '#ef4444'}}>
              <td style={{padding: '1rem'}}>COGS</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y1.totalCogs > 0 ? -y1.totalCogs : y1.totalCogs)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y1.totalCogs, y1.totalRev, true)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y2.totalCogs > 0 ? -y2.totalCogs : y2.totalCogs)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y2.totalCogs, y2.totalRev, true)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y3.totalCogs > 0 ? -y3.totalCogs : y3.totalCogs)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y3.totalCogs, y3.totalRev, true)}</td>
            </tr>
            <tr style={{fontWeight: '700', borderTop: '1px solid #e2e8f0'}}>
              <td style={{padding: '1rem'}}>Gross Margin</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderVal(y1.grossMargin)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y1.grossMargin, y1.totalRev)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderVal(y2.grossMargin)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y2.grossMargin, y2.totalRev)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderVal(y3.grossMargin)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y3.grossMargin, y3.totalRev)}</td>
            </tr>
            <tr style={{fontWeight: '700', color: '#ef4444'}}>
              <td style={{padding: '1rem'}}>CAC / Marketing</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y1.totalCac > 0 ? -y1.totalCac : y1.totalCac)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y1.totalCac, y1.totalRev, true)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y2.totalCac > 0 ? -y2.totalCac : y2.totalCac)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y2.totalCac, y2.totalRev, true)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y3.totalCac > 0 ? -y3.totalCac : y3.totalCac)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y3.totalCac, y3.totalRev, true)}</td>
            </tr>
            <tr style={{fontWeight: '700', borderBottom: '1px solid #e2e8f0'}}>
              <td style={{padding: '1rem'}}>Contribution</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(contrib1)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(contrib1, y1.totalRev, contrib1 < 0)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(contrib2)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(contrib2, y2.totalRev, contrib2 < 0)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(contrib3)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(contrib3, y3.totalRev, contrib3 < 0)}</td>
            </tr>
            <tr style={{fontWeight: '700', color: '#0d9488'}}>
              <td style={{padding: '1rem'}}>G&amp;A</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y1.ga > 0 ? -y1.ga : y1.ga)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y1.ga, y1.totalRev, true)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y2.ga > 0 ? -y2.ga : y2.ga)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y2.ga, y2.totalRev, true)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y3.ga > 0 ? -y3.ga : y3.ga)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y3.ga, y3.totalRev, true)}</td>
            </tr>
            <tr style={{fontWeight: '700', background: '#f8fafc'}}>
              <td style={{padding: '1rem'}}>EBITDA</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y1.ebitda)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y1.ebitda, y1.totalRev, y1.ebitda < 0)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y2.ebitda)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y2.ebitda, y2.totalRev, y2.ebitda < 0)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y3.ebitda)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y3.ebitda, y3.totalRev, y3.ebitda < 0)}</td>
            </tr>
            <tr>
              <td style={{padding: '0.75rem 1rem 0.75rem 2rem', color: '#64748b'}}>Depreciation</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y1.depreciation)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#94a3b8'}}>0.0%</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y2.depreciation)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#94a3b8'}}>0.0%</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y3.depreciation)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#94a3b8'}}>0.0%</td>
            </tr>
            <tr style={{fontWeight: '700', background: '#f8fafc'}}>
              <td style={{padding: '1rem'}}>EBIT</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y1.ebit)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y1.ebit, y1.totalRev, y1.ebit < 0)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y2.ebit)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y2.ebit, y2.totalRev, y2.ebit < 0)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y3.ebit)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y3.ebit, y3.totalRev, y3.ebit < 0)}</td>
            </tr>
            <tr>
              <td style={{padding: '0.75rem 1rem 0.75rem 2rem', color: '#64748b'}}>Interest</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y1.interest)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#94a3b8'}}>0.0%</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y2.interest)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#94a3b8'}}>0.0%</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{formatL(y3.interest)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#94a3b8'}}>0.0%</td>
            </tr>
            <tr style={{fontWeight: '700', background: '#f8fafc'}}>
              <td style={{padding: '1rem'}}>PBT</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y1.ebit - y1.interest)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y1.ebit - y1.interest, y1.totalRev, (y1.ebit - y1.interest) < 0)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y2.ebit - y2.interest)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y2.ebit - y2.interest, y2.totalRev, (y2.ebit - y2.interest) < 0)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderValMinus(y3.ebit - y3.interest)}</td>
              <td style={{textAlign: 'right', padding: '1rem'}}>{renderPct(y3.ebit - y3.interest, y3.totalRev, (y3.ebit - y3.interest) < 0)}</td>
            </tr>
            <tr>
              <td style={{padding: '0.75rem 1rem 0.75rem 2rem', color: '#64748b'}}>Tax (25%)</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{renderVal(y1.taxes, true)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#94a3b8'}}>{y1.taxes > 0 ? '-' : ''}{formatPct(y1.taxes, y1.totalRev)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{renderVal(y2.taxes, true)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#94a3b8'}}>{y2.taxes > 0 ? '-' : ''}{formatPct(y2.taxes, y2.totalRev)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem'}}>{renderVal(y3.taxes, true)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#94a3b8'}}>{y3.taxes > 0 ? '-' : ''}{formatPct(y3.taxes, y3.totalRev)}</td>
            </tr>
            <tr style={{fontWeight: '700', background: '#ecfdf5'}}>
              <td style={{padding: '1rem', color: '#059669'}}>PAT</td>
              <td style={{textAlign: 'right', padding: '1rem', color: '#059669'}}>{renderValMinus(y1.netIncome)}</td>
              <td style={{textAlign: 'right', padding: '1rem', fontSize: '0.85rem', color: '#94a3b8'}}>{renderPct(y1.netIncome, y1.totalRev, y1.netIncome < 0)}</td>
              <td style={{textAlign: 'right', padding: '1rem', color: '#059669'}}>{renderValMinus(y2.netIncome)}</td>
              <td style={{textAlign: 'right', padding: '1rem', fontSize: '0.85rem', color: '#94a3b8'}}>{renderPct(y2.netIncome, y2.totalRev, y2.netIncome < 0)}</td>
              <td style={{textAlign: 'right', padding: '1rem', color: '#059669'}}>{renderValMinus(y3.netIncome)}</td>
              <td style={{textAlign: 'right', padding: '1rem', fontSize: '0.85rem', color: '#94a3b8'}}>{renderPct(y3.netIncome, y3.totalRev, y3.netIncome < 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 style={{fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem'}}>Business Unit Margins (₹ L)</h3>
      <div style={{overflowX: 'auto', paddingBottom: '2rem'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', border: '1px solid #e2e8f0'}}>
          <thead>
            <tr style={{borderBottom: '1px solid #e2e8f0'}}>
              <th style={{textAlign: 'left', padding: '0.75rem', color: '#64748b'}}>Business Unit</th>
              <th style={{textAlign: 'right', padding: '0.75rem', color: '#64748b'}}>Y1</th><th style={{textAlign: 'right', padding: '0.75rem', color: '#64748b'}}>%</th>
              <th style={{textAlign: 'right', padding: '0.75rem', color: '#64748b'}}>Y2</th><th style={{textAlign: 'right', padding: '0.75rem', color: '#64748b'}}>%</th>
              <th style={{textAlign: 'right', padding: '0.75rem', color: '#64748b'}}>Y3</th><th style={{textAlign: 'right', padding: '0.75rem', color: '#64748b'}}>%</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{background: '#f0fdf4', borderTop: '2px solid #bbf7d0'}}>
              <td colSpan="7" style={{padding: '0.75rem', fontWeight: '700', color: '#059669'}}>{activeData.unit1Name || 'Solo Doctors'}</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem'}}>Revenue</td>
              <td style={{textAlign: 'right'}}><span style={{color:'#0d9488'}}>{formatL(y1.rev1)}</span></td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#64748b'}}>100%</td>
              <td style={{textAlign: 'right'}}><span style={{color:'#0d9488'}}>{formatL(y2.rev1)}</span></td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#64748b'}}>100%</td>
              <td style={{textAlign: 'right'}}><span style={{color:'#0d9488'}}>{formatL(y3.rev1)}</span></td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#64748b'}}>100%</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem'}}>COGS</td>
              <td style={{textAlign: 'right'}}>{renderVal(y1.totalCogs, true)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#f97316'}}>{formatPct(y1.totalCogs, y1.rev1)}</td>
              <td style={{textAlign: 'right'}}>{renderVal(y2.totalCogs, true)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#f97316'}}>{formatPct(y2.totalCogs, y2.rev1)}</td>
              <td style={{textAlign: 'right'}}>{renderVal(y3.totalCogs, true)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#f97316'}}>{formatPct(y3.totalCogs, y3.rev1)}</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9', fontWeight: '600'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem', color: '#059669'}}>Gross Margin</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y1.rev1 - y1.totalCogs)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>{formatPct(y1.rev1 - y1.totalCogs, y1.rev1)}</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y2.rev1 - y2.totalCogs)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>{formatPct(y2.rev1 - y2.totalCogs, y2.rev1)}</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y3.rev1 - y3.totalCogs)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>{formatPct(y3.rev1 - y3.totalCogs, y3.rev1)}</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem'}}>CAC / Marketing</td>
              <td style={{textAlign: 'right'}}>{renderVal(y1.totalCac, true)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#f97316'}}>{formatPct(y1.totalCac, y1.rev1)}</td>
              <td style={{textAlign: 'right'}}>{renderVal(y2.totalCac, true)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#f97316'}}>{formatPct(y2.totalCac, y2.rev1)}</td>
              <td style={{textAlign: 'right'}}>{renderVal(y3.totalCac, true)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#f97316'}}>{formatPct(y3.totalCac, y3.rev1)}</td>
            </tr>
            <tr style={{borderBottom: '2px solid #e2e8f0', fontWeight: '700'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem'}}>Contribution</td>
              <td style={{textAlign: 'right', color: (y1.rev1-y1.totalCogs-y1.totalCac)<0?'#ef4444':'#059669'}}>{renderValMinus(y1.rev1-y1.totalCogs-y1.totalCac)}</td>
              <td style={{textAlign: 'right', fontSize: '0.82rem', color: (y1.rev1-y1.totalCogs-y1.totalCac)<0?'#ef4444':'#059669'}}>{renderPct(y1.rev1-y1.totalCogs-y1.totalCac, y1.rev1, (y1.rev1-y1.totalCogs-y1.totalCac)<0)}</td>
              <td style={{textAlign: 'right', color: (y2.rev1-y2.totalCogs-y2.totalCac)<0?'#ef4444':'#059669'}}>{renderValMinus(y2.rev1-y2.totalCogs-y2.totalCac)}</td>
              <td style={{textAlign: 'right', fontSize: '0.82rem', color: (y2.rev1-y2.totalCogs-y2.totalCac)<0?'#ef4444':'#059669'}}>{renderPct(y2.rev1-y2.totalCogs-y2.totalCac, y2.rev1, (y2.rev1-y2.totalCogs-y2.totalCac)<0)}</td>
              <td style={{textAlign: 'right', color: (y3.rev1-y3.totalCogs-y3.totalCac)<0?'#ef4444':'#059669'}}>{renderValMinus(y3.rev1-y3.totalCogs-y3.totalCac)}</td>
              <td style={{textAlign: 'right', fontSize: '0.82rem', color: (y3.rev1-y3.totalCogs-y3.totalCac)<0?'#ef4444':'#059669'}}>{renderPct(y3.rev1-y3.totalCogs-y3.totalCac, y3.rev1, (y3.rev1-y3.totalCogs-y3.totalCac)<0)}</td>
            </tr>
            <tr style={{background: '#faf5ff', borderTop: '2px solid #e9d5ff'}}>
              <td colSpan="7" style={{padding: '0.75rem', fontWeight: '700', color: '#7c3aed'}}>{activeData.unit2Name || 'BU2'}</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem'}}>Revenue</td>
              <td style={{textAlign: 'right', color:'#0d9488'}}>{formatL(y1.rev2)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#64748b'}}>100%</td>
              <td style={{textAlign: 'right', color:'#0d9488'}}>{formatL(y2.rev2)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#64748b'}}>100%</td>
              <td style={{textAlign: 'right', color:'#0d9488'}}>{formatL(y3.rev2)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#64748b'}}>100%</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem'}}>COGS</td>
              <td style={{textAlign: 'right', color: '#ef4444'}}>(0.00 L)</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8'}}>0%</td>
              <td style={{textAlign: 'right', color: '#ef4444'}}>(0.00 L)</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8'}}>0%</td>
              <td style={{textAlign: 'right', color: '#ef4444'}}>(0.00 L)</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8'}}>0%</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9', fontWeight: '600'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem', color: '#059669'}}>Gross Margin</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y1.rev2)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>0%</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y2.rev2)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>0%</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y3.rev2)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>0%</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem'}}>CAC / Marketing</td>
              <td style={{textAlign: 'right', color: '#ef4444'}}>(0.00 L)</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8'}}>0%</td>
              <td style={{textAlign: 'right', color: '#ef4444'}}>(0.00 L)</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8'}}>0%</td>
              <td style={{textAlign: 'right', color: '#ef4444'}}>(0.00 L)</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8'}}>0%</td>
            </tr>
            <tr style={{borderBottom: '2px solid #e2e8f0', fontWeight: '700'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem'}}>Contribution</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y1.rev2)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>0%</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y2.rev2)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>0%</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y3.rev2)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>0%</td>
            </tr>
            <tr style={{background: '#fffbeb', borderTop: '2px solid #fde68a'}}>
              <td colSpan="7" style={{padding: '0.75rem', fontWeight: '700', color: '#d97706'}}>{activeData.unit3Name || 'BU3'}</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem'}}>Revenue</td>
              <td style={{textAlign: 'right', color:'#0d9488'}}>{formatL(y1.rev3)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#64748b'}}>100%</td>
              <td style={{textAlign: 'right', color:'#0d9488'}}>{formatL(y2.rev3)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#64748b'}}>100%</td>
              <td style={{textAlign: 'right', color:'#0d9488'}}>{formatL(y3.rev3)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#64748b'}}>100%</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem'}}>COGS</td>
              <td style={{textAlign: 'right', color: '#ef4444'}}>(0.00 L)</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8'}}>0%</td>
              <td style={{textAlign: 'right', color: '#ef4444'}}>(0.00 L)</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8'}}>0%</td>
              <td style={{textAlign: 'right', color: '#ef4444'}}>(0.00 L)</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8'}}>0%</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9', fontWeight: '600'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem', color: '#059669'}}>Gross Margin</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y1.rev3)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>0%</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y2.rev3)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>0%</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y3.rev3)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>0%</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem'}}>CAC / Marketing</td>
              <td style={{textAlign: 'right', color: '#ef4444'}}>(0.00 L)</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8'}}>0%</td>
              <td style={{textAlign: 'right', color: '#ef4444'}}>(0.00 L)</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8'}}>0%</td>
              <td style={{textAlign: 'right', color: '#ef4444'}}>(0.00 L)</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8'}}>0%</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9', fontWeight: '700'}}>
              <td style={{padding: '0.5rem 1rem 0.5rem 2rem'}}>Contribution</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y1.rev3)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>0%</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y2.rev3)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>0%</td>
              <td style={{textAlign: 'right', color: '#059669'}}>{formatL(y3.rev3)}</td><td style={{textAlign: 'right', fontSize: '0.82rem', color: '#059669'}}>0%</td>
            </tr>
            <tr style={{background: '#f8fafc', borderTop: '2px solid #6366f1', fontWeight: '700'}}>
              <td style={{padding: '0.75rem 1rem', color: '#4f46e5'}}>Total Contribution</td>
              <td style={{textAlign: 'right', padding: '0.75rem', color: contrib1 < 0 ? '#ef4444' : '#059669'}}>{renderValMinus(contrib1)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem', fontSize: '0.82rem', color: contrib1 < 0 ? '#ef4444' : '#059669'}}>{renderPct(contrib1, y1.totalRev, contrib1 < 0)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem', color: contrib2 < 0 ? '#ef4444' : '#059669'}}>{renderValMinus(contrib2)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem', fontSize: '0.82rem', color: contrib2 < 0 ? '#ef4444' : '#059669'}}>{renderPct(contrib2, y2.totalRev, contrib2 < 0)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem', color: contrib3 < 0 ? '#ef4444' : '#059669'}}>{renderValMinus(contrib3)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem', fontSize: '0.82rem', color: contrib3 < 0 ? '#ef4444' : '#059669'}}>{renderPct(contrib3, y3.totalRev, contrib3 < 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem 2rem'}}>
        <div style={{fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem'}}>✅ Path to Profitability</div>
        <div style={{color: '#059669', fontSize: '1rem'}}>
          Year 3 projects a PAT of ₹{formatL(y3.netIncome)} ({y3.totalRev > 0 ? ((y3.netIncome / y3.totalRev) * 100).toFixed(1) : '0.0'}% net margin).
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLoss;
