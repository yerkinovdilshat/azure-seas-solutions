import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Suspense } from 'react';
// AuthProvider temporarily disabled during migration

// Import i18n configuration
import './i18n';

// Import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Catalog from "./pages/Catalog";
import CatalogProduction from "./pages/CatalogProduction";
import CatalogSupply from "./pages/CatalogSupply";
import Projects from "./pages/Projects";
import News from "./pages/News";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Admin from "./pages/Admin";
import AdminSiteSettings from "./pages/AdminSiteSettings";
import AdminAboutItems from "./pages/AdminAboutItems";
import AdminNews from "./pages/AdminNews";
import AdminProjects from "./pages/AdminProjects";
import AdminServices from "./pages/AdminServices";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      
        <TooltipProvider>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/catalog/production" element={<CatalogProduction />} />
              <Route path="/catalog/supply" element={<CatalogSupply />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/news" element={<News />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Admin />}>
                <Route path="site" element={<AdminSiteSettings />} />
                <Route path="about" element={<AdminAboutItems />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="services" element={<AdminServices />} />
              </Route>
              
              {/* Error routes */}
              <Route path="/404" element={<Error404 />} />
              <Route path="/500" element={<Error500 />} />
              {/* Catch-all route for 404 */}
              <Route path="*" element={<Error404 />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </TooltipProvider>
    
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
