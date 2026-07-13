import FundPerformanceChart from './FundPerformanceChart';
import { FUNDS_DATA } from '../data/fundData';

// Only show the 3 primary equity funds in the breakdown cards
const CARD_FUNDS = ['ICICI_LARGE_CAP', 'ICICI_MID_CAP', 'ICICI_INDO_ASIA'];

export default function MarketInsights() {
  return (
    <div className="p-space-lg flex flex-col gap-space-lg overflow-y-auto h-full custom-scrollbar pb-32">
      {/* Dynamic Portfolio Performance Overview Chart */}
      <FundPerformanceChart />

      {/* Fund Breakdown Cards — data driven from shared fundData.js */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
        {CARD_FUNDS.map((key) => {
          const fund = FUNDS_DATA[key];
          const nav = fund.latestNav;
          const change = fund.dayChangePct;
          const isUp = change >= 0;
          return (
            <div key={key} className="bg-surface rounded-xl p-5 border border-outline-variant hover:border-primary transition-all flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 ${fund.iconBg} rounded-lg flex items-center justify-center ${fund.iconColor}`}>
                  <span className="material-symbols-outlined">{fund.icon}</span>
                </div>
                <div className="text-right">
                  <p className="font-headline-md text-on-surface text-lg">₹ {nav.toFixed(2)}</p>
                  <p className={`font-label-md flex items-center justify-end gap-1 ${isUp ? 'text-primary' : 'text-error'}`}>
                    <span className="material-symbols-outlined text-[14px]">{isUp ? 'arrow_drop_up' : 'arrow_drop_down'}</span>
                    {isUp ? '+' : ''}{change}%
                  </p>
                </div>
              </div>
              <h3 className="font-body-lg font-bold text-on-surface mb-1">{fund.name}</h3>
              <p className="font-label-sm text-secondary mb-4 uppercase tracking-wider">{fund.category}</p>
              <div className="flex items-center justify-between mb-4 bg-surface-container-low p-2 rounded-lg">
                <span className="text-label-sm text-secondary">1M Performance</span>
                <svg className="sparkline h-[32px] w-[80px]" viewBox="0 0 80 32">
                  <path d={fund.sparkPath} fill="none" stroke="currentColor" className={fund.sparkClass} strokeWidth="2"></path>
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-y-3 pt-3 border-t border-outline-variant">
                <div>
                  <p className="font-label-sm text-secondary">Exp. Ratio</p>
                  <p className="font-label-md text-on-surface">{fund.expRatio}</p>
                </div>
                <div className="text-right">
                  <p className="font-label-sm text-secondary">Exit Load</p>
                  <p className="font-label-md text-on-surface">{fund.exitLoad}</p>
                </div>
                <div>
                  <p className="font-label-sm text-secondary">Fund Manager</p>
                  <p className="font-label-md text-on-surface">{fund.manager}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analysis Section: Risk Reward & Sector Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        {/* Risk-Reward Analysis */}
        <div className="bg-surface rounded-xl p-space-lg border border-outline-variant shadow-sm h-[400px] flex flex-col">
          <h3 className="font-headline-md text-on-surface mb-1">Risk vs. Reward Analysis</h3>
          <p className="font-body-md text-secondary mb-6">Annualized Volatility vs. 3Y Return (%)</p>
          <div className="flex-1 relative border-l border-b border-outline-variant flex items-end ml-8 mb-6">
            {/* Y-axis Label */}
            <span className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 font-label-sm text-secondary">Returns (%)</span>
            {/* X-axis Label */}
            <span className="absolute left-1/2 -bottom-8 -translate-x-1/2 font-label-sm text-secondary">Volatility (Risk)</span>
            {/* Bubbles */}
            <div className="absolute left-[20%] bottom-[30%] w-8 h-8 rounded-full bg-primary/40 border-2 border-primary cursor-pointer hover:scale-110 transition-transform group">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface text-on-surface px-2 py-1 rounded shadow-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">ICICI Large Cap</div>
            </div>
            <div className="absolute left-[60%] bottom-[80%] w-12 h-12 rounded-full bg-tertiary/40 border-2 border-tertiary cursor-pointer hover:scale-110 transition-transform group">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface text-on-surface px-2 py-1 rounded shadow-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">ICICI Mid Cap</div>
            </div>
            <div className="absolute left-[85%] bottom-[90%] w-10 h-10 rounded-full bg-secondary/40 border-2 border-secondary cursor-pointer hover:scale-110 transition-transform group">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface text-on-surface px-2 py-1 rounded shadow-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">ICICI Smallcap</div>
            </div>
            <div className="absolute left-[40%] bottom-[50%] w-6 h-6 rounded-full bg-primary-container/40 border-2 border-primary-container cursor-pointer hover:scale-110 transition-transform group">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface text-on-surface px-2 py-1 rounded shadow-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">ICICI Long Term Bond</div>
            </div>
            <div className="absolute left-[10%] bottom-[15%] w-4 h-4 rounded-full bg-outline/40 border-2 border-outline cursor-pointer hover:scale-110 transition-transform group">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface text-on-surface px-2 py-1 rounded shadow-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">ICICI Corp Bond</div>
            </div>
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="bg-surface rounded-xl p-space-lg border border-outline-variant shadow-sm h-[400px] flex flex-col">
          <h3 className="font-headline-md text-on-surface mb-1">Sector Allocation</h3>
          <p className="font-body-md text-secondary mb-6">Diversification across top investment categories</p>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Circular Progress Simulation */}
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" className="text-surface-container-high" strokeWidth="16"></circle>
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" className="text-primary" strokeDasharray="502" strokeDashoffset="150" strokeWidth="16"></circle>
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" className="text-tertiary" strokeDasharray="502" strokeDashoffset="400" strokeWidth="16"></circle>
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" className="text-secondary" strokeDasharray="502" strokeDashoffset="460" strokeWidth="16"></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-headline-md text-on-surface">6 Sectors</span>
                <span className="font-label-sm text-secondary">Diversified</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="font-label-md text-on-surface w-24">Financials</span>
                <span className="font-label-sm font-bold text-secondary">35%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                <span className="font-label-md text-on-surface w-24">Technology</span>
                <span className="font-label-sm font-bold text-secondary">28%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="font-label-md text-on-surface w-24">Healthcare</span>
                <span className="font-label-sm font-bold text-secondary">15%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                <span className="font-label-md text-on-surface w-24">Energy</span>
                <span className="font-label-sm font-bold text-secondary">12%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-outline"></span>
                <span className="font-label-md text-on-surface w-24">Others</span>
                <span className="font-label-sm font-bold text-secondary">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Feed */}
      <section className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <h3 className="font-headline-md text-on-surface">AI Portfolio Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          <div className="flex gap-4 p-4 bg-surface rounded-lg border border-outline-variant hover:border-primary hover:shadow-md transition-all">
            <div className="text-primary mt-1">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <div>
              <p className="font-body-md text-on-surface"><strong>ICICI Prudential Mid Cap</strong> has outperformed its category average by 4.2% this quarter.</p>
              <span className="font-label-sm text-secondary mt-2 inline-block">2 hours ago</span>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-surface rounded-lg border border-outline-variant hover:border-primary hover:shadow-md transition-all">
            <div className="text-tertiary mt-1">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <div>
              <p className="font-body-md text-on-surface">Portfolio exposure to <strong>Financial Services</strong> is 12% higher than benchmark. Consider rebalancing.</p>
              <span className="font-label-sm text-secondary mt-2 inline-block">5 hours ago</span>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-surface rounded-lg border border-outline-variant hover:border-primary hover:shadow-md transition-all">
            <div className="text-secondary mt-1">
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <div>
              <p className="font-body-md text-on-surface">New Opportunity: The <strong>Healthcare Sector</strong> shows low volatility and steady 12% growth potential.</p>
              <span className="font-label-sm text-secondary mt-2 inline-block">Yesterday</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
