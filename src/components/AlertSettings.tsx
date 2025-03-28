
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CryptoSymbol, useAppContext } from "@/context/AppContext";
import { Bell, AlertTriangle, X } from "lucide-react";

const AlertSettings: React.FC = () => {
  const { cryptoData, alerts, setAlert, removeAlert, language } = useAppContext();
  const [selectedCryptoForAlert, setSelectedCryptoForAlert] = useState<CryptoSymbol>("XRP");
  const [alertType, setAlertType] = useState<"above" | "below">("above");
  const [alertValue, setAlertValue] = useState<string>("");
  
  const texts = {
    title: language === "de" ? "Preisalarme" : "Price Alerts",
    crypto: language === "de" ? "Kryptowährung" : "Cryptocurrency",
    condition: language === "de" ? "Bedingung" : "Condition",
    price: language === "de" ? "Preis" : "Price",
    above: language === "de" ? "Über" : "Above",
    below: language === "de" ? "Unter" : "Below",
    set: language === "de" ? "Festlegen" : "Set",
    activeAlerts: language === "de" ? "Aktive Alarme" : "Active Alerts",
    noAlerts: language === "de" ? "Keine aktiven Alarme" : "No active alerts",
  };
  
  // Alarm setzen
  const handleSetAlert = () => {
    if (!alertValue || isNaN(parseFloat(alertValue))) return;
    setAlert(selectedCryptoForAlert, alertType, parseFloat(alertValue));
    setAlertValue("");
  };
  
  // Formatiert den Preis im lokalen Format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };
  
  // Aktive Alarme generieren
  const activeAlerts = Array.from(alerts.entries())
    .flatMap(([symbol, alert]) => [
      alert.above !== null ? { symbol, type: "above" as const, value: alert.above } : null,
      alert.below !== null ? { symbol, type: "below" as const, value: alert.below } : null,
    ])
    .filter(Boolean) as { symbol: CryptoSymbol; type: "above" | "below"; value: number; }[];
  
  return (
    <Card className="crypto-card-gradient h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Bell className="h-5 w-5 mr-2 text-primary" />
          {texts.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Kryptowährung */}
          <Select
            value={selectedCryptoForAlert}
            onValueChange={(value) => setSelectedCryptoForAlert(value as CryptoSymbol)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={texts.crypto} />
            </SelectTrigger>
            <SelectContent className="dialog-glass">
              {cryptoData.map((crypto) => (
                <SelectItem key={crypto.symbol} value={crypto.symbol}>
                  {crypto.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Bedingung */}
          <Select
            value={alertType}
            onValueChange={(value) => setAlertType(value as "above" | "below")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={texts.condition} />
            </SelectTrigger>
            <SelectContent className="dialog-glass">
              <SelectItem value="above">{texts.above}</SelectItem>
              <SelectItem value="below">{texts.below}</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Preis */}
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder={texts.price}
              value={alertValue}
              onChange={(e) => setAlertValue(e.target.value)}
              className="flex-1"
              min="0"
              step="0.000001"
            />
            <Button onClick={handleSetAlert} disabled={!alertValue || isNaN(parseFloat(alertValue))}>
              {texts.set}
            </Button>
          </div>
        </div>
        
        {/* Aktive Alarme */}
        <div className="mt-4 flex-1">
          <h3 className="text-sm font-medium mb-2">{texts.activeAlerts}</h3>
          
          {activeAlerts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {texts.noAlerts}
            </p>
          ) : (
            <div className="space-y-2">
              {activeAlerts.map((alert, index) => {
                const crypto = cryptoData.find(c => c.symbol === alert.symbol);
                return (
                  <div 
                    key={`${alert.symbol}-${alert.type}-${index}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-primary/5 border border-primary/10"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden bg-white/10">
                        <img 
                          src={crypto?.image} 
                          alt={alert.symbol} 
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="font-medium">{alert.symbol}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={alert.type === "above" ? "text-crypto-up" : "text-crypto-down"}>
                        {alert.type === "above" ? ">" : "<"} {formatPrice(alert.value)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeAlert(alert.symbol, alert.type)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertSettings;
