const generateMockData = (months, startValue, trend, volatility, benchmarkTrend) => {
  let data = [];
  let currentNav = startValue;
  let currentBench = 100; // Benchmark starts at 100 index

  const now = new Date();
  
  for (let i = months; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = d.toLocaleDateString('en-US', { month: 'short', year: i > 12 ? '2-digit' : '2-digit' });
    
    const noise = 1 + (Math.random() - 0.5) * volatility;
    const benchNoise = 1 + (Math.random() - 0.5) * (volatility * 0.8);
    
    currentNav = currentNav * (1 + trend) * noise;
    currentBench = currentBench * (1 + benchmarkTrend) * benchNoise;
    
    data.push({
      date: monthStr,
      timestamp: d.getTime(),
      nav: Number(currentNav.toFixed(2)),
      benchmark: Number(currentBench.toFixed(2)),
    });
  }
  return data;
};

console.log(generateMockData(12, 100, 0.015, 0.02, 0.012).slice(0, 3));
