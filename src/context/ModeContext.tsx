
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';

export type AppMode = 'cashier' | 'admin';

interface ModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>('cashier'); // Default to cashier mode

  const toggleMode = useCallback(() => {
    setModeState((prevMode) => (prevMode === 'cashier' ? 'admin' : 'cashier'));
  }, []);

  const setMode = useCallback((newMode: AppMode) => {
    setModeState(newMode);
  }, []);

  const contextValue = useMemo(() => ({ mode, setMode, toggleMode }), [mode, setMode, toggleMode]);

  return (
    <ModeContext.Provider value={contextValue}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
