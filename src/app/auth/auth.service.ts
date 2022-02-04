import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { successData } from "../posts/common.model";

@Injectable({ providedIn: "root" })

export class AuthService {
    constructor(private http: HttpClient, private router: Router) { }
    private token = ''
    public userpath = 'http://localhost:3000/api/users/'
    private authStatusListener = new Subject<boolean>();

    private tokenTimer: ReturnType<typeof setTimeout> | undefined

    getToken() {
        return this.token
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(authData: AuthData) {
        return this.http.post(this.userpath + 'signup', authData)
    }

    login(authData: AuthData) {
        this.http.post<successData>(this.userpath + 'login', authData).subscribe({
            next: (res) => {
                if (res.data?.token) {
                    const expiresInDuration = (res.data.expiresIn || 0) * 1000
                    this.setAuthTimer(expiresInDuration)
                    this.token = res.data.token as string
                    this.authStatusListener.next(true);
                    const expirationDate = new Date(new Date().getTime() + expiresInDuration)
                    this.saveAuthData(this.token, expirationDate)
                    this.router.navigate(['/']);
                }
            },
            error: (err) => {
                console.error(err)
            }
        })
    }
    logOut() {
        this.token = ''
        this.authStatusListener.next(false)
        this.router.navigate(['/']);
        if (this.tokenTimer) {
            clearTimeout(this.tokenTimer)
        }
        this.clearAuthData()
    }
    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.clear()
    }

    autoAuthUser () {
        const dataFromBrowser = this.getAuthData()
        const isExpired = (dataFromBrowser?.expirationDate || new Date()).getTime() - new Date().getTime()
        if (dataFromBrowser?.token && isExpired) {
            this.token = dataFromBrowser.token
            this.setAuthTimer(isExpired)
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
        }
    }
    private setAuthTimer(expiresIn: number) {
        this.tokenTimer = setTimeout(() => {
            this.logOut()
        }, expiresIn);
    }
    private getAuthData () {
        const token = localStorage.getItem('token')
        const expirationDate = localStorage.getItem('expiration')
        if (!token || !expirationDate) {
            return;
            this.router.navigate(['/']);
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }
}