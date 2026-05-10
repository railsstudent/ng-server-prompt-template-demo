import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  isLoading = signal(false);
  errorMsg = signal('');
  isError = signal(false);
}
