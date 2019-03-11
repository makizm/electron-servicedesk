import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    // {
    //     path: '',
    //     component: HomeComponent
    // },
    { path: 'sd', loadChildren: 'app/servicedesk/servicedesk.module#ServiceDeskModule' },
    { path: '', redirectTo: 'sd', pathMatch: 'full' },
    { path: '**', redirectTo: 'sd' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
