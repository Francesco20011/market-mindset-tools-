
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartType, TimeRange, Indicator, useAppContext } from "@/context/AppContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  Minus, 
  Plus, 
  RefreshCw 
} from "lucide-react";
import { calculateBollingerBands, calculateRSI, calculateMACD } from "@/utils/indicators";

// Define interfaces for chart data
interface ChartDataItem {
  time: Date;
  price: number;
  upper?: number;
  middle?: number;
  lower?: number;
  macd?: number;
  signal?: number;
  histogram?: number;
  rsi?: number;
}

const Chart: React.FC = () => {
  const { 
    selectedCrypto, 
    chartType, 
    setChartType,
    timeRange, 
    setTimeRange,
    indicators,
    historicalData,
    language,
    fetchHistoricalData,
    isLoading
  } = useAppContext();
  
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [bollingerBands, setBollingerBands] = useState<{ upper: number[], middle: number[], lower: number[] } | null>(null);
  const [rsiData, setRsiData] = useState<number[]>([]);
  const [macdData, setMacdData] = useState<{ macd: number[], signal: number[], histogram: number[] } | null>(null);
  const [minMaxPrice, setMinMaxPrice] = useState<{min: number, max: number} | null>(null);
  
  // Zeitbereiche
  const timeRanges: {value: TimeRange, label: {de: string, en: string}}[] = [
    { value: "1d", label: { de: "1 Tag", en: "1 Day" } },
    { value: "7d", label: { de: "1 Woche", en: "1 Week" } },
    { value: "30d", label: { de: "1 Monat", en: "1 Month" } },
    { value: "90d", label: { de: "3 Monate", en: "3 Months" } },
    { value: "1y", label: { de: "1 Jahr", en: "1 Year" } },
    { value: "max", label: { de: "Alle", en: "All" } }
  ];
  
  // Text-Ressourcen
  const texts = {
    title: language === "de" ? `${selectedCrypto} Kursverlauf` : `${selectedCrypto} Price Chart`,
    timeRange: language === "de" ? "Zeitraum" : "Time Range",
    chartType: language === "de" ? "Diagrammtyp" : "Chart Type",
    indicators: language === "de" ? "Indikatoren" : "Indicators",
    price: language === "de" ? "Preis" : "Price",
    volume: language === "de" ? "Volumen" : "Volume",
    time: language === "de" ? "Zeit" : "Time",
    refresh: language === "de" ? "Aktualisieren" : "Refresh",
    loading: language === "de" ? "Lädt..." : "Loading...",
    zoomIn: language === "de" ? "Vergrößern" : "Zoom In",
    zoomOut: language === "de" ? "Verkleinern" : "Zoom Out",
    rsi: language === "de" ? "RSI" : "RSI",
    macd: language === "de" ? "MACD" : "MACD",
    bollinger: language === "de" ? "Bollinger Bänder" : "Bollinger Bands",
    overbought: language === "de" ? "Überkauft" : "Overbought",
    oversold: language === "de" ? "Überverkauft" : "Oversold",
    signal: language === "de" ? "Signal" : "Signal",
    histogram: language === "de" ? "Histogramm" : "Histogram",
    upper: language === "de" ? "Oberes Band" : "Upper Band",
    middle: language === "de" ? "Mittleres Band" : "Middle Band",
    lower: language === "de" ? "Unteres Band" : "Lower Band"
  };
  
  // Formatierung der Daten für die Charts
  useEffect(() => {
    if (!historicalData) return;
    
    const priceData: ChartDataItem[] = historicalData.prices.map(([timestamp, price]) => {
      return {
        time: new Date(timestamp),
        price,
      };
    });
    
    // Preise für Indikatoren
    const prices = priceData.map(d => d.price);
    
    // Bollinger Bands berechnen
    if (indicators.includes("bollinger")) {
      setBollingerBands(calculateBollingerBands(prices));
    }
    
    // RSI berechnen
    if (indicators.includes("rsi")) {
      setRsiData(calculateRSI(prices));
    }
    
    // MACD berechnen
    if (indicators.includes("macd")) {
      setMacdData(calculateMACD(prices));
    }
    
    // Min und Max Preis für Y-Achsenskalierung
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const padding = (maxPrice - minPrice) * 0.1;
    setMinMaxPrice({
      min: minPrice - padding,
      max: maxPrice + padding
    });
    
    // Bollinger Bands zu Daten hinzufügen
    if (indicators.includes("bollinger") && bollingerBands) {
      for (let i = 0; i < priceData.length; i++) {
        priceData[i].upper = bollingerBands.upper[i];
        priceData[i].middle = bollingerBands.middle[i];
        priceData[i].lower = bollingerBands.lower[i];
      }
    }
    
    // MACD zu Daten hinzufügen
    if (indicators.includes("macd") && macdData) {
      for (let i = 0; i < priceData.length; i++) {
        priceData[i].macd = macdData.macd[i];
        priceData[i].signal = macdData.signal[i];
        priceData[i].histogram = macdData.histogram[i];
      }
    }
    
    // RSI zu Daten hinzufügen
    if (indicators.includes("rsi")) {
      for (let i = 0; i < priceData.length; i++) {
        priceData[i].rsi = rsiData[i];
      }
    }
    
    setChartData(priceData);
  }, [historicalData, indicators, bollingerBands, rsiData, macdData]);
  
  // Formatierung des Datums
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  // Kursformat für Tooltip
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };
  
  // Chart-Aktualisierung
  const handleRefresh = () => {
    fetchHistoricalData(selectedCrypto, timeRange);
  };
  
  // Benutzerdefinierter Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="card-glass p-3 text-sm shadow-lg">
          <p className="mb-2 font-semibold">{formatDate(new Date(label))}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="flex items-center">
              <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
              <span className="mr-2">{entry.name}:</span>
              <span className="font-medium">
                {entry.name === texts.price || entry.name === texts.upper || entry.name === texts.middle || entry.name === texts.lower
                  ? formatPrice(entry.value)
                  : entry.value.toFixed(2)}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="crypto-card-gradient h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{texts.title}</CardTitle>
        
        <div className="flex items-center space-x-2">
          {/* Zeitraum-Auswahl */}
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-[110px] h-8">
              <SelectValue placeholder={texts.timeRange} />
            </SelectTrigger>
            <SelectContent className="dialog-glass">
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {language === "de" ? range.label.de : range.label.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Chart-Typ */}
          <Tabs value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
            <TabsList className="h-8">
              <TabsTrigger value="line" className="px-2">
                <LineChartIcon className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="candlestick" className="px-2">
                <BarChartIcon className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Aktualisieren */}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 px-2">
        {/* Hauptchart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatDate} 
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
                tickLine={false}
              />
              <YAxis 
                domain={[minMaxPrice?.min || "auto", minMaxPrice?.max || "auto"]} 
                tickFormatter={(value) => formatPrice(value)}
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Bollinger Bands */}
              {indicators.includes("bollinger") && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="upper" 
                    name={texts.upper}
                    stroke="#a3a3a3" 
                    strokeWidth={1} 
                    dot={false} 
                    activeDot={false}
                    strokeDasharray="3 3"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="middle" 
                    name={texts.middle}
                    stroke="#737373" 
                    strokeWidth={1} 
                    dot={false} 
                    activeDot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lower" 
                    name={texts.lower}
                    stroke="#a3a3a3" 
                    strokeWidth={1} 
                    dot={false} 
                    activeDot={false}
                    strokeDasharray="3 3"
                  />
                </>
              )}
              
              {/* Hauptkurslinie */}
              <Line 
                type="monotone" 
                dataKey="price" 
                name={texts.price} 
                stroke="hsl(var(--primary))" 
                fill="url(#colorPrice)" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Indikatoren */}
        {indicators.includes("rsi") && (
          <div className="h-[120px] w-full mt-4">
            <div className="text-xs text-muted-foreground mb-1 flex justify-between">
              <span>{texts.rsi}</span>
              <div className="flex space-x-2">
                <span className="text-crypto-up">{texts.overbought} (70)</span>
                <span className="text-crypto-down">{texts.oversold} (30)</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={formatDate} 
                  tick={{ fontSize: 10 }}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  height={10}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10 }}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  width={25}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={70} stroke="var(--crypto-up)" strokeDasharray="3 3" />
                <ReferenceLine y={30} stroke="var(--crypto-down)" strokeDasharray="3 3" />
                <Line 
                  type="monotone" 
                  dataKey="rsi" 
                  name="RSI" 
                  stroke="#805AD5" 
                  strokeWidth={1.5} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {indicators.includes("macd") && (
          <div className="h-[120px] w-full mt-4">
            <div className="text-xs text-muted-foreground mb-1">{texts.macd}</div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={formatDate} 
                  tick={{ fontSize: 10 }}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  height={10}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  width={25}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="var(--muted-foreground)" />
                <Bar 
                  dataKey="histogram" 
                  name={texts.histogram}
                  fill="var(--muted-foreground)" 
                  opacity={0.5}
                />
                <Line 
                  type="monotone" 
                  dataKey="macd" 
                  name="MACD" 
                  stroke="#3B82F6" 
                  strokeWidth={1.5} 
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="signal" 
                  name={texts.signal} 
                  stroke="#EF4444" 
                  strokeWidth={1.5} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Chart;
