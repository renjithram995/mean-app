import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable() // provides interceptor diffrently but this one needs to get added as required from angular
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authService.getToken();
        const authRequest = req.clone({
            setHeaders: { Authorization: `Bearer ${authToken}` }
        })
        return next.handle(authRequest);
    }
}