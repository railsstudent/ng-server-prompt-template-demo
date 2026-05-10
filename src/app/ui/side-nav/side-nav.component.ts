import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BottleIconComponent } from '../icons/bottle-icon.component';
import { CarIconComponent } from '../icons/car-icon.component';
import { FigurineIconComponent } from '../icons/figurine-icon.component';
import { FlagIconComponent } from '../icons/flag-icon.component';
import { HistoryIconComponent } from '../icons/history-icon.component';
import { HomeIconComponent } from '../icons/home-icon.component';
import { MapIconComponent } from '../icons/map-icon.component';

@Component({
  selector: 'app-side-nav',
  imports: [
    HomeIconComponent,
    BottleIconComponent,
    FigurineIconComponent,
    MapIconComponent,
    CarIconComponent,
    FlagIconComponent,
    HistoryIconComponent,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {}
