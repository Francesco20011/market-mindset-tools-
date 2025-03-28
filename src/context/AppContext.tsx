
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

// Typen für Kryptowährungen
export type CryptoSymbol = "XRP" | "ADA" | "DOGE" | "MATIC" | "UNI";

export interface CryptoData {
  id: string;
  symbol: CryptoSymbol;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  last_updated: string;
}

export interface HistoricalData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export type ChartType = "candlestick" | "line";
export type TimeRange = "1d" | "7d" | "30d" | "90d" | "1y" | "max";
export type Indicator = "bollinger" | "macd" | "rsi" | "ma" | "ema";
export type Language = "de" | "en";
export type Theme = "light" | "dark" | "system";

export interface AppContextProps {
  cryptoData: CryptoData[];
  selectedCrypto: CryptoSymbol;
  setSelectedCrypto: (symbol: CryptoSymbol) => void;
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  indicators: Indicator[];
  toggleIndicator: (indicator: Indicator) => void;
  historicalData: HistoricalData | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
  alerts: Map<CryptoSymbol, { above: number | null; below: number | null }>;
  setAlert: (symbol: CryptoSymbol, type: "above" | "below", value: number | null) => void;
  removeAlert: (symbol: CryptoSymbol, type: "above" | "below") => void;
  fetchData: () => Promise<void>;
  fetchHistoricalData: (symbol: CryptoSymbol, range: TimeRange) => Promise<void>;
  getAIRecommendation: () => Promise<string>;
}

// Standard-CryptoData-Objekt für den Fall, dass die API nicht antwortet
const defaultCryptoData: CryptoData[] = [
  {
    id: "ripple",
    symbol: "XRP",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.5,
    price_change_percentage_24h: 0.0,
    market_cap: 27000000000,
    total_volume: 1000000000,
    high_24h: 0.52,
    low_24h: 0.49,
    last_updated: new Date().toISOString(),
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.35,
    price_change_percentage_24h: 0.0,
    market_cap: 12000000000,
    total_volume: 500000000,
    high_24h: 0.36,
    low_24h: 0.34,
    last_updated: new Date().toISOString(),
  },
  {
    id: "dogecoin",
    symbol: "DOGE",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.1,
    price_change_percentage_24h: 0.0,
    market_cap: 14000000000,
    total_volume: 600000000,
    high_24h: 0.11,
    low_24h: 0.09,
    last_updated: new Date().toISOString(),
  },
  {
    id: "matic-network",
    symbol: "MATIC",
    name: "Polygon",
    image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    current_price: 0.5,
    price_change_percentage_24h: 0.0,
    market_cap: 5000000000,
    total_volume: 300000000,
    high_24h: 0.52,
    low_24h: 0.48,
    last_updated: new Date().toISOString(),
  },
  {
    id: "uniswap",
    symbol: "UNI",
    name: "Uniswap",
    image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
    current_price: 7.0,
    price_change_percentage_24h: 0.0,
    market_cap: 4000000000,
    total_volume: 200000000,
    high_24h: 7.2,
    low_24h: 6.8,
    last_updated: new Date().toISOString(),
  }
];

// Kontext erstellen
const AppContext = createContext<AppContextProps | undefined>(undefined);

// Provider-Komponente
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(defaultCryptoData);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoSymbol>("XRP");
  const [chartType, setChartType] = useState<ChartType>("candlestick");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [indicators, setIndicators] = useState<Indicator[]>(["bollinger", "rsi"]);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>("de");
  const [theme, setTheme] = useState<Theme>("system");
  const [alerts, setAlerts] = useState<Map<CryptoSymbol, { above: number | null; below: number | null }>>(
    new Map([
      ["XRP", { above: null, below: null }],
      ["ADA", { above: null, below: null }],
      ["DOGE", { above: null, below: null }],
      ["MATIC", { above: null, below: null }],
      ["UNI", { above: null, below: null }],
    ])
  );

  // Darkmode-Einstellung basierend auf System oder Benutzereinstellung
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Indikator umschalten
  const toggleIndicator = (indicator: Indicator) => {
    setIndicators(prev => 
      prev.includes(indicator)
        ? prev.filter(ind => ind !== indicator)
        : [...prev, indicator]
    );
  };

  // Alarm setzen
  const setAlert = (symbol: CryptoSymbol, type: "above" | "below", value: number | null) => {
    setAlerts(prev => {
      const newAlerts = new Map(prev);
      const current = newAlerts.get(symbol) || { above: null, below: null };
      newAlerts.set(symbol, { ...current, [type]: value });
      return newAlerts;
    });
    
    if (value !== null) {
      toast({
        title: language === "de" ? "Preisalarm gesetzt" : "Price alert set",
        description: `${symbol}: ${type === "above" ? ">" : "<"} ${value}€`,
      });
    }
  };

  // Alarm entfernen
  const removeAlert = (symbol: CryptoSymbol, type: "above" | "below") => {
    setAlerts(prev => {
      const newAlerts = new Map(prev);
      const current = newAlerts.get(symbol) || { above: null, below: null };
      newAlerts.set(symbol, { ...current, [type]: null });
      return newAlerts;
    });
  };

  // Kryptodaten abrufen
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In einer realen App würde hier ein API-Aufruf stehen
      // Für diese Demo simulieren wir Daten mit leichten Änderungen
      const updatedData = cryptoData.map(crypto => {
        const priceChange = (Math.random() - 0.5) * 5; // Zufällige Preisänderung zwischen -2.5% und +2.5%
        const newPrice = crypto.current_price * (1 + priceChange / 100);
        return {
          ...crypto,
          current_price: newPrice,
          price_change_percentage_24h: priceChange,
          last_updated: new Date().toISOString(),
        };
      });
      setCryptoData(updatedData);

      // Preisalarme prüfen
      updatedData.forEach(crypto => {
        const alert = alerts.get(crypto.symbol as CryptoSymbol);
        if (alert) {
          if (alert.above !== null && crypto.current_price > alert.above) {
            toast({
              title: language === "de" ? "Preisalarm" : "Price Alert",
              description: `${crypto.symbol} ${language === "de" ? "ist über" : "is above"} ${alert.above}€`,
              variant: "destructive",
            });
          }
          if (alert.below !== null && crypto.current_price < alert.below) {
            toast({
              title: language === "de" ? "Preisalarm" : "Price Alert",
              description: `${crypto.symbol} ${language === "de" ? "ist unter" : "is below"} ${alert.below}€`,
              variant: "destructive",
            });
          }
        }
      });
    } catch (error) {
      console.error("Fehler beim Abrufen der Kryptodaten:", error);
      toast({
        title: language === "de" ? "Fehler" : "Error",
        description: language === "de" 
          ? "Daten konnten nicht aktualisiert werden." 
          : "Could not update data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Historische Daten abrufen
  const fetchHistoricalData = async (symbol: CryptoSymbol, range: TimeRange) => {
    setIsLoading(true);
    try {
      // In einer realen App würde hier ein API-Aufruf stehen
      // Für diese Demo generieren wir zufällige Daten
      const days = range === "1d" ? 1 : range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365;
      const startPrice = cryptoData.find(c => c.symbol === symbol)?.current_price || 1;
      
      const prices: [number, number][] = [];
      const market_caps: [number, number][] = [];
      const total_volumes: [number, number][] = [];
      
      const now = Date.now();
      const msPerDay = 86400000;
      const pointsPerDay = 24;
      const totalPoints = days * pointsPerDay;
      const msPerPoint = msPerDay / pointsPerDay;
      
      let currentPrice = startPrice;
      for (let i = 0; i < totalPoints; i++) {
        const timestamp = now - (totalPoints - i) * msPerPoint;
        const volatility = 0.01; // 1% Volatilität pro Punkt
        const change = (Math.random() - 0.5) * 2 * volatility;
        currentPrice = currentPrice * (1 + change);
        
        prices.push([timestamp, currentPrice]);
        market_caps.push([timestamp, currentPrice * 1000000000]);
        total_volumes.push([timestamp, currentPrice * 100000000]);
      }
      
      setHistoricalData({ prices, market_caps, total_volumes });
    } catch (error) {
      console.error("Fehler beim Abrufen historischer Daten:", error);
      toast({
        title: language === "de" ? "Fehler" : "Error",
        description: language === "de" 
          ? "Historische Daten konnten nicht geladen werden." 
          : "Could not load historical data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // KI-Empfehlung abrufen
  const getAIRecommendation = async (): Promise<string> => {
    const crypto = cryptoData.find(c => c.symbol === selectedCrypto);
    if (!crypto) return language === "de" ? "Keine Daten verfügbar" : "No data available";
    
    // Simulierte KI-Empfehlung basierend auf Preisänderung und Zufall
    const randomFactor = Math.random();
    const priceChange = crypto.price_change_percentage_24h;
    
    if (priceChange > 2) {
      return randomFactor > 0.3 
        ? (language === "de" ? "Verkaufen: Der Kurs ist stark gestiegen und könnte korrigieren" : "Sell: The price has risen significantly and might correct")
        : (language === "de" ? "Halten: Trotz Anstieg besteht weiteres Potenzial" : "Hold: Despite the increase, there is more potential");
    } else if (priceChange < -2) {
      return randomFactor > 0.3
        ? (language === "de" ? "Kaufen: Der niedrige Preis bietet eine Einstiegschance" : "Buy: The low price offers an entry opportunity")
        : (language === "de" ? "Halten: Weitere Verluste könnten folgen" : "Hold: Further losses may follow");
    } else {
      return language === "de" 
        ? "Halten: Der Markt zeigt keine klare Richtung" 
        : "Hold: The market shows no clear direction";
    }
  };

  // Initialen Datenabruf
  useEffect(() => {
    fetchData();
    fetchHistoricalData(selectedCrypto, timeRange);
    
    // Daten alle 30 Sekunden aktualisieren
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Historische Daten aktualisieren, wenn sich Krypto oder Zeitraum ändert
  useEffect(() => {
    fetchHistoricalData(selectedCrypto, timeRange);
  }, [selectedCrypto, timeRange]);

  return (
    <AppContext.Provider
      value={{
        cryptoData,
        selectedCrypto,
        setSelectedCrypto,
        chartType,
        setChartType,
        timeRange,
        setTimeRange,
        indicators,
        toggleIndicator,
        historicalData,
        language,
        setLanguage,
        theme, 
        setTheme,
        isLoading,
        alerts,
        setAlert,
        removeAlert,
        fetchData,
        fetchHistoricalData,
        getAIRecommendation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook für einfachen Zugriff auf den Kontext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
