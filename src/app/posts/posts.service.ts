import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

interface RespondObject {
    message: string;
    posts: any;
}

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    getPost(id: string) {
        return this.httpClient.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
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
        this.httpClient.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
            .subscribe( (responseData) => {
                // will only executed with successful request
                // handle when id is null before stored post in db
                const id = responseData.postId;
                post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

    deletePost(postId: string){
        this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
            .subscribe(() => {
                console.log('Deleted post: ' + postId);
                const updatePosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatePosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    updatePost(id: string, title: string, content: string) {
        const post: Post = {id: id, title: title, content: content};
        // second arg is payload
        this.httpClient.put('http://localhost:3000/api/posts/' + id, post)
            .subscribe(response => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next({...this.posts});
                this.router.navigate(['/']);
            });
    }
}