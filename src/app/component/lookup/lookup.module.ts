import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import {
  MatFormFieldAppearance,
  MatFormFieldModule
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { LookupComponent, LookupModalComponent } from './lookup.component';

import { APPEARANCE } from './..';

@NgModule({
  declarations: [LookupComponent, LookupModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule
  ],
  exports: [LookupComponent]
})
export class LookupModule {
  static forRoot(
    appearance: MatFormFieldAppearance = 'standard'
  ): ModuleWithProviders<LookupModule> {
    return {
      ngModule: LookupModule,
      providers: [
        {
          provide: APPEARANCE,
          useValue: appearance
        }
      ]
    };
  }
}
