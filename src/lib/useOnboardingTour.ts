'use client';

import { useEffect, useRef, useCallback } from 'react';
import { driver, type DriveStep, type Config } from 'driver.js';

const TOUR_STORAGE_KEY = 'educubeia_onboarding_completed';

interface TourConfig {
  tourId: string;
  steps: DriveStep[];
  onComplete?: () => void;
  /** Delay in ms before starting the tour (default: 1000) */
  delay?: number;
}

export function useOnboardingTour({ tourId, steps, onComplete, delay = 1000 }: TourConfig) {
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);
  const hasStarted = useRef(false);

  const getTourKey = useCallback(() => {
    return `${TOUR_STORAGE_KEY}_${tourId}`;
  }, [tourId]);

  const isTourCompleted = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(getTourKey()) === 'true';
  }, [getTourKey]);

  const markTourCompleted = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getTourKey(), 'true');
  }, [getTourKey]);

  const getResponsiveSteps = useCallback((): DriveStep[] => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return steps.filter(step => {
      // On mobile, skip steps that target the sidebar (not visible by default)
      if (isMobile && step.element && typeof step.element === 'string' && step.element.startsWith('#sidebar')) {
        return false;
      }
      return true;
    }).map(step => ({
      ...step,
      popover: {
        ...step.popover,
        // On mobile, prefer center alignment for non-element steps
        ...(isMobile && !step.element ? { align: 'center' as const } : {}),
      },
    }));
  }, [steps]);

  const createDriver = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const responsiveSteps = getResponsiveSteps();

    const config: Config = {
      showProgress: true,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: isMobile ? 'Siguiente' : 'Siguiente →',
      prevBtnText: isMobile ? 'Anterior' : '← Anterior',
      doneBtnText: '¡Listo! ✓',
      progressText: '{{current}} de {{total}}',
      overlayColor: 'rgba(0, 0, 0, 0.78)',
      stagePadding: isMobile ? 6 : 12,
      stageRadius: 14,
      popoverClass: `educubeia-tour-popover${isMobile ? ' educubeia-tour-mobile' : ''}`,
      popoverOffset: isMobile ? 8 : 14,
      steps: responsiveSteps,
      onDestroyStarted: () => {
        markTourCompleted();
        if (onComplete) onComplete();
        driverRef.current?.destroy();
      },
    };

    return driver(config);
  }, [getResponsiveSteps, onComplete, markTourCompleted]);

  // Auto-start on mount if not completed
  useEffect(() => {
    if (hasStarted.current) return;
    if (isTourCompleted()) return;

    hasStarted.current = true;

    const timer = setTimeout(() => {
      driverRef.current = createDriver();
      driverRef.current.drive();
    }, delay);

    return () => {
      clearTimeout(timer);
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [isTourCompleted, createDriver, delay]);

  const startTour = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
    driverRef.current = createDriver();
    driverRef.current.drive();
  }, [createDriver]);

  const resetTour = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(getTourKey());
  }, [getTourKey]);

  return { startTour, resetTour, isTourCompleted };
}
