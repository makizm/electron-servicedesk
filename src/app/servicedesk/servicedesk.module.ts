import { NgModule } from '@angular/core';
import { ReactiveFormsModule }   from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';

import { ServiceDeskpComponent } from './servicedesk.component';
import { ServiceDeskRoutingModule } from './servicedesk-routing.module';

import { ServiceDeskService } from './servicedesk.service';
import { SdLoginComponent } from './components/login/login.component';

const COMPONENTS = [
  ServiceDeskpComponent,
  SdLoginComponent,
]

@NgModule({
  imports: [
    ServiceDeskRoutingModule,
    ReactiveFormsModule,
    NgxElectronModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  providers: [
    ServiceDeskService,
  ]
})
export class ServiceDeskModule {}