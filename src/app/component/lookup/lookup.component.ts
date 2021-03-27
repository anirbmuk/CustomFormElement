import { Component, OnInit, Input, Inject, forwardRef, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorStateMatcher } from '@angular/material/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { FormConfig, LookupConfig } from './../../model/config.model';

import { IGeneric } from './../../model/generic.model';

import { FetchService } from './../../service/fetch.service';

class FormStateMatcher implements ErrorStateMatcher {

  private errorCode: string;
  constructor(errorCode?: string) {
    this.errorCode = errorCode || '';
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!this.errorCode;
  }
}

@Component({
  selector: 'app-lookup-modal',
  templateUrl: './template/lookup.modal.html',
  providers: [FetchService]
})
export class LookupModalComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  private dialogData: { action: string, context: any };
  private dataSource: any;
  private lookupConfig: LookupConfig;
  public searchFields: LookupConfig['searchFields'];
  public displayFields: LookupConfig['displayFields'];
  public fieldConfig: LookupConfig['fieldConfig'];
  public postback: string;
  public lookupSearchForm: FormGroup;

  selectedKey: string;
  selectedRow: any;

  lookupData$: Observable<IGeneric[]>;
  public matTableDataSource: MatTableDataSource<any>;

  constructor(public dialogRef: MatDialogRef<LookupModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private fetch: FetchService) { }

  ngOnInit(): void {
    this.lookupConfig = this.data;
    this.searchFields = this.lookupConfig.searchFields;
    this.displayFields = this.lookupConfig.displayFields;
    this.fieldConfig = this.lookupConfig.fieldConfig;
    this.postback = this.lookupConfig.postback;
    this.dialogData = { action: null, context: {} };
    this.buildFormGroup(this.searchFields);
    this.lookupData$ = this.fetch.getLookupData<IGeneric>(this.lookupConfig.lookup);

    if (this.lookupConfig.fetchOnLoad) {
      this.buildData();
    } else {
      this.dataSource = [];
      this.matTableDataSource = new MatTableDataSource<any>(this.dataSource);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isArray(source: unknown[]): boolean {
    return Array.isArray(source);
  }

  public onLookupFilter(): void {
    this.lookupData$.pipe(
      map((data: unknown[]) => {
        const filteredData = data.filter((each: IGeneric) => {
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
        return filteredData;
      })
    ).subscribe((filteredData: IGeneric[]) => {
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
    this.lookupData$.subscribe((data: IGeneric[]) => {
      this.dataSource = data;
      this.matTableDataSource = new MatTableDataSource<any>(data);
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

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LookupComponent),
    multi: true
  }, FetchService]
})
export class LookupComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  @Input() formConfig: FormConfig;
  @Input() lookupConfig: LookupConfig;
  @Input() _formValue: any;
  @ViewChild('formInput') formInput?: ElementRef<HTMLElement>;

  fieldErrorStateMatcher = new FormStateMatcher();

  public formValue: any;
  public action$: Observable<string>;

  constructor(private dialog: MatDialog, private fetch: FetchService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const postback = this.lookupConfig.postback;
    this.action$ = fromEvent(this.formInput.nativeElement, 'input')
    .pipe(
      takeUntil(this.destroy$),
      debounceTime(250),
      distinctUntilChanged(),
      map((event: KeyboardEvent) => ((event.target as HTMLInputElement).value as string))
    );
    if (this.lookupConfig.allowUnlistedValue) {
      this.action$.subscribe((value: string) => this.callback(value));
    } else {
      this.action$.pipe(
        switchMap((value: string) => {
          return this.fetch.getLookupData<IGeneric>(this.lookupConfig.lookup)
          .pipe(
            take(1),
            map((data: IGeneric[]) => {
              const valid = data.some(each => each[postback] === value);
              if (valid) {
                this.callback(value);
                this.fieldErrorStateMatcher = new FormStateMatcher();
              } else {
                this.callback(null);
                this.fieldErrorStateMatcher = new FormStateMatcher('error');
              }
            })
          );
        })
      ).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      if (result.action === 'select') {
        if (result && result.context) {
          this.formValue = result.context.postback;
        } else {
          this.formValue = '';
        }
        this.callback(this.formValue);
        this.fieldErrorStateMatcher = new FormStateMatcher();
      }
    });
  }

  private callback = (data: any) => { };

}
