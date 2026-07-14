import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const DashboardLayout = lazy(() =>
  import("@/components/DashboardLayout").then((m) => ({ default: m.DashboardLayout }))
);

const Index = lazy(() => import("./pages/Index"));
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

const Loader = () => (
  <div className="min-h-screen hero-bg flex items-center justify-center">
    <div className="text-primary animate-pulse font-display text-xl">Loading...</div>
  </div>
);

// Defensively checks `loading` itself rather than relying solely on AuthProvider
// withholding render — correct even if that upstream contract ever changes.
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
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
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="/dev-chat-preview" element={<ChatPage />} />

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