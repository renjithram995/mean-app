import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http"

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { posts } from "./post.model";
import { successData } from "./common.model";

@Injectable({ providedIn: 'root' })

export class PostsService {
    constructor(private http: HttpClient) { }
    private posts: posts[] = []
    private postsUpdated = new Subject<posts[]>()
    private serverUrl = 'http://localhost:3000/api/posts';
    getPosts(postsPerPage = 1, currentPage = 1) {
        const queryParam = `?pagesize=${postsPerPage}&page=${currentPage}`
        this.http.get<successData>(this.serverUrl + queryParam)
            .pipe(map((data) => {
                return (data.data || []).map((item: any) => {
                    return {
                        id: item._id,
                        title: item.title,
                        content: item.content,
                        imagePath: item.imagePath,
                        creator: item.creator
                    } as posts
                })
            }))
            .subscribe((data: posts[]) => {
                const postData = data as posts[]
                this.posts = postData || []
                this.postsUpdated.next([...this.posts])
            })
    }

    getPost(id: string) {
        return this.http.get<successData>(this.serverUrl + '/' + id).pipe(map((item: successData) => {
            return {
                id: item.data?._id,
                title: item.data?.title,
                content: item.data?.content,
                imagePath: item.data?.imagePath
            } as posts
        }))
    }

    getPostCount() {
        return this.http.get<successData>(this.serverUrl + '/count').pipe(map((item: successData) => {
            return item.data as number
        }))
    }

    getPostsListener(): Observable<posts[]> {
        return this.postsUpdated.asObservable();
    }

    addPosts(postData: posts, image: File) {

        const postDataToSend = new FormData()
        postDataToSend.append("title", postData.title)
        postDataToSend.append("content", postData.content)
        postDataToSend.append("image", image, postData.title) // key should be that match with the server excepting on request(multer)
        this.http.post<successData>(this.serverUrl, postDataToSend).subscribe((data: successData) => {
            // postData = {...postData, ...data.data}
            // this.posts.push(postData)
            // this.postsUpdated.next([...this.posts])
        })
    }


    deleteposts(postId: string) {
        return this.http.delete(this.serverUrl + '/' + postId)
        // .subscribe((data) => {
        //     const index = this.posts.findIndex((ele: posts) => ele.id === postId)
        //     if (index !== -1) {
        //         this.posts.splice(index, 1)
        //     }
        //     this.postsUpdated.next([...this.posts])
        // })
    }

    updatePost(post: posts, image: File | string) {
        let postData = new FormData()
        if (typeof (image) === 'object') {
            postData.append('title', post.title)
            postData.append('content', post.content)
            postData.append('image', image, post.title) // key should be that match with the server excepting on request(multer)
        }
        this.http.patch<successData>(this.serverUrl + '/' + post.id,
            (typeof (image) === 'object' ? postData : post)).subscribe({
                // next: (response: successData) => {
                //     if (response.data) {
                //         post = {...post, ...response.data}
                //     }
                //     const index = this.posts.findIndex((ele: posts) => ele.id === post.id)
                //     if (index !== -1) {
                //         this.posts.splice(index, 1, post)
                //     }
                //     this.postsUpdated.next([...this.posts])
                // },
                error: (error: HttpErrorResponse) => {
                    console.log(error.error)
                }
            })
    }
}