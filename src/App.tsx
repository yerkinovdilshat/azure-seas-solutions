import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Suspense } from 'react';

// Import i18n configuration
import './i18n';

// Import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Catalog from "./pages/Catalog";
import Projects from "./pages/Projects";
import News from "./pages/News";
import Contacts from "./pages/Contacts";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";

// Admin pages
import AuthLogin from "./pages/AuthLogin";
import Admin from "./pages/Admin";
import AdminAbout from "./pages/AdminAbout";
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
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/news" element={<News />} />
              <Route path="/contacts" element={<Contacts />} />
              
              {/* Admin routes */}
              <Route path="/auth/login" element={<AuthLogin />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/about" element={<AdminAbout />} />
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
