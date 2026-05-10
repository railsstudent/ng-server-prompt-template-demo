import rcDefaults from '@/firebase-workspace/remote_config_defaults.json';
import { Injectable, signal } from '@angular/core';
import { getValue, RemoteConfig } from 'firebase/remote-config';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  #countryTemplateId = signal('');
  #diecastTemplateId = signal('');
  #figurineTemplateId = signal('');
  #glassBottleTemplateId = signal('');
  #historicEventTemplateId = signal('');
  #threeDimentionsMapTemplateId = signal('');

  countryTemplateId = this.#countryTemplateId.asReadonly();
  diecastTemplateId = this.#diecastTemplateId.asReadonly();
  figurineTemplateId = this.#figurineTemplateId.asReadonly();
  glassBottleTemplateId = this.#glassBottleTemplateId.asReadonly();
  historicEventTemplateId = this.#historicEventTemplateId.asReadonly();
  threeDimentionsMapTemplateId = this.#threeDimentionsMapTemplateId.asReadonly();

  updateTemplateIds(remoteConfig: RemoteConfig) {
    if (remoteConfig) {
      const configKeys = Object.keys(rcDefaults);
      for (const key of configKeys) {
        const value = getValue(remoteConfig, key).asString();
        console.log('Remote config key', key, 'value', value);
        switch (key) {
          case 'countryTemplateId':
            this.#countryTemplateId.set(value);
            break;
          case 'diecastVehicleTemplateId':
            this.#diecastTemplateId.set(value);
            break;
          case 'historicEventTemplateId':
            this.#historicEventTemplateId.set(value);
            break;
          case 'glassBottleSouvenirTemplateId':
            this.#glassBottleTemplateId.set(value);
            break;
          case 'threeDimentionsMapTemplateId':
            this.#threeDimentionsMapTemplateId.set(value);
            break;
          case 'figurineTemplateId':
            this.#figurineTemplateId.set(value);
            break;
          default:
            break;
        }
      }
    }
  }

  updateTemplateId(key: string, value: string) {
    switch (key) {
      case 'countryTemplateId':
        this.#countryTemplateId.set(value);
        break;
      case 'diecastVehicleTemplateId':
        this.#diecastTemplateId.set(value);
        break;
      case 'historicEventTemplateId':
        this.#historicEventTemplateId.set(value);
        break;
      case 'glassBottleSouvenirTemplateId':
        this.#glassBottleTemplateId.set(value);
        break;
      case 'threeDimentionsMapTemplateId':
        this.#threeDimentionsMapTemplateId.set(value);
        break;
      case 'figurineTemplateId':
        this.#figurineTemplateId.set(value);
        break;
      default:
        break;
    }
  }
}
