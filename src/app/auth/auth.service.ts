import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';


import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({providedIn: 'root'})
export class AuthService {
    private token: string;
    private tokenTimer: NodeJS.Timer;
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    private userId: string;

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

    getUserId() {
        return this.userId;
    }

    createUser(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};

        this.http.post(BACKEND_URL + '/signup', authData)
            .subscribe(
                () => {
                    this.router.navigate(['/']);
                },
                error => {
                    this.authStatusListener.next(false);
                }
            );
    }

    login(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};

        this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + '/login', authData)
            .subscribe(
                response => {
                    const token = response.token;
                    this.token = token;

                    if (token) {
                        const expiresInDuration = response.expiresIn;

                        this.setAuthTimer(expiresInDuration);

                        this.isAuthenticated = true;
                        this.userId = response.userId;
                        this.authStatusListener.next(true);
                        const now = new Date();
                        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                        this.saveAuthData(token, expirationDate, this.userId);
                        this.router.navigate(['/']);
                    }
                },
                error => {
                    this.authStatusListener.next(false);
                }
            );
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthDate();
        this.userId = null;
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
            this.userId = authInfo.userId;
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

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthDate() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate){
            return;
        }

        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        };
    }
}
