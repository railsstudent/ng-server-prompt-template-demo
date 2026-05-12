import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-car-icon',
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
        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.026a2.999 2.999 0 0 0-5.197-2.06l-1.556-1.913a4.875 4.875 0 0 0-3.823-1.875H5.25A2.25 2.25 0 0 0 3 11.25v3.91M3.375 18.75a1.125 1.125 0 0 0 1.125 1.125H19.5a1.125 1.125 0 0 0 1.125-1.125V14.25m-17.25-4.5h15.75c.621 0 1.125.504 1.125 1.125v3.026M10.5 11.25V6.75m0 0a1.5 1.5 0 0 0-3 0m3 0a1.5 1.5 0 0 1-3 0"
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
export class CarIconComponent {}
