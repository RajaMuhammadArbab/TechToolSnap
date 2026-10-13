'use client';
import { useState } from 'react';
import { Coins, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';

export default function ZakatCalculator() {
  const [currency, setCurrency] = useState('PKR');
  const [nisabThreshold, setNisabThreshold] = useState('180000'); // Typical silver Nisab value in PKR

  // Assets
  const [cash, setCash] = useState('');
  const [goldSilver, setGoldSilver] = useState('');
  const [investments, setInvestments] = useState('');
  const [businessInventory, setBusinessInventory] = useState('');
  const [moneyOwedToYou, setMoneyOwedToYou] = useState('');

  // Liabilities
  const [debts, setDebts] = useState('');
  const [immediateExpenses, setImmediateExpenses] = useState('');

  const num = (v: string) => {
    const parsed = parseFloat(v);
    return isNaN(parsed) ? 0 : parsed;
  };

  const totalAssets = num(cash) + num(goldSilver) + num(investments) + num(businessInventory) + num(moneyOwedToYou);
  const totalLiabilities = num(debts) + num(immediateExpenses);
  const netWealth = Math.max(0, totalAssets - totalLiabilities);

  const nisab = num(nisabThreshold);
  const isEligible = netWealth >= nisab && nisab > 0;
  const zakatDue = isEligible ? netWealth * 0.025 : 0;

  const formatMoney = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Currency & Nisab settings */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-indigo-500" />
            Nisab Benchmark & Currency
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Zakat is obligatory (2.5%) once your net wealth has reached or exceeded the Nisab threshold.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
          >
            <option value="PKR">PKR (₨)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="SAR">SAR (﷼)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="INR">INR (₹)</option>
          </select>

          <div className="relative flex-grow sm:w-36">
            <input
              type="number"
              value={nisabThreshold}
              onChange={(e) => setNisabThreshold(e.target.value)}
              placeholder="Nisab threshold"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
            <span className="absolute -top-4 right-1 text-[10px] text-slate-400">Current Nisab</span>
          </div>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Zakatable Assets */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-2">
            1. Zakatable Assets
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Cash (in hand, bank accounts, savings)
            </label>
            <input
              type="number"
              placeholder="0"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Gold & Silver Value (at current market rates)
            </label>
            <input
              type="number"
              placeholder="0"
              value={goldSilver}
              onChange={(e) => setGoldSilver(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Shares, Stocks, Mutual Funds & Crypto
            </label>
            <input
              type="number"
              placeholder="0"
              value={investments}
              onChange={(e) => setInvestments(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Business Inventory & Goods for Resale
            </label>
            <input
              type="number"
              placeholder="0"
              value={businessInventory}
              onChange={(e) => setBusinessInventory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Loans Receivable (money expected back from others)
            </label>
            <input
              type="number"
              placeholder="0"
              value={moneyOwedToYou}
              onChange={(e) => setMoneyOwedToYou(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>
        </div>

        {/* Liabilities & Deductions */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-2">
              2. Deductible Liabilities
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Immediate Debts & Outstanding Loans Due
              </label>
              <input
                type="number"
                placeholder="0"
                value={debts}
                onChange={(e) => setDebts(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Due Bills, Taxes & Immediate Living Expenses
              </label>
              <input
                type="number"
                placeholder="0"
                value={immediateExpenses}
                onChange={(e) => setImmediateExpenses(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Quick Summary card */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Total Assets:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currency} {formatMoney(totalAssets)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Total Liabilities:</span>
              <span className="font-semibold text-slate-900 dark:text-white">- {currency} {formatMoney(totalLiabilities)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-2">
              <span>Net Zakatable Wealth:</span>
              <span>{currency} {formatMoney(netWealth)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Display Hero Card */}
      <div className={`p-8 rounded-3xl border text-center space-y-4 ${
        isEligible
          ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-300 dark:border-emerald-800'
          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white dark:bg-slate-800 shadow-xs">
          {isEligible ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Zakat is Obligatory (Above Nisab)</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-slate-600 dark:text-slate-400">Below Nisab Threshold ({currency} {formatMoney(nisab)})</span>
            </>
          )}
        </div>

        <div>
          <span className="block text-sm font-semibold uppercase tracking-wider text-slate-500">
            Total Zakat Payable (2.5%)
          </span>
          <div className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white my-2">
            {currency} {formatMoney(zakatDue)}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {isEligible
              ? `Calculated as 2.5% on your net zakatable wealth of ${currency} ${formatMoney(netWealth)}.`
              : `Your net wealth is below the Nisab threshold of ${currency} ${formatMoney(nisab)}, so Zakat is not mandatory for you at this time.`}
          </p>
        </div>
      </div>
    </div>
  );
}
