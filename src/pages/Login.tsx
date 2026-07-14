import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BlurText from "@/components/BlurText";
import { isValidEmail, getAuthErrorMessage } from "@/lib/authErrors";

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
    if (!isValidEmail(email)) { toast.error("Enter a valid email address."); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(getAuthErrorMessage(err, err.message || "Login failed. Check your credentials."));
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

        <div className="relative z-10 space-y-4">
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-6">
            <h1
              className="font-display font-bold text-white leading-[1.1] tracking-[-0.03em]"
              style={{ fontSize: "clamp(28px, 3vw, 44px)" }}
            >
              <BlurText text="The only platform" animateBy="words" direction="top" delay={120} />
              <BlurText text="built for the" animateBy="words" direction="top" delay={120} />
              <BlurText text="Pakistani CS student." animateBy="words" direction="top" delay={120} />
            </h1>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-6 max-w-sm">
            <BlurText
              text="Bridging the gap between academic theory and industry reality. Join the community shaping the future of tech."
              animateBy="words"
              direction="top"
              delay={60}
              className="text-white/80 text-[15px] leading-relaxed"
            />
          </div>
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

        <div className="max-w-md w-full mx-auto rounded-2xl bg-white border border-border/60 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_16px_40px_-16px_rgba(0,0,0,0.12)] p-8 sm:p-10">
          <div className="mb-8">
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
