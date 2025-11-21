import React, { useState, useEffect } from 'react';
import { DeductionState } from './types';
import { Calculator } from './components/Calculator';
import { ClipboardList } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<number>(0); // 0: Intro, 1: Input, 2: Review, 3: Success
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Check for submission status on mount
  useEffect(() => {
    const submitted = localStorage.getItem('tax_deduction_submitted');
    if (submitted === 'true') {
      setHasSubmitted(true);
    }
  }, []);

  const [state, setState] = useState<DeductionState>({
    children: { enabled: false, count: 1, splitMethod: '100%' },
    continuingEdu: { enabled: false, academic: false, professional: false },
    housingLoan: { enabled: false, splitMethod: '100%' },
    rent: { enabled: false, cityType: 'tier1' },
    elderly: { 
        enabled: false, 
        isOnlyChild: true, 
        shareMethod: 'average',
        siblingCount: 2,
        shareAmount: 1000 
    },
    seriousIllness: { enabled: false, annualSelfPay: 0 },
    infant: { enabled: false, count: 1, splitMethod: '100%' },
  });

  const getTitle = () => {
    if (step === 0) return hasSubmitted ? '申报状态' : '申报说明';
    if (step === 1) return '填写扣除信息';
    if (step === 2) return '确认填报信息';
    return '申报完成';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
        <div className="px-6 h-16 flex items-center justify-between max-w-xl mx-auto w-full">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-500 p-1.5 rounded-lg text-white shadow-sm">
                <ClipboardList size={20} strokeWidth={2} />
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              {getTitle()}
            </h1>
          </div>
          <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            {step === 0 ? (hasSubmitted ? 'Done' : 'Start') : step < 3 ? `Step ${step} / 2` : 'Done'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-xl mx-auto w-full relative">
        <Calculator 
            state={state} 
            setState={setState} 
            step={step}
            setStep={setStep}
            hasSubmitted={hasSubmitted}
            setHasSubmitted={setHasSubmitted}
        />
      </main>
    </div>
  );
}