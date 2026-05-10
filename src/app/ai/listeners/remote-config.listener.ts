import { TemplateConfigService } from '@/ai/services/template-config.service';
import rcDefaults from '@/firebase-workspace/remote_config_defaults.json';
import {
  activate,
  getValue,
  onConfigUpdate,
  RemoteConfig,
  Unsubscribe,
} from 'firebase/remote-config';
import { TemplateKey } from '../types/template-key.type';

const templateIdsSet = Object.keys(rcDefaults);

export function setupRemoteConfigListener(
  remoteConfig: RemoteConfig,
  service: TemplateConfigService,
): Unsubscribe {
  if (!remoteConfig) {
    console.warn('⚠️ Remote Config is not initialized yet.');
    throw new Error('Remote Config is not initialized yet.');
  }

  return onConfigUpdate(remoteConfig, {
    next: (configUpdate) => {
      const updatedKeys = configUpdate.getUpdatedKeys();
      const hasOverlap = templateIdsSet.some((key) => updatedKeys.has(key));
      if (hasOverlap) {
        activate(remoteConfig).then((activated) => {
          console.log('Remote Config updated. Activated new values:', activated);
          updatedKeys.forEach((key) => {
            const value = getValue(remoteConfig, key).asString();
            service.updateTemplateId(key as TemplateKey, value);
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
}
