
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import DashboardGrid from "@/components/DashboardGrid";
import { AppProvider } from "@/context/AppContext";

const Index: React.FC = () => {
  // Wir setzen hier den Overflow-y auf auto, um Scrolling zu ermöglichen
  useEffect(() => {
    document.body.style.overflowY = "auto";
    
    return () => {
      document.body.style.overflowY = "";
    };
  }, []);

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 container mx-auto py-6 px-4 sm:px-6">
          <DashboardGrid />
        </main>
        
        <footer className="border-t border-border/20 py-6 bg-background">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Crypto Dashboard</p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
};

export default Index;
