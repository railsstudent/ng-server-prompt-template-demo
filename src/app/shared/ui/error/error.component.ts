import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GlobalStateService } from '../services/global-state.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ErrorComponent {
  private readonly stateService = inject(GlobalStateService);

  errorMessage = computed(() => this.stateService.errorMsg() || 'Unknown Error');
}
