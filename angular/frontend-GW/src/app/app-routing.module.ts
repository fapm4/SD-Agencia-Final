import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components

import {PublicTasksComponent} from './components/public-tasks/public-tasks.component';
import {PrivateTasksComponent} from './components/private-tasks/private-tasks.component';
import {InciarSesionComponent} from './components/inciar-sesion/inciar-sesion.component';
import {RegistrarComponent} from './components/registrar/registrar.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path:'',
    redirectTo: '/public',
    pathMatch: 'full'
  },
  {
    path:'public',
    component: PublicTasksComponent
  },
  {
    path: 'private',
    component: PrivateTasksComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'iniciar',
    component: InciarSesionComponent
  },
  {
    path: 'registrar',
    component: RegistrarComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
