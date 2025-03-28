
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Indicator, useAppContext } from "@/context/AppContext";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const TradingIndicators: React.FC = () => {
  const { indicators, toggleIndicator, language } = useAppContext();
  
  const texts = {
    title: language === "de" ? "Trading-Indikatoren" : "Trading Indicators",
    bollinger: language === "de" ? "Bollinger Bänder" : "Bollinger Bands",
    macd: language === "de" ? "MACD" : "MACD",
    rsi: language === "de" ? "RSI" : "RSI",
    ma: language === "de" ? "Gleitender Durchschnitt" : "Moving Average",
    ema: language === "de" ? "Exp. gleitender Durchschnitt" : "Exp. Moving Average",
    description: {
      bollinger: language === "de" 
        ? "Zeigt Volatilität und relative Preisniveaus." 
        : "Shows volatility and relative price levels.",
      macd: language === "de" 
        ? "Momentum-Indikator, der Trend und Momentum zeigt." 
        : "Momentum indicator showing trend and momentum.",
      rsi: language === "de" 
        ? "Misst Geschwindigkeit und Änderung von Preisbewegungen." 
        : "Measures speed and change of price movements.",
      ma: language === "de" 
        ? "Durchschnittlicher Preis über einen bestimmten Zeitraum." 
        : "Average price over a specific time period.",
      ema: language === "de" 
        ? "Gewichtet neuere Preise stärker als ältere." 
        : "Weighs recent prices more heavily than older ones."
    }
  };
  
  const indicatorData: {id: Indicator, name: string, description: string}[] = [
    { id: "bollinger", name: texts.bollinger, description: texts.description.bollinger },
    { id: "macd", name: texts.macd, description: texts.description.macd },
    { id: "rsi", name: texts.rsi, description: texts.description.rsi },
    { id: "ma", name: texts.ma, description: texts.description.ma },
    { id: "ema", name: texts.ema, description: texts.description.ema }
  ];
  
  return (
    <Card className="crypto-card-gradient h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{texts.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {indicatorData.map((indicator) => (
            <div 
              key={indicator.id}
              className={cn(
                "group flex items-start space-x-4 p-3 rounded-lg transition-all cursor-pointer",
                indicators.includes(indicator.id) 
                  ? "bg-primary/10 border border-primary/20" 
                  : "hover:bg-primary/5 border border-transparent"
              )}
              onClick={() => toggleIndicator(indicator.id)}
            >
              <div className={cn(
                "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
                indicators.includes(indicator.id) 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "border-muted-foreground group-hover:border-primary"
              )}>
                {indicators.includes(indicator.id) && (
                  <Check className="h-3 w-3" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{indicator.name}</h3>
                <p className="text-sm text-muted-foreground">{indicator.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingIndicators;
