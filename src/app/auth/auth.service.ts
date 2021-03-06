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

    private userID = ''

    getToken() {
        return this.token
    }

    getUserID () {
        return this.userID
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
                    this.userID = res.data.userId;
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
                this.authStatusListener.error(false)
            }
        })
    }
    logOut() {
        this.token = this.userID = ''
        this.authStatusListener.next(false)
        this.router.navigate(['/']);
        if (this.tokenTimer) {
            clearTimeout(this.tokenTimer)
        }
        this.clearAuthData()
    }
    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', this.userID);
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
        this.userID = localStorage.getItem('userId') || ''
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