import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ResetPassword = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasSession, setHasSession] = useState(true); // Assume true initially to avoid flashing error
  
  useEffect(() => {
    let isMounted = true;
    
    const checkSession = async () => {
      // Supabase parses URL parameters automatically when detectSessionInUrl is true.
      // Wait a moment for it to process the token
      const { data: { session } } = await supabase.auth.getSession();
      if (isMounted) {
        if (!session) {
          setError(language === 'ar' ? 'رابط الاستعادة غير صالح أو منتهي الصلاحية' : 'Reset link is invalid or expired');
          setHasSession(false);
        } else {
          setHasSession(true);
        }
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (session) {
        setHasSession(true);
        if (error === 'رابط الاستعادة غير صالح أو منتهي الصلاحية' || error === 'Reset link is invalid or expired') {
          setError(null);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [language, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!hasSession) {
      setError(language === 'ar' ? 'رابط الاستعادة غير صالح أو منتهي الصلاحية' : 'Reset link is invalid or expired');
      return;
    }
    
    if (!password) {
      setError(language === 'ar' ? 'الرجاء إدخال كلمة المرور' : 'Please enter a password');
      return;
    }
    
    if (password !== confirmPassword) {
      setError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError(language === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      // Sign out to enforce re-authentication as requested
      await supabase.auth.signOut();
      
      setSuccess(
        language === 'ar' 
          ? 'تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.' 
          : 'Password updated successfully. You can now sign in using your new password.'
      );
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A18] flex items-center justify-center p-6 py-20">
      <div className="w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A1128] border border-[#1C2E5A] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#121E3D] border border-[#1C2E5A] rounded-[2rem] flex items-center justify-center text-[#D4AF37] mx-auto mb-6 shadow-xl shadow-black/20">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
              {language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
            </h1>
            <p className="text-gray-500 font-bold text-sm">
              {language === 'ar' ? 'الرجاء إدخال كلمة المرور الجديدة' : 'Please enter your new password'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-500 text-sm font-bold"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="leading-relaxed">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 flex items-center gap-4 text-green-500 text-sm font-bold flex-col text-center"
                >
                  <div className="flex items-center gap-2 mb-2 text-base">
                     <CheckCircle2 size={24} />
                     {success}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/auth')}
                    className="bg-[#D4AF37] text-[#0A1128] px-8 py-3 rounded-xl font-bold uppercase text-xs hover:bg-[#E5C158] transition-colors mt-2"
                  >
                    {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!success && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">
                    {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="password"
                      required
                      minLength={6}
                      disabled={!hasSession || loading}
                      className="w-full bg-[#121E3D] border border-[#1C2E5A] rounded-2xl py-4 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none transition-all font-bold disabled:opacity-50"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">
                    {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="password"
                      required
                      minLength={6}
                      disabled={!hasSession || loading}
                      className="w-full bg-[#121E3D] border border-[#1C2E5A] rounded-2xl py-4 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none transition-all font-bold disabled:opacity-50"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !hasSession}
                  className="w-full bg-[#D4AF37] text-[#0A1128] py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#E5C158] transition-all shadow-xl shadow-[#D4AF37]/10 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                   <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      {language === 'ar' ? 'تغيير كلمة المرور' : 'Update Password'}
                    </>
                  )}
                </button>
              </>
            )}

          </form>
        </motion.div>
      </div>
    </div>
  );
};
