
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CryptoData, CryptoSymbol, useAppContext } from "@/context/AppContext";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CryptoCardProps {
  crypto: CryptoData;
  isSelected?: boolean;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, isSelected = false }) => {
  const { setSelectedCrypto, language } = useAppContext();
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };
  
  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };
  
  const isPositive = crypto.price_change_percentage_24h > 0;
  const isNeutral = crypto.price_change_percentage_24h === 0;
  
  return (
    <Card 
      className={cn(
        "crypto-card-gradient hover-scale overflow-hidden cursor-pointer border-transparent transition-all duration-300",
        isSelected ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"
      )}
      onClick={() => setSelectedCrypto(crypto.symbol as CryptoSymbol)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white/10 p-1">
            <img 
              src={crypto.image} 
              alt={crypto.name} 
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{crypto.name}</h3>
              <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                {crypto.symbol}
              </span>
            </div>
            
            <div className="mt-1 flex items-center justify-between">
              <p className="text-lg font-bold">{formatCurrency(crypto.current_price)}</p>
              
              <div className={cn(
                "flex items-center space-x-1 text-sm px-2 py-0.5 rounded-full",
                isPositive ? "text-crypto-up bg-crypto-up/10" : 
                isNeutral ? "text-muted-foreground bg-muted/20" : 
                "text-crypto-down bg-crypto-down/10"
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : isNeutral ? (
                  <AlertCircle className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{formatPercentage(crypto.price_change_percentage_24h)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border/40 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">{language === "de" ? "24h Hoch" : "24h High"}</p>
            <p className="font-medium">{formatCurrency(crypto.high_24h)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{language === "de" ? "24h Tief" : "24h Low"}</p>
            <p className="font-medium">{formatCurrency(crypto.low_24h)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoCard;
