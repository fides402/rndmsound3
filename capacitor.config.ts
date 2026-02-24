import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fides402.rndmsound3',
  appName: 'Random Sound',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
