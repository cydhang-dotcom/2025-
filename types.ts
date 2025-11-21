export interface DeductionState {
  children: {
    enabled: boolean;
    count: number;
    splitMethod: '100%' | '50%';
  };
  continuingEdu: {
    enabled: boolean;
    academic: boolean; // 学历教育
    professional: boolean; // 职业资格
  };
  housingLoan: {
    enabled: boolean;
    splitMethod: '100%' | '50%';
  };
  rent: {
    enabled: boolean;
    cityType: 'tier1' | 'tier2' | 'tier3';
  };
  elderly: {
    enabled: boolean;
    isOnlyChild: boolean;
    shareMethod: 'average' | 'specific'; // New: 分摊方式
    siblingCount: number; // New: 兄弟姐妹总人数
    shareAmount: number; // For non-only child specific amount
  };
  seriousIllness: {
    enabled: boolean;
    annualSelfPay: number;
  };
  infant: {
    enabled: boolean;
    count: number;
    splitMethod: '100%' | '50%';
  };
}

export type Tab = 'calculator' | 'guide';

// Constants based on the provided text
export const RULES = {
  CHILD_PER_MONTH: 1000,
  INFANT_PER_MONTH: 1000,
  EDU_ACADEMIC_MONTH: 400,
  EDU_PROFESSIONAL_YEAR: 3600,
  LOAN_MONTH: 1000,
  ELDERLY_ONLY_CHILD_MONTH: 2000,
  RENT_TIER1: 1500, // 省会/计划单列市
  RENT_TIER2: 1100, // 市辖区户籍>100万
  RENT_TIER3: 800,  // 其余
  ILLNESS_THRESHOLD: 15000,
  ILLNESS_LIMIT: 80000,
};