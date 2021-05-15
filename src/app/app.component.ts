import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { FormConfig, LookupConfig } from './model/config.model';

import { DataService } from './service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('storeForm') storeForm: NgForm;

  public itemFormConfig: FormConfig;
  public itemLookupConfig: LookupConfig;
  public storeFormConfig: FormConfig;
  public storeLookupConfig: LookupConfig;

  readonly value$: Observable<any> = this.data.value$;

  constructor(private data: DataService) {}

  ngOnInit(): void {

    this.itemFormConfig = {
      placeholder: 'Select Item',
      label: 'Item',
      color: 'primary'
    };
    this.itemLookupConfig = {
      lookup: 'items', // lookup service, maybe a REST endpoint
      fetchOnLoad: true, // fetch data as soon as popup window is launched
      allowUnlistedValue: false, // allow values which are not in list
      searchFields: ['name'], // modal search fields
      displayFields: ['name', 'brand'], // modal data table display fields
      fieldConfig: {
        name: { controlname: 'name', type: 'input', label: 'Item', header: 'Item' },
        brand: { controlname: 'brand', type: 'input', label: 'Brand', header: 'Brand' }
      },
      postback: 'name' // data model attribute which would populate the form
    };

    this.storeFormConfig = {
      placeholder: 'Select Store',
      label: 'Store',
      color: 'primary'
    };
    this.storeLookupConfig = {
      lookup: 'stores',
      fetchOnLoad: true,
      allowUnlistedValue: true,
      searchFields: ['name', 'location'],
      displayFields: ['name', 'location'],
      fieldConfig: {
        name: { controlname: 'name', type: 'input', label: 'Store', header: 'Store' },
        location: { controlname: 'location', type: 'input', label: 'Location', header: 'Location' }
      },
      postback: 'name'
    };
  }

  ngAfterViewInit(): void {
    this.data.print(this.storeForm.value);
  }

  public submitStoreForm(): void {
    if (this.storeForm) {
      this.data.print(this.storeForm.value);
    }
  }

}
