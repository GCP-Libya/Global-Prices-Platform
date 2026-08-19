import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Commodity } from '../types';

interface MarketContextType {
  data: Commodity[];
  news: any[];
  analyses: any[];
  history: any[];
  connected: boolean;
  pricesLoading: boolean;
  historyLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  latency: number | null;
  isMockData: boolean;
  fetchCommodities: () => Promise<void>;
  fetchNews: () => Promise<void>;
  fetchAnalyses: () => Promise<void>;
  fetchHistory: (symbol?: string) => Promise<void>;
}

const MarketContext = createContext<MarketContextType>({ 
  data: [], 
  news: [],
  analyses: [],
  history: [],
  connected: false,
  pricesLoading: true,
  historyLoading: false,
  error: null,
  lastUpdate: null,
  latency: null,
  isMockData: false,
  fetchCommodities: async () => {},
  fetchNews: async () => {},
  fetchAnalyses: async () => {},
  fetchHistory: async () => {}
});

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<Commodity[]>([]); 
  const [news, setNews] = useState<any[]>([]);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const historySymbolRef = React.useRef<string | null>(null);

  const [connected, setConnected] = useState(false);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  const fetchCommodities = async () => {
    try {
      const fetchStart = Date.now();
      console.log('[MARKET] fetch start');
      const { data: commodities, error: supaError } = await supabase
        .from('commodities')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(100);

      console.log('[MARKET] result rows:', commodities?.length);
      if (supaError) {
        console.log('[MARKET] error:', supaError.message);
        throw supaError;
      }
      console.log('[MARKET] fetch end');

      setLatency(Date.now() - fetchStart);
      setError(null);
      
      if (commodities && commodities.length > 0) {
        setIsMockData(false);
        const mappedCommodities = commodities
          .filter((c: any) => c.is_visible !== false)
          .map((c: any) => {
            let normalizedSector = 'commodities';
            let secAr = 'السلع الأساسية';
            let secEn = 'Commodities';

            const rawSector = String(c.sector || '').toLowerCase().trim();
            if (rawSector === 'energy' || rawSector === 'oil' || rawSector === 'النفط' || rawSector === 'الطاقة') {
              normalizedSector = 'energy';
              secAr = 'الطاقة';
              secEn = 'Energy';
            } else if (rawSector === 'metals' || rawSector === 'metal' || rawSector === 'المعادن') {
              normalizedSector = 'metals';
              secAr = 'المعادن';
              secEn = 'Metals';
            } else if (rawSector === 'commodities' || rawSector === 'commodity' || rawSector === 'agriculture' || rawSector === 'السلع الزراعية' || rawSector === 'السلع الأساسية' || rawSector === 'السلع') {
              normalizedSector = 'commodities';
              secAr = 'السلع الأساسية';
              secEn = 'Commodities';
            } else if (rawSector === 'forex' || rawSector === 'currencies' || rawSector === 'العملات') {
              normalizedSector = 'forex';
              secAr = 'العملات';
              secEn = 'Currencies';
            } else if (rawSector === 'indices' || rawSector === 'المؤشرات') {
              normalizedSector = 'indices';
              secAr = 'المؤشرات';
              secEn = 'Indices';
            } else if (rawSector === 'shipping' || rawSector === 'الشحن') {
              normalizedSector = 'shipping';
              secAr = 'الشحن';
              secEn = 'Shipping';
            }

            return {
              id: String(c.id),
              nameAr: c.name_ar,
              nameEn: c.name_en,
              symbol: c.symbol,
              sector: normalizedSector,
              sectorAr: secAr,
              sectorEn: secEn,
              price: c.price,
              changePercent: c.change_percent,
              trend: c.trend,
              high: c.high,
              low: c.low,
              unitAr: c.unit || '',
              unitEn: c.unit || '',
              source: c.source,
              createdAt: c.created_at,
              updatedAt: c.updated_at,
              isVisible: c.is_visible,
              prevClose: c.previous_price,
              changeAmount: c.change_value,
              statusAr: c.status === 'active' || !c.status ? 'مفتوح' : 'مغلق',
              statusEn: c.status === 'active' || !c.status ? 'Open' : 'Closed',
              lastUpdate: c.updated_at || new Date().toISOString(),
              history: []
            };
          }) as unknown as Commodity[];
        
        setData(mappedCommodities);
        setConnected(true);
        setLastUpdate(new Date());
      } else {
        setIsMockData(false);
        setData([]); 
        setConnected(true);
        setLastUpdate(new Date());
      }
    } catch (err: any) {
      console.warn('Supabase commodities fetch error:', err);
      if (data.length === 0) {
        setError('تعذر تحميل البيانات مؤقتًا');
        setConnected(false);
        setIsMockData(false);
      }
    } finally {
      setPricesLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (newsError) {
        console.warn('Supabase news fetch error:', newsError.message);
      } else if (newsData) {
        setNews(newsData);
      }
    } catch (err) {
      console.warn('Supabase news fetch exception:', err);
    }
  };

  const fetchAnalyses = async () => {
    try {
      console.log('[REPORTS/ANALYSES] fetch start');
      const { data: analysesData, error: analysesError } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      console.log('[REPORTS/ANALYSES] result rows:', analysesData?.length);
      if (analysesError) {
        console.log('[REPORTS/ANALYSES] error:', analysesError.message);
      }
      console.log('[REPORTS/ANALYSES] fetch end');
      
      if (analysesData) {
        setAnalyses(analysesData);
      }
    } catch (err) {
      console.warn('Supabase analyses fetch exception:', err);
    }
  };

  const fetchHistory = async (symbol?: string) => {
    const sym = symbol || historySymbolRef.current;
    if (!sym) return;
    historySymbolRef.current = sym;
    
    setHistoryLoading(true);
    try {
      console.log('[ARCHIVE/HISTORY] fetch start symbol:', sym);
      const { data: historyData, error: historyError } = await supabase
        .from('commodity_price_history')
        .select('*')
        .eq('symbol', sym)
        .order('recorded_at', { ascending: true })
        .limit(50);
      
      console.log('[ARCHIVE/HISTORY] result rows:', historyData?.length);
      if (historyError) {
        console.log('[ARCHIVE/HISTORY] error:', historyError.message);
      }
      console.log('[ARCHIVE/HISTORY] fetch end');
      
      if (historyData) {
        setHistory(historyData);
      }
    } catch (err) {
      console.warn('Supabase history fetch exception:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Initial fetches
    fetchCommodities();
    fetchNews();
    fetchAnalyses();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (!isMounted) return;
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        fetchCommodities();
        fetchNews();
        fetchAnalyses();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <MarketContext.Provider value={{ 
      data, news, analyses, history, connected, pricesLoading, historyLoading, error, lastUpdate, latency, isMockData,
      fetchCommodities, fetchNews, fetchAnalyses, fetchHistory
    }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarketData = () => useContext(MarketContext);
