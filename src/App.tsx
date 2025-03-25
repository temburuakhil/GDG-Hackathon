
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import WaterModule from "./pages/modules/WaterModule";
import FarmerModule from "./pages/modules/FarmerModule";
import EducationModule from "./pages/modules/EducationModule";
import HealthModule from "./pages/modules/HealthModule";
import ResourceModule from "./pages/modules/ResourceModule";
import ClimateModule from "./pages/modules/ClimateModule";
import GenderModule from "./pages/modules/GenderModule";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Prefetch Inter font to avoid layout shifts
  useEffect(() => {
    // Add Inter variable font support explicitly
    document.documentElement.classList.add('font-feature-settings-enabled');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence mode="wait">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/water" element={<WaterModule />} />
              <Route path="/farmer" element={<FarmerModule />} />
              <Route path="/education" element={<EducationModule />} />
              <Route path="/health" element={<HealthModule />} />
              <Route path="/resource" element={<ResourceModule />} />
              <Route path="/climate" element={<ClimateModule />} />
              <Route path="/gender" element={<GenderModule />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
