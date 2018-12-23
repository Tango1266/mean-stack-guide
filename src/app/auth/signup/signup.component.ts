import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {AuthService} from '../auth.service';

@Component({
    // no selector because it will be handled through routing
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
    isLoading = false;
    private autStatusSub: Subscription;

    constructor(public authService: AuthService) {
    }

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        this.authService.createUser(form.value.email, form.value.password);
    }

    ngOnInit(): void {
        this.autStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        );
    }

    ngOnDestroy(): void {
        this.autStatusSub.unsubscribe();
    }
}
