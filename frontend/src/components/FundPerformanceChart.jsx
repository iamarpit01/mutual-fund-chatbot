import { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { FUNDS_DATA } from '../data/fundData';

// CSS variables in this project are stored as "R G B" space-separated values.
// SVG stroke attributes can't use CSS variables directly — we resolve them at runtime.
function getCssColor(varName) {
  const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return val ? `rgb(${val})` : '#888888';
}

export default function FundPerformanceChart() {
  const [selectedFund, setSelectedFund] = useState('ICICI_LARGE_CAP');
  const [timeframe, setTimeframe] = useState('12M');
  const [chartWidth, setChartWidth] = useState(0);
  const [colors, setColors] = useState({});
  const containerRef = useRef(null);

  // Resolve CSS variables → actual rgb() colors (re-runs on theme toggle)
  const resolveColors = () => {
    const cssVar = FUNDS_DATA[selectedFund].cssVar;
    setColors({
      fund: getCssColor(cssVar),
      secondary: getCssColor('--secondary'),
      onSurface: getCssColor('--on-surface'),
      outlineVariant: getCssColor('--outline-variant'),
      surfaceHighest: getCssColor('--surface-container-highest'),
    });
  };

  useEffect(() => {
    resolveColors();
    const mo = new MutationObserver(resolveColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, [selectedFund]);

  // Measure container width with ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0) setChartWidth(Math.floor(rect.width));
    const ro = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setChartWidth(Math.floor(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const currentData = useMemo(() => FUNDS_DATA[selectedFund][timeframe], [selectedFund, timeframe]);
  const fundInfo = FUNDS_DATA[selectedFund];

  const pct = (arr) => (((arr.at(-1) - arr[0]) / arr[0]) * 100).toFixed(1);
  const totalReturn = pct(currentData.map((d) => d.nav));

  const fundColor = colors.fund || '#006c53';
  const benchColor = colors.secondary || '#4b626b';
  const axisColor = colors.secondary || '#4b626b';
  const gridColor = colors.outlineVariant || '#c8c8c8';
  const tipBg = colors.surfaceHighest || '#f5f5f5';
  const tipText = colors.onSurface || '#1a1a1a';

  return (
    <section className="bg-surface rounded-xl p-space-lg border border-outline-variant shadow-sm relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Fund Performance</h2>
          <p className="font-body-md text-secondary">Historical returns vs. Nifty 50 Benchmark</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedFund}
            onChange={(e) => setSelectedFund(e.target.value)}
            className="bg-surface-container-low border border-outline-variant text-on-surface text-label-md rounded-lg focus:ring-primary focus:border-primary block p-2 transition-colors cursor-pointer"
          >
            {Object.entries(FUNDS_DATA).map(([key, d]) => (
              <option key={key} value={key}>{d.name}</option>
            ))}
          </select>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-surface-container-low border border-outline-variant text-on-surface text-label-md rounded-lg focus:ring-primary focus:border-primary block p-2 transition-colors cursor-pointer"
          >
            <option value="12M">Last 12 Months</option>
            <option value="5Y">Last 5 Years</option>
          </select>
        </div>
      </div>

      {/* Return Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="flex items-center gap-2 font-label-md text-primary bg-primary-container/20 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fundColor }}></span>
          {fundInfo.name}: {totalReturn > 0 ? '+' : ''}{totalReturn}%
        </span>
      </div>

      {/* Chart */}
      <div ref={containerRef} style={{ width: '100%', height: 320 }}>
        {chartWidth > 0 && (
          <LineChart
            width={chartWidth}
            height={320}
            data={currentData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid vertical={false} stroke={gridColor} opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              minTickGap={20}
            />
            <YAxis
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v.toFixed(0)}`}
              domain={['auto', 'auto']}
              width={45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tipBg,
                borderRadius: '8px',
                border: `1px solid ${gridColor}`,
                color: tipText,
                fontSize: '12px',
              }}
              itemStyle={{ color: tipText }}
              formatter={(value, name) => [`NAV ${value}`, name === 'nav' ? fundInfo.name : 'Nifty 50']}
              labelStyle={{ color: axisColor, marginBottom: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="nav"
              stroke={fundColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: fundColor }}
              name="nav"
            />
          </LineChart>
        )}
      </div>
    </section>
  );
}
