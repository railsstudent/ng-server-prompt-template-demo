import { Injectable, signal } from '@angular/core';
import { getValue, RemoteConfig } from 'firebase/remote-config';
import { TEMPLATE_KEYS } from '../constants/template_keys.const';
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

  templates = this.#templates.asReadonly();

  getTemplateValue(key: TemplateKey) {
    if (key in this.#templates()) {
      return this.#templates()[key];
    }
    return undefined;
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
  }
}
