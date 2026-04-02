import { useModel } from '../../context/ModelContext';

const CashFlow = () => {
  const { calculateFinancials, activeData } = useModel();

  const calculateCF = (yearKey) => {
    const fin = calculateFinancials(yearKey);
    // Rough approximations based on the BS vars
    const prevAr = yearKey === 'y1' ? 0 : (calculateFinancials('y' + (parseInt(yearKey[1]) - 1)).totalRev / 365) * (activeData.receivableDays?.bu1?.[yearKey] || 0);
    const ar = (fin.totalRev / 365) * (activeData.receivableDays?.bu1?.[yearKey] || 0);
    const deltaAr = ar - prevAr;

    const prevAp = yearKey === 'y1' ? 0 : (calculateFinancials('y' + (parseInt(yearKey[1]) - 1)).totalCogs / 365) * (activeData.payableDays?.bu1?.[yearKey] || 0);
    const ap = (fin.totalCogs / 365) * (activeData.payableDays?.bu1?.[yearKey] || 0);
    const deltaAp = ap - prevAp;

    const capex = (activeData.investmentItems || []).reduce((sum, item) => sum + ((item[`${yearKey}Units`] || 0) * (item[`${yearKey}Rate`] || 0)), 0);
    
    const equityRaised = activeData.funding?.equityRaised?.[yearKey] || 0;
    const debtRaised = activeData.funding?.debtRaised?.[yearKey] || 0;

    const opsCash = fin.netIncome + fin.depreciation - deltaAr + deltaAp;
    const invCash = -capex;
    const finCash = equityRaised + debtRaised;
    
    return { 
      netIncome: fin.netIncome,
      dep: fin.depreciation,
      deltaAr,
      deltaAp,
      opsCash,
      capex,
      invCash,
      equityRaised,
      debtRaised,
      finCash,
      netCash: opsCash + invCash + finCash
    };
  };

  const y1 = calculateCF('y1');
  const y2 = calculateCF('y2');
  const y3 = calculateCF('y3');

  const formatL = (val) => {
    return (Math.abs(val) / 100000).toFixed(2) + ' L';
  };

  const renderVal = (val, isNegativeExpected = false) => {
    const isActuallyNegative = isNegativeExpected ? true : val < 0;
    const str = formatL(val);
    const finalStr = isActuallyNegative && val !== 0 ? `-${str}` : str;
    return <span className={isActuallyNegative && val !== 0 ? 'text-red' : ''}>{finalStr}</span>;
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h3 style={{fontSize: '1.4rem'}}>💸 Cash Flow Statement (₹ L)</h3>
      </div>
      
      <div style={{overflowX: 'auto'}}>
        <table className="data-table">
          <thead>
            <tr className="table-header-group">
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>Line Item</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>Year 1</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>Year 2</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>Year 3</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{backgroundColor: '#e0e7ff'}}>
              <td colSpan="4" style={{fontWeight: '700', color: '#3730a3', padding: '0.75rem 1rem'}}>Operating Activities</td>
            </tr>
            <tr className="row-sub">
              <td>PAT (from P&L)</td>
              <td>{renderVal(y1.netIncome)}</td>
              <td>{renderVal(y2.netIncome)}</td>
              <td>{renderVal(y3.netIncome)}</td>
            </tr>
            <tr className="row-sub">
              <td>+ Depreciation</td>
              <td>{renderVal(y1.dep)}</td>
              <td>{renderVal(y2.dep)}</td>
              <td>{renderVal(y3.dep)}</td>
            </tr>
            <tr className="row-sub">
              <td>- Δ Receivables</td>
              <td>{renderVal(y1.deltaAr, true)}</td>
              <td>{renderVal(y2.deltaAr, true)}</td>
              <td>{renderVal(y3.deltaAr, true)}</td>
            </tr>
            <tr className="row-sub">
              <td>+ Δ Payables</td>
              <td>{renderVal(y1.deltaAp)}</td>
              <td>{renderVal(y2.deltaAp)}</td>
              <td>{renderVal(y3.deltaAp)}</td>
            </tr>
            <tr className="row-header" style={{backgroundColor: '#dbeafe'}}>
              <td style={{color: '#1e3a8a'}}>Cash from Operations</td>
              <td style={{color: '#1e3a8a'}}>{renderVal(y1.opsCash)}</td>
              <td style={{color: '#1e3a8a'}}>{renderVal(y2.opsCash)}</td>
              <td style={{color: '#1e3a8a'}}>{renderVal(y3.opsCash)}</td>
            </tr>

            <tr style={{backgroundColor: '#ffedd5', marginTop: '1rem'}}>
              <td colSpan="4" style={{fontWeight: '700', color: '#9a3412', padding: '0.75rem 1rem'}}>Investing Activities</td>
            </tr>
            <tr className="row-sub">
              <td>- Capex</td>
              <td>{renderVal(y1.capex, true)}</td>
              <td>{renderVal(y2.capex, true)}</td>
              <td>{renderVal(y3.capex, true)}</td>
            </tr>
            <tr className="row-header" style={{backgroundColor: '#ffedd5'}}>
              <td style={{color: '#7c2d12'}}>Cash from Investing</td>
              <td style={{color: '#7c2d12'}}>{renderVal(y1.invCash)}</td>
              <td style={{color: '#7c2d12'}}>{renderVal(y2.invCash)}</td>
              <td style={{color: '#7c2d12'}}>{renderVal(y3.invCash)}</td>
            </tr>

            <tr style={{backgroundColor: '#f3f4f6', marginTop: '1rem'}}>
              <td colSpan="4" style={{fontWeight: '700', color: '#374151', padding: '0.75rem 1rem'}}>Financing Activities</td>
            </tr>
            <tr className="row-sub">
              <td>+ Equity Raised</td>
              <td>{renderVal(y1.equityRaised)}</td>
              <td>{renderVal(y2.equityRaised)}</td>
              <td>{renderVal(y3.equityRaised)}</td>
            </tr>
            <tr className="row-sub">
              <td>+ Debt Borrowed</td>
              <td>{renderVal(y1.debtRaised)}</td>
              <td>{renderVal(y2.debtRaised)}</td>
              <td>{renderVal(y3.debtRaised)}</td>
            </tr>
            <tr className="row-header" style={{backgroundColor: '#e5e7eb'}}>
              <td style={{color: '#1f2937'}}>Cash from Financing</td>
              <td style={{color: '#1f2937'}}>{renderVal(y1.finCash)}</td>
              <td style={{color: '#1f2937'}}>{renderVal(y2.finCash)}</td>
              <td style={{color: '#1f2937'}}>{renderVal(y3.finCash)}</td>
            </tr>

            <tr className="row-header bg-light-green border-btm">
              <td className="text-green">Net Cash Flow</td>
              <td className="text-green">{renderVal(y1.netCash)}</td>
              <td className="text-green">{renderVal(y2.netCash)}</td>
              <td className="text-green">{renderVal(y3.netCash)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashFlow;
