import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("admin@flowpulse.io");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary-foreground/5 animate-float" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-primary-foreground/10 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-primary-foreground/5 animate-float" style={{ animationDelay: "2s" }} />

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-primary-foreground max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold">FlowPulse</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Automate your processes with intelligence
          </h1>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            A complete automation and workflow management platform to transform your organization's efficiency.
          </p>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient">FlowPulse</span>
          </div>

          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-accent transition-shadow duration-300" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Demo: use any email and password
          </p>
        </motion.div>
      </div>
    </div>
  );
}
