import { InjectionToken } from '@angular/core';
import { TemplateGenerativeModel } from 'firebase/ai';

// 1. Define the Injection Token
export const SERVER_TEMPLATE_MODEL = new InjectionToken<TemplateGenerativeModel>(
  'SERVER_TEMPLATE_MODEL'
);
