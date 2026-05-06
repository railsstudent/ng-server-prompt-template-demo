import { SERVER_TEMPLATE_MODEL } from './ai/constants/server-template-model.token';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = signal('ng-server-prompt-template-demo');
  model = inject(SERVER_TEMPLATE_MODEL);
  inlineImageData = signal('');

  generateImage() {
    this.model.generateContent('historic-event-v0-0-1', {
      event: '2002 Olympic',
      description: 'The Queen jumped from the helicopter',
    }).then((x) => {
      const candidates = x.response.candidates || [];
      for (const candidate of candidates) {
        const parts = candidate.content.parts || [];
        for (const part of parts) {
          const data = part.inlineData?.data;
          const mimeType = part.inlineData?.mimeType;
          if (data && mimeType) {
            this.inlineImageData.set(`data:${mimeType};base64,${data}`);
            break;
          }
        }
      }
    }).catch((err) => {
      console.error(err);
    })
  }
}
