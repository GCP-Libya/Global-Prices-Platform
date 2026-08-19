export type Sector = 'الطاقة' | 'المعادن' | 'السلع الزراعية' | 'السلع الأساسية' | 'المؤشرات' | 'العملات' | 'الشحن' | string;
export type SectorEn = 'Energy' | 'Metals' | 'Agriculture' | 'Commodities' | 'Indices' | 'Currencies' | 'Shipping' | string;
export type Trend = 'up' | 'down' | 'neutral';
export type MarketStatus = 'مفتوح' | 'مغلق';
export type MarketStatusEn = 'Open' | 'Closed';

export interface Commodity {
  id: string;
  nameAr: string;
  nameEn: string;
  symbol: string;
  sectorAr: Sector;
  sectorEn: SectorEn;
  sector?: string;
  price: number;
  prevClose: number;
  changeAmount: number;
  changePercent: number;
  high?: number | null;
  low?: number | null;
  unitAr: string;
  unitEn: string;
  currency?: string;
  trend: Trend;
  statusAr: MarketStatus;
  statusEn: MarketStatusEn;
  lastUpdate: string;
  history: { time: string; price: number }[];
}
