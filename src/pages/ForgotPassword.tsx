import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import genieLogo from "@/assets/genie-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlowOrbs } from "@/components/GlowOrbs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { isValidEmail } from "@/lib/authErrors";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { resetPassword } = useAuth();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) { toast.error("Enter your email"); return; }
        if (!isValidEmail(email)) { toast.error("Enter a valid email address."); return; }
        setLoading(true);
        try {
            await resetPassword(email);
            setSent(true);
        } catch {
            toast.error("Could not send reset email. Check the address.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen hero-bg overflow-hidden flex items-center justify-center">
            <GlowOrbs />
            <div className="relative glass-card rounded-3xl p-10 max-w-md w-full mx-4">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to login
                </Link>

                <img src={genieLogo} alt="Career Genie" className="w-16 h-16 object-contain mb-6" />

                {sent ? (
                    <div className="text-center">
                        <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h2 className="font-display text-2xl font-bold mb-2">Email sent!</h2>
                        <p className="text-muted-foreground mb-6">
                            Check <span className="text-primary font-semibold">{email}</span> for the password reset link.
                        </p>
                        <Button asChild variant="hero" className="w-full">
                            <Link to="/login">Back to Login</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <h1 className="font-display text-3xl font-bold mb-2">Forgot password?</h1>
                        <p className="text-muted-foreground mb-8">
                            Enter your email and we'll send you a reset link.
                        </p>
                        <form onSubmit={onSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input id="email" type="email" placeholder="you@example.com"
                                        className="pl-10 h-12" value={email}
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;