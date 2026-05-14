import { computed, Injectable, signal } from '@angular/core';
import { Status } from '../types/status.type';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  #isLoading = signal(false);
  #errorMsg = signal('');
  #isError = signal(false);

  isError = this.#isError.asReadonly();
  errorMsg = this.#errorMsg.asReadonly();
  isLoading = this.#isLoading.asReadonly();

  status = computed<Status>(() => {
    if (this.#isLoading()) {
      return 'Loading';
    }
    if (this.#isError()) {
      return 'Error';
    }
    return 'Idle';
  });

  startLoading() {
    this.#isError.set(false);
    this.#errorMsg.set('');
    this.#isLoading.set(true);
  }

  stopLoading() {
    this.#isLoading.set(false);
  }

  setError(msg: string) {
    const trimmedMsg = msg.trim();
    this.#isError.set(trimmedMsg.length !== 0);
    this.#errorMsg.set(trimmedMsg);
  }
}
