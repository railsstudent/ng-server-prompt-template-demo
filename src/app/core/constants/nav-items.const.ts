import { NavItem } from '@/shared/types/nav-item.type';
import { BottleIconComponent } from '@/shared/ui/icons/bottle-icon.component';
import { CarIconComponent } from '@/shared/ui/icons/car-icon.component';
import { FigurineIconComponent } from '@/shared/ui/icons/figurine-icon.component';
import { FlagIconComponent } from '@/shared/ui/icons/flag-icon.component';
import { HistoryIconComponent } from '@/shared/ui/icons/history-icon.component';
import { HomeIconComponent } from '@/shared/ui/icons/home-icon.component';
import { MapIconComponent } from '@/shared/ui/icons/map-icon.component';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 0,
    label: 'Home',
    path: '/',
    isExact: true,
    iconComponent: HomeIconComponent,
    title: 'Home',
    pageTitle: 'Home',
  },
  {
    id: 1,
    label: 'Glass Bottle',
    path: '/edit-image/glass-bottle-souvenir',
    iconComponent: BottleIconComponent,
    title: 'Glass Bottle',
    pageTitle: 'Generate a glass bottle souvenir',
    templateKeyId: 'glassBottleSouvenirTemplateId',
  },
  {
    id: 2,
    label: 'Figurine',
    path: '/edit-image/figurine',
    iconComponent: FigurineIconComponent,
    title: 'Figurine',
    pageTitle: 'Generate a Japanese-styled Figurine',
    templateKeyId: 'figurineTemplateId',
  },
  {
    id: 3,
    label: '3D Map',
    path: '/edit-image/map',
    iconComponent: MapIconComponent,
    title: 'Map',
    pageTitle: 'Generate a three-dimensional map',
    templateKeyId: 'threeDimentionsMapTemplateId',
  },
  {
    id: 4,
    label: 'Diecast Vehicle',
    path: '/edit-image/diecast-vehicle',
    iconComponent: CarIconComponent,
    title: 'Diecast Vehicle',
    pageTitle: 'Generate a diecast vehicle with your brand',
    templateKeyId: 'diecastVehicleTemplateId',
  },
  {
    id: 5,
    label: 'Country Guide',
    path: '/country-form',
    iconComponent: FlagIconComponent,
    title: 'Country',
    pageTitle: 'Learn about this country',
    templateKeyId: 'countryTemplateId',
  },
  {
    id: 6,
    label: 'History',
    path: '/historic-event-form',
    iconComponent: HistoryIconComponent,
    title: 'History Event',
    pageTitle: 'Important Moment of this Historic Event',
    templateKeyId: 'historicEventTemplateId',
  },
];
