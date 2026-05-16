import { Status } from '@/shared/types/status.type';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <div class="header-container">
      @let bc = breadcrumb() || 'Home';
      <h1 class="header-title">{{ bc }}</h1>
      <div class="header-status-container">
        @if (templateId(); as tid) {
          <div class="header-status-badge">Template ID: {{ tid }}</div>
        }
        <div class="header-status-text">Status: {{ status() }}</div>
      </div>
    </div>
  `,
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  breadcrumb = input('');
  templateId = input('');
  status = input<Status>('Idle');
}
