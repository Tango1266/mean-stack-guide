import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {PageEvent} from '@angular/material';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    currentPage = 1;
    postsPerPage = 2;
    totalPosts = 0;
    pageSizeOptions = [1, 2, 5, 10];
    posts: Post[] = [];
    userIsAuthenticated: boolean;
    userId: string;

    private postsSub: Subscription;
    private isLoading = false;
    private authStatusSub: Subscription;

    constructor(public postsService: PostsService, private  authService: AuthService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, 1);
        this.userId = this.authService.getUserId();
        this.postsSub =
            this.postsService
                .getPostUpdateListener()
                // Args: 1. funcOnUpdate, 2.funcOnError, 3. onEndService
                .subscribe(
                    // 1. Arg:
                    (postData: { posts: Post[], postCount: number }) => {
                        this.isLoading = false;
                        this.posts = postData.posts;
                        this.totalPosts = postData.postCount;
                    });

        // post list component will be initialized after login
        // hence, when subscribing for status listener there will be no status update
        // hence, we need the current status from the authService
        this.userIsAuthenticated = this.authService.getIsAuth();

        this.authStatusSub = this.authService.getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId();
            });
    }

    ngOnDestroy(): void {
        // prevents memory leaks
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

    onDelete(posId: string) {
        this.isLoading = true;
        this.postsService.deletePost(posId).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        }, error => {
            this.isLoading = false;
        });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.postsPerPage = pageData.pageSize;
        // pagination in db is 1 based
        this.currentPage = pageData.pageIndex + 1;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }
}
