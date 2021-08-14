import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { FormConfig, LookupConfig } from './component';
import { IGeneric } from './model/generic.model';

import { DataService } from './service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('storeForm') storeForm: NgForm;

  itemFormConfig: FormConfig;
  itemLookupConfig: LookupConfig<IGeneric>;
  storeFormConfig: FormConfig;
  storeLookupConfig: LookupConfig<IGeneric>;

  readonly value$: Observable<any> = this.data.value$;

  constructor(private readonly data: DataService) {}

  ngOnInit(): void {
    this.itemFormConfig = {
      placeholder: 'Select Item',
      label: 'Item',
      color: 'primary'
    };
    this.itemLookupConfig = {
      lookup: 'api/items', // lookup service, maybe a REST endpoint
      fetchOnLoad: true, // fetch data as soon as popup window is launched
      allowUnlistedValue: false, // allow values which are not in list
      searchFields: ['name'], // modal search fields
      displayFields: ['name', 'brand'], // modal data table display fields
      fieldConfig: {
        name: {
          controlname: 'name',
          type: 'input',
          label: 'Item',
          header: 'Item'
        },
        brand: {
          controlname: 'brand',
          type: 'input',
          label: 'Brand',
          header: 'Brand'
        }
      },
      postback: 'name' // data model attribute which would populate the form
    };

    this.storeFormConfig = {
      placeholder: 'Select Store',
      label: 'Store',
      color: 'primary'
    };
    this.storeLookupConfig = {
      lookup: 'api/stores',
      fetchOnLoad: true,
      allowUnlistedValue: true,
      searchFields: ['name', 'location'],
      displayFields: ['name', 'location'],
      fieldConfig: {
        name: {
          controlname: 'name',
          type: 'input',
          label: 'Store',
          header: 'Store'
        },
        location: {
          controlname: 'location',
          type: 'input',
          label: 'Location',
          header: 'Location'
        }
      },
      postback: 'name'
    };
  }

  ngAfterViewInit(): void {
    this.data.print(this.storeForm.value);
  }

  submitStoreForm(): void {
    this.data.print(this.storeForm?.value);
  }

  resetStoreForm(): void {
    this.storeForm?.reset();
    this.data.print({});
  }
}
