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

// Detail pages
import ServiceDetail from "./pages/ServiceDetail";
import ProjectDetail from "./pages/ProjectDetail";

// Simplified Contacts page component
const Contacts = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold">Contact Us</h1>
    <p className="mt-4">Contact form will be implemented here</p>
  </div>
);

// Simplified detail pages
const NewsDetail = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold">News Article</h1>
    <p className="mt-4">News details will be implemented here</p>
  </div>
);

const CatalogDetail = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold">Product Details</h1>
    <p className="mt-4">Product details will be implemented here</p>
  </div>
);

// Simplified admin pages
const AuthLogin = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold">Admin Login</h1>
    <p className="mt-4">Admin authentication will be implemented here</p>
  </div>
);

const Admin = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold">Admin Panel</h1>
    <p className="mt-4">Admin panel will be implemented here</p>
  </div>
);

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
              
              {/* Admin routes - temporarily simplified during migration */}
              <Route path="/auth/login" element={<AuthLogin />} />
              <Route path="/admin" element={<Admin />} />
              
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
