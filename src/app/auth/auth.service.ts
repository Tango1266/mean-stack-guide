import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
    private token: string;
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private http: HttpClient) {
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getToken(){
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    createUser(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};

        this.http.post('http://localhost:3000/api/users/signup', authData)
            .subscribe(response => {
                console.log(response);
            });
    }

    login(email: string, password: string){
        const authData: AuthData = {email: email, password: password};

        this.http.post<{token: string}>('http://localhost:3000/api/users/login', authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;

                if (token) {
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                }
            });
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
    }
}
