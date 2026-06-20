export interface DataListConfig<T = unknown> {
  items: T[];
  placeholder: string;
  trackBy: (item: T) => string | number;
  value: (item: T) => string;
  label: (item: T) => string;
}
