import re

with open('src/pages/Auth.tsx', 'r') as f:
    content = f.read()

old_login = """      if (authState === 'login') {
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
      }"""

new_login = """      if (authState === 'login') {
        const start = Date.now();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password
        });
        
        const elapsed = Date.now() - start;
        if (elapsed < 1500) {
          await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));
        }
        
        if (authError || !authData.user) {
          throw new Error(language === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Invalid sign-in credentials.');
        }
        
        // Post-login PTS validation
        const { data: platformUser } = await supabase
          .from('platform_users')
          .select('pts_hash')
          .eq('auth_user_id', authData.user.id)
          .single();
          
        const enteredPtsHash = await generatePTSHash(normalizedPTS);
        
        if (!platformUser || platformUser.pts_hash !== enteredPtsHash) {
          await supabase.auth.signOut();
          throw new Error(language === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Invalid sign-in credentials.');
        }
        
        navigate('/');
      }"""

content = content.replace(old_login, new_login)

with open('src/pages/Auth.tsx', 'w') as f:
    f.write(content)

print("Done")
