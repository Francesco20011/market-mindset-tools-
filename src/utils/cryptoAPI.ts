
import { CryptoSymbol, TimeRange } from "@/context/AppContext";

// Schnittstellen für API-Daten
export interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
}

export interface CoinGeckoHistoricalData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// IDs für CoinGecko API
const coinGeckoIds: Record<CryptoSymbol, string> = {
  "XRP": "ripple",
  "ADA": "cardano",
  "DOGE": "dogecoin",
  "MATIC": "matic-network",
  "UNI": "uniswap"
};

// Marktdaten für mehrere Kryptowährungen abrufen
export const fetchMarketData = async (symbols: CryptoSymbol[] = ["XRP", "ADA", "DOGE", "MATIC", "UNI"]) => {
  try {
    const ids = symbols.map(symbol => coinGeckoIds[symbol]).join(",");
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=de`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: CoinGeckoMarketData[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw error;
  }
};

// Historische Daten für eine Kryptowährung abrufen
export const fetchHistoricalPriceData = async (symbol: CryptoSymbol, range: TimeRange) => {
  try {
    const id = coinGeckoIds[symbol];
    const days = 
      range === "1d" ? 1 :
      range === "7d" ? 7 :
      range === "30d" ? 30 :
      range === "90d" ? 90 :
      range === "1y" ? 365 :
      "max";
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=eur&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: CoinGeckoHistoricalData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
};

// Kryptowährungsdetails abrufen
export const fetchCoinDetails = async (symbol: CryptoSymbol) => {
  try {
    const id = coinGeckoIds[symbol];
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching coin details:", error);
    throw error;
  }
};
