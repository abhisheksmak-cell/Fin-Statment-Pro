import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PLStatement, BalanceSheet, FinancialData } from './financialLogic';
import { formatCurrency } from './utils';

export function generatePDF(data: FinancialData, pl: PLStatement, bs: BalanceSheet) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Page 1: Profit & Loss
  doc.setFontSize(18);
  doc.text(data.businessName, pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Estimated Profit & Loss Statement', pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Assessment Year: ${data.assessmentYear}`, pageWidth / 2, 38, { align: 'center' });

  autoTable(doc, {
    startY: 50,
    head: [['Particulars', 'Amount (INR)']],
    body: [
      ['Gross Sales', formatCurrency(pl.revenue)],
      ['Cost of Goods Sold (COGS)', formatCurrency(pl.cogs)],
      [{ content: 'Gross Profit', styles: { fontStyle: 'bold' } }, { content: formatCurrency(pl.grossProfit), styles: { fontStyle: 'bold' } }],
      ['Salaries', formatCurrency(pl.salaries)],
      ['Rent', formatCurrency(pl.rent)],
      ['Utilities', formatCurrency(pl.utilities)],
      ['Miscellaneous Expenses', formatCurrency(pl.misc)],
      [{ content: 'EBITDA', styles: { fontStyle: 'bold' } }, { content: formatCurrency(pl.ebitda), styles: { fontStyle: 'bold' } }],
      ['Depreciation', formatCurrency(pl.depreciation)],
      [{ content: 'EBIT', styles: { fontStyle: 'bold' } }, { content: formatCurrency(pl.ebit), styles: { fontStyle: 'bold' } }],
      ['Interest', formatCurrency(pl.interest)],
      [{ content: 'Profit Before Tax (PBT)', styles: { fontStyle: 'bold' } }, { content: formatCurrency(pl.pbt), styles: { fontStyle: 'bold' } }],
      ['Tax', formatCurrency(pl.tax)],
      [{ content: 'Profit After Tax (PAT)', styles: { fontStyle: 'bold' } }, { content: formatCurrency(pl.pat), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'grid',
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1 },
    styles: { textColor: [0, 0, 0] }
  });

  // Page 2: Balance Sheet
  doc.addPage();
  doc.setFontSize(18);
  doc.text(data.businessName, pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Estimated Balance Sheet', pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Assessment Year: ${data.assessmentYear}`, pageWidth / 2, 38, { align: 'center' });

  autoTable(doc, {
    startY: 50,
    head: [['Assets', 'Amount', 'Liabilities & Equity', 'Amount']],
    body: [
      [{ content: 'Current Assets', styles: { fontStyle: 'bold' } }, '', { content: 'Liabilities', styles: { fontStyle: 'bold' } }, ''],
      ['Cash', formatCurrency(bs.assets.cash), 'Notes Payable', formatCurrency(bs.liabilitiesEquity.notesPayable)],
      ['Accounts Receivable', formatCurrency(bs.assets.accountsReceivable), 'Accounts Payable', formatCurrency(bs.liabilitiesEquity.accountsPayable)],
      ['Prepaid Expenses', formatCurrency(bs.assets.prepaidExpenses), 'Salaries Payable', formatCurrency(bs.liabilitiesEquity.salariesPayable)],
      ['Insurance', formatCurrency(bs.assets.insurance), 'Unearned Revenue', formatCurrency(bs.liabilitiesEquity.unearnedRevenue)],
      ['Supplies', formatCurrency(bs.assets.supplies), '', ''],
      [{ content: 'Total Current Assets', styles: { fontStyle: 'bold' } }, formatCurrency(bs.assets.totalCurrentAssets), { content: 'Total Liabilities', styles: { fontStyle: 'bold' } }, formatCurrency(bs.liabilitiesEquity.totalLiabilities)],
      ['', '', '', ''],
      [{ content: 'Non-Current Assets', styles: { fontStyle: 'bold' } }, '', { content: 'Equity', styles: { fontStyle: 'bold' } }, ''],
      ['Equipment', formatCurrency(bs.assets.equipment), 'Capital', formatCurrency(bs.liabilitiesEquity.capital)],
      ['Less: Acc. Depreciation', `(${formatCurrency(bs.assets.accumulatedDepreciation)})`, 'Retained Earnings', formatCurrency(bs.liabilitiesEquity.retainedEarnings)],
      [{ content: 'Net Fixed Assets', styles: { fontStyle: 'bold' } }, formatCurrency(bs.assets.netFixedAssets), { content: 'Total Equity', styles: { fontStyle: 'bold' } }, formatCurrency(bs.liabilitiesEquity.totalEquity)],
      ['', '', '', ''],
      [{ content: 'TOTAL ASSETS', styles: { fontStyle: 'bold' } }, { content: formatCurrency(bs.assets.totalAssets), styles: { fontStyle: 'bold' } }, { content: 'TOTAL LIABILITIES & EQUITY', styles: { fontStyle: 'bold' } }, { content: formatCurrency(bs.liabilitiesEquity.totalLiabilitiesEquity), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'grid',
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1 },
    styles: { textColor: [0, 0, 0] }
  });

  doc.save(`${data.businessName.replace(/\s+/g, '_')}_Financial_Statements.pdf`);
}
