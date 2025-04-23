import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Portfolio from "@/pages/portfolio";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Portfolio />
    </TooltipProvider>
  );
}

export default App;