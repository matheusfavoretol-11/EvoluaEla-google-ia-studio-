import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please check your .env file.');
}

// Create a client only if credentials are present, otherwise export a proxy that warns
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: (target, prop) => {
        const warning = () => console.error(`Supabase not configured. Cannot call ${String(prop)}`);
        
        if (prop === 'auth') {
          return new Proxy({}, {
            get: (_, authProp) => {
              if (authProp === 'onAuthStateChange') {
                return () => {
                  console.error('Supabase not configured. Cannot call auth.onAuthStateChange');
                  return { data: { subscription: { unsubscribe: () => {} } } };
                };
              }
              return async () => {
                console.error(`Supabase not configured. Cannot call auth.${String(authProp)}`);
                return { data: { user: null, session: null }, error: new Error('Supabase not configured') };
              };
            }
          });
        }

        if (prop === 'from') {
          return () => new Proxy({}, {
            get: (_, fromProp) => {
              return () => new Proxy({}, {
                get: (_, queryProp) => {
                  if (queryProp === 'single') return async () => ({ data: null, error: new Error('Supabase not configured') });
                  const queryFunc = () => ({ data: null, error: new Error('Supabase not configured') });
                  // Handle chaining for methods like .select().eq().single()
                  return new Proxy(queryFunc, {
                    get: (t, p) => {
                      if (p === 'then') return undefined; // Not a promise unless it's a terminator
                      return queryFunc;
                    }
                  });
                }
              });
            }
          });
        }

        if (prop === 'channel') {
          const channelProxy: any = new Proxy({}, {
            get: (_, p) => {
              if (p === 'on' || p === 'subscribe') return () => channelProxy;
              if (p === 'unsubscribe') return () => {};
              return () => channelProxy;
            }
          });
          return () => channelProxy;
        }

        if (prop === 'removeChannel') return () => {};

        return () => {
          warning();
          return { data: null, error: new Error('Supabase not configured') };
        };
      }
    });
