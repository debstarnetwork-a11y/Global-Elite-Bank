import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, LanguageCode } from '../context/LanguageContext';

interface LanguageDropdownProps {
  variant?: 'navbar' | 'dashboard' | 'compact';
  className?: string;
}

export function LanguageDropdown({ variant = 'navbar', className = '' }: LanguageDropdownProps) {
  const { language, setLanguage, currentLanguageOption, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const isDashboard = variant === 'dashboard';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl transition-all duration-200 outline-none select-none text-xs font-semibold ${
          isDashboard
            ? 'h-9 px-3 bg-card border border-border text-foreground hover:bg-card/80 hover:border-primary/40 shadow-xs'
            : 'h-9 px-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white backdrop-blur-md shadow-xs'
        }`}
        title={t('selectLanguage', 'Select Language')}
        aria-label={t('selectLanguage', 'Select Language')}
        aria-expanded={isOpen}
      >
        <Globe size={15} className={isDashboard ? 'text-primary' : 'text-accent'} />
        <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
        <span className="tracking-wide uppercase font-bold text-[11px]">{currentLanguageOption.code}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 opacity-60 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl shadow-2xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150 border ${
            isDashboard
              ? 'bg-card border-border text-foreground shadow-black/20'
              : 'bg-[#0f172a]/95 border-white/15 text-white backdrop-blur-xl shadow-black/60'
          }`}
        >
          <div className="px-3 py-2 border-b border-border/40 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground/50">
              {t('selectLanguage', 'Select Language')}
            </span>
            <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">
              10 Global
            </span>
          </div>

          <div className="space-y-0.5">
            {languages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all duration-150 ${
                    isSelected
                      ? 'bg-primary text-white font-bold shadow-xs'
                      : isDashboard
                      ? 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0 leading-none">{item.flag}</span>
                    <div className="truncate">
                      <span className="block font-semibold truncate leading-snug">{item.nativeName}</span>
                      <span className={`block text-[10px] leading-tight ${isSelected ? 'text-white/80' : 'text-foreground/50'}`}>
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className={`text-[10px] font-mono uppercase px-1 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-foreground/10 text-foreground/60'
                    }`}>
                      {item.code}
                    </span>
                    {isSelected && <Check size={14} className="text-white shrink-0 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
