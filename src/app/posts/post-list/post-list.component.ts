import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {PageEvent} from '@angular/material';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    postsPerPage: 2;
    totalPosts = 10;
    pageSizeOptions = [1, 2, 5, 10];
    posts: Post[] = [];
    private postsSub: Subscription;
    private isLoading = false;

    constructor(public postsService: PostsService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.postsService.getPosts();

        this.postsSub =
            this.postsService
                .getPostUpdateListener()
                // Args: 1. funcOnUpdate, 2.funcOnError, 3. onEndService
                .subscribe(
                    // 1. Arg:
                    (posts: Post[]) => {
                        this.isLoading = false;
                        this.posts = posts;
                    });
    }

    ngOnDestroy(): void {
        // prevents memory leaks
        this.postsSub.unsubscribe();
    }

    onDelete(posId: string) {
        this.postsService.deletePost(posId);
    }

    onChangedPage(pageData: PageEvent) {
        console.log(pageData);
    }
}
