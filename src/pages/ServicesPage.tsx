import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  Code2, 
  Download, 
  Star, 
  HeadphonesIcon, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Database, 
  Layers, 
  Clock, 
  FileSpreadsheet, 
  FileText, 
  Bell, 
  BarChart3, 
  Users, 
  LifeBuoy, 
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';

interface ServiceDetailData {
  id: string;
  slug: string;
  icon: React.ElementType;
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descAr: string;
  descEn: string;
  highlightsAr: string[];
  highlightsEn: string[];
  features: {
    icon: React.ElementType;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
  }[];
  ctaTextAr: string;
  ctaTextEn: string;
}

const SERVICES_DATA: Record<string, ServiceDetailData> = {
  api: {
    id: 'api',
    slug: '/services/api',
    icon: Code2,
    badgeAr: 'بنية تحتية متطورة',
    badgeEn: 'Advanced Infrastructure',
    titleAr: 'الربط البرمجي (API)',
    titleEn: 'API Integration',
    subtitleAr: 'واجهة برمجية موحدة ولحظية لربط بيانات الأسواق العالمية مع أنظمتكم ومواقعكم الرقمية.',
    subtitleEn: 'A unified real-time API to integrate global market data seamlessly with your digital systems.',
    descAr: 'نوفر خدمة الربط البرمجي المباشر لتمكين المؤسسات والشركات والمنصات الرقمية من سحب البيانات والأسعار العالمية للسلع والمعادن ومصادر الطاقة بشكل آلي ومؤمّن، مع تحديثات مستمرة وفورية تدعم التكامل مع الأنظمة المحاسبية، ولوحات المتابعة، وتطبيقات الجوال والويب.',
    descEn: 'We provide direct RESTful and WebSocket API integration services to enable financial institutions, enterprises, and digital platforms to fetch global commodity, metal, and energy prices automatically and securely, with high-frequency updates supporting ERPs, dashboards, and custom apps.',
    highlightsAr: [
      'بروتوكولات RESTful & WebSocket فائقة السرعة مع وقت استجابة منخفض جداً',
      'مفاتيح وصول آمنة وتشفير متكامل (OAuth & API Keys)',
      'توثيق تفاعلي متكامل (Swagger / OpenAPI Documentation) ونماذج برمجية جاهزة',
      'نسبة استقرار وجاهزية تشغيلية تصل إلى 99.9% (High Availability)',
      'تغطية كاملة لقطاعات الطاقة، المعادن، السلع الزراعية، ومؤشرات الشحن العالمية'
    ],
    highlightsEn: [
      'Ultra-fast RESTful & WebSocket protocols with sub-millisecond response latency',
      'Secure access tokens and end-to-end encryption (OAuth & API Keys)',
      'Interactive Swagger / OpenAPI docs with code snippets in Python, Node.js, and cURL',
      '99.9% operational uptime SLA guarantee with redundant server nodes',
      'Full coverage across Energy, Metals, Agricultural Commodities, and Global Freight'
    ],
    features: [
      {
        icon: Zap,
        titleAr: 'تحديثات لحظية (Real-Time Streams)',
        titleEn: 'Real-Time Streams',
        descAr: 'بث حي للأسعار والتغيرات اللحظية عبر قنوات اتصال خفيفة ومستقرة.',
        descEn: 'Live price streaming and instant delta notifications via low-overhead sockets.'
      },
      {
        icon: Database,
        titleAr: 'سجلات تاريخية عميقة',
        titleEn: 'Deep Historical Data',
        descAr: 'استعلام واسترجاع البيانات التاريخية لعدة سنوات مع فلاتر زمنية دقيقة.',
        descEn: 'Query and retrieve multi-year historical price series with custom intervals.'
      },
      {
        icon: ShieldCheck,
        titleAr: 'أعلى معايير الأمان المؤسسي',
        titleEn: 'Enterprise Security',
        descAr: 'حماية متقدمة ضد هجمات الحجب وتحكم دقيق في نطاقات IP المسموح بها.',
        descEn: 'DDoS protection, rate limiting, and granular IP-whitelisting capabilities.'
      },
      {
        icon: Layers,
        titleAr: 'هيكلية بيانات منظمة وموحدة',
        titleEn: 'Clean JSON Schema',
        descAr: 'مخرجات JSON قياسية وموحدة لسهولة المعالجة والدمج مع قواعد بياناتكم.',
        descEn: 'Consistent JSON formats designed for effortless ingestion and database sync.'
      }
    ],
    ctaTextAr: 'طلب مفتاح تجريبي وتوثيق الـ API',
    ctaTextEn: 'Request API Demo & Docs'
  },
  'data-export': {
    id: 'data-export',
    slug: '/services/data-export',
    icon: Download,
    badgeAr: 'تقارير وقوائم مخصصة',
    badgeEn: 'Custom Reports & Datasets',
    titleAr: 'تصدير البيانات المخصصة',
    titleEn: 'Custom Data Export',
    subtitleAr: 'استخراج وتصدير البيانات التاريخية واللحظية بصيغ متعددة وجداول مهيأة للتحليل.',
    subtitleEn: 'Export real-time and historical datasets in multiple formats optimized for analytics.',
    descAr: 'إمكانية تصدير البيانات وفق احتياجات المؤسسة بصيغ متعددة مثل Excel وPDF وCSV ورسوم بيانية عالية الدقة، مع تخصيص كامل لنطاق البيانات، والفترات الزمنية (يومي، أسبوعي، شهري، سنوي)، ونوع السلع أو الخامات، بما يدعم أعمال التحليل وإعداد الدراسات الاقتصادية واتخاذ القرارات التجارية.',
    descEn: 'Export bespoke datasets tailored to your exact business requirements in Excel, CSV, PDF, and high-resolution chart formats. Customize historical date ranges, commodity classifications, and granularity to empower financial modeling, strategic procurement, and market intelligence.',
    highlightsAr: [
      'تصدير فوري بصيغ متعددة: Excel (XLSX), CSV, PDF وتقارير جاهزة للطباعة',
      'فلاتر متقدمة حسب القطاع، السلعة، النطاق الزمني، ووحدة القياس',
      'رسوم بيانية تحليلية مدمجة مع علامة مائية رسمية معتمدة',
      'إمكانية جدولة إرسال التقارير الدورية تلقائياً إلى بريدك الإلكتروني',
      'ملفات مجمعة تشمل ملخصات الإغلاق، أعلى/أدنى سعر، ونسب التغير'
    ],
    highlightsEn: [
      'Instant export in multiple formats: Excel (XLSX), CSV, PDF, and print-ready briefs',
      'Granular filtering by economic sector, commodity symbol, date range, and unit',
      'Exportable high-resolution analytical charts with official authenticated watermarks',
      'Automated scheduled report delivery directly to corporate email inboxes',
      'Aggregated files containing closing prices, high/low records, and percentage changes'
    ],
    features: [
      {
        icon: FileSpreadsheet,
        titleAr: 'جداول Excel مهيأة للتحليل',
        titleEn: 'Structured Excel Worksheets',
        descAr: 'جداول بيانات مجهزة بمعادلات وتنسيق احترافي لتسهيل إعداد التقارير المالية.',
        descEn: 'Professionally formatted workbooks ready for pivot tables and financial modeling.'
      },
      {
        icon: FileText,
        titleAr: 'تقارير PDF تنفيذية',
        titleEn: 'Executive PDF Reports',
        descAr: 'تقارير رسمية منسقة تتضمن رسوماً بيانية وملخصات تحليلية موجزة لصناع القرار.',
        descEn: 'Formally styled executive briefs featuring summary analytics and charts.'
      },
      {
        icon: Clock,
        titleAr: 'سلاسل زمنية مخصصة',
        titleEn: 'Custom Time Series',
        descAr: 'تحديد النطاقات الزمنية الدقيقة من أيام محددة حتى عقود سابقة.',
        descEn: 'Select custom date ranges from intraday ticks to multi-year archives.'
      },
      {
        icon: Database,
        titleAr: 'تصدير كميات ضخمة من البيانات',
        titleEn: 'Bulk Data Extracts',
        descAr: 'دعم استخراج مئات الآلاف من السجلات دون التأثير على سرعة التنزيل.',
        descEn: 'High-throughput bulk downloads optimized for big data repositories.'
      }
    ],
    ctaTextAr: 'طلب تصدير بيانات مخصصة لمؤسستك',
    ctaTextEn: 'Request Custom Dataset Export'
  },
  subscriptions: {
    id: 'subscriptions',
    slug: '/services/subscriptions',
    icon: Star,
    badgeAr: 'باقات وحلول مؤسسية',
    badgeEn: 'Corporate & Pro Plans',
    titleAr: 'الاشتراكات المميزة',
    titleEn: 'Premium Subscriptions',
    subtitleAr: 'باقات اشتراك متقدمة تمنحك وصولاً شاملاً للتحليلات الحصرية والتنبيهات الذكية.',
    subtitleEn: 'Comprehensive subscription tiers providing full access to exclusive intelligence.',
    descAr: 'نقدم باقات اشتراك مميزة مصممة للشركات والمؤسسات والباحثين والمستثمرين، تتيح الوصول إلى مزايا حصرية تشمل بيانات سوقية متعمقة، وتحديثات بالغة السرعة، ومحتوى تحليلي وتقارير استخباراتية اقتصادية حصرية، وأدوات مقارنة متقدمة وتنبيهات ذكية مخصصة.',
    descEn: 'We provide specialized subscription tiers crafted for corporations, importers, research bodies, and investors. Gain unrestricted access to in-depth price analytics, priority updates, exclusive macroeconomic intelligence reports, advanced multi-asset comparison tools, and instant price threshold alerts.',
    highlightsAr: [
      'وصول غير محدود لكافة التقارير الاقتصادية والتحليلات الحصرية',
      'تنبيهات أسعار فورية ذكية عبر البريد الإلكتروني والرسائل القصيرة',
      'أدوات متقدمة لمقارنة السلع المتعددة وتحليل العلاقات السعرية',
      'حسابات متعددة للمؤسسات مع إدارة مرنة لصلاحيات المستخدمين',
      'أولوية قصوى في الحصول على البيانات والخدمات الاستشارية'
    ],
    highlightsEn: [
      'Unrestricted access to all certified economic reports and intelligence briefs',
      'Smart real-time price alerts via email and SMS when key thresholds are breached',
      'Advanced multi-asset comparison engines and correlation matrix visualizers',
      'Multi-user corporate accounts with role-based access control management',
      'Priority routing for customer requests and custom research inquiries'
    ],
    features: [
      {
        icon: Bell,
        titleAr: 'تنبيهات ذكية فورية',
        titleEn: 'Smart Price Alerts',
        descAr: 'إشعارات لحظية عند وصول الأسعار إلى مستويات محددة أو حدوث تقلبات قوية.',
        descEn: 'Instant push alerts whenever price points breach predefined targets.'
      },
      {
        icon: BarChart3,
        titleAr: 'أدوات تحليلية حصرية',
        titleEn: 'Proprietary Analytics Tools',
        descAr: 'نماذج مقارنة ومؤشرات تقنية ورسوم بيانية تفاعلية متقدمة.',
        descEn: 'Interactive correlation analyzers, technical indicators, and charting suites.'
      },
      {
        icon: Users,
        titleAr: 'إدارة فرق العمل والمؤسسات',
        titleEn: 'Multi-Seat Enterprise Management',
        descAr: 'لوحة إدارة موحدة لإضافة الموظفين وتعيين الصلاحيات والمتابعة.',
        descEn: 'Centralized admin portal to provision team members and manage entitlements.'
      },
      {
        icon: ShieldCheck,
        titleAr: 'تراخيص تجارية معتمدة',
        titleEn: 'Certified Commercial Licensing',
        descAr: 'ترخيص رسمي لاستخدام ونشر البيانات في العروض والتقارير المؤسسية.',
        descEn: 'Official rights to utilize and cite platform data in commercial publications.'
      }
    ],
    ctaTextAr: 'استفسر عن باقات الشركات والاشتراكات',
    ctaTextEn: 'Inquire About Enterprise Plans'
  },
  support: {
    id: 'support',
    slug: '/services/support',
    icon: HeadphonesIcon,
    badgeAr: 'مساندة واستجابة سريعة',
    badgeEn: 'Rapid Technical Assistance',
    titleAr: 'الدعم الفني المتقدم',
    titleEn: 'Advanced Technical Support',
    subtitleAr: 'فريق دعم فني وهندسي متخصص لضمان أعلى مستويات الأداء والاستقرار لأنظمتكم.',
    subtitleEn: 'Dedicated engineering and support specialists ensuring peak performance and uptime.',
    descAr: 'فريق دعم فني متخصص لمتابعة احتياجات المشتركين وتقديم المساندة الفنية والتقنية بشكل سريع واحترافي على مدار الساعة، مع تقديم خدمات المساعدة المباشرة في عمليات الربط والتشغيل (Onboarding)، وحل المشكلات الفنية، وتخصيص استفسارات البيانات لضمان استمرارية الأعمال.',
    descEn: 'Our experienced technical support team provides prompt, around-the-clock technical assistance for enterprise subscribers. We offer white-glove onboarding, direct integration engineering guidance, rapid troubleshooting, and dedicated account management to guarantee seamless operations.',
    highlightsAr: [
      'قنوات اتصال مخصصة وذات أولوية قصوى (Priority Support Tickets & Hotline)',
      'فريق هندسي متخصص لمساندة عمليات ربط وتكامل الـ API',
      'مدير حساب مخصص للمؤسسات الكبرى (Dedicated Account Manager)',
      'اتفاقيات مستوى الخدمة المعتمدة (SLA) مع زمن استجابة سريع ومضمون',
      'جلسات تدريبية وإرشادية للفرق التقنية على استخدام أدوات المنصة'
    ],
    highlightsEn: [
      'Dedicated priority communication channels (VIP ticketing and direct hotline)',
      'Specialized engineering assistance for seamless API integration and webhook setup',
      'Assigned dedicated account manager for corporate and institutional partners',
      'Binding Service Level Agreements (SLAs) guaranteeing fast response and resolution times',
      'Hands-on onboarding and training sessions for your technical and analytical teams'
    ],
    features: [
      {
        icon: LifeBuoy,
        titleAr: 'استجابة فائقة السرعة',
        titleEn: 'Fast-Track Response',
        descAr: 'معالجة فورية للطلبات التقنية مع ضمان عدم تعطل العمليات التشغيلية.',
        descEn: 'Immediate triage and resolution for critical operational queries.'
      },
      {
        icon: Users,
        titleAr: 'مدير حساب مخصص',
        titleEn: 'Dedicated Account Manager',
        descAr: 'نقطة اتصال واحدة تتابع كافة متطلبات مؤسستك واشتراكك بدقة.',
        descEn: 'A single point of contact overseeing all your institutional requirements.'
      },
      {
        icon: Zap,
        titleAr: 'استشارات هندسية للربط',
        titleEn: 'Integration Consulting',
        descAr: 'مساعدة كودية مباشرة لحل مشاكل الاتصال وتجهيز البرمجيات الوسيطة.',
        descEn: 'Hands-on code guidance and middleware configuration support.'
      },
      {
        icon: ShieldCheck,
        titleAr: 'مراقبة استباقية وتنبيهات الأداء',
        titleEn: 'Proactive System Monitoring',
        descAr: 'متابعة حية لجودة الاتصال ورصد أي تأخير قبل تأثيره على المستخدمين.',
        descEn: 'Continuous health monitoring and pre-emptive alerts for connection health.'
      }
    ],
    ctaTextAr: 'تواصل مع فريق الدعم الفني المتقدم',
    ctaTextEn: 'Contact Advanced Support Team'
  }
};

export const ServicesPage = () => {
  const { serviceId } = useParams<{ serviceId?: string }>();
  const location = useLocation();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const pathKey = location.pathname.split('/services/')[1]?.replace(/\/$/, '');
  const resolvedKey = (serviceId || pathKey || '').toLowerCase();
  const currentServiceKey = resolvedKey && SERVICES_DATA[resolvedKey] ? resolvedKey : null;
  const service = currentServiceKey ? SERVICES_DATA[currentServiceKey] : null;

  const allServicesList = Object.values(SERVICES_DATA);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#050A18] text-white">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#1C2E5A]/30 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Navigation Breadcrumb / Tabs */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#1C2E5A] pb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link to="/services" className={`hover:text-[#D4AF37] transition-colors ${!service ? 'text-[#D4AF37] font-bold' : ''}`}>
              {isAr ? 'الخدمات المؤسسية' : 'Corporate Services'}
            </Link>
            {service && (
              <>
                <span>/</span>
                <span className="text-[#D4AF37] font-bold">
                  {isAr ? service.titleAr : service.titleEn}
                </span>
              </>
            )}
          </div>

          {/* Quick Service Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <Link
              to="/services"
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                !service
                  ? 'bg-[#D4AF37] text-[#0A1128] font-bold shadow-md shadow-[#D4AF37]/20'
                  : 'bg-[#121E3D] text-gray-300 hover:text-white hover:bg-[#1C2E5A]'
              }`}
            >
              {isAr ? 'كافة الخدمات' : 'All Services'}
            </Link>
            {allServicesList.map((item) => {
              const isActive = currentServiceKey === item.id;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.slug}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#0A1128] font-bold shadow-md shadow-[#D4AF37]/20'
                      : 'bg-[#121E3D] text-gray-300 hover:text-white hover:bg-[#1C2E5A]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{isAr ? item.titleAr : item.titleEn}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* If viewing a single service detail */}
        {service ? (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* Header Hero for the service */}
            <div className="bg-gradient-to-b from-[#121E3D] to-[#0A1128] border border-[#1C2E5A] rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-6">
                  <service.icon size={14} />
                  <span>{isAr ? service.badgeAr : service.badgeEn}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                  {isAr ? service.titleAr : service.titleEn}
                </h1>

                <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 font-medium">
                  {isAr ? service.subtitleAr : service.subtitleEn}
                </p>

                <p className="text-base text-gray-400 leading-relaxed mb-10">
                  {isAr ? service.descAr : service.descEn}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to={`/contact?service=${service.id}`}
                    className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#0A1128] font-black rounded-xl transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center gap-3 text-base sm:text-lg transform hover:-translate-y-0.5 active:scale-95"
                  >
                    <MessageSquare size={20} />
                    <span>{isAr ? service.ctaTextAr : service.ctaTextEn}</span>
                    {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </Link>

                  <Link
                    to="/contact"
                    className="px-6 py-4 bg-[#1C2E5A] hover:bg-[#2A4075] text-white font-bold rounded-xl transition-all border border-[#2A4075] text-base"
                  >
                    {isAr ? 'تواصل معنا للاستفسار' : 'General Inquiry'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Highlights & Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Highlights Box */}
              <div className="lg:col-span-1 bg-[#121E3D] border border-[#1C2E5A] rounded-2xl p-8 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-[#1C2E5A] pb-3 flex items-center gap-2">
                    <ShieldCheck size={22} className="text-[#D4AF37]" />
                    <span>{isAr ? 'أهم المزايا المؤسسية' : 'Key Highlights'}</span>
                  </h3>
                  <ul className="space-y-4">
                    {(isAr ? service.highlightsAr : service.highlightsEn).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-[#D4AF37] mt-0.5 shrink-0" />
                        <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-[#1C2E5A]">
                  <div className="bg-[#0A1128] p-4 rounded-xl border border-[#1C2E5A]/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400">{isAr ? 'حالة الخدمة' : 'Service Status'}</div>
                      <div className="text-sm font-bold text-[#10B981] flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                        {isAr ? 'متاحة وجاهزة للربط' : 'Available & Active'}
                      </div>
                    </div>
                    <service.icon size={24} className="text-[#D4AF37]" />
                  </div>
                </div>
              </div>

              {/* Detailed Feature Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {service.features.map((feat, idx) => {
                  const FeatIcon = feat.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-[#121E3D] border border-[#1C2E5A] rounded-2xl p-6 hover:border-[#D4AF37]/40 transition-all group shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-[#0A1128] border border-[#1C2E5A] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0A1128] transition-all mb-4">
                          <FeatIcon size={22} />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                          {isAr ? feat.titleAr : feat.titleEn}
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {isAr ? feat.descAr : feat.descEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Other Services Section */}
            <div className="border-t border-[#1C2E5A] pt-12">
              <h3 className="text-2xl font-bold text-white mb-6">
                {isAr ? 'استكشف باقي الخدمات المؤسسية' : 'Explore Other Corporate Services'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {allServicesList
                  .filter((s) => s.id !== service.id)
                  .map((other) => {
                    const OtherIcon = other.icon;
                    return (
                      <Link
                        key={other.id}
                        to={other.slug}
                        className="bg-[#121E3D] border border-[#1C2E5A] rounded-2xl p-6 hover:border-[#D4AF37]/50 hover:-translate-y-1 transition-all group shadow-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-10 h-10 rounded-lg bg-[#0A1128] border border-[#1C2E5A] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0A1128] transition-all mb-4">
                            <OtherIcon size={20} />
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                            {isAr ? other.titleAr : other.titleEn}
                          </h4>
                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-4">
                            {isAr ? other.descAr : other.descEn}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1 mt-2">
                          {isAr ? 'عرض التفاصيل' : 'View Details'}
                          {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                        </span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* General Services Overview Screen (/services) */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-4">
                <Layers size={14} />
                <span>{isAr ? 'حلول مؤسسية متقدمة' : 'Institutional Solutions'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                {isAr ? 'الخدمات المؤسسية وحلول البيانات' : 'Corporate Services & Data Solutions'}
              </h1>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                {isAr
                  ? 'نوفر بنية متكاملة من الخدمات والحلول الرقمية لدعم اتخاذ القرار وتسهيل وصول الشركات والجهات الحكومية والمؤسسات المالية إلى أسعار السلع والخامات العالمية.'
                  : 'We offer an integrated suite of digital infrastructure and analytics solutions to empower institutions, corporations, and traders with global market intelligence.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allServicesList.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-[#121E3D] border border-[#1C2E5A] rounded-3xl p-8 hover:border-[#D4AF37]/50 transition-all group shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#0A1128] border border-[#1C2E5A] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0A1128] transition-all shadow-md">
                          <Icon size={28} />
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1C2E5A] text-gray-300 border border-[#2A4075]">
                          {isAr ? item.badgeAr : item.badgeEn}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                        {isAr ? item.titleAr : item.titleEn}
                      </h2>

                      <p className="text-gray-300 text-sm leading-relaxed mb-6">
                        {isAr ? item.descAr : item.descEn}
                      </p>

                      <div className="space-y-2 mb-8 border-t border-[#1C2E5A] pt-4">
                        {(isAr ? item.highlightsAr : item.highlightsEn).slice(0, 2).map((h, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs text-gray-400">
                            <CheckCircle2 size={14} className="text-[#D4AF37] mt-0.5 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-[#1C2E5A]">
                      <Link
                        to={item.slug}
                        className="flex-1 py-3 px-4 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A1128] font-bold rounded-xl text-center text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10"
                      >
                        <span>{isAr ? 'عرض تفاصيل الخدمة' : 'View Service Details'}</span>
                        {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                      </Link>
                      <Link
                        to={`/contact?service=${item.id}`}
                        className="py-3 px-4 bg-[#1C2E5A] hover:bg-[#2A4075] text-white font-medium rounded-xl text-sm transition-all border border-[#2A4075]"
                      >
                        {isAr ? 'طلب الخدمة' : 'Inquire'}
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Support Banner */}
            <div className="bg-gradient-to-r from-[#121E3D] via-[#0A1128] to-[#121E3D] border border-[#1C2E5A] rounded-3xl p-8 md:p-10 text-center relative overflow-hidden shadow-2xl">
              <div className="max-w-2xl mx-auto relative z-10">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                  {isAr ? 'هل تحتاج إلى حلول مخصصة لمؤسستك؟' : 'Need Tailored Solutions for Your Organization?'}
                </h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                  {isAr
                    ? 'فريقنا مستعد لتصميم باقات وحلول ربط متوافقة مع المتطلبات المحددة لشركتكم أو جهاتكم الحكومية.'
                    : 'Our engineering and data specialists are ready to architect custom integration packages matching your exact requirements.'}
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A1128] font-black rounded-xl transition-all shadow-xl shadow-[#D4AF37]/20"
                >
                  <MessageSquare size={18} />
                  <span>{isAr ? 'تواصل مع المستشار المؤسسي' : 'Speak with an Enterprise Advisor'}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
