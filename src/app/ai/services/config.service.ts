import { Injectable, isDevMode } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { fetchAndActivate, getRemoteConfig, RemoteConfig } from 'firebase/remote-config';
import rcDefaults from '../../../../firebase-workspace/remote_config_defaults.json';
import firebaseConfig from '../../../firebase.config.json';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  #appInstance: FirebaseApp | null = null;
  #remoteConfig: RemoteConfig | null = null;

  get app(): FirebaseApp {
    if (!this.#appInstance) {
      throw new Error('FirebaseApp is not initialized yet.');
    }
    return this.#appInstance;
  }

  get remoteConfig(): RemoteConfig {
    if (!this.#remoteConfig) {
      throw new Error('RemoteConfig is not initialized yet.');
    }
    return this.#remoteConfig;
  }

  async initialize(): Promise<void> {
    // Prevent double initialization
    if (this.#appInstance) {
      return;
    }

    // 1. Initialize App
    this.#appInstance = initializeApp(firebaseConfig);

    // 2. Initialize App Check
    if (firebaseConfig.recaptchaEnterpriseKey) {
      initializeAppCheck(this.#appInstance, {
        provider: new ReCaptchaEnterpriseProvider(firebaseConfig.recaptchaEnterpriseKey),
        isTokenAutoRefreshEnabled: true,
      });
    } else {
      console.warn('⚠️ App Check was not initialized because RECAPTCHA_ENTERPRISE_KEY is missing.');
    }

    // 3. Initialize Remote Config
    this.#remoteConfig = getRemoteConfig(this.#appInstance);
    // Remote Config defaults should be an object of key-value pairs.
    // The downloaded template has a "parameters" property. We need to map it or pass it correctly.
    // Actually, defaultConfig expects a Record<string, string | number | boolean>.
    const simplifiedDefaults: Record<string, string | number | boolean> = {};
    if (rcDefaults.parameters) {
      Object.keys(rcDefaults.parameters).forEach((key) => {
        const param = (rcDefaults.parameters as any)[key];
        if (param.defaultValue && param.defaultValue.value !== undefined) {
          simplifiedDefaults[key] = param.defaultValue.value;
        }
      });
    }
    this.#remoteConfig.defaultConfig = simplifiedDefaults;
    this.#remoteConfig.settings.minimumFetchIntervalMillis = isDevMode() ? 0 : 3600000;

    // 4. Fetch and Activate
    try {
      const activated = await fetchAndActivate(this.#remoteConfig);
      console.log('Remote Config initialized. Activated new values:', activated);
    } catch (error) {
      console.error('Failed to initialize Remote Config:', error);
    }
  }
}
