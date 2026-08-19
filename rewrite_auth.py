import re

with open('src/pages/Auth.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    "import { User, KeyRound, Loader2, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';",
    "import { User, KeyRound, Loader2, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';"
)

# 2. Update state variables
old_state = """  const [formData, setFormData] = useState({
    fullName: '',
    ptsCode: ''
  });"""
new_state = """  const [formData, setFormData] = useState({
    fullName: '',
    ptsCode: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);"""
content = content.replace(old_state, new_state)

# 3. Update handleSubmit
old_submit = """    try {
      if (!formData.fullName.trim() || !formData.ptsCode.trim()) {
        throw new Error(language === 'ar' ? 'يرجى إدخال اسم الشركة وكود PTS' : 'Please enter Company Name and PTS Code');
      }

      const email = await generateEmailFromName(formData.fullName);
      const normalizedPTS = formData.ptsCode.trim();

      if (!/^\\d{6}$/.test(normalizedPTS)) {
        throw new Error(language === 'ar' ? 'كود PTS يجب أن يتكون من 6 أرقام فقط' : 'PTS Code must be exactly 6 digits');
      }

      if (authState === 'login') {
        const start = Date.now();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password: normalizedPTS
        });
        
        const elapsed = Date.now() - start;
        if (elapsed < 1500) {
          await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));
        }
        
        if (authError) {
          throw new Error(language === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Invalid login credentials.');
        }
        
        navigate('/');
      } else {
        const ptsHash = await generatePTSHash(normalizedPTS);

        const { error: authError } = await supabase.auth.signUp({
          email,
          password: normalizedPTS,
          options: {
            data: {
              full_name: formData.fullName.trim(),
              pts_hash: ptsHash
            }
          }
        });

        if (authError) {
          throw new Error(language === 'ar' 
            ? 'تعذر إنشاء الحساب بهذه البيانات. يرجى التواصل مع الإدارة.' 
            : 'Could not create account with these details. Please contact administration.'
          );
        }

        setSuccess(language === 'ar' 
          ? 'تم إرسال طلب التسجيل بنجاح. يرجى انتظار موافقة الإدارة.' 
          : 'Registration request sent successfully. Please wait for admin approval.'
        );
        
        setFormData({ fullName: '', ptsCode: '' });
        setAuthState('login');
        
        await supabase.auth.signOut();
      }
    }"""

new_submit = """    try {
      if (!formData.fullName.trim() || !formData.ptsCode.trim() || !formData.password) {
        throw new Error(language === 'ar' ? 'يرجى إدخال جميع الحقول المطلوبة.' : 'Please enter all required fields.');
      }

      const email = await generateEmailFromName(formData.fullName);
      const normalizedPTS = formData.ptsCode.trim();

      if (!/^\\d{6}$/.test(normalizedPTS)) {
        throw new Error(language === 'ar' ? 'يجب أن يتكون كود PTS من 6 أرقام فقط.' : 'PTS Code must contain exactly 6 digits.');
      }

      if (authState === 'login') {
        const start = Date.now();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password
        });
        
        const elapsed = Date.now() - start;
        if (elapsed < 1500) {
          await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));
        }
        
        if (authError) {
          throw new Error(language === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Invalid sign-in credentials.');
        }
        
        navigate('/');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error(language === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
        }

        const passwordValid = formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) && /\\d/.test(formData.password);
        if (!passwordValid) {
          throw new Error(language === 'ar' 
            ? 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حروف وأرقام.' 
            : 'Password must be at least 8 characters long and contain letters and numbers.'
          );
        }

        const ptsHash = await generatePTSHash(normalizedPTS);

        const { error: authError } = await supabase.auth.signUp({
          email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName.trim(),
              pts_hash: ptsHash
            }
          }
        });

        if (authError) {
          throw new Error(language === 'ar' 
            ? 'تعذر إنشاء الحساب بهذه البيانات. يرجى التواصل مع الإدارة.' 
            : 'Unable to create an account with these details. Please contact the administrator.'
          );
        }

        setSuccess(language === 'ar' 
          ? 'تم إرسال طلب تسجيل الشركة بنجاح. طلب حساب شركتك قيد المراجعة، يرجى انتظار موافقة الإدارة.' 
          : 'Your company registration request has been submitted successfully. Your account is currently under review. Please wait for administrator approval.'
        );
        
        setFormData({ fullName: '', ptsCode: '', password: '', confirmPassword: '' });
        setAuthState('login');
        
        await supabase.auth.signOut();
      }
    }"""
content = content.replace(old_submit, new_submit)

# 4. Inject Password Fields into JSX
old_jsx_pts = """            <div className="space-y-2">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest mr-4">{language === 'ar' ? 'كود PTS' : 'PTS Code'}</label>
              <div className="relative">
                <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  className="w-full bg-[#121E3D] border border-[#1C2E5A] rounded-2xl py-4 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none transition-all font-bold text-base md:text-lg tracking-[0.2em]"
                  value={formData.ptsCode}
                  onChange={e => setFormData({...formData, ptsCode: e.target.value})}
                />
              </div>
            </div>"""

new_jsx_pts = """            <div className="space-y-2">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest mr-4">{language === 'ar' ? 'كود PTS' : 'PTS Code'}</label>
              <div className="relative">
                <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  className="w-full bg-[#121E3D] border border-[#1C2E5A] rounded-2xl py-4 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none transition-all font-bold text-base md:text-lg tracking-[0.2em]"
                  value={formData.ptsCode}
                  onChange={e => setFormData({...formData, ptsCode: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest mr-4">{language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-[#121E3D] border border-[#1C2E5A] rounded-2xl py-4 pr-12 pl-12 text-white focus:border-[#D4AF37] outline-none transition-all font-bold text-base md:text-lg"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  aria-label={language === 'ar' ? (showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور') : (showPassword ? 'Hide password' : 'Show password')}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {authState === 'register' && (
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest mr-4">{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="w-full bg-[#121E3D] border border-[#1C2E5A] rounded-2xl py-4 pr-12 pl-12 text-white focus:border-[#D4AF37] outline-none transition-all font-bold text-base md:text-lg"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    aria-label={language === 'ar' ? (showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور') : (showConfirmPassword ? 'Hide password' : 'Show password')}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}"""

content = content.replace(old_jsx_pts, new_jsx_pts)

with open('src/pages/Auth.tsx', 'w') as f:
    f.write(content)

print("Done")
