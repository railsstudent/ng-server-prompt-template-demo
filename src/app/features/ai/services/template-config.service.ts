import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import {
  activate,
  fetchAndActivate,
  getValue,
  onConfigUpdate,
  RemoteConfig,
} from 'firebase/remote-config';
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
    empireTemplateId: '',
  });

  templates = this.#templates.asReadonly();

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

  setupRemoteConfigListener(remoteConfig: RemoteConfig) {
    if (!remoteConfig) {
      console.warn('⚠️ Remote Config is not initialized yet.');
      throw new Error('Remote Config is not initialized yet.');
    }

    const unsubscribe = onConfigUpdate(remoteConfig, {
      next: (configUpdate) => {
        console.log('configUpdate.getUpdatedKeys()', configUpdate.getUpdatedKeys());
        const templatesToUpdate = TEMPLATE_KEYS.filter((key) =>
          configUpdate.getUpdatedKeys().has(key),
        );
        console.log('templatesToUpdate', templatesToUpdate);
        activate(remoteConfig).then((activated) => {
          this.#templates.update((prev) => {
            const next = { ...prev };
            for (const k of templatesToUpdate) {
              next[k] = getValue(remoteConfig, k).asString();
            }
            return next;
          });

          console.log('Firebase remote config updated:', activated);
        });
      },
      error: (error) => {
        console.log('Config update error:', error);
        fetchAndActivate(remoteConfig);
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
