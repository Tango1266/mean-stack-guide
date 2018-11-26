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
        return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
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
                        content: post.content,
                        imagePath: post.imagePath
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
                // will only executed with successful request

                // create new post
                const post: Post = {
                    id: responseData.post.id,
                    title: title,
                    content: content,
                    imagePath: responseData.post.imagePath
                };

                // send request, get next, and navigate back to root
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
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
                const post: Post = {
                    id: id,
                    title: title,
                    content: content,
                    imagePath: ""
                };
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next({...this.posts});
                this.router.navigate(['/']);
            });
    }
}