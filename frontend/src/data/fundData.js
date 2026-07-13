// Shared fund data used by both FundPerformanceChart and MarketInsights.
// All NAV values shown in cards are derived from this same data so they stay consistent.

const generateMockData = (months, startValue, trend, volatility) => {
  const data = [];
  let currentNav = startValue;
  const now = new Date();
  // Simple seeded LCG so values are stable across re-renders
  let seed = startValue * 1000;
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = months; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const noise = 1 + (rand() - 0.5) * volatility;
    currentNav = currentNav * (1 + trend) * noise;
    data.push({
      date: monthStr,
      nav:  Number(currentNav.toFixed(2)),
    });
  }
  return data;
};

// Scale the entire series so its LAST point == realNav.
// This guarantees the chart endpoint matches the NAV shown on the card.
const normalizeToRealNav = (data, realNav) => {
  const lastNav = data.at(-1).nav;
  if (!lastNav || lastNav === 0) return data;
  const scale = realNav / lastNav;
  return data.map((d) => ({ ...d, nav: Number((d.nav * scale).toFixed(2)) }));
};

// Fund metadata — single source of truth
// NAV, expense ratio, exit load, and fund manager data are from real Groww scraped data (10 Jul 2026)
export const FUNDS_META = {
  ICICI_LARGE_CAP: {
    name:        'ICICI Pru Large Cap',
    category:    'Equity: Large Cap',
    cssVar:      '--primary',
    icon:        'trending_up',
    iconBg:      'bg-primary-container/10',
    iconColor:   'text-primary',
    expRatio:    '1.02%',
    exitLoad:    '1% within 1 month',
    manager:     'Sharmila D\'Silva',
    aum:         '₹79,420 Cr',
    realNav:     120.45,     // Actual NAV as of 10 Jul 2026
    realChange:  1.04,       // Actual 1D change %
    sparkPath:   'M0,20 L10,25 L20,15 L30,18 L40,10 L50,12 L60,5 L70,8 L80,2',
    sparkClass:  'text-primary',
    // chart simulation params (seeded, consistent)
    startVal:  100, trend12: 0.015, vol12: 0.02,  startVal5:  50,  trend5: 0.01,  vol5: 0.04,
  },
  ICICI_MID_CAP: {
    name:        'ICICI Pru Midcap',
    category:    'Equity: Mid Cap',
    cssVar:      '--tertiary',
    icon:        'bolt',
    iconBg:      'bg-tertiary-container/10',
    iconColor:   'text-tertiary',
    expRatio:    '1.13%',
    exitLoad:    '1% within 1 year',
    manager:     'Sharmila D\'Silva',
    aum:         '₹7,845 Cr',
    realNav:     382.35,     // Actual NAV as of 10 Jul 2026
    realChange:  1.15,       // Actual 1D change %
    sparkPath:   'M0,25 L10,22 L20,28 L30,20 L40,15 L50,18 L60,10 L70,5 L80,0',
    sparkClass:  'text-tertiary',
    // chart simulation params
    startVal:  140, trend12: 0.02,  vol12: 0.035, startVal5:  40,  trend5: 0.015, vol5: 0.06,
  },
  ICICI_INDO_ASIA: {
    name:        'ICICI Pru Smallcap',
    category:    'Equity: Small Cap',
    cssVar:      '--error',
    icon:        'public',
    iconBg:      'bg-secondary-container/10',
    iconColor:   'text-secondary',
    expRatio:    '1.18%',
    exitLoad:    '1% within 1 year',
    manager:     'Rajat Chandak',
    aum:         '₹9,378 Cr',
    realNav:     100.92,     // Actual NAV as of 10 Jul 2026
    realChange:  0.92,       // Actual 1D change %
    sparkPath:   'M0,25 L10,22 L20,18 L30,20 L40,15 L50,12 L60,8 L70,10 L80,5',
    sparkClass:  'text-primary',
    // chart simulation params
    startVal:   80, trend12: -0.002, vol12: 0.05, startVal5:  25,  trend5: 0.018, vol5: 0.08,
  },
  ICICI_CORP_BOND: {
    name:        'ICICI Pru Corporate Bond',
    category:    'Debt: Corporate Bond',
    cssVar:      '--secondary',
    icon:        'account_balance',
    iconBg:      'bg-secondary-container/10',
    iconColor:   'text-secondary',
    expRatio:    '0.39%',
    exitLoad:    '0.00%',
    manager:     'Manish Banthia',
    aum:         '--',
    realNav:     null,
    realChange:  null,
    sparkPath:   'M0,20 L20,18 L40,16 L60,14 L80,12',
    sparkClass:  'text-secondary',
    // chart simulation params
    startVal:  120, trend12: 0.005, vol12: 0.005, startVal5:  90,  trend5: 0.006, vol5: 0.008,
  },
  ICICI_LONG_TERM_BOND: {
    name:        'ICICI Pru Long Term Bond',
    category:    'Debt: Long Duration',
    cssVar:      '--primary',
    icon:        'savings',
    iconBg:      'bg-primary-container/10',
    iconColor:   'text-primary',
    expRatio:    '0.65%',
    exitLoad:    '0.00%',
    manager:     'Manish Banthia',
    aum:         '--',
    realNav:     null,
    realChange:  null,
    sparkPath:   'M0,22 L20,20 L40,17 L60,14 L80,11',
    sparkClass:  'text-primary',
    // chart simulation params
    startVal:  110, trend12: 0.006, vol12: 0.01,  startVal5:  80,  trend5: 0.007, vol5: 0.012,
  },
};

// Generate time-series data once (stable across re-renders due to seeded RNG)
// The 12M series is normalized so its last point == realNav (matching the card).
// The 5Y series is also normalized to the same endpoint for consistency.
export const FUNDS_DATA = Object.fromEntries(
  Object.entries(FUNDS_META).map(([key, m]) => {
    const raw12M = generateMockData(12, m.startVal,  m.trend12, m.vol12);
    const raw5Y  = generateMockData(60, m.startVal5, m.trend5,  m.vol5);

    const latestNav    = m.realNav   !== null ? m.realNav   : raw12M.at(-1).nav;
    const dayChangePct = m.realChange !== null ? m.realChange
      : Number((((raw12M.at(-1).nav - raw12M.at(-2).nav) / raw12M.at(-2).nav) * 100).toFixed(2));

    // Normalize both series so the last data point = latestNav (real or simulated)
    const data12M = m.realNav !== null ? normalizeToRealNav(raw12M, m.realNav) : raw12M;
    const data5Y  = m.realNav !== null ? normalizeToRealNav(raw5Y,  m.realNav) : raw5Y;

    return [
      key,
      {
        ...m,
        '12M':        data12M,
        '5Y':         data5Y,
        latestNav,
        dayChangePct,
      },
    ];
  })
);
