import { Routes } from '@angular/router';
import { SyncTableComponent } from './components/synctable/synctable';

export const routes: Routes = [
  { path: '', component: SyncTableComponent },
  { path: 'synctable', component: SyncTableComponent }
];
