import re

with open('src/components/AccessRestricted.tsx', 'r') as f:
    content = f.read()

old_get_message = """  const getMessage = () => {
    if (statusMessage) return language === 'ar' ? statusMessage.ar : statusMessage.en;

    if (!user) {
      return language === 'ar' 
        ? 'التحليلات والتقارير المتقدمة تتطلب حساب شركة معتمداً. يرجى تسجيل الدخول أو طلب حساب جديد.' 
        : 'Advanced analytics and reports require an approved company account. Please sign in or request a new account.';
    }

    if (platformUser && platformUser.approval_status === 'pending') {
      return language === 'ar'
        ? 'طلب حساب شركتك قيد المراجعة، يرجى انتظار موافقة الإدارة.'
        : 'Your company account request is under review, please wait for admin approval.';
    }
    
    if (platformUser && platformUser.approval_status === 'rejected') {
      return language === 'ar'
        ? 'تم رفض طلب تسجيل الشركة.'
        : 'Company registration request was rejected.';
    }

    if (platformUser && (!platformUser.is_active || platformUser.approval_status === 'suspended')) {
      return language === 'ar'
        ? 'تم تعليق حساب الشركة، يرجى التواصل مع الإدارة.'
        : 'Your company account is suspended, please contact the administration.';
    }

    return language === 'ar' 
      ? 'هذا الجزء مخصص للشركات المعتمدة فقط. سيتم مراجعة بياناتك وتفعيل الوصول قريباً.' 
      : 'This section is for approved companies only. Your data will be reviewed and access granted soon.';
  };"""

new_get_message = """  const getMessage = () => {
    if (statusMessage) return language === 'ar' ? statusMessage.ar : statusMessage.en;

    if (!user) {
      return language === 'ar' 
        ? 'التحليلات والتقارير المتقدمة تتطلب حساب شركة معتمداً. يرجى تسجيل الدخول أو طلب حساب جديد.' 
        : 'Advanced analytics and reports require an approved company account. Please sign in or request a new account.';
    }

    if (platformUser && platformUser.approval_status === 'pending') {
      return language === 'ar'
        ? 'طلب حساب شركتك قيد المراجعة. يرجى انتظار موافقة الإدارة.'
        : 'Your company account request is under review. Please wait for administrator approval.';
    }
    
    if (platformUser && platformUser.approval_status === 'rejected') {
      return language === 'ar'
        ? 'تم رفض طلب تسجيل الشركة.'
        : 'Your company registration request has been rejected.';
    }

    if (platformUser && platformUser.approval_status === 'suspended') {
      return language === 'ar'
        ? 'تم تعليق حساب الشركة. يرجى التواصل مع الإدارة.'
        : 'Your company account has been suspended. Please contact the administrator.';
    }
    
    if (platformUser && !platformUser.is_active) {
      return language === 'ar'
        ? 'حساب الشركة غير فعال حاليًا. يرجى التواصل مع الإدارة.'
        : 'Your company account is currently inactive. Please contact the administrator.';
    }

    return language === 'ar' 
      ? 'هذا الجزء مخصص للشركات المعتمدة فقط. سيتم مراجعة بياناتك وتفعيل الوصول قريباً.' 
      : 'This section is for approved companies only. Your data will be reviewed and access granted soon.';
  };"""

content = content.replace(old_get_message, new_get_message)

with open('src/components/AccessRestricted.tsx', 'w') as f:
    f.write(content)

print("Done")
