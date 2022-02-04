import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { successData } from "./common.model";

@Injectable({ providedIn: "root" })

export class AuthService {
    constructor(private http: HttpClient, private router: Router) { }
    private token = ''
    public userpath = 'http://localhost:3000/api/users/'
    private authStatusListener = new Subject<boolean>();

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
                    this.token = res.data.token as string
                    this.authStatusListener.next(true)
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
    }
}