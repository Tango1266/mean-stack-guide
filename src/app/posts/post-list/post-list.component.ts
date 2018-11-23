import {Component} from '@angular/core';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
    post = [{
        title: 'First Post', content: 'This is the content of the first post',
        title: 'Second Post', content: 'This is the content of the second post',
        title: 'Third Post', content: 'This is the content of the third post'
    }];
}
