
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "@/components/layout/AppLayout";

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
  // Prefetch fonts to avoid layout shifts
  useEffect(() => {
    // Add font feature settings explicitly
    document.documentElement.classList.add('font-feature-settings-enabled');
    
    // Preload Merriweather and Open Sans fonts
    const fontLinks = [
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap',
        as: 'style'
      },
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap',
        as: 'style'
      }
    ];
    
    fontLinks.forEach(font => {
      const link = document.createElement('link');
      Object.entries(font).forEach(([key, value]) => {
        link.setAttribute(key, value);
      });
      document.head.appendChild(link);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AnimatePresence mode="wait">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<AppLayout><Index /></AppLayout>} />
                <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                <Route path="/water" element={<AppLayout><WaterModule /></AppLayout>} />
                <Route path="/farmer" element={<AppLayout><FarmerModule /></AppLayout>} />
                <Route path="/education" element={<AppLayout><EducationModule /></AppLayout>} />
                <Route path="/health" element={<AppLayout><HealthModule /></AppLayout>} />
                <Route path="/resource" element={<AppLayout><ResourceModule /></AppLayout>} />
                <Route path="/climate" element={<AppLayout><ClimateModule /></AppLayout>} />
                <Route path="/gender" element={<AppLayout><GenderModule /></AppLayout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AnimatePresence>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
