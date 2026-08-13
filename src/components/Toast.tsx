/**
 * Minimal toast system. Toasts auto-dismiss after `duration` ms (default 3s).
 *
 * Usage:
 *   import { toast } from '@/components/Toast';
 *   toast.success('Done!');
 *   toast.error('Nope');
 *   toast.info('FYI');
 *
 * Mount <Toaster /> once at the app root (inside AppShell).
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type ToastKind = 'success' | 'error' | 'info';

interface ToastEntry {
  id: number;
  message: string;
  kind: ToastKind;
}

let listeners: Array<(entries: ToastEntry[]) => void> = [];
let entries: ToastEntry[] = [];
let nextId = 1;

function emit() {
  for (const l of listeners) l(entries);
}

function push(message: string, kind: ToastKind, duration = 3000) {
  const entry = { id: nextId++, message, kind };
  entries = [...entries, entry];
  emit();
  window.setTimeout(() => {
    entries = entries.filter((e) => e.id !== entry.id);
    emit();
  }, duration);
}

export const toast = {
  success: (msg: string, duration?: number) => push(msg, 'success', duration),
  error: (msg: string, duration?: number) => push(msg, 'error', duration),
  info: (msg: string, duration?: number) => push(msg, 'info', duration),
};

export function Toaster() {
  const [list, setList] = useState<ToastEntry[]>(entries);

  useEffect(() => {
    const listener = (next: ToastEntry[]) => setList(next);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  if (list.length === 0) return null;

  return createPortal(
    <div style={{ position: 'fixed', bottom: 24, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none', zIndex: 200 }}>
      {list.map((e) => (
        <div key={e.id} className={`toast toast--${e.kind}`} style={{ position: 'relative', margin: 0 }}>
          {e.message}
        </div>
      ))}
    </div>,
    document.body,
  );
}
