import { useModel } from '../../context/ModelContext';

const ProfitAndLoss = () => {
  const { calculateFinancials, activeData } = useModel();
  
  const y1 = calculateFinancials('y1');
  const y2 = calculateFinancials('y2');
  const y3 = calculateFinancials('y3');

  const formatL = (val) => {
    return (Math.abs(val) / 100000).toFixed(2) + ' L';
  };

  const formatPct = (val, rev) => {
    if (!rev || rev === 0) return '0%';
    return ((val / rev) * 100).toFixed(1) + '%';
  };

  const renderVal = (val, isNegativeExpected = false, showMinus = true) => {
    const isActuallyNegative = isNegativeExpected ? true : val < 0;
    const str = formatL(val);
    const finalStr = isActuallyNegative && val !== 0 ? (showMinus ? `-${str}` : `(${str})`) : str;
    return <span className={isActuallyNegative && val !== 0 ? 'text-red' : ''}>{finalStr}</span>;
  };

  const renderPct = (val, rev, isNegativeExpected = false) => {
    const isActuallyNegative = isNegativeExpected ? true : val < 0;
    const pct = formatPct(val, rev);
    const finalStr = isActuallyNegative && val !== 0 ? `-${pct}` : pct;
    return <span className={`text-gray ${isActuallyNegative && val !== 0 ? 'text-red' : ''}`}>{finalStr}</span>;
  };

  // derived contribution
  const contrib1 = y1.grossMargin - y1.totalCac;
  const contrib2 = y2.grossMargin - y2.totalCac;
  const contrib3 = y3.grossMargin - y3.totalCac;

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3 style={{fontSize: '1.4rem'}}>Profit &amp; Loss Statement (₹ L)</h3>
      </div>
      
      <div style={{overflowX: 'auto', marginBottom: '3rem'}}>
        <table className="data-table">
          <thead>
            <tr className="table-header-group">
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>Line Item</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>Year 1</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>%</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>Year 2</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>%</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>Year 3</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>%</th>
            </tr>
          </thead>
          <tbody>
            <tr className="row-header">
              <td className="text-teal">Revenue</td>
              <td className="text-teal">{formatL(y1.totalRev)}</td>
              <td className="text-gray">100%</td>
              <td className="text-teal">{formatL(y2.totalRev)}</td>
              <td className="text-gray">100%</td>
              <td className="text-teal">{formatL(y3.totalRev)}</td>
              <td className="text-gray">100%</td>
            </tr>
            <tr className="row-sub">
              <td>{activeData.unit1Name || 'Solo Doctors'}</td>
              <td>{formatL(y1.rev1)}</td><td></td>
              <td>{formatL(y2.rev1)}</td><td></td>
              <td>{formatL(y3.rev1)}</td><td></td>
            </tr>
            <tr className="row-sub">
              <td>{activeData.unit2Name || 'BU2'}</td>
              <td>{formatL(y1.rev2)}</td><td></td>
              <td>{formatL(y2.rev2)}</td><td></td>
              <td>{formatL(y3.rev2)}</td><td></td>
            </tr>
            <tr className="row-sub">
              <td>{activeData.unit3Name || 'BU3'}</td>
              <td>{formatL(y1.rev3)}</td><td></td>
              <td>{formatL(y2.rev3)}</td><td></td>
              <td>{formatL(y3.rev3)}</td><td></td>
            </tr>
            <tr className="row-header">
              <td className="text-red">COGS</td>
              <td>{renderVal(y1.totalCogs, true)}</td>
              <td>{renderPct(y1.totalCogs, y1.totalRev, true)}</td>
              <td>{renderVal(y2.totalCogs, true)}</td>
              <td>{renderPct(y2.totalCogs, y2.totalRev, true)}</td>
              <td>{renderVal(y3.totalCogs, true)}</td>
              <td>{renderPct(y3.totalCogs, y3.totalRev, true)}</td>
            </tr>
            <tr className="row-header">
              <td>Gross Margin</td>
              <td>{renderVal(y1.grossMargin)}</td>
              <td>{renderPct(y1.grossMargin, y1.totalRev)}</td>
              <td>{renderVal(y2.grossMargin)}</td>
              <td>{renderPct(y2.grossMargin, y2.totalRev)}</td>
              <td>{renderVal(y3.grossMargin)}</td>
              <td>{renderPct(y3.grossMargin, y3.totalRev)}</td>
            </tr>
            <tr className="row-header">
              <td className="text-red">CAC / Marketing</td>
              <td>{renderVal(y1.totalCac, true)}</td>
              <td>{renderPct(y1.totalCac, y1.totalRev, true)}</td>
              <td>{renderVal(y2.totalCac, true)}</td>
              <td>{renderPct(y2.totalCac, y2.totalRev, true)}</td>
              <td>{renderVal(y3.totalCac, true)}</td>
              <td>{renderPct(y3.totalCac, y3.totalRev, true)}</td>
            </tr>
            <tr className="row-header">
              <td>Contribution</td>
              <td>{renderVal(contrib1)}</td>
              <td>{renderPct(contrib1, y1.totalRev, contrib1 < 0)}</td>
              <td>{renderVal(contrib2)}</td>
              <td>{renderPct(contrib2, y2.totalRev, contrib2 < 0)}</td>
              <td>{renderVal(contrib3)}</td>
              <td>{renderPct(contrib3, y3.totalRev, contrib3 < 0)}</td>
            </tr>
            <tr className="row-header">
              <td className="text-teal">G&A</td>
              <td>{renderVal(y1.ga, true)}</td>
              <td>{renderPct(y1.ga, y1.totalRev, true)}</td>
              <td>{renderVal(y2.ga, true)}</td>
              <td>{renderPct(y2.ga, y2.totalRev, true)}</td>
              <td>{renderVal(y3.ga, true)}</td>
              <td>{renderPct(y3.ga, y3.totalRev, true)}</td>
            </tr>
            <tr className="row-header row-bg-gray">
              <td>EBITDA</td>
              <td>{renderVal(y1.ebitda)}</td>
              <td>{renderPct(y1.ebitda, y1.totalRev, y1.ebitda < 0)}</td>
              <td>{renderVal(y2.ebitda)}</td>
              <td>{renderPct(y2.ebitda, y2.totalRev, y2.ebitda < 0)}</td>
              <td>{renderVal(y3.ebitda)}</td>
              <td>{renderPct(y3.ebitda, y3.totalRev, y3.ebitda < 0)}</td>
            </tr>
            <tr className="row-sub">
              <td style={{paddingLeft: '1rem'}}>Depreciation</td>
              <td>{formatL(y1.depreciation)}</td><td>{formatPct(y1.depreciation, y1.totalRev)}</td>
              <td>{formatL(y2.depreciation)}</td><td>{formatPct(y2.depreciation, y2.totalRev)}</td>
              <td>{formatL(y3.depreciation)}</td><td>{formatPct(y3.depreciation, y3.totalRev)}</td>
            </tr>
            <tr className="row-header row-bg-gray">
              <td>EBIT</td>
              <td>{renderVal(y1.ebit)}</td>
              <td>{renderPct(y1.ebit, y1.totalRev, y1.ebit < 0)}</td>
              <td>{renderVal(y2.ebit)}</td>
              <td>{renderPct(y2.ebit, y2.totalRev, y2.ebit < 0)}</td>
              <td>{renderVal(y3.ebit)}</td>
              <td>{renderPct(y3.ebit, y3.totalRev, y3.ebit < 0)}</td>
            </tr>
            <tr className="row-sub">
              <td style={{paddingLeft: '1rem'}}>Interest</td>
              <td>{formatL(y1.interest)}</td><td>{formatPct(y1.interest, y1.totalRev)}</td>
              <td>{formatL(y2.interest)}</td><td>{formatPct(y2.interest, y2.totalRev)}</td>
              <td>{formatL(y3.interest)}</td><td>{formatPct(y3.interest, y3.totalRev)}</td>
            </tr>
            <tr className="row-header row-bg-gray">
              <td>PBT</td>
              <td>{renderVal(y1.ebit - y1.interest)}</td>
              <td>{renderPct(y1.ebit - y1.interest, y1.totalRev, (y1.ebit - y1.interest) < 0)}</td>
              <td>{renderVal(y2.ebit - y2.interest)}</td>
              <td>{renderPct(y2.ebit - y2.interest, y2.totalRev, (y2.ebit - y2.interest) < 0)}</td>
              <td>{renderVal(y3.ebit - y3.interest)}</td>
              <td>{renderPct(y3.ebit - y3.interest, y3.totalRev, (y3.ebit - y3.interest) < 0)}</td>
            </tr>
            <tr className="row-header bg-light-green">
              <td className="text-green">PAT</td>
              <td className="text-green" style={{fontWeight: '700'}}>{renderVal(y1.netIncome)}</td>
              <td className="text-gray">{renderPct(y1.netIncome, y1.totalRev, y1.netIncome < 0)}</td>
              <td className="text-green" style={{fontWeight: '700'}}>{renderVal(y2.netIncome)}</td>
              <td className="text-gray">{renderPct(y2.netIncome, y2.totalRev, y2.netIncome < 0)}</td>
              <td className="text-green" style={{fontWeight: '700'}}>{renderVal(y3.netIncome)}</td>
              <td className="text-gray">{renderPct(y3.netIncome, y3.totalRev, y3.netIncome < 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 style={{fontSize: '1.2rem', marginBottom: '1rem'}}>Business Unit Margins (₹ L)</h3>
      <div style={{overflowX: 'auto', marginBottom: '2rem'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{background: 'white', color: '#64748b', fontSize: '0.9rem', borderBottom: '2px solid #e2e8f0'}}>Business Unit</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '0.9rem', borderBottom: '2px solid #e2e8f0'}}>Y1</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '0.9rem', borderBottom: '2px solid #e2e8f0'}}>%</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '0.9rem', borderBottom: '2px solid #e2e8f0'}}>Y2</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '0.9rem', borderBottom: '2px solid #e2e8f0'}}>%</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '0.9rem', borderBottom: '2px solid #e2e8f0'}}>Y3</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '0.9rem', borderBottom: '2px solid #e2e8f0'}}>%</th>
            </tr>
          </thead>
          <tbody>
            {/* Solo Doctors */}
            <tr className="bg-light-green border-btm">
              <th colSpan="7" className="text-green" style={{padding: '0.5rem 1rem'}}>{activeData.unit1Name || 'Solo Doctors'}</th>
            </tr>
            <tr className="row-sub">
              <td style={{paddingLeft:'2rem'}}>Revenue</td>
              <td className="text-teal">{formatL(y1.rev1)}</td><td className="text-gray">100%</td>
              <td className="text-teal">{formatL(y2.rev1)}</td><td className="text-gray">100%</td>
              <td className="text-teal">{formatL(y3.rev1)}</td><td className="text-gray">100%</td>
            </tr>
            <tr className="row-sub">
              <td style={{paddingLeft:'2rem'}}>COGS</td>
              {/* Note: BU Margins screenshot uses parentheses for negatives (8.93 L) */}
              <td>{renderVal(y1.totalCogs, true, false)}</td><td>{renderPct(y1.totalCogs, y1.rev1, false)}</td>
              <td>{renderVal(y2.totalCogs, true, false)}</td><td>{renderPct(y2.totalCogs, y2.rev1, false)}</td>
              <td>{renderVal(y3.totalCogs, true, false)}</td><td>{renderPct(y3.totalCogs, y3.rev1, false)}</td>
            </tr>
            <tr className="row-header">
              <td className="text-green" style={{paddingLeft:'2rem'}}>Gross Margin</td>
              <td className="text-green">{formatL(y1.rev1 - y1.totalCogs)}</td><td className="text-green">{formatPct(y1.rev1 - y1.totalCogs, y1.rev1)}</td>
              <td className="text-green">{formatL(y2.rev1 - y2.totalCogs)}</td><td className="text-green">{formatPct(y2.rev1 - y2.totalCogs, y2.rev1)}</td>
              <td className="text-green">{formatL(y3.rev1 - y3.totalCogs)}</td><td className="text-green">{formatPct(y3.rev1 - y3.totalCogs, y3.rev1)}</td>
            </tr>
            <tr className="row-sub">
              <td style={{paddingLeft:'2rem'}}>CAC / Marketing</td>
              <td>{renderVal(y1.totalCac, true, false)}</td><td>{renderPct(y1.totalCac, y1.rev1, false)}</td>
              <td>{renderVal(y2.totalCac, true, false)}</td><td>{renderPct(y2.totalCac, y2.rev1, false)}</td>
              <td>{renderVal(y3.totalCac, true, false)}</td><td>{renderPct(y3.totalCac, y3.rev1, false)}</td>
            </tr>
            <tr className="row-header">
              <td style={{paddingLeft:'2rem', color: '#0f172a'}}>Contribution</td>
              <td className={y1.rev1 - y1.totalCogs - y1.totalCac < 0 ? 'text-red' : 'text-green'}>{renderVal(y1.rev1 - y1.totalCogs - y1.totalCac, false, true)}</td>
              <td className={y1.rev1 - y1.totalCogs - y1.totalCac < 0 ? 'text-red' : 'text-green'}>{renderPct(y1.rev1 - y1.totalCogs - y1.totalCac, y1.rev1, false)}</td>
              <td className={y2.rev1 - y2.totalCogs - y2.totalCac < 0 ? 'text-red' : 'text-green'}>{renderVal(y2.rev1 - y2.totalCogs - y2.totalCac, false, true)}</td>
              <td className={y2.rev1 - y2.totalCogs - y2.totalCac < 0 ? 'text-red' : 'text-green'}>{renderPct(y2.rev1 - y2.totalCogs - y2.totalCac, y2.rev1, false)}</td>
              <td className={y3.rev1 - y3.totalCogs - y3.totalCac < 0 ? 'text-red' : 'text-green'}>{renderVal(y3.rev1 - y3.totalCogs - y3.totalCac, false, true)}</td>
              <td className={y3.rev1 - y3.totalCogs - y3.totalCac < 0 ? 'text-red' : 'text-green'}>{renderPct(y3.rev1 - y3.totalCogs - y3.totalCac, y3.rev1, false)}</td>
            </tr>
            
            {/* BU 2 */}
            <tr style={{backgroundColor: '#faf5ff'}}>
              <th colSpan="7" style={{color: '#9333ea', padding: '0.5rem 1rem'}}>{activeData.unit2Name || 'BU2'}</th>
            </tr>
            <tr className="row-sub">
              <td style={{paddingLeft:'2rem'}}>Revenue</td>
              <td className="text-teal">{formatL(y1.rev2)}</td><td className="text-gray">100%</td>
              <td className="text-teal">{formatL(y2.rev2)}</td><td className="text-gray">100%</td>
              <td className="text-teal">{formatL(y3.rev2)}</td><td className="text-gray">100%</td>
            </tr>
            <tr className="row-sub">
              <td style={{paddingLeft:'2rem'}}>COGS</td>
              <td>{renderVal(0, true, false)}</td><td>0%</td>
              <td>{renderVal(0, true, false)}</td><td>0%</td>
              <td>{renderVal(0, true, false)}</td><td>0%</td>
            </tr>
            <tr className="row-header">
              <td className="text-green" style={{paddingLeft:'2rem'}}>Gross Margin</td>
              <td className="text-green">{formatL(y1.rev2 - 0)}</td><td className="text-green">{formatPct(y1.rev2 - 0, y1.rev2)}</td>
              <td className="text-green">{formatL(y2.rev2 - 0)}</td><td className="text-green">{formatPct(y2.rev2 - 0, y2.rev2)}</td>
              <td className="text-green">{formatL(y3.rev2 - 0)}</td><td className="text-green">{formatPct(y3.rev2 - 0, y3.rev2)}</td>
            </tr>
            <tr className="row-sub">
              <td style={{paddingLeft:'2rem'}}>CAC / Marketing</td>
              <td>{renderVal(0, true, false)}</td><td>0%</td>
              <td>{renderVal(0, true, false)}</td><td>0%</td>
              <td>{renderVal(0, true, false)}</td><td>0%</td>
            </tr>
            <tr className="row-header">
              <td style={{paddingLeft:'2rem', color: '#0f172a'}}>Contribution</td>
              <td className="text-green">{renderVal(y1.rev2 - 0, false, true)}</td><td className="text-green">0%</td>
              <td className="text-green">{renderVal(y2.rev2 - 0, false, true)}</td><td className="text-green">0%</td>
              <td className="text-green">{renderVal(y3.rev2 - 0, false, true)}</td><td className="text-green">0%</td>
            </tr>

            {/* Total Contribution */}
            <tr className="row-header" style={{backgroundColor: '#f8fafc', borderTop: '2px solid #e2e8f0'}}>
              <td style={{color: '#4f46e5'}}>Total Contribution</td>
              <td className={contrib1 < 0 ? 'text-red' : 'text-green'}>{renderVal(contrib1)}</td>
              <td className={contrib1 < 0 ? 'text-red' : 'text-green'}>{renderPct(contrib1, y1.totalRev, contrib1 < 0)}</td>
              <td className={contrib2 < 0 ? 'text-red' : 'text-green'}>{renderVal(contrib2)}</td>
              <td className={contrib2 < 0 ? 'text-red' : 'text-green'}>{renderPct(contrib2, y2.totalRev, contrib2 < 0)}</td>
              <td className={contrib3 < 0 ? 'text-red' : 'text-green'}>{renderVal(contrib3)}</td>
              <td className={contrib3 < 0 ? 'text-red' : 'text-green'}>{renderPct(contrib3, y3.totalRev, contrib3 < 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitAndLoss;
