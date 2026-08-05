'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, Theme } from '@/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
    { id: 'system', label: 'System', icon: <Monitor className="w-3.5 h-3.5" /> },
  ];

  const currentIcon = resolvedTheme === 'light' 
    ? <Sun className="w-4 h-4 text-amber-500" /> 
    : <Moon className="w-4 h-4 text-sky-400" />;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 border border-kith-border hover:border-kith-bone/40 bg-kith-card text-kith-bone transition-all duration-200 flex items-center gap-1.5 text-xs font-mono"
        title={`Theme: ${theme.toUpperCase()}`}
        aria-label="Toggle Theme"
      >
        {currentIcon}
        <span className="hidden md:inline text-[11px] uppercase tracking-wider text-kith-muted">{theme}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-kith-card border border-kith-border shadow-2xl py-1 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-kith-border/50 text-[10px] font-mono tracking-widest text-kith-darkMuted uppercase">
            APPEARANCE
          </div>
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setTheme(opt.id);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-xs font-mono flex items-center justify-between transition-colors ${
                theme === opt.id
                  ? 'bg-kith-border/40 text-kith-bone font-bold'
                  : 'text-kith-muted hover:text-kith-bone hover:bg-kith-border/20'
              }`}
            >
              <div className="flex items-center gap-2">
                {opt.icon}
                <span>{opt.label}</span>
              </div>
              {theme === opt.id && <Check className="w-3 h-3 text-sky-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const MobileThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const options: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
    { id: 'system', label: 'System', icon: <Monitor className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center justify-between p-3 border border-kith-border bg-kith-card mt-2">
      <span className="text-xs font-mono uppercase tracking-widest text-kith-muted">MODE</span>
      <div className="flex items-center border border-kith-border bg-kith-subBg p-0.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setTheme(opt.id)}
            className={`px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 transition-colors ${
              theme === opt.id
                ? 'bg-kith-btnBg text-kith-btnText font-bold shadow'
                : 'text-kith-muted hover:text-kith-bone'
            }`}
          >
            {opt.icon}
            <span className="capitalize">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
