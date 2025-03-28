
import React, { useState } from "react";
import { 
  Moon, 
  Sun, 
  Languages, 
  Settings, 
  Bell
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    theme, 
    setTheme 
  } = useAppContext();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const texts = {
    title: language === "de" ? "Crypto Dashboard" : "Crypto Dashboard",
    settings: language === "de" ? "Einstellungen" : "Settings",
    alerts: language === "de" ? "Alarme" : "Alerts",
    language: language === "de" ? "Sprache" : "Language",
    theme: language === "de" ? "Design" : "Theme",
    german: language === "de" ? "Deutsch" : "German",
    english: language === "de" ? "Englisch" : "English",
    light: language === "de" ? "Hell" : "Light",
    dark: language === "de" ? "Dunkel" : "Dark", 
    system: language === "de" ? "System" : "System",
  };

  return (
    <nav className="glass-morphism sticky top-0 z-50 w-full border-b border-white/10 dark:border-white/5 py-2 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo und Titel */}
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <div className="w-7 h-7 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-crypto-xrp via-crypto-cardano to-crypto-uniswap rounded-full opacity-80 animate-pulse-soft"></div>
              <div className="absolute inset-2 bg-background rounded-full"></div>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">{texts.title}</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Sprache */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label={texts.language}>
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dialog-glass">
              <DropdownMenuLabel>{texts.language}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className={language === "de" ? "bg-primary/10" : ""}
                onClick={() => setLanguage("de")}
              >
                {texts.german}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={language === "en" ? "bg-primary/10" : ""}
                onClick={() => setLanguage("en")}
              >
                {texts.english}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label={texts.theme}>
                {theme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dialog-glass">
              <DropdownMenuLabel>{texts.theme}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className={theme === "light" ? "bg-primary/10" : ""}
                onClick={() => setTheme("light")}
              >
                {texts.light}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={theme === "dark" ? "bg-primary/10" : ""}
                onClick={() => setTheme("dark")}
              >
                {texts.dark}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={theme === "system" ? "bg-primary/10" : ""}
                onClick={() => setTheme("system")}
              >
                {texts.system}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Alert-Button */}
          <Button variant="ghost" size="icon" className="rounded-full" aria-label={texts.alerts}>
            <Bell className="h-5 w-5" />
          </Button>

          {/* Einstellungen */}
          <Button variant="ghost" size="icon" className="rounded-full" aria-label={texts.settings}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-primary/10 smooth-transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`h-0.5 w-full bg-foreground rounded-full transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`h-0.5 w-full bg-foreground rounded-full transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
            <span className={`h-0.5 w-full bg-foreground rounded-full transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`absolute top-full left-0 right-0 glass-morphism md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 flex flex-col space-y-3">
          <Button variant="ghost" className="w-full justify-start" onClick={() => setLanguage(language === "de" ? "en" : "de")}>
            <Languages className="mr-2 h-5 w-5" />
            {language === "de" ? "Sprache: Deutsch" : "Language: English"}
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? (
              <>
                <Moon className="mr-2 h-5 w-5" />
                {texts.dark}
              </>
            ) : (
              <>
                <Sun className="mr-2 h-5 w-5" />
                {texts.light}
              </>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Bell className="mr-2 h-5 w-5" />
            {texts.alerts}
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-5 w-5" />
            {texts.settings}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
