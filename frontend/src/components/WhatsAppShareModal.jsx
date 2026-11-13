import React, { useState } from 'react';
import { Send, Copy, Check, X, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WhatsAppShareModal = ({ isOpen, onClose, title, defaultText, targetPhone = '' }) => {
  const { lang } = useLanguage();
  const [message, setMessage] = useState(defaultText || '');
  const [phone, setPhone] = useState(targetPhone);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 w-full max-w-lg shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {title || (lang === 'hi' ? 'व्हाट्सएप पर साझा करें' : 'Share via WhatsApp')}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">
              {lang === 'hi' ? 'अभिभावक या विद्यार्थी को सीधा संदेश भेजें' : 'Send direct update to parent or student'}
            </p>
          </div>
        </div>

        <div className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {lang === 'hi' ? 'व्हाट्सएप मोबाइल नंबर (वैकल्पिक):' : 'WhatsApp Number (Optional):'}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800 dark:text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {lang === 'hi' ? 'संदेश प्रारूप:' : 'Message Content:'}
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 text-xs leading-relaxed rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? (lang === 'hi' ? 'कॉपी हो गया!' : 'Copied!') : (lang === 'hi' ? 'टेक्स्ट कॉपी करें' : 'Copy Text')}
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              <Send className="w-4 h-4" />
              {lang === 'hi' ? 'व्हाट्सएप में खोलें' : 'Open in WhatsApp'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
