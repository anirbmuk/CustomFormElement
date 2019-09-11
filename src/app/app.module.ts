import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { MaterialModule } from './material.module';

import { DataService } from './service/data.service';

import { AppComponent } from './app.component';
import { LookupComponent, LookupModalComponent } from './component/lookup/lookup.component';

@NgModule({
  declarations: [
    AppComponent,
    LookupComponent,
    LookupModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent],
  entryComponents: [LookupModalComponent]
})
export class AppModule { }
