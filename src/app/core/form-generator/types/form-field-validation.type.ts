export interface ValidationConfig {
  isRequired?: boolean;
  requiredErrorMsg?: string;
  debounce?: number;
  maxLength?: number;
  maxLengthErrorMsg?: string;
  minLength?: number;
  minLengthErrorMsg?: string;
  min?: number;
  minErrorMsg?: string;
  max?: number;
  maxErrorMsg?: string;
}
