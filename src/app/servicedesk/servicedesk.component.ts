import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceDeskService } from './servicedesk.service';

@Component({
  selector: 'service-desk',
  template: `Hello world`,
})
export class ServiceDeskpComponent {
    constructor(private sdService: ServiceDeskService, private route: ActivatedRoute, private router: Router) {
        // temporary until route guards are implemented
        // redirect to login page when not logged in
        if(this.sdService.isLoggedIn() === false) {
            this.router.navigate(['login'], { relativeTo: this.route});
        }
    }
}