import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';

interface RespondObject {
    message: string;
    posts: Post[];
}

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private httpClient: HttpClient) {
    }

    getPosts() {
        this.httpClient.get<RespondObject>('http://localhost:3000/api/posts')
        // unsubscription will be handled in http framework
            .subscribe(
                // httpClient will return body of the respond
                (postData) => {
                    this.posts = postData.posts;
                    this.postsUpdated.next([...this.posts]);
                });
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post: Post = {id: null, title: title, content: content};
        this.httpClient.post<{ message: string }>('http://localhost:3000/api/posts', post)
            .subscribe( (responseData) => {
                // will only executed with successful request
                console.log(responseData.message);
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
    }
}