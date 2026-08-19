# إعدادات قاعدة البيانات ونظام المصادقة (PTS)

يجب تنفيذ هذا السكريبت في **SQL Editor** داخل لوحة تحكم Supabase.
هذا السكريبت يضمن:
1. منع تكرار كود PTS عبر Database UNIQUE Constraint.
2. استخدام Trigger آمن لإنشاء حساب المنصة تلقائيًا عند التسجيل.
3. التراجع عن التسجيل بالكامل (Rollback) في حال كان الكود مكررًا.
4. تطبيق قواعد أمان (RLS) صارمة تمنع المستخدم من تعديل حالته أو قراءة بيانات غيره.

```sql
-- 1. التأكد من إسقاط الدالة العامة غير الآمنة لفحص الأكواد إن وُجدت
DROP FUNCTION IF EXISTS check_pts_hash_exists(TEXT);

-- 2. إعداد جدول platform_users وتفعيل قيد الـ UNIQUE
ALTER TABLE public.platform_users ADD COLUMN IF NOT EXISTS pts_hash TEXT;
ALTER TABLE public.platform_users DROP CONSTRAINT IF EXISTS platform_users_pts_hash_key;
ALTER TABLE public.platform_users ADD CONSTRAINT platform_users_pts_hash_key UNIQUE (pts_hash);

-- 3. إعداد سياسات الأمان (RLS)
ALTER TABLE public.platform_users ENABLE ROW LEVEL SECURITY;

-- تفعيل قراءة المستخدم لبياناته فقط
DROP POLICY IF EXISTS "Users can view own profile" ON public.platform_users;
CREATE POLICY "Users can view own profile" 
ON public.platform_users FOR SELECT 
USING (auth.uid() = auth_user_id);

-- تأكد من عدم وجود سياسات INSERT أو UPDATE للمستخدم العادي (لتجنب تعديل approval_status)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.platform_users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.platform_users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.platform_users;

-- 4. دالة و Trigger لإنشاء الحساب بأمان (تُنفذ كـ SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.platform_users (
    auth_user_id, 
    email, 
    full_name, 
    approval_status, 
    is_active, 
    pts_hash
  )
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    'pending', 
    true, 
    new.raw_user_meta_data->>'pts_hash'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ربط الـ Trigger بجدول المستخدمين
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```
