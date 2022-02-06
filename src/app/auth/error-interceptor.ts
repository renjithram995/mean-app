import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { catchError, throwError } from "rxjs";
import { ErrorComponent } from "../error/error/error.component";
import { ErrorResponse } from "../posts/common.model";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const self = this
        return next.handle(req)
            .pipe(catchError((err: HttpErrorResponse) => {
                this.dialog.open(ErrorComponent, {
                    data: err.error as ErrorResponse
                })
                return throwError(() => err.error)
            }));
    }
}