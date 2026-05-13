import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  isLoading = signal(false);
  errorMsg = signal('');
  isError = signal(false);

  startLoading() {
    this.isError.set(false);
    this.errorMsg.set('');
    this.isLoading.set(true);
  }
}
