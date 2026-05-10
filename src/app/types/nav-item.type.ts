import { TemplateKey } from '@/ai/types/template-key.type';
import { Type } from '@angular/core';

export interface NavItem {
  id: number;
  label: string;
  path: string;
  isExact?: boolean;
  iconComponent: Type<unknown>;
  title: string;
  pageTitle: string;
  templateKeyId?: TemplateKey;
}
