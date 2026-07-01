import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/* ── Editorial bottom-border input ── */
const EditorialInput = ({
  id, type, label, value, onChange, children,
}: {
  id: string; type: string; label: string;
  value: string; onChange: (v: string) => void;
  children?: React.ReactNode;
}) => (
  <div className="relative mb-7 group">
    <input
      id={id} type={type} placeholder=" " value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="peer w-full bg-transparent border-0 border-b-[1.5px] border-foreground/30 focus:border-primary outline-none pt-5 pb-2 text-foreground text-[15px] pr-10 transition-colors duration-200"
    />
    <label
      htmlFor={id}
      className="absolute left-0 top-5 text-muted-foreground text-[11px] font-medium tracking-[0.04em] uppercase pointer-events-none transition-all duration-200
        peer-placeholder-shown:top-5 peer-placeholder-shown:text-[15px] peer-placeholder-shown:tracking-normal peer-placeholder-shown:uppercase-none peer-placeholder-shown:font-normal
        peer-focus:top-0 peer-focus:text-[11px] peer-focus:text-primary peer-focus:tracking-[0.04em] peer-focus:uppercase peer-focus:font-medium
        peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:tracking-[0.04em]"
    >
      {label}
    </label>
    {children}
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT — Burnt sienna branding panel ── */}
      <div
        className="hidden md:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ backgroundColor: "#c1440e" }}
      >
        {/* Cross-hatch texture */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 16h32M16 0v32' stroke='%23fff' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10">
          <Link to="/" className="font-display font-bold text-2xl text-white">CareerGenie</Link>
        </div>

        <div className="relative z-10">
          <h1
            className="font-display font-bold text-white leading-[1.1] tracking-[-0.03em] mb-5"
            style={{ fontSize: "clamp(32px, 3.5vw, 48px)" }}
          >
            The only platform<br />built for the<br />Pakistani CS student.
          </h1>
          <p className="text-white/80 text-[15px] leading-relaxed max-w-sm">
            Bridging the gap between academic theory and industry reality.
            Join the community shaping the future of tech.
          </p>
        </div>
      </div>

      {/* ── RIGHT — Form panel ── */}
      <div
        className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12"
        style={{ backgroundColor: "#F7F3EE" }}
      >
        {/* Mobile logo */}
        <div className="md:hidden mb-10">
          <Link to="/" className="font-display font-bold text-xl text-foreground">CareerGenie</Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h2 className="font-display font-bold text-foreground mb-2" style={{ fontSize: 32, lineHeight: 1.2 }}>
              Welcome back
            </h2>
            <p className="text-muted-foreground text-[15px]">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={onSubmit}>
            <EditorialInput id="email" type="email" label="Email Address" value={email} onChange={setEmail} />

            <EditorialInput id="password" type={showPassword ? "text" : "password"} label="Password" value={password} onChange={setPassword}>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </EditorialInput>

            <div className="flex items-center justify-between mb-7">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary rounded-sm" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-foreground font-medium hover:text-primary transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-[10px] text-white font-semibold text-[15px] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                backgroundColor: "#c1440e",
                boxShadow: "0 4px 14px rgba(193, 68, 14, 0.3)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.92)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = ""; }}
            >
              {loading ? "Signing in…" : "Login"} {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 border-t border-border" />
            <span className="text-[13px] text-muted-foreground">Or continue with</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[10px] bg-white border border-border text-foreground text-[15px] font-medium hover:bg-secondary transition-colors"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <p className="mt-8 text-center text-[15px] text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
