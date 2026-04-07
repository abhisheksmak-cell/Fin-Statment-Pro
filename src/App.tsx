import { useState, useMemo } from 'react';
import { Calculator, Download, AlertCircle, FileText, PieChart, Building2, Calendar, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateFinancials, FinancialData, PLStatement, BalanceSheet } from './lib/financialLogic';
import { generatePDF } from './lib/pdfGenerator';
import { formatCurrency, cn } from './lib/utils';

export default function App() {
  const [formData, setFormData] = useState<FinancialData>({
    businessName: '',
    assessmentYear: '2024-25',
    grossSales: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ pl: PLStatement; bs: BalanceSheet } | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (!formData.businessName) throw new Error("Business Name is required");
      if (formData.grossSales <= 0) throw new Error("Gross Sales must be greater than 0");
      
      const calcResults = calculateFinancials(formData);
      setResults(calcResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setResults(null);
    }
  };

  const handleDownload = () => {
    if (results) {
      generatePDF(formData, results.pl, results.bs);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">FinStatement Pro</h1>
          </div>
          <div className="text-sm text-slate-500 hidden md:block">
            Professional Financial Statement Generator
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Input Parameters
              </h2>
              <form onSubmit={handleCalculate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Assessment Year</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2024-25"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      value={formData.assessmentYear}
                      onChange={(e) => setFormData({ ...formData, assessmentYear: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Gross Sales (Amount in ₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="Enter amount"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      value={formData.grossSales || ''}
                      onChange={(e) => setFormData({ ...formData, grossSales: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Calculator className="w-5 h-5" />
                  Generate Statements
                </button>
              </form>
            </section>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-2xl flex gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-red-800">Validation Error</h3>
                    <p className="text-sm text-red-700 mt-0.5">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  {/* Action Bar */}
                  <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <PieChart className="w-5 h-5" />
                      <span className="font-medium">Statement Preview</span>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>

                  {/* P&L Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                      <h3 className="font-bold text-slate-800">Profit & Loss Statement</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-3 font-semibold">Particulars</th>
                            <th className="px-6 py-3 font-semibold text-right">Amount (INR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <Row label="Gross Sales" value={results.pl.revenue} />
                          <Row label="Cost of Goods Sold (COGS)" value={results.pl.cogs} />
                          <Row label="Gross Profit" value={results.pl.grossProfit} isBold />
                          <Row label="Salaries" value={results.pl.salaries} />
                          <Row label="Rent" value={results.pl.rent} />
                          <Row label="Utilities" value={results.pl.utilities} />
                          <Row label="Misc Expenses" value={results.pl.misc} />
                          <Row label="EBITDA" value={results.pl.ebitda} isBold />
                          <Row label="Depreciation" value={results.pl.depreciation} />
                          <Row label="EBIT" value={results.pl.ebit} isBold />
                          <Row label="Interest" value={results.pl.interest} />
                          <Row label="Profit Before Tax (PBT)" value={results.pl.pbt} isBold />
                          <Row label="Tax" value={results.pl.tax} />
                          <Row label="Profit After Tax (PAT)" value={results.pl.pat} isBold isHighlight />
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Balance Sheet Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                      <h3 className="font-bold text-slate-800">Estimated Balance Sheet</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="text-xs text-slate-500 uppercase border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-3 font-semibold border-r border-slate-100">Assets (INR)</th>
                            <th className="px-6 py-3 font-semibold text-right border-r border-slate-100">Amount</th>
                            <th className="px-6 py-3 font-semibold">Liabilities & Equity (INR)</th>
                            <th className="px-6 py-3 font-semibold text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="px-6 py-2 font-bold border-r border-slate-100">Current Assets</td>
                            <td className="px-6 py-2 border-r border-slate-100"></td>
                            <td className="px-6 py-2 font-bold">Liabilities</td>
                            <td className="px-6 py-2"></td>
                          </tr>
                          <BSRow 
                            aLabel="Cash" aValue={results.bs.assets.cash}
                            lLabel="Notes Payable" lValue={results.bs.liabilitiesEquity.notesPayable}
                          />
                          <BSRow 
                            aLabel="Accounts Receivable" aValue={results.bs.assets.accountsReceivable}
                            lLabel="Accounts Payable" lValue={results.bs.liabilitiesEquity.accountsPayable}
                          />
                          <BSRow 
                            aLabel="Prepaid Expenses" aValue={results.bs.assets.prepaidExpenses}
                            lLabel="Salaries Payable" lValue={results.bs.liabilitiesEquity.salariesPayable}
                          />
                          <BSRow 
                            aLabel="Insurance" aValue={results.bs.assets.insurance}
                            lLabel="Unearned Revenue" lValue={results.bs.liabilitiesEquity.unearnedRevenue}
                          />
                          <BSRow 
                            aLabel="Supplies" aValue={results.bs.assets.supplies}
                            lLabel="" lValue={0}
                          />
                          <tr className="font-bold border-t border-slate-200">
                            <td className="px-6 py-3 border-r border-slate-100">Total Current Assets</td>
                            <td className="px-6 py-3 text-right border-r border-slate-100">{formatCurrency(results.bs.assets.totalCurrentAssets)}</td>
                            <td className="px-6 py-3">Total Liabilities</td>
                            <td className="px-6 py-3 text-right">{formatCurrency(results.bs.liabilitiesEquity.totalLiabilities)}</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 font-bold border-r border-slate-100">Non-Current Assets</td>
                            <td className="px-6 py-2 border-r border-slate-100"></td>
                            <td className="px-6 py-2 font-bold">Equity</td>
                            <td className="px-6 py-2"></td>
                          </tr>
                          <BSRow 
                            aLabel="Equipment" aValue={results.bs.assets.equipment}
                            lLabel="Capital" lValue={results.bs.liabilitiesEquity.capital}
                          />
                          <BSRow 
                            aLabel="Less: Acc. Depreciation" aValue={-results.bs.assets.accumulatedDepreciation}
                            lLabel="Retained Earnings" lValue={results.bs.liabilitiesEquity.retainedEarnings}
                          />
                          <tr className="font-bold border-t border-slate-200">
                            <td className="px-6 py-3 border-r border-slate-100">Net Fixed Assets</td>
                            <td className="px-6 py-3 text-right border-r border-slate-100">{formatCurrency(results.bs.assets.netFixedAssets)}</td>
                            <td className="px-6 py-3">Total Equity</td>
                            <td className="px-6 py-3 text-right">{formatCurrency(results.bs.liabilitiesEquity.totalEquity)}</td>
                          </tr>
                          <tr className="font-bold border-t-2 border-slate-900">
                            <td className="px-6 py-4 border-r border-slate-200">TOTAL ASSETS</td>
                            <td className="px-6 py-4 text-right border-r border-slate-200">{formatCurrency(results.bs.assets.totalAssets)}</td>
                            <td className="px-6 py-4">TOTAL LIABILITIES & EQUITY</td>
                            <td className="px-6 py-4 text-right">{formatCurrency(results.bs.liabilitiesEquity.totalLiabilitiesEquity)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200"
                >
                  <Calculator className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium">Enter details to generate preview</p>
                  <p className="text-sm">Financial statements will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value, isBold = false }: { label: string; value: number; isBold?: boolean }) {
  return (
    <tr className={cn(
      isBold && "font-bold text-slate-800"
    )}>
      <td className="px-6 py-3">{label}</td>
      <td className="px-6 py-3 text-right">{formatCurrency(value)}</td>
    </tr>
  );
}

function BSRow({ aLabel, aValue, lLabel, lValue }: { aLabel: string; aValue: number; lLabel: string; lValue: number }) {
  return (
    <tr>
      <td className="px-6 py-2 border-r border-slate-100">{aLabel}</td>
      <td className="px-6 py-2 text-right border-r border-slate-100 text-slate-600">
        {aValue < 0 ? `(${formatCurrency(Math.abs(aValue))})` : formatCurrency(aValue)}
      </td>
      <td className="px-6 py-2">{lLabel}</td>
      <td className="px-6 py-2 text-right text-slate-600">
        {lLabel ? formatCurrency(lValue) : ''}
      </td>
    </tr>
  );
}
