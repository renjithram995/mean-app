import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }
  public isLoading = false;
  private authListenerSubs: Subscription | undefined;
  ngOnInit(): void {
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe({
      error: () => {
        this.isLoading = false;
      }
    })
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

  ngOnDestroy(): void {
    if (this.authListenerSubs) {
      this.authListenerSubs.unsubscribe()
    }
}

}
