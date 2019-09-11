import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('storeForm', { static: true }) storeForm: NgForm;

  public itemFormConfig: any;
  public itemLookupConfig: any;
  public storeFormConfig: any;
  public storeLookupConfig: any;

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
      searchFields: ['ItemName'], // modal search fields
      displayFields: ['ItemName', 'ItemDescription'], // modal data table display fields
      fieldConfig: {
        ItemName: { controlname: 'ItemName', type: 'input', label: 'Item', header: 'Item' },
        ItemDescription: { controlname: 'ItemDescription', type: 'input', label: 'Description', header: 'Description' }
      },
      postback: 'ItemName' // data model attribute which would populate the form
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
      searchFields: ['StoreName', 'StoreLocation'],
      searchFieldConfig: {
        StoreName: {  }
      },
      displayFields: ['StoreName', 'StoreLocation'],
      fieldConfig: {
        StoreName: { controlname: 'StoreName', type: 'input', label: 'Store', header: 'Store' },
        StoreLocation: { controlname: 'StoreLocation', type: 'input', label: 'Location', header: 'Location' }
      },
      postback: 'StoreName'
    };
  }

  public submitStoreForm(): void {
    if (this.storeForm) {
      console.log(this.storeForm.value);
    }
  }

}
