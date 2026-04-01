import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;
let initPromise: Promise<SupabaseClient | null> | null = null;

async function getClient(): Promise<SupabaseClient | null> {
  if (client) return client;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const response = await fetch('/api/config');
      if (!response.ok) throw new Error('Failed to fetch config');
      
      const config = await response.json();
      if (config.supabaseUrl && config.supabaseAnonKey) {
        client = createClient(config.supabaseUrl, config.supabaseAnonKey);
        return client;
      }
      return null;
    } catch (err) {
      console.error('Supabase initialization error:', err);
      return null;
    }
  })();

  return initPromise;
}

// Start fetching immediately
getClient();

/**
 * Creates a lazy proxy that records method calls and replays them once the client is ready.
 */
function createLazyProxy(basePath: string[], initialCalls: { name: string, args: any[] }[] = []) {
  const calls = [...initialCalls];
  let executed = false;
  let resultPromise: Promise<any> | null = null;

  const execute = () => {
    if (executed && resultPromise) return resultPromise;
    executed = true;
    resultPromise = getClient().then(c => {
      if (!c) throw new Error('Supabase not configured');
      let current: any = c;
      for (const segment of basePath) {
        current = current[segment];
      }
      for (const call of calls) {
        if (typeof current[call.name] !== 'function') {
          throw new Error(`Method ${call.name} not found on Supabase object`);
        }
        current = current[call.name](...call.args);
      }
      return current;
    });
    return resultPromise;
  };

  const proxy: any = (...args: any[]) => {
    const lastCall = calls[calls.length - 1];
    if (lastCall) {
      lastCall.args = args;
    }
    // Trigger execution for methods that might not be awaited (like subscribe or on)
    if (lastCall && (lastCall.name === 'subscribe' || lastCall.name === 'on')) {
      execute();
    }
    return proxy;
  };

  proxy.then = (onFulfilled: any, onRejected: any) => {
    return execute().then(onFulfilled, onRejected);
  };

  return new Proxy(proxy, {
    get: (target, prop) => {
      if (prop === 'then') return target.then;
      if (typeof prop === 'symbol') return (target as any)[prop];
      
      // Add a new method to the chain
      calls.push({ name: prop as string, args: [] });
      return proxy;
    }
  });
}

/**
 * A proxy for the Supabase client that waits for the configuration to be fetched
 * from the backend before executing any commands.
 */
export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    if (typeof prop === 'symbol') return target[prop];
    
    if (client) {
      const val = (client as any)[prop];
      return typeof val === 'function' ? val.bind(client) : val;
    }

    // Special handling for auth.onAuthStateChange
    if (prop === 'auth') {
      return new Proxy({}, {
        get: (_, authProp) => {
          if (authProp === 'onAuthStateChange') {
            return (callback: any) => {
              let unsubscribe: () => void = () => {};
              getClient().then(c => {
                if (c) {
                  const { data } = c.auth.onAuthStateChange(callback);
                  unsubscribe = data.subscription.unsubscribe;
                }
              });
              return { data: { subscription: { unsubscribe: () => unsubscribe() } } };
            };
          }
          return (...args: any[]) => createLazyProxy(['auth'], [{ name: authProp as string, args }]);
        }
      });
    }

    // For everything else, return a lazy proxy
    return (...args: any[]) => createLazyProxy([], [{ name: prop as string, args }]);
  }
});
