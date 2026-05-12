import { GlobalStateService } from '@/shared/services/global-state.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ErrorComponent {
  private readonly stateService = inject(GlobalStateService);

  errorMessage = computed(() => this.stateService.errorMsg() || 'Unknown Error');
}
