
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { Sparkles, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const AIRecommendation: React.FC = () => {
  const { selectedCrypto, getAIRecommendation, language } = useAppContext();
  const [recommendation, setRecommendation] = useState<string>("");
  const [action, setAction] = useState<"buy" | "sell" | "hold">("hold");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingDots, setLoadingDots] = useState<string>("");
  
  const texts = {
    title: language === "de" ? "KI-Empfehlung" : "AI Recommendation",
    refresh: language === "de" ? "Neue Analyse" : "New Analysis",
    loading: language === "de" ? "Analysiere" : "Analyzing",
    buy: language === "de" ? "Kaufen" : "Buy",
    sell: language === "de" ? "Verkaufen" : "Sell",
    hold: language === "de" ? "Halten" : "Hold",
    disclaimer: language === "de" 
      ? "Hinweis: Dies ist keine Finanzberatung" 
      : "Disclaimer: This is not financial advice"
  };
  
  // Animierte Ladepunkte
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingDots(prev => prev.length < 3 ? prev + "." : "");
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isLoading]);
  
  // Empfehlung abrufen
  const fetchRecommendation = async () => {
    setIsLoading(true);
    try {
      const result = await getAIRecommendation();
      setRecommendation(result);
      
      if (result.toLowerCase().includes("kauf") || result.toLowerCase().includes("buy")) {
        setAction("buy");
      } else if (result.toLowerCase().includes("verkauf") || result.toLowerCase().includes("sell")) {
        setAction("sell");
      } else {
        setAction("hold");
      }
    } catch (error) {
      console.error("Fehler bei der KI-Empfehlung:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Erste Empfehlung beim Laden
  useEffect(() => {
    fetchRecommendation();
  }, [selectedCrypto]);
  
  return (
    <Card className="crypto-card-gradient h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            {texts.title}
          </CardTitle>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={fetchRecommendation}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse"></div>
              <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">
              {texts.loading}{loadingDots}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-2 flex justify-center">
              <div className={cn(
                "px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1",
                action === "buy" ? "bg-crypto-up/20 text-crypto-up" :
                action === "sell" ? "bg-crypto-down/20 text-crypto-down" :
                "bg-muted/20 text-muted-foreground"
              )}>
                {action === "buy" ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : action === "sell" ? (
                  <TrendingDown className="h-4 w-4 mr-1" />
                ) : (
                  <Minus className="h-4 w-4 mr-1" />
                )}
                <span>
                  {action === "buy" ? texts.buy :
                   action === "sell" ? texts.sell :
                   texts.hold}
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex-1">
              <p className="text-center">{recommendation}</p>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 pb-3 px-4 text-xs text-muted-foreground text-center">
        {texts.disclaimer}
      </CardFooter>
    </Card>
  );
};

export default AIRecommendation;
