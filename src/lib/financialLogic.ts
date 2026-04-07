export interface FinancialData {
  businessName: string;
  assessmentYear: string;
  grossSales: number;
}

export interface PLStatement {
  revenue: number;
  cogs: number;
  grossProfit: number;
  salaries: number;
  rent: number;
  utilities: number;
  misc: number;
  totalExpenses: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interest: number;
  pbt: number;
  tax: number;
  pat: number;
}

export interface BalanceSheet {
  assets: {
    cash: number;
    accountsReceivable: number;
    prepaidExpenses: number;
    insurance: number;
    supplies: number;
    totalCurrentAssets: number;
    equipment: number;
    accumulatedDepreciation: number;
    netFixedAssets: number;
    totalAssets: number;
  };
  liabilitiesEquity: {
    notesPayable: number;
    accountsPayable: number;
    salariesPayable: number;
    unearnedRevenue: number;
    totalLiabilities: number;
    capital: number;
    retainedEarnings: number;
    totalEquity: number;
    totalLiabilitiesEquity: number;
  };
}

export function calculateFinancials(input: FinancialData) {
  const sales = input.grossSales;

  // P&L Logic
  const revenue = sales;
  const cogs = sales * 0.60;
  const grossProfit = revenue - cogs;

  const salaries = sales * 0.12;
  const rent = sales * 0.06;
  const utilities = sales * 0.03;
  const misc = sales * 0.04;
  const totalExpenses = salaries + rent + utilities + misc;

  const ebitda = grossProfit - totalExpenses;
  const depreciation = sales * 0.05;
  const ebit = ebitda - depreciation;
  const interest = sales * 0.02;
  const pbt = ebit - interest;

  // Tax Validation
  if (pbt > 1200000) {
    throw new Error("PBT exceeds ₹12,00,000. Tax calculation not allowed under current rule.");
  }

  const tax = 0;
  const pat = pbt - tax;

  const pl: PLStatement = {
    revenue, cogs, grossProfit, salaries, rent, utilities, misc,
    totalExpenses, ebitda, depreciation, ebit, interest, pbt, tax, pat
  };

  // Balance Sheet Logic
  const accountsReceivable = sales * 0.15;
  const prepaidExpenses = sales * 0.02;
  const insurance = sales * 0.01;
  const supplies = sales * 0.01;
  const equipment = sales * 0.40;
  const accumulatedDepreciation = depreciation; // Assuming single year for this model
  const netFixedAssets = equipment - accumulatedDepreciation;

  // Ensure Cash is a positive healthy figure (e.g., 12% of sales)
  const cash = sales * 0.12;
  
  const totalCurrentAssets = cash + accountsReceivable + prepaidExpenses + insurance + supplies;
  const totalAssets = totalCurrentAssets + netFixedAssets;

  const notesPayable = sales * 0.05;
  const accountsPayable = cogs * 0.08;
  const salariesPayable = sales * 0.02;
  const unearnedRevenue = sales * 0.04;
  const totalLiabilities = notesPayable + accountsPayable + salariesPayable + unearnedRevenue;

  const retainedEarnings = pat;
  
  // Capital is the balancing figure to ensure Assets = Liabilities + Equity
  const capital = totalAssets - (totalLiabilities + retainedEarnings);
  const totalEquity = capital + retainedEarnings;
  const totalLiabilitiesEquity = totalLiabilities + totalEquity;

  const bs: BalanceSheet = {
    assets: {
      cash, accountsReceivable, prepaidExpenses, insurance, supplies,
      totalCurrentAssets, equipment, accumulatedDepreciation, netFixedAssets, totalAssets
    },
    liabilitiesEquity: {
      notesPayable, accountsPayable, salariesPayable, unearnedRevenue,
      totalLiabilities, capital, retainedEarnings, totalEquity,
      totalLiabilitiesEquity
    }
  };

  return { pl, bs };
}
