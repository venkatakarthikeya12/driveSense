import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.drivesense.app',
  appName: 'DriveSense',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#050505',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
};

export default config;
