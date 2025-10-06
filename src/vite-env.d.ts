/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_REACT_APP_FACEBOOK_APP_ID: string
  readonly VITE_REACT_APP_GOOGLE_CLIENT_ID: string
  readonly VITE_REACT_APP_APPLE_CLIENT_ID: string
  readonly VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_REACT_APP_API_URL: string
  readonly VITE_REACT_APP_NARAKEET_API_KEY: string
  readonly VITE_REACT_APP_LOVO_API_KEY: string
  readonly VITE_REACT_APP_MOONPAY_API_KEY: string
  readonly VITE_REACT_APP_MOONPAY_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
