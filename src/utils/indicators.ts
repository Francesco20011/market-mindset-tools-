
// Typ für Preisdaten
type PriceData = number[];

// Berechnet den einfachen gleitenden Durchschnitt (SMA)
export const calculateSMA = (data: PriceData, period: number): number[] => {
  const result: number[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j];
    }
    result.push(sum / period);
  }
  
  // Fülle die ersten Werte mit NaN, damit das Array die gleiche Länge hat
  const padding = Array(period - 1).fill(NaN);
  return [...padding, ...result];
};

// Berechnet den exponentiellen gleitenden Durchschnitt (EMA)
export const calculateEMA = (data: PriceData, period: number): number[] => {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Erste EMA ist SMA
  let ema = data.slice(0, period).reduce((sum, price) => sum + price, 0) / period;
  result.push(ema);
  
  // Berechne EMA für die restlichen Daten
  for (let i = period; i < data.length; i++) {
    ema = (data[i] - ema) * multiplier + ema;
    result.push(ema);
  }
  
  // Fülle die ersten Werte mit NaN, damit das Array die gleiche Länge hat
  const padding = Array(period - 1).fill(NaN);
  return [...padding, ...result];
};

// Berechnet Bollinger Bands
export const calculateBollingerBands = (
  data: PriceData,
  period: number = 20,
  deviation: number = 2
): { upper: number[]; middle: number[]; lower: number[] } => {
  const sma = calculateSMA(data, period);
  const upper: number[] = [];
  const lower: number[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += Math.pow(data[i - j] - sma[i], 2);
    }
    const stdDev = Math.sqrt(sum / period);
    upper.push(sma[i] + deviation * stdDev);
    lower.push(sma[i] - deviation * stdDev);
  }
  
  // Fülle die ersten Werte mit NaN
  const padding = Array(period - 1).fill(NaN);
  return {
    upper: [...padding, ...upper],
    middle: sma,
    lower: [...padding, ...lower],
  };
};

// Berechnet RSI (Relative Strength Index)
export const calculateRSI = (data: PriceData, period: number = 14): number[] => {
  const result: number[] = [];
  const changes: number[] = [];
  
  // Berechne Preisänderungen
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i] - data[i - 1]);
  }
  
  // Initialisiere Arrays für Gewinne und Verluste
  const gains: number[] = changes.map(change => change > 0 ? change : 0);
  const losses: number[] = changes.map(change => change < 0 ? Math.abs(change) : 0);
  
  // Berechne erste durchschnittliche Gewinne und Verluste
  let avgGain = gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;
  
  // Berechne RSI für den ersten Punkt
  result.push(100 - (100 / (1 + avgGain / (avgLoss === 0 ? 0.001 : avgLoss))));
  
  // Berechne RSI für die restlichen Punkte
  for (let i = period; i < changes.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    result.push(100 - (100 / (1 + avgGain / (avgLoss === 0 ? 0.001 : avgLoss))));
  }
  
  // Fülle die ersten Werte mit NaN
  const padding = Array(period).fill(NaN);
  return [...padding, ...result];
};

// Berechnet MACD (Moving Average Convergence Divergence)
export const calculateMACD = (
  data: PriceData,
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macd: number[]; signal: number[]; histogram: number[] } => {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  // MACD-Linie ist die Differenz zwischen schnellem und langsamem EMA
  const macdLine: number[] = [];
  for (let i = 0; i < data.length; i++) {
    macdLine.push(fastEMA[i] - slowEMA[i]);
  }
  
  // Signal-Linie ist der EMA der MACD-Linie
  const validMacd = macdLine.filter(value => !isNaN(value));
  const signalLine = calculateEMA(validMacd, signalPeriod);
  
  // Fülle Signal-Linie mit NaN für die ersten Werte
  const padding = Array(data.length - validMacd.length + signalPeriod - 1).fill(NaN);
  const paddedSignalLine = [...padding, ...signalLine];
  
  // Histogramm ist die Differenz zwischen MACD und Signal
  const histogram: number[] = [];
  for (let i = 0; i < data.length; i++) {
    histogram.push(macdLine[i] - paddedSignalLine[i]);
  }
  
  return {
    macd: macdLine,
    signal: paddedSignalLine,
    histogram,
  };
};

// Berechnet Support- und Widerstandslinien
export const calculateSupportResistance = (
  data: PriceData,
  period: number = 14
): { support: number[]; resistance: number[] } => {
  const support: number[] = [];
  const resistance: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      support.push(NaN);
      resistance.push(NaN);
      continue;
    }
    
    const window = data.slice(i - period, i);
    const min = Math.min(...window);
    const max = Math.max(...window);
    
    support.push(min);
    resistance.push(max);
  }
  
  return { support, resistance };
};
