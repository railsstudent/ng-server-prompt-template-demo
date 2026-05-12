import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { activate, getValue, onConfigUpdate, RemoteConfig } from 'firebase/remote-config';
import { TEMPLATE_KEYS } from '../constants/template-keys.const';
import { TemplateKey, TemplateMap } from '../types/template-key.type';

@Injectable({
  providedIn: 'root',
})
export class TemplateConfigService {
  #templates = signal<TemplateMap>({
    countryTemplateId: '',
    diecastVehicleTemplateId: '',
    historicEventTemplateId: '',
    glassBottleSouvenirTemplateId: '',
    threeDimentionsMapTemplateId: '',
    figurineTemplateId: '',
  });

  destroyRef$ = inject(DestroyRef);

  getTemplateValue(key: TemplateKey): string {
    return this.#templates()[key] || '';
  }

  updateTemplateIds(remoteConfig: RemoteConfig) {
    if (remoteConfig) {
      const copiedMap: TemplateMap = { ...this.#templates() };
      for (const key of TEMPLATE_KEYS) {
        const value = getValue(remoteConfig, key).asString();
        copiedMap[key] = value;
      }
      this.#templates.set(copiedMap);
    }
  }

  updateTemplateId(key: TemplateKey, value: string) {
    this.#templates.update((prev) => ({ ...prev, [key]: value }));
    console.log(`Update template id successfully.`, key, value);
  }

  setupRemoteConfigListener(remoteConfig: RemoteConfig) {
    if (!remoteConfig) {
      console.warn('⚠️ Remote Config is not initialized yet.');
      throw new Error('Remote Config is not initialized yet.');
    }

    const unsubscribe = onConfigUpdate(remoteConfig, {
      next: (configUpdate) => {
        const updatedKeys = configUpdate.getUpdatedKeys();
        const hasOverlap = TEMPLATE_KEYS.some((key) => updatedKeys.has(key));
        if (hasOverlap) {
          activate(remoteConfig).then(() => {
            updatedKeys.forEach((key) => {
              const value = getValue(remoteConfig, key).asString();
              this.updateTemplateId(key as TemplateKey, value);
            });
          });
        }
      },
      error: (error) => {
        console.log('Config update error:', error);
      },
      complete: () => {
        console.log('Listening stopped.');
      },
    });

    this.destroyRef$.onDestroy(() => {
      try {
        unsubscribe();
        console.log('Remote config listener unsubscribed successfully.');
      } catch (e) {
        const errMsg =
          e instanceof Error
            ? e.message
            : 'Error occurs while unsubscribing remote config listener';
        console.error(errMsg);
      }
    });
  }
}
