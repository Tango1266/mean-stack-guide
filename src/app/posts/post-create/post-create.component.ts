import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {PostsService} from '../posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from '../post.model';
import {mimeType} from './mime-type.validator';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
    enteredTitle = '';
    enteredContent = '';
    private mode = 'create';
    private postId: string;
    post: Post;
    isLoading = false;
    form: FormGroup;
    imagePreview: string;

    constructor(public postsService: PostsService, public rout: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            'title': new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)]}),
            'content': new FormControl(null, {
                validators: [Validators.required]
            }),
            'image': new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        });

        this.rout.paramMap.subscribe((paramMap: ParamMap) => {
            // if postId exists, we are actually editing
            if (paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId');

                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe(postData => {
                    this.isLoading = false;

                    // create new post
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content,
                        imagePath: null
                    };
                    // init Form
                    this.form.setValue({'title': this.post.title, 'content': this.post.title});
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onImagePicked(event: Event){
        const target = event.target as HTMLInputElement;
        const file = target.files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();

        // populate image preview
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };

        reader.readAsDataURL(file);
    }

    onSavePost() {
        if (this.form.invalid) {
            return;
        }
        // does not need to set to back to false
        // will be redirected where it is handled
        this.isLoading = true;
        if (this.mode === 'create') {
            this.postsService.addPost(
                this.form.value.title,
                this.form.value.content,
                this.form.value.image);
        } else {
            this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
        }
        this.form.reset();
    }
}