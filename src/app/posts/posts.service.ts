import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

interface RespondObject {
    message: string;
    posts: any;
    maxPosts: number;
}

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    getPost(id: string) {
        return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
    }

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?page=${currentPage}&pagesize=${postsPerPage}`;
        this.httpClient
            .get<RespondObject>('http://localhost:3000/api/posts' + queryParams)
            // pipe can execute operations on each respondObject
            .pipe(map((postData) => {
                // transform _id to id
                    return {
                        posts: postData.posts.map(post => {
                            const transformedPost = {
                                id: post._id,
                                title: post.title,
                                content: post.content,
                                imagePath: post.imagePath
                            };
                            return transformedPost;
                        }),
                        maxPosts: postData.maxPosts
                    };
                })
            )
            // unsubscription will be handled in http framework
            .subscribe(
                // httpClient will return body of the respond
                (transformedPostData) => {
                    this.posts = transformedPostData.posts;
                    this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
                });
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.httpClient
            .post<{ message: string, post: Post }>(
                'http://localhost:3000/api/posts',
                postData)
            .subscribe( (responseData) => {
                this.router.navigate(['/']);
            });
    }

    deletePost(postId: string){
       return this.httpClient.delete('http://localhost:3000/api/posts/' + postId);
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            // image is a file
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image);
        } else {
            // image is a string
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image
            };
        }
        
        // second arg is payload
        this.httpClient
            .put('http://localhost:3000/api/posts/' + id, postData)
            .subscribe((response) => {
                this.router.navigate(['/']);
            });
    }
}