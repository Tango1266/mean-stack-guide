import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
    // no selector because it will be handled through routing
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {
    isLoading = false;

    onSignup(form: NgForm) {
        console.log(form.value);
    }
}