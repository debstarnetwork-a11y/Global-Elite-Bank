import React from 'react';
import { Check, X, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { evaluatePasswordStrength } from '../utils/passwordStrength';

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
  compact?: boolean;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showRequirements = true,
  compact = false,
  className = '',
}) => {
  const result = evaluatePasswordStrength(password);
  const hasInput = (password || '').length > 0;

  if (!hasInput && !showRequirements) {
    return null;
  }

  const getBarColor = (index: number) => {
    if (!hasInput) return 'bg-border/60';
    if (result.score === 1) {
      return index === 0 ? 'bg-rose-500' : 'bg-border/40';
    }
    if (result.score === 2) {
      return index <= 1 ? 'bg-amber-500' : 'bg-border/40';
    }
    if (result.score === 3) {
      return 'bg-emerald-500';
    }
    return 'bg-border/40';
  };

  const getStrengthBadge = () => {
    if (!hasInput) {
      return (
        <span className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider">
          Enter Password
        </span>
      );
    }
    if (result.score === 1) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
          <ShieldAlert size={12} /> Weak
        </span>
      );
    }
    if (result.score === 2) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
          <Shield size={12} /> Medium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
        <ShieldCheck size={12} /> Strong
      </span>
    );
  };

  if (compact) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-foreground/60 font-medium">Password Strength:</span>
          {getStrengthBadge()}
        </div>
        <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
          <div className={`h-full rounded-full transition-colors duration-200 ${getBarColor(0)}`} />
          <div className={`h-full rounded-full transition-colors duration-200 ${getBarColor(1)}`} />
          <div className={`h-full rounded-full transition-colors duration-200 ${getBarColor(2)}`} />
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 bg-foreground/5 border border-border/70 rounded-xl space-y-2.5 transition-all ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground/70 tracking-wide">
          Password Strength:
        </span>
        {getStrengthBadge()}
      </div>

      {/* 3-stage visual strength meter */}
      <div className="grid grid-cols-3 gap-2 h-2 w-full">
        <div className={`h-full rounded-full transition-colors duration-300 ${getBarColor(0)}`} />
        <div className={`h-full rounded-full transition-colors duration-300 ${getBarColor(1)}`} />
        <div className={`h-full rounded-full transition-colors duration-300 ${getBarColor(2)}`} />
      </div>

      {/* Requirement checkpoints */}
      {showRequirements && (
        <div className="pt-1 border-t border-border/40 space-y-1.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              {result.hasMinLength ? (
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                  <Check size={10} strokeWidth={3} />
                </span>
              ) : (
                <span className="w-3.5 h-3.5 rounded-full bg-foreground/10 text-foreground/40 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
                </span>
              )}
              <span className={result.hasMinLength ? 'text-foreground font-medium' : 'text-foreground/50'}>
                At least 6 characters
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {result.hasMix ? (
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                  <Check size={10} strokeWidth={3} />
                </span>
              ) : (
                <span className="w-3.5 h-3.5 rounded-full bg-foreground/10 text-foreground/40 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
                </span>
              )}
              <span className={result.hasMix ? 'text-foreground font-medium' : 'text-foreground/50'}>
                Mix of letters & numbers / symbols
              </span>
            </div>
          </div>

          {hasInput && (
            <p className={`text-[11px] leading-tight transition-colors ${
              result.score === 1
                ? 'text-rose-500 font-medium'
                : result.score === 2
                ? 'text-amber-500 font-medium'
                : 'text-emerald-500 font-medium'
            }`}>
              {result.feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
