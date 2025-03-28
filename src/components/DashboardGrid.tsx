
import React from "react";
import CryptoCard from "@/components/CryptoCard";
import Chart from "@/components/Chart";
import TradingIndicators from "@/components/TradingIndicators";
import AIRecommendation from "@/components/AIRecommendation";
import AlertSettings from "@/components/AlertSettings";
import { useAppContext } from "@/context/AppContext";

const DashboardGrid: React.FC = () => {
  const { cryptoData, selectedCrypto } = useAppContext();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 animate-fade-in">
      {/* Kryptokarten */}
      <div className="col-span-1 md:col-span-3 lg:col-span-3 flex flex-col gap-4">
        {cryptoData.map((crypto) => (
          <CryptoCard 
            key={crypto.symbol} 
            crypto={crypto} 
            isSelected={crypto.symbol === selectedCrypto}
          />
        ))}
      </div>
      
      {/* Hauptchart */}
      <div className="col-span-1 md:col-span-3 lg:col-span-6">
        <Chart />
      </div>
      
      {/* Rechte Spalte */}
      <div className="col-span-1 md:col-span-3 lg:col-span-3 flex flex-col gap-6">
        {/* Trading-Indikatoren */}
        <div className="flex-1">
          <TradingIndicators />
        </div>
        
        {/* KI-Empfehlung */}
        <div className="flex-1">
          <AIRecommendation />
        </div>
        
        {/* Preisalarme */}
        <div className="flex-1">
          <AlertSettings />
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;
