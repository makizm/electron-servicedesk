import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ServiceDeskpComponent } from './servicedesk.component';
import { SdLoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', component: ServiceDeskpComponent },
  { path: 'login', component: SdLoginComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceDeskRoutingModule {
}