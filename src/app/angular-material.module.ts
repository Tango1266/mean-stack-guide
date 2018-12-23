import {NgModule} from '@angular/core';
import {
MatButtonModule,
MatCardModule,
MatDialogModule,
MatExpansionModule,
MatInputModule,
MatPaginatorModule,
MatProgressSpinnerModule,
MatToolbarModule
} from '@angular/material';

@NgModule({
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatPaginatorModule
    ]
})
export class AngularMaterialModule {}
