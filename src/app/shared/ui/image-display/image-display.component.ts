import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ImageDisplayState } from './types/image-display-state.type';

@Component({
  selector: 'app-image-display',
  styleUrl: './image-display.component.css',
  template: ` <div class="image-display">
    @let state = uiState();
    @if (state.isLoading) {
      <div class="image-display-msg-wrapper">
        <p>Loading...</p>
      </div>
    } @else if (state.isError) {
      <div class="image-display-msg-wrapper">
        <p>Error: {{ errorMsgWithDefaultValue() }}</p>
      </div>
    } @else {
      @if (state.image; as img) {
        <div class="image-display-msg-wrapper">
          <img src="{{ img }}" alt="Generated Image" class="image-display-img" />
        </div>
      } @else {
        <div class="image-display-msg-wrapper">
          <p>No image generated yet.</p>
        </div>
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
