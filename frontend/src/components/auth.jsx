import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Hexagon, ArrowRight, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Auth = () => {
  const { login, signup, loginWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Successfully logged in!");
      } else {
        await signup(formData.email, formData.password, formData.name);
        toast.success("Account created successfully!");
      }
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Authenticated with Google!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-900 flex items-center justify-center p-4 relative overflow-hidden selection:bg-cyan-500/30">
      {/* Animated Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[120px] animate-blob" style={{ animationDelay: "2s" }} />
      </div>

      <Link to="/" className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-2 group z-20 text-brand-light">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 backdrop-blur-md group-hover:bg-white/10 transition-colors">
          <Hexagon className="h-5 w-5 text-cyan-400" />
        </div>
        <span className="font-bold tracking-tight text-lg opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Return Home
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative rounded-[2.5rem] p-[1px] bg-gradient-to-br from-violet-500/30 via-white/5 to-cyan-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 blur-xl" />
          
          <div className="relative rounded-[2.45rem] bg-brand-800/60 backdrop-blur-3xl p-8 sm:p-10 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                {isLogin ? "Welcome back" : "Create an account"}
              </h2>
              <p className="text-sm text-brand-light/60">
                {isLogin ? "Enter your details to access your account." : "Join us for an exclusive tech experience."}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex relative bg-black/40 rounded-full p-1 mb-8 border border-white/10">
              <button
                onClick={() => setIsLogin(true)}
                className={`relative flex-1 py-2 text-sm font-semibold z-10 transition-colors ${isLogin ? "text-brand-900" : "text-white/60 hover:text-white"}`}
              >
                Log In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`relative flex-1 py-2 text-sm font-semibold z-10 transition-colors ${!isLogin ? "text-brand-900" : "text-white/60 hover:text-white"}`}
              >
                Sign Up
              </button>
              
              <motion.div
                className="absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-full z-0"
                animate={{ left: isLogin ? "4px" : "calc(50%)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-1.5"
                  >
                    <label className="text-xs font-semibold text-brand-light/60 uppercase tracking-widest pl-2">Full Name</label>
                    <div className="relative group">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-white/20"
                        placeholder="John Doe"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-light/60 uppercase tracking-widest pl-2">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-white/20"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-light/60 uppercase tracking-widest pl-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-white/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between mt-1 px-2"
                  >
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="hidden" />
                      <div className="w-4 h-4 rounded border border-white/20 bg-black/40 group-hover:border-cyan-400 transition-colors flex items-center justify-center">
                        <Check className="h-3 w-3 text-cyan-400 opacity-0 group-hover:opacity-100" />
                      </div>
                      <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">Remember me</span>
                    </label>
                    <a href="#" className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                      Forgot password?
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex items-center justify-center gap-2 w-full mt-4 bg-white text-brand-900 rounded-2xl py-4 text-sm font-bold shadow-[0_10px_20px_-10px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 overflow-hidden"
              >
                {loading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-brand-900 border-t-transparent animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">{isLogin ? "Sign In" : "Create Account"}</span>
                    <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4 before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">
              <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">Or</span>
            </div>

            <button
              onClick={handleGoogleAuth}
              type="button"
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/40 py-3.5 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
