import { useModel } from '../../context/ModelContext';

const BalanceSheet = () => {
  const { calculateFinancials, activeData } = useModel();

  const calculateBS = (yearKey) => {
    const fin = calculateFinancials(yearKey);
    const ar = (fin.totalRev / 365) * (activeData.receivableDays?.bu1?.[yearKey] || 0);

    const capex = (activeData.investmentItems || []).reduce((sum, item) => sum + ((item[`${yearKey}Units`] || 0) * (item[`${yearKey}Rate`] || 0)), 0);
    const dep = fin.depreciation;
    const netFixed = capex - dep;
    
    const equityRaised = activeData.funding?.equityRaised?.[yearKey] || 0;
    const debtRaised = activeData.funding?.debtRaised?.[yearKey] || 0;
    const cash = equityRaised + debtRaised + fin.netIncome;

    const assets = cash + ar + netFixed;

    const ap = (fin.totalCogs / 365) * (activeData.payableDays?.bu1?.[yearKey] || 0);
    const debt = debtRaised;
    const equity = equityRaised + fin.netIncome; 
    
    const liabilitiesAndEquity = ap + debt + equity;

    return { cash, ar, capex, dep, netFixed, assets, ap, debt, equity, liabilitiesAndEquity };
  };

  const y1 = calculateBS('y1');
  const y2 = calculateBS('y2');
  const y3 = calculateBS('y3');

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
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3 style={{fontSize: '1.4rem'}}>🏦 Balance Sheet (₹ L)</h3>
      </div>
      <p style={{marginBottom: '2rem'}}>New company — no opening balances. All figures as at year-end.</p>
      
      <div style={{overflowX: 'auto'}}>
        <table className="data-table">
          <thead>
            <tr className="table-header-group">
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>Particulars</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>Year 1</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>Year 2</th>
              <th style={{background: 'white', color: '#64748b', fontSize: '1rem', borderBottom: '2px solid #e2e8f0'}}>Year 3</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-light-green">
              <td colSpan="4" className="text-green" style={{fontWeight: '700', padding: '0.75rem 1rem'}}>ASSETS</td>
            </tr>
            <tr className="row-header"><td colSpan="4">A. Non-Current Assets</td></tr>
            <tr className="row-sub">
              <td>Gross Block (Cumulative Capex)</td>
              <td>{renderVal(y1.capex)}</td>
              <td>{renderVal(y2.capex)}</td>
              <td>{renderVal(y3.capex)}</td>
            </tr>
            <tr className="row-sub">
              <td>Less: Accumulated Depreciation</td>
              <td>{renderVal(y1.dep, true)}</td>
              <td>{renderVal(y2.dep, true)}</td>
              <td>{renderVal(y3.dep, true)}</td>
            </tr>
            <tr className="row-header">
              <td>Net Fixed Assets</td>
              <td>{renderVal(y1.netFixed)}</td>
              <td>{renderVal(y2.netFixed)}</td>
              <td>{renderVal(y3.netFixed)}</td>
            </tr>
            <tr className="row-header"><td colSpan="4">B. Current Assets</td></tr>
            <tr className="row-sub">
              <td>Cash & Bank Balance</td>
              <td>{renderVal(y1.cash)}</td>
              <td>{renderVal(y2.cash)}</td>
              <td>{renderVal(y3.cash)}</td>
            </tr>
            <tr className="row-sub">
              <td>Accounts Receivable</td>
              <td>{renderVal(y1.ar)}</td>
              <td>{renderVal(y2.ar)}</td>
              <td>{renderVal(y3.ar)}</td>
            </tr>
            <tr className="row-header bg-light-green">
              <td className="text-green">Total Assets</td>
              <td className="text-green">{renderVal(y1.assets)}</td>
              <td className="text-green">{renderVal(y2.assets)}</td>
              <td className="text-green">{renderVal(y3.assets)}</td>
            </tr>

            <tr className="bg-light-green border-btm">
              <td colSpan="4" className="text-green" style={{fontWeight: '700', padding: '0.75rem 1rem'}}>EQUITY & LIABILITIES</td>
            </tr>
            <tr className="row-header"><td colSpan="4">A. Equity & Reserves</td></tr>
            <tr className="row-sub">
              <td>Share Capital</td>
              <td>{renderVal(y1.equity - y1.netIncome)}</td>
              <td>{renderVal(y2.equity - y2.netIncome)}</td>
              <td>{renderVal(y3.equity - y3.netIncome)}</td>
            </tr>
            <tr className="row-sub">
              <td>Retained Earnings</td>
              <td>{renderVal(y1.netIncome)}</td>
              <td>{renderVal(y2.netIncome)}</td>
              <td>{renderVal(y3.netIncome)}</td>
            </tr>
            <tr className="row-header"><td colSpan="4">B. Non-Current Liabilities</td></tr>
            <tr className="row-sub">
              <td>Long-term Borrowings</td>
              <td>{renderVal(y1.debt)}</td>
              <td>{renderVal(y2.debt)}</td>
              <td>{renderVal(y3.debt)}</td>
            </tr>
            <tr className="row-header"><td colSpan="4">C. Current Liabilities</td></tr>
            <tr className="row-sub">
              <td>Trade Payables</td>
              <td>{renderVal(y1.ap)}</td>
              <td>{renderVal(y2.ap)}</td>
              <td>{renderVal(y3.ap)}</td>
            </tr>
            <tr className="row-header bg-light-green">
              <td className="text-green">Total Equity & Liabilities</td>
              <td className="text-green">{renderVal(y1.liabilitiesAndEquity)}</td>
              <td className="text-green">{renderVal(y2.liabilitiesAndEquity)}</td>
              <td className="text-green">{renderVal(y3.liabilitiesAndEquity)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BalanceSheet;
