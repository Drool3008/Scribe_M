import { useModel } from '../../context/ModelContext';

const BalanceSheet = () => {
  const { calculateFinancials, activeData } = useModel();

  const formatL = (val) => (Math.abs(val) / 100000).toFixed(2) + ' L';

  const renderVal = (val) => {
    const neg = val < 0;
    return <span style={{color: neg ? '#ef4444' : 'inherit'}}>{neg ? `-${formatL(val)}` : formatL(val)}</span>;
  };

  const calcYear = (yk, prevNetIncome) => {
    const fin = calculateFinancials(yk);
    const capex = (activeData.investmentItems || []).reduce((s, item) =>
      s + ((item[`${yk}Units`] || 0) * (item[`${yk}Rate`] || 0)), 0);
    const dep = fin.depreciation;
    const netFixed = capex - dep;

    const ar = (fin.totalRev / 365) * (activeData.receivableDays?.bu1?.[yk] || 0);
    const ap = (fin.totalCogs / 365) * (activeData.payableDays?.bu1?.[yk] || 0);
    const equityRaised = activeData.funding?.equityRaised?.[yk] || 0;
    const debtRaised = activeData.funding?.debtRaised?.[yk] || 0;
    const debtRepayment = activeData.funding?.debtRepayment?.[yk] || 0;

    // Cash = opening cash + equity + debt - repayment + net income
    const cash = equityRaised + debtRaised - debtRepayment + fin.netIncome + (prevNetIncome || 0);
    const totalAssets = netFixed + ar + cash;

    const shareCapital = equityRaised;
    const retainedEarnings = fin.netIncome + (prevNetIncome || 0);
    const equity = shareCapital + retainedEarnings;
    const totalDebt = debtRaised - debtRepayment;
    const totalLiab = equity + totalDebt + ap;

    return { capex, dep, netFixed, ar, cash, totalAssets, shareCapital, retainedEarnings, equity, totalDebt, ap, totalLiab, netIncome: fin.netIncome };
  };

  const y1 = calcYear('y1', 0);
  const y2 = calcYear('y2', y1.retainedEarnings);
  const y3 = calcYear('y3', y1.retainedEarnings + y2.retainedEarnings);

  const isBalanced = (d) => Math.abs(d.totalAssets - d.totalLiab) < 1;

  const row = (label, v1, v2, v3, style = {}, indent = false) => (
    <tr style={style}>
      <td style={{padding: '0.5rem 1rem 0.5rem', paddingLeft: indent ? '2rem' : '1rem', color: '#475569'}}>{label}</td>
      <td style={{textAlign: 'right', padding: '0.5rem 1rem'}}>{renderVal(v1)}</td>
      <td style={{textAlign: 'right', padding: '0.5rem 1rem'}}>{renderVal(v2)}</td>
      <td style={{textAlign: 'right', padding: '0.5rem 1rem'}}>{renderVal(v3)}</td>
    </tr>
  );

  const sectionHeader = (label, color) => (
    <tr style={{background: color + '20', borderTop: `2px solid ${color}40`}}>
      <td colSpan="4" style={{padding: '0.75rem 1rem', fontWeight: '700', color, fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase'}}>{label}</td>
    </tr>
  );

  const subHeader = (label) => (
    <tr style={{background: '#f8fafc'}}>
      <td colSpan="4" style={{padding: '0.5rem 1rem', fontWeight: '600', color: '#64748b', fontSize: '0.85rem'}}>{label}</td>
    </tr>
  );

  const totalRow = (label, v1, v2, v3, color = '#059669') => (
    <tr style={{fontWeight: '700', background: color + '10', borderTop: `1px solid ${color}30`}}>
      <td style={{padding: '0.75rem 1rem', color}}>{label}</td>
      <td style={{textAlign: 'right', padding: '0.75rem 1rem', color}}>{formatL(v1)}</td>
      <td style={{textAlign: 'right', padding: '0.75rem 1rem', color}}>{formatL(v2)}</td>
      <td style={{textAlign: 'right', padding: '0.75rem 1rem', color}}>{formatL(v3)}</td>
    </tr>
  );

  return (
    <div>
      <h3 style={{fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem'}}>Balance Sheet (₹ L)</h3>
      <p style={{color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem'}}>New company — no opening balances. All figures as at year-end.</p>

      <div style={{overflowX: 'auto', marginBottom: '2rem'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', border: '1px solid #e2e8f0'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #e2e8f0'}}>
              <th style={{textAlign: 'left', padding: '0.75rem 1rem', color: '#64748b', fontWeight: '600', background: '#f8fafc'}}>Particulars</th>
              <th style={{textAlign: 'right', padding: '0.75rem 1rem', color: '#64748b', fontWeight: '600', background: '#f8fafc'}}>Year 1</th>
              <th style={{textAlign: 'right', padding: '0.75rem 1rem', color: '#64748b', fontWeight: '600', background: '#f8fafc'}}>Year 2</th>
              <th style={{textAlign: 'right', padding: '0.75rem 1rem', color: '#64748b', fontWeight: '600', background: '#f8fafc'}}>Year 3</th>
            </tr>
          </thead>
          <tbody>
            {sectionHeader('ASSETS', '#0d9488')}
            {subHeader('A. Non-Current Assets')}
            {row('Gross Block (Cumulative Capex)', y1.capex, y2.capex, y3.capex, {}, true)}
            {row('Less: Accumulated Depreciation', -y1.dep, -y2.dep, -y3.dep, {}, true)}
            {row('Net Fixed Assets', y1.netFixed, y2.netFixed, y3.netFixed, {fontWeight: '600'}, true)}
            {subHeader('B. Current Assets')}
            {row('Cash & Bank Balance', y1.cash, y2.cash, y3.cash, {}, true)}
            {row('Accounts Receivable (AR)', y1.ar, y2.ar, y3.ar, {}, true)}
            {totalRow('TOTAL ASSETS', y1.totalAssets, y2.totalAssets, y3.totalAssets, '#0d9488')}

            {sectionHeader("LIABILITIES & EQUITY", '#7c3aed')}
            {subHeader('A. Shareholders\' Equity')}
            {row('Share Capital (Equity Raised)', y1.shareCapital, y2.shareCapital, y3.shareCapital, {}, true)}
            {row('Retained Earnings (Cumulative PAT)', y1.retainedEarnings, y2.retainedEarnings, y3.retainedEarnings, {}, true)}
            {row('Total Equity', y1.equity, y2.equity, y3.equity, {fontWeight: '600'}, true)}
            {subHeader('B. Non-Current Liabilities')}
            {row('Long-term Debt', y1.totalDebt, y2.totalDebt, y3.totalDebt, {}, true)}
            {subHeader('C. Current Liabilities')}
            {row('Accounts Payable (AP)', y1.ap, y2.ap, y3.ap, {}, true)}
            {totalRow('TOTAL LIABILITIES & EQUITY', y1.totalLiab, y2.totalLiab, y3.totalLiab, '#7c3aed')}
          </tbody>
        </table>
      </div>

      <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
        {[{label:'Y1', d: y1}, {label:'Y2', d: y2}, {label:'Y3', d: y3}].map(({label, d}) => (
          <div key={label} style={{flex: 1, background: isBalanced(d) ? '#f0fdf4' : '#fef2f2', border: `1px solid ${isBalanced(d) ? '#bbf7d0' : '#fecaca'}`, borderRadius: '8px', padding: '0.75rem 1rem', textAlign: 'center'}}>
            <div style={{fontWeight: '700', fontSize: '0.9rem', color: isBalanced(d) ? '#059669' : '#dc2626'}}>
              {isBalanced(d) ? '✓ Balanced' : '⚠ Unbalanced'} — {label}
            </div>
            <div style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem'}}>
              Assets: {formatL(d.totalAssets)} | L+E: {formatL(d.totalLiab)}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem'}}>Working Capital Analysis (₹ L)</h3>
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', border: '1px solid #e2e8f0'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #e2e8f0', background: '#f8fafc'}}>
              <th style={{textAlign: 'left', padding: '0.75rem 1rem', color: '#64748b', fontWeight: '600'}}>Metric</th>
              <th style={{textAlign: 'right', padding: '0.75rem 1rem', color: '#64748b', fontWeight: '600'}}>Year 1</th>
              <th style={{textAlign: 'right', padding: '0.75rem 1rem', color: '#64748b', fontWeight: '600'}}>Year 2</th>
              <th style={{textAlign: 'right', padding: '0.75rem 1rem', color: '#64748b', fontWeight: '600'}}>Year 3</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.6rem 1rem'}}>Accounts Receivable (AR)</td>
              <td style={{textAlign: 'right', padding: '0.6rem 1rem'}}>{formatL(y1.ar)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 1rem'}}>{formatL(y2.ar)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 1rem'}}>{formatL(y3.ar)}</td>
            </tr>
            <tr style={{borderBottom: '1px solid #f1f5f9'}}>
              <td style={{padding: '0.6rem 1rem'}}>Accounts Payable (AP)</td>
              <td style={{textAlign: 'right', padding: '0.6rem 1rem'}}>{formatL(y1.ap)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 1rem'}}>{formatL(y2.ap)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 1rem'}}>{formatL(y3.ap)}</td>
            </tr>
            <tr style={{fontWeight: '700', background: '#f0fdf4'}}>
              <td style={{padding: '0.6rem 1rem', color: '#059669'}}>Net Working Capital (AR - AP)</td>
              <td style={{textAlign: 'right', padding: '0.6rem 1rem', color: '#059669'}}>{formatL(y1.ar - y1.ap)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 1rem', color: '#059669'}}>{formatL(y2.ar - y2.ap)}</td>
              <td style={{textAlign: 'right', padding: '0.6rem 1rem', color: '#059669'}}>{formatL(y3.ar - y3.ap)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BalanceSheet;
