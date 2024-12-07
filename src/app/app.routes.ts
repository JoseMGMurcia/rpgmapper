import { Routes } from '@angular/router';
import { ROUTES } from '@shared/constants/routes.constants';
import { MainContainerComponent } from './routes/main/container/main-container.component';


export const routes: Routes = [
  {
    path: ROUTES.HOME.path,
    component: MainContainerComponent,
    // canActivate: [TranslationLoaderGuard],
  },
];
