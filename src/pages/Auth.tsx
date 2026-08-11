import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, User, Phone, Building, Briefcase, 
  ArrowRight, ArrowLeft, ShieldCheck, MailCheck, AlertCircle, 
  CheckCircle2, Loader2, KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

type AuthState = 'login' | 'register' | 'forgot_password';

export const Auth = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [authState, setAuthState] = useState<AuthState>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    organization: '',
    jobTitle: ''
  });

  const getRedirectUrl = (path: string = '') => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#/${path}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (authState === 'login') {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        
        if (authError) {
          throw authError;
        }
        navigate('/');
      } else if (authState === 'register') {
        if (!formData.fullName || !formData.organization) {
          throw new Error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
        }
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              organization: formData.organization,
              phone: formData.phone,
              job_title: formData.jobTitle
            }
          }
        });
        
        if (authError) throw authError;
        
        if (authData.user) {
          // In cases where Supabase auto-confirms or we handle it in context
          setSuccess(
            language === 'ar' 
              ? 'تم إنشاء الحساب بنجاح. حسابك الآن قيد المراجعة، يرجى انتظار موافقة الإدارة.' 
              : 'Account created successfully. Your account is under review, please wait for admin approval.'
          );
          setAuthState('login');
          setFormData(prev => ({ ...prev, password: '' }));
          
          // Sign out immediately so they don't get stuck in a weird state
          await signOut();
        }
      } else if (authState === 'forgot_password') {
        if (!formData.email) {
          throw new Error(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email');
        }
        
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: getRedirectUrl('reset-password')
        });
        
        if (resetError) throw resetError;
        
        setSuccess(
          language === 'ar'
            ? 'إذا كان البريد مرتبطًا بحساب، فسيتم إرسال رابط استعادة كلمة المرور إليه.'
            : 'If an account exists for this email, a password reset link will be sent.'
        );
        setAuthState('login');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message);
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
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#121E3D] border border-[#1C2E5A] rounded-[2rem] flex items-center justify-center text-[#D4AF37] mx-auto mb-6 shadow-xl shadow-black/20">
              {authState === 'login' ? <ShieldCheck size={40} /> : authState === 'register' ? <MailCheck size={40} /> : <KeyRound size={40} />}
            </div>
            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
              {authState === 'login' 
                 ? (language === 'ar' ? 'تسجيل الدخول' : 'Sign In') 
                 : authState === 'register' 
                 ? (language === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account')
                 : (language === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password')}
            </h1>
            <p className="text-gray-500 font-bold text-sm">
              {authState === 'login' 
                 ? (language === 'ar' ? 'مرحباً بك في منصة الأسعار العالمية' : 'Welcome to the World Prices Platform')
                 : authState === 'register' 
                 ? (language === 'ar' ? 'انضم إلى نخبة المستخدمين واحصل على تقارير حصرية' : 'Join elite users and get exclusive reports')
                 : (language === 'ar' ? 'أدخل بريدك الإلكتروني لتلقي رابط الاستعادة' : 'Enter your email to receive a reset link')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex flex-col gap-3 text-red-500 text-sm font-bold"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3 text-green-500 text-sm font-bold"
                >
                  <CheckCircle2 size={18} className="shrink-0" />
                  <p className="leading-relaxed">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {authState === 'register' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full bg-[#121E3D] border border-[#1C2E5A] rounded-2xl py-4 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none transition-all font-bold"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="tel"
                      className="w-full bg-[#121E3D] border border-[#1C2E5A] rounded-2xl py-4 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none transition-all font-bold"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">{language === 'ar' ? 'الجهة / المؤسسة' : 'Organization'}</label>
                  <div className="relative">
                    <Building className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full bg-[#121E3D] border border-[#1C2E5A] rounded-2xl py-4 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none transition-all font-bold"
                      value={formData.organization}
                      onChange={e => setFormData({...formData, organization: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">{language === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}</label>
                  <div className="relative">
                    <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      className="w-full bg-[#121E3D] border border-[#1C2E5A] rounded-2xl py-4 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none transition-all font-bold"
                      value={formData.jobTitle}
                      onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-[#121E3D] border border-[#1C2E5A] rounded-2xl py-4 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none transition-all font-bold"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {authState !== 'forgot_password' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">{language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full bg-[#121E3D] border border-[#1C2E5A] rounded-2xl py-4 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none transition-all font-bold"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                {authState === 'login' && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthState('forgot_password');
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-xs text-gray-400 hover:text-[#D4AF37] transition-colors font-bold"
                    >
                      {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-[#0A1128] py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#E5C158] transition-all shadow-xl shadow-[#D4AF37]/10 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
               <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {authState === 'login' && <ShieldCheck size={20} />}
                  {authState === 'register' && <User size={20} />}
                  {authState === 'forgot_password' && <KeyRound size={20} />}
                  {authState === 'login' 
                    ? (language === 'ar' ? 'تسجيل الدخول' : 'Sign In') 
                    : authState === 'register'
                    ? (language === 'ar' ? 'إنشاء الحساب' : 'Create Account')
                    : (language === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link')}
                </>
              )}
            </button>

            <div className="pt-6 border-t border-[#1C2E5A] text-center flex flex-col gap-4">
              {authState !== 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthState('login');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                  {language === 'ar' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                </button>
              )}
              
              {authState === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthState('register');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  {language === 'ar' ? 'ليس لديك حساب؟ سجل الآن' : "Don't have an account? Register"}
                  {language === 'ar' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
