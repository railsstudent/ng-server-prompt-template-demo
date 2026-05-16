import { NavService } from '@/core/services/nav.service';
import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink, RouterLinkActive, NgComponentOutlet],
  template: ` <div class="nav-header">
      <span class="nav-title-icon">ITH</span>
      <span class="nav-title-text">Intelligent Task Hub</span>
    </div>
    <ul class="nav-list">
      @for (navItem of navItems; track navItem.id) {
        <li
          [routerLink]="navItem.path"
          routerLinkActive="nav-active"
          [routerLinkActiveOptions]="{ exact: navItem.isExact || false }"
          class="nav-link"
          [attr.aria-label]="navItem.label"
        >
          <ng-container class="nav-icon" [ngComponentOutlet]="navItem.iconComponent" />
          <span class="nav-text">{{ navItem.label }}</span>
        </li>
      }
    </ul>`,
  styleUrl: './side-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
  navService = inject(NavService);
  navItems = this.navService.navItems;
}
