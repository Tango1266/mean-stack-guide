import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';

interface RespondObject {
    message: string;
    posts: any;
}

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private httpClient: HttpClient) {
    }

    getPosts() {
        this.httpClient
            .get<RespondObject>('http://localhost:3000/api/posts')
            // pipe can execute operations on each respondObject
            .pipe(map((postData) => {
                // transform _id to id
                return postData.posts.map(post => {
                    const transformedPost = {
                        id: post._id,
                        title: post.title,
                        content: post.content
                    };
                    return transformedPost;
                });
            }))
            // unsubscription will be handled in http framework
            .subscribe(
                // httpClient will return body of the respond
                (transformedPosts) => {
                    this.posts = transformedPosts;
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