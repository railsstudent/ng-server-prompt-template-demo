import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-map-icon',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 6.75V15m6-10.5v.115m0 0a3 3 0 0 1-3 3h-.345m0 0a9 9 0 0 1-5.758 2.013M9 6.75h.345a3 3 0 0 1 3 3v.115m0 0a3 3 0 0 1-3 3H9m0 0a9 9 0 0 1-5.758-2.013M9 15h.345a3 3 0 0 1 3 3v.115m0 0a3 3 0 0 1-3 3H9m0 0a9 9 0 0 1-5.758-2.013M15 4.5h.345a3 3 0 0 1 3 3v.115m0 0a3 3 0 0 1-3 3H15m0 0a9 9 0 0 1-5.758-2.013M15 15h.345a3 3 0 0 1 3 3v.115m0 0a3 3 0 0 1-3 3H15m0 0a9 9 0 0 1-5.758-2.013"
      />
    </svg>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapIconComponent {}
