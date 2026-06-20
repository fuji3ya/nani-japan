/**
 * Tiny global store for the "Unlock all Japan" entitlement.
 * Cached in AsyncStorage so the unlock survives offline; reconciled with the
 * live RC entitlement on launch/foreground (see app/_layout.tsx). Screens read
 * it via useUnlocked() and re-render the moment a purchase/restore succeeds.
 */
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'nanijapan:unlocked';
let cached = false;
let hydrated = false;
const listeners = new Set<(v: boolean) => void>();

export async function hydrateUnlock(): Promise<boolean> {
  try {
    cached = (await AsyncStorage.getItem(KEY)) === '1';
  } catch {
    cached = false;
  }
  hydrated = true;
  listeners.forEach((l) => l(cached));
  return cached;
}

export async function setUnlocked(v: boolean): Promise<void> {
  cached = v;
  try {
    await AsyncStorage.setItem(KEY, v ? '1' : '0');
  } catch {
    /* ignore persistence error — in-memory value still drives the UI */
  }
  listeners.forEach((l) => l(cached));
}

export function getUnlocked(): boolean {
  return cached;
}

export function useUnlocked(): boolean {
  const [v, setV] = useState(cached);
  useEffect(() => {
    const l = (nv: boolean) => setV(nv);
    listeners.add(l);
    if (!hydrated) hydrateUnlock();
    else setV(cached);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return v;
}
