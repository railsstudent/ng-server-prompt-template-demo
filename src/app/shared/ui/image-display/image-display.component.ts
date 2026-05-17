import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ImageDisplayState } from './types/image-display-state.type';

@Component({
  selector: 'app-image-display',
  template: ` <div>
    @let state = uiState();
    @if (state.isLoading) {
      <div>Loading...</div>
    } @else if (state.isError) {
      <div>Error: {{ errorMsgWithDefaultValue() }}</div>
    } @else {
      @if (state.image; as img) {
        <img src="{{ img }}" alt="Generated Image" />
      } @else {
        <div>No image generated yet.</div>
      }
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageDisplayComponent {
  uiState = input<ImageDisplayState>({
    image: '',
    isLoading: false,
    isError: false,
    errMsg: '',
  });

  errorMsgWithDefaultValue = computed(() => this.uiState().errMsg.trim() || 'Unknown Error');
}
