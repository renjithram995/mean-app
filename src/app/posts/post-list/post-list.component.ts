import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { posts } from '../post.model';
import { PostsService } from '../posts.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.sass']
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(public postService: PostsService, private authService: AuthService) { }
  posts: posts[] = []
  private postsSub: Subscription | undefined;
  public loadingPosts = false
  totalPosts = 0
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOption = [1, 2, 5, 7, 10]
  authStatusSubs: Subscription | undefined
  userIsAuthenticated = false
  ngOnInit(): void {
    this.fetchPosts()
    this.postsSub = this.postService.getPostsListener()
      .subscribe((data: posts[]) => {
        this.loadingPosts = false
        this.posts = data
      })
    this.userIsAuthenticated = Boolean(this.authService.getToken())
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated
    })
  }
  ngOnDestroy() {
    this.postsSub?.unsubscribe()
    if (this.authStatusSubs) {
      this.authStatusSubs.unsubscribe()
    }
  }
  fetchPosts() {
    this.loadingPosts = true
    this.postService.getPostCount().subscribe((count: number) => {
      this.totalPosts = count
    })
    this.postService.getPosts(this.postsPerPage, this.currentPage)
  }
  onDelete (id: string) {
    if (id) {
      this.postService.deleteposts(id).subscribe(this.fetchPosts.bind(this))
    }
  }
  onChangedPage(eve: PageEvent) {
    this.loadingPosts = true
    this.currentPage = eve.pageIndex + 1
    this.postsPerPage = eve.pageSize
    this.postService.getPosts(this.postsPerPage, this.currentPage)
  }
}
