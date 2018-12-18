import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
    private token: string;
    private tokenTimer: NodeJS.Timer;
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private http: HttpClient, private router: Router) {
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

        this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/users/login', authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;

                if (token) {
                    const expiresInDuration = response.expiresIn;

                    this.setAuthTimer(expiresInDuration);

                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    console.log(expirationDate)
                    this.saveAuthData(token, expirationDate);
                    this.router.navigate(['/']);
                }
            });
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthDate();
        this.router.navigate(['/']);
    }

    autoAuthUser() {
        const authInfo = this.getAuthData();
        if (!authInfo) {
            return;
        }
        const now = new Date();

        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

        const tokenIsValid = expiresIn > 0;
        if (tokenIsValid) {
            this.token = authInfo.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }

    }

    private setAuthTimer(duration: number) {
        console.log('Setting timer: ' + duration);

        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthDate() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!token || !expirationDate){
            return;
        }

        return {token: token, expirationDate: new Date(expirationDate)};
    }
}
