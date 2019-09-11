import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatFormFieldModule, MatInputModule,
         MatDialogModule, MatIconModule, MatTableModule, MatPaginatorModule,
         MatTooltipModule, MatExpansionModule, MatDividerModule } from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatExpansionModule,
        MatDividerModule
    ],
    exports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatExpansionModule,
        MatDividerModule
    ]
})
export class MaterialModule {}
