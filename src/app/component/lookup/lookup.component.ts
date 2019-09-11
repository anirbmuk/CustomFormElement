import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { FormControl, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource } from '@angular/material';

import { DataService } from './../../service/data.service';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LookupComponent),
    multi: true
  }]
})
export class LookupComponent implements OnInit, ControlValueAccessor {

  @Input() formConfig: any;
  @Input() lookupConfig: any;
  @Input() _formValue: any;

  public formValue: any;
  private callback = (data: any) => { };

  constructor(private dialog: MatDialog, private dataservice: DataService) { }

  ngOnInit() {
  }

  writeValue(value: any): void {
    this.formValue = value;
  }

  registerOnChange(callback: any): void {
    this.callback = callback;
  }

  registerOnTouched() { }

  public launchPopup(): void {
    const dialogRef = this.dialog.open(LookupModalComponent, {
      width: '90vw',
      height: '95vh',
      disableClose: true,
      data: this.lookupConfig
    });
    dialogRef.afterClosed().subscribe((result: { action: string, context: any }) => {
      if (result && result.context) {
        this.formValue = result.context.postback;
      } else {
        this.formValue = '';
      }
      this.callback(this.formValue);
    });
  }

  public onValueChange(value: any) {
    if (this.lookupConfig.allowUnlistedValue) {
      this.callback(this.formValue);
    } else {
      this.validate(this.formValue).then(valid => {
        if (valid) {
          this.callback(this.formValue);
        }
      });
    }
  }

  private validate(value: any) {
    const postback = this.lookupConfig.postback;
    const lookupData = this.dataservice.getData()[this.lookupConfig.lookup];
    return Promise.resolve(lookupData().then((data: any[]) => {
      const valid = data.some(each => each[postback] === value);
      return valid;
    }));
  }

}

@Component({
  selector: 'app-lookup-modal',
  templateUrl: './template/lookup.modal.html'
})
export class LookupModalComponent implements OnInit {

  private lookupConfig: any;
  public searchFields: any[];
  public displayFields: any[];
  public fieldConfig: any;
  public postback: string;
  public lookupSearchForm: FormGroup;

  private selectedKey: string;
  private selectedRow: any;

  private dataSource: any;
  public matTableDataSource: MatTableDataSource<any>;

  private dialogData: { action: string, context: any };

  constructor(public dialogRef: MatDialogRef<LookupModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataservice: DataService) { }

  ngOnInit(): void {
    this.lookupConfig = this.data;
    this.searchFields = this.lookupConfig.searchFields;
    this.displayFields = this.lookupConfig.displayFields;
    this.fieldConfig = this.lookupConfig.fieldConfig;
    this.postback = this.lookupConfig.postback;
    this.dialogData = { action: null, context: {} };
    this.buildFormGroup(this.searchFields);

    if (this.lookupConfig.fetchOnLoad) {
      this.buildData();
    } else {
      this.dataSource = [];
      this.matTableDataSource = new MatTableDataSource<any>(this.dataSource);
    }
  }

  public onLookupFilter(): void {
    const lookupData = this.dataservice.getData()[this.lookupConfig.lookup];
    lookupData().then((data: any[]) => {
      const filteredData = data.filter(each => {
        let condition = true;
        this.searchFields.forEach(field => {
          if (this.lookupSearchForm.value[field]) {
            condition = condition && (each[field]
              ? (each[field].toLowerCase().indexOf(this.lookupSearchForm.value[field].toLowerCase()) > -1)
              : true);
          } else {
            condition = condition && true;
          }
        });
        return condition;
      });
      if (filteredData) {
        this.dataSource = filteredData;
      } else {
        this.dataSource = [];
      }
      this.matTableDataSource = new MatTableDataSource<any>(this.dataSource);
    });
  }

  public resetForm(): void {
    this.lookupSearchForm.reset();
    this.dataSource = [];
    this.matTableDataSource = new MatTableDataSource<any>(this.dataSource);
  }

  public onRowSelection(currentKey: string) {
    if (this.selectedKey === currentKey) {
      this.selectedRow = null;
      this.selectedKey = null;
    } else {
      this.selectedKey = currentKey;
      this.selectedRow = this.dataSource.find((data: any) => data[this.postback] === currentKey);
    }
  }

  public onDialogAction(): void {
    this.dialogData.action = 'select';
    this.dialogData.context = { postback: this.selectedKey };
    this.dialogRef.close(this.dialogData);
  }

  public closeModal(): void {
    this.dialogData.action = 'cancel';
    this.dialogData.context = {};
    this.dialogRef.close(this.dialogData);
  }

  private buildData() {
    const lookupData = this.dataservice.getData()[this.lookupConfig.lookup];
    lookupData().then((data: any[]) => {
      this.dataSource = data;
      this.matTableDataSource = new MatTableDataSource<any>(this.dataSource);
    });
  }

  private buildFormGroup(attributes: any[]): void {
    const formGroup = {};
    attributes.forEach(attribute => {
      formGroup[attribute] = new FormControl('');
    });
    this.lookupSearchForm = new FormGroup(formGroup);
  }

}
