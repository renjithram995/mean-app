import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthData } from 'src/app/posts/auth-data.model';
import { AuthService } from 'src/app/posts/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }
  public isLoading = false;
  ngOnInit(): void {
  }

  OnLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const authData = {
      email: form.value.email,
      password: form.value.password
    } as AuthData
    this.isLoading = true;
    this.authService.login(authData)
  }

}
