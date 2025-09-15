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
import Contacts from "./pages/Contacts";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";

// Detail pages
import ServiceDetail from "./pages/ServiceDetail";
import ProjectDetail from "./pages/ProjectDetail";
import NewsDetail from "./pages/NewsDetail";
import CatalogDetail from "./pages/CatalogDetail";

// Admin pages
import AuthLogin from "./pages/AuthLogin";
import Admin from "./pages/Admin";
import AdminAbout from "./pages/AdminAbout";
import AdminAboutStory from "./pages/AdminAboutStory";
import AdminAboutValues from "./pages/AdminAboutValues";
import AdminAboutTimeline from "./pages/AdminAboutTimeline";
import AdminAboutTeam from "./pages/AdminAboutTeam";
import AdminAboutPartners from "./pages/AdminAboutPartners";
import AdminAboutDistribution from "./pages/AdminAboutDistribution";
import AdminAboutCertificates from "./pages/AdminAboutCertificates";
import AdminAboutLicenses from "./pages/AdminAboutLicenses";
import AdminNews from "./pages/AdminNews";
import AdminProjects from "./pages/AdminProjects";
import AdminServices from "./pages/AdminServices";
import AdminCatalog from "./pages/AdminCatalog";
import AdminContacts from "./pages/AdminContacts";

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
              <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/production" element={<CatalogProduction />} />
            <Route path="/catalog/supply" element={<CatalogSupply />} />
            <Route path="/catalog/:slug" element={<CatalogDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/contacts" element={<Contacts />} />
              
              {/* Admin routes */}
              <Route path="/auth/login" element={<AuthLogin />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/about" element={<AdminAbout />} />
        <Route path="/admin/about/story" element={<AdminAboutStory />} />
        <Route path="/admin/about/values" element={<AdminAboutValues />} />
        <Route path="/admin/about/timeline" element={<AdminAboutTimeline />} />
        <Route path="/admin/about/team" element={<AdminAboutTeam />} />
        <Route path="/admin/about/partners" element={<AdminAboutPartners />} />
        <Route path="/admin/about/distribution" element={<AdminAboutDistribution />} />
        <Route path="/admin/about/certificates" element={<AdminAboutCertificates />} />
        <Route path="/admin/about/licenses" element={<AdminAboutLicenses />} />
              <Route path="/admin/news" element={<AdminNews />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/catalog" element={<AdminCatalog />} />
              <Route path="/admin/contacts" element={<AdminContacts />} />
              
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
