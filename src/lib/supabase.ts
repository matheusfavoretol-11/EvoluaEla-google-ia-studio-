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
              return async () => {
                console.error(`Supabase not configured. Cannot call auth.${String(authProp)}`);
                return { data: { user: null, session: null, subscription: { unsubscribe: () => {} } }, error: new Error('Supabase not configured') };
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
                  return () => ({ data: null, error: new Error('Supabase not configured') });
                }
              });
            }
          });
        }

        if (prop === 'channel') {
          return () => new Proxy({}, {
            get: (_, channelProp) => {
              if (channelProp === 'on') return () => new Proxy({}, { get: (_, onProp) => { if (onProp === 'subscribe') return () => ({ unsubscribe: () => {} }); return () => {}; } });
              if (channelProp === 'subscribe') return () => ({ unsubscribe: () => {} });
              return () => {};
            }
          });
        }

        if (prop === 'removeChannel') return () => {};

        return () => {
          warning();
          return { data: null, error: new Error('Supabase not configured') };
        };
      }
    });
