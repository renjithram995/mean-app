import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { posts } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
      this.authService.autoAuthUser()
  }
}
