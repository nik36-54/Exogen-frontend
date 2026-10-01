import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { businessUnitsList, getBusinessUnit } from '@/data/risk-intelligence-data';
import type { BusinessUnitItem } from '@/types/risk-intelligence';

export const ACTIVE_BU_STORAGE_KEY = 'exogen_active_business_unit_id';
export const ACTIVE_BU_EVENT_KEY = 'exogen_active_bu_changed';
export const DEFAULT_ACTIVE_BU_ID = 'commercial-banking';

/**
 * Returns the initial active business unit id checking URL first, then localStorage, then default.
 */
export function getStoredActiveBusinessUnitId(): string {
  if (typeof window === 'undefined') return DEFAULT_ACTIVE_BU_ID;
  try {
    const pathname = window.location.pathname || '';
    const match = pathname.match(/\/exposure\/business-unit\/([^/]+)/);
    if (match && match[1]) {
      const decoded = decodeURIComponent(match[1]);
      if (businessUnitsList.some((bu) => bu.id === decoded)) {
        return decoded;
      }
    }

    const stored = localStorage.getItem(ACTIVE_BU_STORAGE_KEY);
    if (stored && businessUnitsList.some((bu) => bu.id === stored)) {
      return stored;
    }
  } catch {
    // fallback
  }
  return DEFAULT_ACTIVE_BU_ID;
}

/**
 * Explicitly updates the active business unit globally across the application.
 */
export function setActiveBusinessUnitId(unitId: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_BU_STORAGE_KEY, unitId);
    window.dispatchEvent(new CustomEvent(ACTIVE_BU_EVENT_KEY, { detail: { unitId } }));
  } catch {
    // fallback
  }
}

/**
 * React hook for consuming and updating the globally active business unit.
 */
export function useActiveBusinessUnit() {
  const [location] = useLocation();
  const [activeUnitId, setActiveUnitIdState] = useState<string>(getStoredActiveBusinessUnitId);

  // Sync if location changes to a specific business unit detail page
  useEffect(() => {
    const match = location.match(/^\/exposure\/business-unit\/([^/]+)$/);
    if (match && match[1]) {
      const routeId = decodeURIComponent(match[1]);
      if (businessUnitsList.some((b) => b.id === routeId)) {
        setActiveUnitIdState(routeId);
        try {
          localStorage.setItem(ACTIVE_BU_STORAGE_KEY, routeId);
        } catch {}
      }
    }
  }, [location]);

  // Listen to cross-component change events
  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as CustomEvent<{ unitId: string }>;
      if (evt.detail?.unitId) {
        setActiveUnitIdState(evt.detail.unitId);
      }
    };
    window.addEventListener(ACTIVE_BU_EVENT_KEY, handler);
    return () => window.removeEventListener(ACTIVE_BU_EVENT_KEY, handler);
  }, []);

  const changeActiveUnit = useCallback((id: string) => {
    setActiveUnitIdState(id);
    setActiveBusinessUnitId(id);
  }, []);

  const activeUnit = getBusinessUnit(activeUnitId) || businessUnitsList[0];
  const isUnitActive = useCallback((id: string) => id === activeUnitId, [activeUnitId]);

  return {
    activeUnitId,
    activeUnit,
    setActiveUnitId: changeActiveUnit,
    isUnitActive,
    allUnits: businessUnitsList,
  };
}
