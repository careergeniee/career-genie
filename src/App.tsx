import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Globe2 } from "lucide-react";

const DashboardLayout = lazy(() =>
  import("@/components/DashboardLayout").then((m) => ({ default: m.DashboardLayout }))
);
const ComingSoon = lazy(() => import("@/pages/dashboard/ComingSoon"));

const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DashboardHome = lazy(() => import("./pages/dashboard/Home"));
const ChatPage = lazy(() => import("./pages/dashboard/Chat"));
const ResumePage = lazy(() => import("./pages/dashboard/Resume"));
const InterviewPage = lazy(() => import("./pages/dashboard/Interview"));
const RoadmapPage = lazy(() => import("./pages/dashboard/Roadmap"));
const AssessmentPage = lazy(() => import("./pages/dashboard/Assessment"));
const CareersPage = lazy(() => import("./pages/dashboard/Careers"));
const InstructorPage = lazy(() => import("./pages/dashboard/Instructor"));
const SettingsPage = lazy(() => import("./pages/dashboard/Settings"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const Loader = () => (
  <div className="min-h-screen hero-bg flex items-center justify-center">
    <div className="text-primary animate-pulse font-display text-xl">Loading...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected dashboard routes */}
              <Route path="/dashboard" element={
                <PrivateRoute><DashboardLayout /></PrivateRoute>
              }>
                <Route index element={<DashboardHome />} />
                <Route path="assessment" element={<AssessmentPage />} />
                <Route path="careers" element={<CareersPage />} />
                <Route path="instructor" element={<InstructorPage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="resume" element={<ResumePage />} />
                <Route path="interview" element={<InterviewPage />} />
                <Route path="roadmap" element={<RoadmapPage />} />
                <Route path="career-verse" element={<ComingSoon title="3D Career Verse" desc="Immersive 3D career exploration environments." Icon={Globe2} />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;