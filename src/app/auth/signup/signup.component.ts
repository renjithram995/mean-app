import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorResponse, successData } from 'src/app/posts/common.model';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }
  public isLoading = false;
  ngOnInit(): void {
  }
  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const authData: AuthData = {
      email: form.value.email,
      password: form.value.password
    }
    this.isLoading = true;
    this.authService.createUser(authData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err: ErrorResponse) => {
        console.error(err?.message || 'Sign up failed')
        this.isLoading = false
      }
    })
  }
}
