import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { posts } from "../post.model";
import { PostsService } from "../posts.service";
import { mimeType } from "./mime-type.validator"

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.sass']
    
})
export class PostCreateComponent implements OnInit {
    constructor(public postService: PostsService,
        public route: ActivatedRoute,
        private authservice: AuthService,
        private router: Router) { }
    private mode = 'create'
    private postId: string = '';
    public form: FormGroup = new FormGroup({
        'title': new FormControl(null, {
            validators: [Validators.required, Validators.minLength(3)],
        }),
        'content': new FormControl(null, {
            validators: [Validators.required],
        }),
        image: new FormControl(null, {
            validators: [Validators.required],
            asyncValidators: [mimeType]
        })
    })
    public selectedPost: posts = {} as posts
    public loadingPosts = false
    imagePreview = ''
    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.loadingPosts = true
                this.mode = 'edit'
                this.postId = paramMap.get('postId') || ''
                if (this.postId) {
                    this.postService.getPost(this.postId).subscribe((data: posts) => {
                        this.loadingPosts = false
                        this.selectedPost = data
                        this.form.setValue({
                            title: this.selectedPost.title,
                            content: this.selectedPost.content,
                            image: this.selectedPost.imagePath
                        })
                    })
                }
            } else {
                this.mode = 'create'
            }
        })
    }
    onAddPost() {
        if (!this.form.invalid) {
            const post: posts = {
                id: '',
                title: this.form.value.title,
                content: this.form.value.content,
                imagePath: '',
                creator: this.authservice.getUserID()
            }
            this.loadingPosts = true
            if (this.mode === 'edit') {
                post.id = this.selectedPost.id
                this.postService.updatePost(post, this.form.value.image)
            } else {
                this.postService.addPosts(post, this.form.value.image)
            }
            this.form.reset()
            this.router.navigate([''])
        }
    }
    onImageAdded(eve: Event) {
        const files = (eve.target as HTMLInputElement).files
        if (files?.length) {
            const file = files[0]
            this.form.patchValue({
                image: file
            })
            this.form.get('image')?.updateValueAndValidity()
            const reader = new FileReader()
            reader.onload = () => {
                this.imagePreview = reader.result as string
            }
            reader.readAsDataURL(file);
        }
    }
}