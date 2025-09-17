import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.82568245d58f4c30804b5426958d088b',
  appName: 'play-store-illusion',
  webDir: 'dist',
  server: {
    url: "https://82568245-d58f-4c30-804b-5426958d088b.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;