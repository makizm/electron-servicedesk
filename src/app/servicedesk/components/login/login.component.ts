import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceDeskService } from '../../servicedesk.service';

@Component({
  selector: 'sd-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
})
export class SdLoginComponent {
    public loginForm: FormGroup;

    constructor(private fb: FormBuilder, private sd: ServiceDeskService) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        })
    }

    onSubmit() {
        this.sd.login(this.loginForm.value.username, this.loginForm.value.username)
            // .subscribe(res => console.log(res))
    }
}