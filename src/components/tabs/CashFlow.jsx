import { useModel } from '../../context/ModelContext';

const CashFlow = () => {
  const { calculateFinancials, activeData } = useModel();

  const formatL = (val) => (Math.abs(val) / 100000).toFixed(2) + ' L';

  const renderVal = (val) => {
    const neg = val < 0;
    return <span style={{color: neg ? '#ef4444' : 'inherit'}}>{neg ? `-${formatL(val)}` : formatL(val)}</span>;
  };

  const calcCF = (yk, prevYk) => {
    const fin = calculateFinancials(yk);
    const prevFin = prevYk ? calculateFinancials(prevYk) : null;

    const prevAr = prevFin ? (prevFin.totalRev / 365) * (activeData.receivableDays?.bu1?.[prevYk] || 0) : 0;
    const ar = (fin.totalRev / 365) * (activeData.receivableDays?.bu1?.[yk] || 0);
    const deltaAr = ar - prevAr;

    const prevAp = prevFin ? (prevFin.totalCogs / 365) * (activeData.payableDays?.bu1?.[prevYk] || 0) : 0;
    const ap = (fin.totalCogs / 365) * (activeData.payableDays?.bu1?.[yk] || 0);
    const deltaAp = ap - prevAp;

    const capex = (activeData.investmentItems || []).reduce((s, item) =>
      s + ((item[`${yk}Units`] || 0) * (item[`${yk}Rate`] || 0)), 0);

    const equityRaised = activeData.funding?.equityRaised?.[yk] || 0;
    const debtRaised = activeData.funding?.debtRaised?.[yk] || 0;
    const debtRepayment = activeData.funding?.debtRepayment?.[yk] || 0;

    const opsCash = fin.netIncome + fin.depreciation - deltaAr + deltaAp;
    const invCash = -capex;
    const finCash = equityRaised + debtRaised - debtRepayment;
    const netCash = opsCash + invCash + finCash;

    return { netIncome: fin.netIncome, dep: fin.depreciation, deltaAr, deltaAp, opsCash, capex, invCash, equityRaised, debtRaised, debtRepayment, finCash, netCash };
  };

  const y1cf = calcCF('y1', null);
  const y2cf = calcCF('y2', 'y1');
  const y3cf = calcCF('y3', 'y2');

  const openY1 = 0;
  const closeY1 = openY1 + y1cf.netCash;
  const openY2 = closeY1;
  const closeY2 = openY2 + y2cf.netCash;
  const openY3 = closeY2;
  const closeY3 = openY3 + y3cf.netCash;

  const equityTotal = (activeData.funding?.equityRaised?.y1 || 0) + (activeData.funding?.equityRaised?.y2 || 0) + (activeData.funding?.equityRaised?.y3 || 0);
  const debtTotal = (activeData.funding?.debtRaised?.y1 || 0) + (activeData.funding?.debtRaised?.y2 || 0) + (activeData.funding?.debtRaised?.y3 || 0);
  const repayTotal = (activeData.funding?.debtRepayment?.y1 || 0) + (activeData.funding?.debtRepayment?.y2 || 0) + (activeData.funding?.debtRepayment?.y3 || 0);

  const y1fin = calculateFinancials('y1');
  const y2fin = calculateFinancials('y2');
  const y3fin = calculateFinancials('y3');
  const totalPat = y1fin.netIncome + y2fin.netIncome + y3fin.netIncome;

  const row = (label, v1, v2, v3, indent = false, bold = false) => (
    <tr style={{borderBottom: '1px solid #f1f5f9', fontWeight: bold ? '600' : 'normal'}}>
      <td style={{padding: '0.6rem 1rem', paddingLeft: indent ? '2rem' : '1rem', color: '#475569'}}>{label}</td>
      <td style={{textAlign: 'right', padding: '0.6rem 1rem'}}>{renderVal(v1)}</td>
      <td style={{textAlign: 'right', padding: '0.6rem 1rem'}}>{renderVal(v2)}</td>
      <td style={{textAlign: 'right', padding: '0.6rem 1rem'}}>{renderVal(v3)}</td>
    </tr>
  );

  const sectionHeader = (label, bg, color) => (
    <tr style={{background: bg}}>
      <td colSpan="4" style={{padding: '0.75rem 1rem', fontWeight: '700', color}}>{label}</td>
    </tr>
  );

  const totalRow = (label, v1, v2, v3, color) => (
    <tr style={{fontWeight: '700', borderTop: `2px solid ${color}40`, borderBottom: `2px solid ${color}40`, background: color + '15'}}>
      <td style={{padding: '0.75rem 1rem', color}}>{label}</td>
      <td style={{textAlign: 'right', padding: '0.75rem 1rem', color}}>{renderVal(v1)}</td>
      <td style={{textAlign: 'right', padding: '0.75rem 1rem', color}}>{renderVal(v2)}</td>
      <td style={{textAlign: 'right', padding: '0.75rem 1rem', color}}>{renderVal(v3)}</td>
    </tr>
  );

  return (
    <div>
      <h3 style={{fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem'}}>Cash Flow Statement (₹ L)</h3>

      <div style={{overflowX: 'auto', marginBottom: '2rem'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', border: '1px solid #e2e8f0'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #e2e8f0', background: '#f8fafc'}}>
              <th style={{textAlign: 'left', padding: '0.75rem 1rem', color: '#64748b', fontWeight: '600'}}>Line Item</th>
              <th style={{textAlign: 'right', padding: '0.75rem 1rem', color: '#64748b', fontWeight: '600'}}>Year 1</th>
              <th style={{textAlign: 'right', padding: '0.75rem 1rem', color: '#64748b', fontWeight: '600'}}>Year 2</th>
              <th style={{textAlign: 'right', padding: '0.75rem 1rem', color: '#64748b', fontWeight: '600'}}>Year 3</th>
            </tr>
          </thead>
          <tbody>
            {sectionHeader('A. Operating Activities', '#dbeafe', '#1e3a8a')}
            {row('PAT (from P&L)', y1cf.netIncome, y2cf.netIncome, y3cf.netIncome, true)}
            {row('+ Depreciation', y1cf.dep, y2cf.dep, y3cf.dep, true)}
            {row('− Δ Accounts Receivable', -y1cf.deltaAr, -y2cf.deltaAr, -y3cf.deltaAr, true)}
            {row('+ Δ Accounts Payable', y1cf.deltaAp, y2cf.deltaAp, y3cf.deltaAp, true)}
            {totalRow('Cash from Operations', y1cf.opsCash, y2cf.opsCash, y3cf.opsCash, '#3b82f6')}

            {sectionHeader('B. Investing Activities', '#ffedd5', '#9a3412')}
            {row('− Capital Expenditure (Capex)', -y1cf.capex, -y2cf.capex, -y3cf.capex, true)}
            {totalRow('Cash from Investing', y1cf.invCash, y2cf.invCash, y3cf.invCash, '#f97316')}

            {sectionHeader('C. Financing Activities', '#f3f4f6', '#374151')}
            {row('+ Equity Raised', y1cf.equityRaised, y2cf.equityRaised, y3cf.equityRaised, true)}
            {row('+ Debt Raised', y1cf.debtRaised, y2cf.debtRaised, y3cf.debtRaised, true)}
            {row('− Debt Repayment', -y1cf.debtRepayment, -y2cf.debtRepayment, -y3cf.debtRepayment, true)}
            {totalRow('Cash from Financing', y1cf.finCash, y2cf.finCash, y3cf.finCash, '#6b7280')}

            {totalRow('Net Cash Flow', y1cf.netCash, y2cf.netCash, y3cf.netCash, '#059669')}

            <tr style={{background: '#f8fafc', borderTop: '1px solid #e2e8f0'}}>
              <td style={{padding: '0.6rem 1rem', color: '#64748b'}}>Opening Cash Balance</td>
              <td style={{textAlign: 'right', padding: '0.6rem 1rem'}}>{renderVal(openY1)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 1rem'}}>{renderVal(openY2)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 1rem'}}>{renderVal(openY3)}</td>
            </tr>
            <tr style={{fontWeight: '700', background: '#ecfdf5', borderTop: '1px solid #bbf7d0'}}>
              <td style={{padding: '0.75rem 1rem', color: '#059669'}}>Closing Cash Balance</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem', color: '#059669'}}>{renderVal(closeY1)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem', color: '#059669'}}>{renderVal(closeY2)}</td>
              <td style={{textAlign: 'right', padding: '0.75rem 1rem', color: '#059669'}}>{renderVal(closeY3)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 style={{fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem'}}>Capital Structure Summary (₹ L)</h3>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem'}}>
        {[
          { label: 'Total Equity Raised', val: equityTotal, color: '#6366f1', bg: '#eef2ff' },
          { label: 'Total Debt Raised', val: debtTotal, color: '#f97316', bg: '#fff7ed' },
          { label: 'Cumulative PAT (Y1–Y3)', val: totalPat, color: totalPat >= 0 ? '#059669' : '#ef4444', bg: totalPat >= 0 ? '#f0fdf4' : '#fef2f2' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} style={{background: bg, border: `1px solid ${color}30`, borderRadius: '10px', padding: '1rem 1.25rem'}}>
            <div style={{fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem'}}>{label}</div>
            <div style={{fontSize: '1.4rem', fontWeight: '700', color}}>₹{formatL(val)}</div>
          </div>
        ))}
      </div>

      <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem 1.25rem'}}>
        <div style={{fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b'}}>Interest Rate</div>
        <div style={{fontSize: '0.9rem', color: '#475569'}}>
          {activeData.funding?.interestRate || 0}% p.a. on outstanding debt
          {(activeData.funding?.interestRate || 0) === 0 && ' — No debt raised, no interest expense.'}
        </div>
      </div>
    </div>
  );
};

export default CashFlow;
