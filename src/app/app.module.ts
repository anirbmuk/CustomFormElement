import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { LookupComponent, LookupModalComponent } from './component/lookup/lookup.component';
import { DataService } from './service/data.service';

@NgModule({
  declarations: [
    AppComponent,
    LookupComponent,
    LookupModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(DataService, { delay: 250 }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [LookupModalComponent]
})
export class AppModule { }
