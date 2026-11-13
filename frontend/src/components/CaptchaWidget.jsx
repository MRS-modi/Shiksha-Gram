import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CaptchaWidget = ({ onValidate }) => {
  const { lang } = useLanguage();
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(4);
  const [inputVal, setInputVal] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 1;
    setNum1(n1);
    setNum2(n2);
    setInputVal('');
    setIsVerified(false);
    onValidate(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputVal(val);
    if (parseInt(val, 10) === num1 + num2) {
      setIsVerified(true);
      onValidate(true);
    } else {
      setIsVerified(false);
      onValidate(false);
    }
  };

  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2.5 flex-wrap sm:flex-nowrap">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {lang === 'hi' ? 'सुरक्षा जांच:' : 'Security Check:'}
        </span>
        <div className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono font-bold tracking-widest text-brand-600 dark:text-brand-400 select-none shadow-inner">
          {num1} + {num2} = ?
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={inputVal}
          onChange={handleChange}
          placeholder="Answer"
          className="w-16 px-2 py-1 text-sm text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-slate-800 dark:text-slate-100 font-bold"
        />

        {isVerified ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <button
            type="button"
            onClick={generateCaptcha}
            title="Refresh Captcha"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
