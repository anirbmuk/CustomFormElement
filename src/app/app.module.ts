import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LookupModule } from './component';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';

import { DataService } from './service/data.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    LookupModule.forRoot('fill'),
    InMemoryWebApiModule.forRoot(DataService, { delay: 250 })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
