import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageDisplayComponent {
  isLoading = input(false);
  image = input('');
  isError = input(false);
  errMsg = input('');

  errorMsgWithDefaultValue = computed(() => this.errMsg().trim() || 'Unknown Error');
}
