import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../posts/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) { }
  private authListenerSubs: Subscription | undefined
  userIsAuthentivated = false

  ngOnInit(): void {
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((authenticationStatus) => {
      this.userIsAuthentivated = authenticationStatus
    })
  }

  ngOnDestroy(): void {
      if (this.authListenerSubs) {
        this.authListenerSubs.unsubscribe()
      }
  }

  onLogOut() {
    this.authService.logOut()
  }

}
