import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuidedTour } from '../components/tour/GuidedTour';
import { TOUR_STEPS } from '../data/tour';

interface TourContextValue {
  active: boolean;
  /** Leva à página inicial (sem filtros) e começa o passo a passo. */
  start: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState<number | null>(null);

  const start = useCallback(() => {
    navigate('/');
    setIndex(0);
  }, [navigate]);
  const close = useCallback(() => setIndex(null), []);

  const value = useMemo(() => ({ active: index !== null, start }), [index, start]);

  return (
    <TourContext.Provider value={value}>
      {children}
      {index !== null && (
        <GuidedTour steps={TOUR_STEPS} index={index} onIndexChange={setIndex} onClose={close} />
      )}
    </TourContext.Provider>
  );
}

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used inside TourProvider');
  return ctx;
}
