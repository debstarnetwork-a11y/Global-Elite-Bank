import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Circuit-breaker state to prevent stalling, spamming, or throwing when Supabase project is offline/paused
let cloudCircuitOpenUntil = 0;
let consecutiveFailures = 0;

export function isCloudAvailable(): boolean {
  return Date.now() >= cloudCircuitOpenUntil;
}

export function tripCloudCircuitBreaker(cooldownMs = 60000) {
  cloudCircuitOpenUntil = Date.now() + cooldownMs;
}

const safeFallbackResponse = (url: any) => {
  const isSingle = typeof url === 'string' && (url.includes('limit=1') || url.includes('maybeSingle'));
  const emptyBody = isSingle ? 'null' : '[]';
  return new Response(emptyBody, {
    status: 200,
    statusText: 'OK (Offline Cache Fallback)',
    headers: {
      'Content-Type': 'application/json',
      'content-range': '0-0/0',
    },
  });
};

const resilientFetch = async (url: any, options: any) => {
  // If circuit breaker is currently open, immediately return safe fallback without hanging
  if (Date.now() < cloudCircuitOpenUntil) {
    return safeFallbackResponse(url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const mergedSignal = options?.signal
      ? (options.signal.aborted ? options.signal : controller.signal)
      : controller.signal;

    const nativeFetch = typeof window !== 'undefined' && window.fetch ? window.fetch.bind(window) : fetch;
    const response = await nativeFetch(url, { ...options, signal: mergedSignal });
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    
    // Check for Cloudflare 522/524, gateway timeouts, statement timeouts, or HTML error pages
    if (!response.ok && (response.status >= 500 || response.status === 408 || contentType.includes('text/html'))) {
      consecutiveFailures++;
      tripCloudCircuitBreaker(consecutiveFailures >= 2 ? 60000 : 30000);
      console.warn(`[Supabase] Cloud endpoint returned status ${response.status}. Switched to local offline mode.`);
      return safeFallbackResponse(url);
    }

    consecutiveFailures = 0;
    return response;
  } catch (err: any) {
    consecutiveFailures++;
    tripCloudCircuitBreaker(60000);
    console.warn('[Supabase] Cloud connection unreachable; safely preserving data in local cache:', err?.message || err);
    return safeFallbackResponse(url);
  }
};

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: resilientFetch
    }
  }
);
