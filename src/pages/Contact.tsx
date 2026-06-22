import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GlowOrbs } from "@/components/GlowOrbs";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill out every field");
      return;
    }
    setSending(true);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { name: form.name.trim(), email: form.email.trim(), message: form.message.trim() },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );
      toast.success("Message sent! We'll be in touch within 24 hours.");
      setForm({ name: "", email: "", message: "" });
      // Save to Firestore as backup — non-blocking, silent fail if not set up
      addDoc(collection(db, "contact_submissions"), {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        createdAt: serverTimestamp(),
      }).catch(() => {});
    } catch (err: any) {
      console.error("EmailJS error:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <section className="relative hero-bg overflow-hidden">
        <GlowOrbs />
        <div className="container relative py-20 text-center">
          <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-5">Let's <span className="text-gradient-gold">talk</span></h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">Questions, feedback, partnerships — we'd love to hear from you.</p>
        </div>
      </section>

      <section className="container pb-24 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[
            { icon: Mail, label: "Email", value: "careergeniefyp@gmail.com" },
            { icon: Phone, label: "Phone", value: "+92 309 4502691" },
            { icon: MapPin, label: "Office", value: "Johar Town, Lahore" },
          ].map((c) => (
            <div key={c.label} className="glass-card-hover rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-gold flex items-center justify-center">
                <c.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="font-semibold mt-1">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-3 glass-card rounded-2xl p-8 space-y-5">
          <h2 className="font-display text-2xl font-bold">Send us a message</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={6} placeholder="Tell us how we can help..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full sm:w-auto" disabled={sending}>
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
