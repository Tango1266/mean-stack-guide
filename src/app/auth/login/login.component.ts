import {Component} from '@angular/core';

@Component({
    // no selector because it will be handled through routing
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoading = false;
}