
import React, { useMemo, useEffect } from 'react';
import { DeductionState, RULES } from '../types';
import { ChevronRight, GraduationCap, Baby, Home, Building, HeartPulse, UserPlus, Book, CheckCircle2, Edit2, ArrowLeft, FileText, Download, AlertCircle, ShieldCheck, Building2, UserCheck, XCircle, History } from 'lucide-react';

interface CalculatorProps {
  state: DeductionState;
  setState: React.Dispatch<React.SetStateAction<DeductionState>>;
  step: number;
  setStep: (step: number) => void;
  hasSubmitted: boolean;
  setHasSubmitted: (val: boolean) => void;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 }).format(val);
};

export const Calculator: React.FC<CalculatorProps> = ({ state, setState, step, setStep, hasSubmitted, setHasSubmitted }) => {
  
  // --- Calculations ---
  const totals = useMemo(() => {
    let monthly = 0;
    const breakdown: {name: string, value: number, detail: string}[] = [];

    // 1. Children
    if (state.children.enabled) {
      const perChild = RULES.CHILD_PER_MONTH * (state.children.splitMethod === '100%' ? 1 : 0.5);
      const val = perChild * state.children.count;
      monthly += val;
      breakdown.push({ 
          name: '子女教育', 
          value: val, 
          detail: `${state.children.count}个子女, ${state.children.splitMethod === '100%' ? '全额扣除' : '平均分摊'}` 
      });
    }

    // 2. Infant
    if (state.infant.enabled) {
      const perInfant = RULES.INFANT_PER_MONTH * (state.infant.splitMethod === '100%' ? 1 : 0.5);
      const val = perInfant * state.infant.count;
      monthly += val;
      breakdown.push({ 
          name: '3岁以下婴幼儿照护', 
          value: val, 
          detail: `${state.infant.count}个婴幼儿, ${state.infant.splitMethod === '100%' ? '全额扣除' : '平均分摊'}` 
      });
    }

    // 3. Continuing Edu
    if (state.continuingEdu.enabled) {
      let val = 0;
      const types = [];
      if (state.continuingEdu.academic) {
          val += RULES.EDU_ACADEMIC_MONTH;
          types.push('学历教育');
      }
      if (state.continuingEdu.professional) {
          val += (RULES.EDU_PROFESSIONAL_YEAR / 12); 
          types.push('职业资格');
      }
      monthly += val;
      if (val > 0) breakdown.push({ name: '继续教育', value: val, detail: types.join(' + ') });
    }

    // 4. Loan
    if (state.housingLoan.enabled) {
      const val = RULES.LOAN_MONTH * (state.housingLoan.splitMethod === '100%' ? 1 : 0.5);
      monthly += val;
      breakdown.push({ 
          name: '住房贷款利息', 
          value: val, 
          detail: state.housingLoan.splitMethod === '100%' ? '本人扣除 (100%)' : '夫妻分摊 (50%)' 
      });
    }

    // 5. Rent
    if (state.rent.enabled && !state.housingLoan.enabled) {
      let amount = RULES.RENT_TIER3;
      let label = '中小城市';
      if (state.rent.cityType === 'tier1') { amount = RULES.RENT_TIER1; label = '省会/直辖市'; }
      if (state.rent.cityType === 'tier2') { amount = RULES.RENT_TIER2; label = '大城市'; }
      monthly += amount;
      breakdown.push({ name: '住房租金', value: amount, detail: label });
    }

    // 6. Elderly
    if (state.elderly.enabled) {
      let val = 0;
      let detail = '';
      
      if (state.elderly.isOnlyChild) {
        val = RULES.ELDERLY_ONLY_CHILD_MONTH;
        detail = '独生子女 (2000元)';
      } else {
        if (state.elderly.shareMethod === 'average') {
            // Avoid division by zero
            const count = Math.max(1, state.elderly.siblingCount);
            val = Math.floor(2000 / count);
            detail = `非独生 - 平均分摊 (共${count}人)`;
        } else {
            val = Math.min(state.elderly.shareAmount, 2000);
            detail = `非独生 - 约定分摊`;
        }
      }
      monthly += val;
      breakdown.push({ name: '赡养老人', value: val, detail });
    }

    return { monthly, breakdown };
  }, [state]);

  const annualIllnessDeduction = useMemo(() => {
    if (!state.seriousIllness.enabled) return 0;
    const deductible = Math.max(0, state.seriousIllness.annualSelfPay - RULES.ILLNESS_THRESHOLD);
    return Math.min(deductible, RULES.ILLNESS_LIMIT);
  }, [state.seriousIllness]);

  const totalAnnual = (totals.monthly * 12) + annualIllnessDeduction;

  const updateState = (section: keyof DeductionState, payload: Partial<DeductionState[keyof DeductionState]>) => {
    setState(prev => ({
      ...prev,
      [section]: { ...prev[section], ...payload } as any
    }));
  };

  // Handle Persistence when reaching Step 3
  useEffect(() => {
    if (step === 3) {
        setHasSubmitted(true);
        localStorage.setItem('tax_deduction_submitted', 'true');
    }
  }, [step, setHasSubmitted]);

  // --- STEP 0: INTRO PAGE (OR SUBMITTED STATUS) ---
  if (step === 0) {
    if (hasSubmitted) {
        // RE-ENTRY VIEW
        return (
            <div className="pb-32 pt-8 px-6 animate-in fade-in duration-500">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8 text-center">
                    <div className="w-20 h-20 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">申报信息已提交</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8">
                        您已完成2025年度专项附加扣除信息填报。
                        <br />
                        如您的个人情况发生变化，可重新填写。
                    </p>

                    <div className="bg-gray-50 rounded-xl p-4 text-left mb-8">
                        <div className="flex items-center text-gray-900 font-medium mb-2">
                            <History className="w-4 h-4 mr-2 text-gray-400" />
                            最近提交状态
                        </div>
                        <div className="text-xs text-gray-500">
                            状态：<span className="text-teal-600 font-medium">已完成</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setStep(1)}
                        className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center"
                    >
                        <Edit2 className="w-4 h-4 mr-2" />
                        修改申报信息
                    </button>
                </div>
            </div>
        );
    }

    // DEFAULT INTRO VIEW
    return (
        <div className="pb-32 pt-8 px-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-8 text-white text-center">
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold mb-1">个税专项附加扣除信息采集</h2>
                    <p className="text-teal-50 text-sm">2025年度</p>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="flex items-start space-x-4">
                        <div className="bg-teal-50 p-2 rounded-lg shrink-0">
                            <Building2 className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">背景说明</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                受贵司（合作单位）委托，<span className="font-semibold text-gray-900">班步协作</span> 现邀请您填写2025年度个人所得税专项附加扣除信息。
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="bg-teal-50 p-2 rounded-lg shrink-0">
                            <UserCheck className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">致各位承揽者</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                为了更好地服务各位承揽者，提供更精准的税务服务与薪酬计算，请您根据实际情况，依法如实填报税前扣除数据。
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="bg-teal-50 p-2 rounded-lg shrink-0">
                            <ShieldCheck className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">隐私承诺</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                我们承诺严格保障您的数据安全，您填写的所有信息将<span className="font-semibold">仅用于税务合规申报</span>，绝不用于其他用途。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-10 flex justify-center">
             <div className="w-full max-w-xl">
                <button 
                    onClick={() => setStep(1)}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/30 active:scale-[0.98] transition-all flex items-center justify-center text-base"
                >
                    我已了解，开始填报
                    <ChevronRight className="w-5 h-5 ml-1" />
                </button>
             </div>
         </div>
        </div>
    );
  }

  // --- STEP 1: INPUT FORM ---
  if (step === 1) {
    return (
      <div className="pb-32 pt-6 animate-in fade-in slide-in-from-right-4 duration-500">
         <div className="px-4 space-y-5">
            <div className="flex items-center mb-2 px-1">
                <div className="w-1 h-4 bg-teal-500 rounded mr-2"></div>
                <h2 className="text-sm font-semibold text-gray-900">基本信息填报</h2>
            </div>
            
            <InputItem 
                title="子女教育" 
                icon={<GraduationCap className="w-5 h-5" />}
                enabled={state.children.enabled}
                onToggle={() => updateState('children', { enabled: !state.children.enabled })}
            >
                <Counter 
                    label="子女数量" 
                    value={state.children.count} 
                    onChange={(v) => updateState('children', { count: v })} 
                />
                <SegmentedControl 
                    label="分摊方式"
                    options={[
                        { label: '全额扣除 (100%)', value: '100%' },
                        { label: '夫妻平摊 (50%)', value: '50%' }
                    ]}
                    value={state.children.splitMethod}
                    onChange={(v) => updateState('children', { splitMethod: v as any })}
                />
            </InputItem>

            <InputItem 
                title="3岁以下婴幼儿照护" 
                icon={<Baby className="w-5 h-5" />}
                enabled={state.infant.enabled}
                onToggle={() => updateState('infant', { enabled: !state.infant.enabled })}
            >
                <Counter 
                    label="婴幼儿数量" 
                    value={state.infant.count} 
                    onChange={(v) => updateState('infant', { count: v })} 
                />
                <SegmentedControl 
                    label="分摊方式"
                    options={[
                        { label: '全额扣除 (100%)', value: '100%' },
                        { label: '夫妻平摊 (50%)', value: '50%' }
                    ]}
                    value={state.infant.splitMethod}
                    onChange={(v) => updateState('infant', { splitMethod: v as any })}
                />
            </InputItem>

            <InputItem 
                title="住房贷款利息" 
                icon={<Home className="w-5 h-5" />}
                enabled={state.housingLoan.enabled}
                onToggle={() => {
                    if (!state.housingLoan.enabled && state.rent.enabled) {
                        if(!window.confirm("住房贷款利息和住房租金不能同时享受。确认切换吗？")) return;
                        updateState('rent', { enabled: false });
                    }
                    updateState('housingLoan', { enabled: !state.housingLoan.enabled });
                }}
            >
                <SegmentedControl 
                    label="扣除方式"
                    options={[
                        { label: '本人扣除 (100%)', value: '100%' },
                        { label: '夫妻平摊 (50%)', value: '50%' }
                    ]}
                    value={state.housingLoan.splitMethod}
                    onChange={(v) => updateState('housingLoan', { splitMethod: v as any })}
                />
                <div className="text-xs text-gray-400 mt-2">需为首套住房贷款。</div>
            </InputItem>

            <InputItem 
                title="住房租金" 
                icon={<Building className="w-5 h-5" />}
                enabled={state.rent.enabled}
                onToggle={() => {
                    if (!state.rent.enabled && state.housingLoan.enabled) {
                        if(!window.confirm("住房贷款利息和住房租金不能同时享受。确认切换吗？")) return;
                        updateState('housingLoan', { enabled: false });
                    }
                    updateState('rent', { enabled: !state.rent.enabled });
                }}
            >
                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">工作城市类型</label>
                    <RadioGroup 
                        options={[
                            { value: 'tier1', label: '省会/直辖市/计划单列市', sub: '1500元/月' },
                            { value: 'tier2', label: '市辖区人口 > 100万', sub: '1100元/月' },
                            { value: 'tier3', label: '市辖区人口 ≤ 100万', sub: '800元/月' },
                        ]}
                        value={state.rent.cityType}
                        onChange={(v) => updateState('rent', { cityType: v as any })}
                    />
                </div>
            </InputItem>

            <InputItem 
                title="赡养老人" 
                icon={<UserPlus className="w-5 h-5" />}
                enabled={state.elderly.enabled}
                onToggle={() => updateState('elderly', { enabled: !state.elderly.enabled })}
            >
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700 font-medium">我是独生子女</span>
                    <Toggle 
                        checked={state.elderly.isOnlyChild} 
                        onChange={(c) => updateState('elderly', { isOnlyChild: c })} 
                    />
                </div>
                {!state.elderly.isOnlyChild && (
                    <div className="mt-4 space-y-4">
                         <SegmentedControl 
                            label="分摊方式"
                            options={[
                                { label: '平均分摊 (自动计算)', value: 'average' },
                                { label: '约定/指定分摊', value: 'specific' }
                            ]}
                            value={state.elderly.shareMethod}
                            onChange={(v) => updateState('elderly', { shareMethod: v as any })}
                        />
                        
                        {state.elderly.shareMethod === 'average' ? (
                            <div>
                                <Counter 
                                    label="共同赡养人数(含本人)" 
                                    value={state.elderly.siblingCount} 
                                    onChange={(v) => updateState('elderly', { siblingCount: Math.max(2, v) })} 
                                />
                                <p className="text-xs text-gray-400 -mt-3 mb-2 px-1 flex items-start">
                                    <AlertCircle className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
                                    指您父母的所有子女总数（含您自己）。
                                </p>
                            </div>
                        ) : (
                            <div className="mt-2">
                                <label className="text-sm text-gray-600 block mb-2 font-medium">本月扣除金额 (元)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">¥</span>
                                    <input 
                                        type="number" 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-8 pr-3 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                        value={state.elderly.shareAmount}
                                        onChange={(e) => updateState('elderly', { shareAmount: Number(e.target.value) })}
                                        placeholder="请输入协议约定金额"
                                    />
                                </div>
                                <div className="text-xs text-orange-500 mt-1.5 flex items-start">
                                    <AlertCircle className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
                                    每人最高不超1000元，所有子女合计不超2000元
                                </div>
                            </div>
                        )}
                    </div>
                 )}
            </InputItem>

            <InputItem 
                title="继续教育" 
                icon={<Book className="w-5 h-5" />}
                enabled={state.continuingEdu.enabled}
                onToggle={() => updateState('continuingEdu', { enabled: !state.continuingEdu.enabled })}
            >
                 <div className="space-y-3">
                     <Checkbox 
                        label="学历(学位)继续教育" 
                        sub="400元/月"
                        checked={state.continuingEdu.academic}
                        onChange={(c) => updateState('continuingEdu', { academic: c })}
                     />
                     <Checkbox 
                        label="职业资格继续教育" 
                        sub="3600元/年"
                        checked={state.continuingEdu.professional}
                        onChange={(c) => updateState('continuingEdu', { professional: c })}
                     />
                 </div>
            </InputItem>

            <InputItem 
                title="大病医疗" 
                icon={<HeartPulse className="w-5 h-5" />}
                enabled={state.seriousIllness.enabled}
                onToggle={() => updateState('seriousIllness', { enabled: !state.seriousIllness.enabled })}
            >
                 <div className="mt-1">
                     <label className="text-sm text-gray-600 block mb-2 font-medium">年度自付金额 (元)</label>
                     <div className="relative">
                         <span className="absolute left-3 top-2.5 text-gray-400 text-sm">¥</span>
                         <input 
                            type="number" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-8 pr-3 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                            value={state.seriousIllness.annualSelfPay}
                            onChange={(e) => updateState('seriousIllness', { annualSelfPay: Number(e.target.value) })}
                            placeholder="请输入年度累计自付"
                         />
                     </div>
                     <div className="text-xs text-gray-400 mt-1.5">仅限汇算清缴时扣除</div>
                 </div>
            </InputItem>
         </div>

         {/* Floating Action Button */}
         <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-10 flex justify-center">
             <div className="w-full max-w-xl">
                <button 
                    onClick={() => setStep(2)}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/30 active:scale-[0.98] transition-all flex items-center justify-center text-base"
                >
                    下一步
                    <ChevronRight className="w-5 h-5 ml-1" />
                </button>
             </div>
         </div>
      </div>
    );
  }

  // --- STEP 2: INVOICE STYLE REVIEW ---
  if (step === 2) {
    return (
      <div className="pb-32 px-4 pt-6 animate-in fade-in slide-in-from-right-8 duration-500">
        
        {/* Invoice Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Invoice Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">专项附加扣除试算单</h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">Tax Deduction 2025</p>
                </div>
                <div className="text-right">
                     <div className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                        <FileText className="w-3 h-3 mr-1" /> 预览
                     </div>
                </div>
            </div>

            {/* Total Summary */}
            <div className="p-6 bg-gray-50/50 border-b border-gray-100 text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">预计月度扣除总额</div>
                <div className="text-4xl font-bold text-teal-600 tracking-tight">
                    {formatCurrency(totals.monthly)}
                </div>
                <div className="mt-3 inline-flex items-center justify-center text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    预计年度总扣除：{formatCurrency(totalAnnual)}
                </div>
            </div>

            {/* Itemized List */}
            <div className="p-2">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 font-medium">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">项目</th>
                            <th className="px-4 py-3 text-right rounded-r-lg">金额</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {totals.breakdown.length === 0 && !state.seriousIllness.enabled && (
                             <tr>
                                 <td colSpan={2} className="px-4 py-8 text-center text-gray-400">
                                     暂无扣除项目
                                 </td>
                             </tr>
                        )}
                        {totals.breakdown.map((item, idx) => (
                            <tr key={idx} className="group">
                                <td className="px-4 py-4">
                                    <div className="font-medium text-gray-900">{item.name}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{item.detail}</div>
                                </td>
                                <td className="px-4 py-4 text-right font-semibold text-gray-700">
                                    {formatCurrency(item.value)}
                                </td>
                            </tr>
                        ))}
                         {state.seriousIllness.enabled && (
                            <tr className="bg-orange-50/30">
                                <td className="px-4 py-4">
                                    <div className="font-medium text-gray-900">大病医疗</div>
                                    <div className="text-xs text-orange-500 mt-0.5">年度汇算时扣除</div>
                                </td>
                                <td className="px-4 py-4 text-right font-semibold text-orange-600">
                                    {formatCurrency(annualIllnessDeduction)}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Footer Total Row */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">合计 (Total)</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(totals.monthly)}</span>
            </div>
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-10 flex justify-center">
             <div className="w-full max-w-xl flex space-x-3">
                <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl active:bg-gray-50 transition-colors shadow-sm"
                >
                    返回修改
                </button>
                <button 
                    onClick={() => setStep(3)}
                    className="flex-[2] bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-500/30 active:scale-[0.98] transition-all flex items-center justify-center"
                >
                    确认提交
                </button>
             </div>
         </div>
      </div>
    );
  }

  // --- STEP 3: SUCCESS ---
  if (step === 3) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-sm border border-green-100">
                <CheckCircle2 size={48} strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">提交成功</h2>
            <div className="space-y-4 w-full max-w-xs">
                <button 
                    onClick={() => {
                        // Try to close the window, fallback to alert
                        try {
                            window.close();
                        } catch(e) {}
                        alert("请直接关闭浏览器窗口以退出");
                    }}
                    className="w-full flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/30 transition-colors"
                >
                    <XCircle className="w-5 h-5 mr-2" />
                    关闭 (Close)
                </button>
            </div>
        </div>
      );
  }

  return null;
};

// --- UI Components ---

const InputItem: React.FC<{
    title: string;
    icon: React.ReactNode;
    enabled: boolean;
    onToggle: () => void;
    children?: React.ReactNode;
}> = ({ title, icon, enabled, onToggle, children }) => {
    return (
        <div className={`bg-white border rounded-xl transition-all duration-200 shadow-sm ${enabled ? 'border-teal-500 ring-1 ring-teal-500/10' : 'border-gray-200'}`}>
            <div className="p-4 flex items-center justify-between cursor-pointer select-none" onClick={onToggle}>
                <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-lg transition-colors ${enabled ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-400'}`}>
                        {icon}
                    </div>
                    <span className={`font-medium text-base transition-colors ${enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                        {title}
                    </span>
                </div>
                <Toggle checked={enabled} onChange={() => onToggle()} />
            </div>
            {enabled && children && (
                <div className="px-4 pb-5 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="h-px bg-gray-100 mb-5"></div>
                    {children}
                </div>
            )}
        </div>
    );
};

const Toggle: React.FC<{ checked: boolean; onChange: (c: boolean) => void }> = ({ checked, onChange }) => (
    <div 
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer ${checked ? 'bg-teal-500' : 'bg-gray-200'}`}
        onClick={(e) => {
            e.stopPropagation();
            onChange(!checked);
        }}
    >
        <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </div>
);

const Counter: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
    <div className="flex justify-between items-center mb-5">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button onClick={(e) => { e.stopPropagation(); onChange(Math.max(1, value - 1)); }} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-md transition-all">-</button>
            <span className="w-10 text-center text-sm font-bold text-gray-800">{value}</span>
            <button onClick={(e) => { e.stopPropagation(); onChange(value + 1); }} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-md transition-all">+</button>
        </div>
    </div>
);

const SegmentedControl: React.FC<{ 
    label: string; 
    options: { label: string; value: string }[]; 
    value: string; 
    onChange: (v: string) => void; 
}> = ({ label, options, value, onChange }) => (
    <div className="mb-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">{label}</label>
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            {options.map((opt) => (
                <button 
                    key={opt.value}
                    onClick={(e) => { e.stopPropagation(); onChange(opt.value); }}
                    className={`flex-1 py-2.5 text-xs font-medium rounded-md transition-all ${value === opt.value ? 'bg-white text-teal-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    </div>
);

const RadioGroup: React.FC<{
    options: { value: string; label: string; sub?: string }[];
    value: string;
    onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
    <div className="space-y-2">
        {options.map((opt) => (
            <label 
                key={opt.value} 
                className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all ${value === opt.value ? 'border-teal-500 bg-teal-50/30 ring-1 ring-teal-500/10' : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => onChange(opt.value)}
            >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3.5 shrink-0 ${value === opt.value ? 'border-teal-500' : 'border-gray-300'}`}>
                    {value === opt.value && <div className="w-2 h-2 bg-teal-500 rounded-full"></div>}
                </div>
                <div>
                    <div className={`text-sm ${value === opt.value ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{opt.label}</div>
                    {opt.sub && <div className="text-xs text-gray-500 mt-0.5">{opt.sub}</div>}
                </div>
            </label>
        ))}
    </div>
);

const Checkbox: React.FC<{ label: string; sub?: string; checked: boolean; onChange: (c: boolean) => void }> = ({ label, sub, checked, onChange }) => (
    <label className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all ${checked ? 'border-teal-500 bg-teal-50/30' : 'border-gray-200'}`}>
        <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3.5 shrink-0 ${checked ? 'bg-teal-500 border-teal-500' : 'border-gray-300 bg-white'}`}>
            {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
        </div>
        <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div>
            <div className={`text-sm ${checked ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{label}</div>
            {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
        </div>
    </label>
);
