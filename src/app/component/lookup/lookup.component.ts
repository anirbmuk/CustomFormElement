import {
  Component,
  OnInit,
  Input,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ControlValueAccessor,
  FormGroupDirective,
  NgForm,
  NgControl
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorStateMatcher } from '@angular/material/core';
import { fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FormConfig, LookupConfig, APPEARANCE } from './..';

import { MatFormFieldAppearance } from '@angular/material/form-field';
import { LookupService } from './lookup.service';

class FormStateMatcher implements ErrorStateMatcher {
  private errorCode: string;
  constructor(errorCode?: string) {
    this.errorCode = errorCode || '';
  }

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!this.errorCode;
  }
}

@Component({
  templateUrl: './template/lookup.modal.html',
  providers: [LookupService]
})
export class LookupModalComponent<T> implements OnInit {
  private dialogData: { action: string; context: any };
  private dataSource: T[];
  private lookupConfig: LookupConfig<T>;

  searchFields: LookupConfig<T>['searchFields'];
  displayFields: LookupConfig<T>['displayFields'];
  fieldConfig: LookupConfig<T>['fieldConfig'];
  postback: keyof T;
  lookupSearchForm: FormGroup;

  selectedKey: T[keyof T];
  selectedRow: T;

  lookupData$: Observable<T[]>;
  matTableDataSource: MatTableDataSource<T>;

  constructor(
    private dialogRef: MatDialogRef<LookupModalComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lookup: LookupService
  ) {}

  ngOnInit(): void {
    this.lookupConfig = this.data;
    this.searchFields = this.lookupConfig.searchFields;
    this.displayFields = this.lookupConfig.displayFields;
    this.fieldConfig = this.lookupConfig.fieldConfig;
    this.postback = this.lookupConfig.postback;
    this.dialogData = { action: null, context: {} };
    this.buildFormGroup(this.searchFields);
    this.lookupData$ = this.lookup.getLookupData<T>(this.lookupConfig.lookup);

    if (this.lookupConfig.fetchOnLoad) {
      this.buildData();
    } else {
      this.dataSource = [];
      this.matTableDataSource = new MatTableDataSource<T>(this.dataSource);
    }
  }

  isArray(source: unknown[]): boolean {
    return Array.isArray(source);
  }

  onLookupFilter(): void {
    this.lookupData$
      .pipe(take(1), map(this.filterFn.bind(this)))
      .subscribe((filteredData: T[]) => {
        this.dataSource = filteredData || [];
        this.matTableDataSource = new MatTableDataSource<T>(this.dataSource);
      });
  }

  resetForm(): void {
    this.lookupSearchForm.reset();
    this.onLookupFilter();
  }

  onRowSelection(currentKey: T[keyof T]) {
    if (this.selectedKey === currentKey) {
      this.selectedRow = null;
      this.selectedKey = null;
    } else {
      this.selectedKey = currentKey;
      this.selectedRow = this.dataSource.find(
        (data: T) => data[this.postback] === currentKey
      );
    }
  }

  onDialogAction(): void {
    this.dialogData.action = 'select';
    this.dialogData.context = { postback: this.selectedKey };
    this.dialogRef.close(this.dialogData);
  }

  closeModal(): void {
    this.dialogData.action = 'cancel';
    this.dialogData.context = {};
    this.dialogRef.close(this.dialogData);
  }

  private buildData() {
    this.lookupData$.subscribe((data: T[]) => {
      this.dataSource = data;
      this.matTableDataSource = new MatTableDataSource<T>(data);
    });
  }

  private buildFormGroup(attributes: string[]): void {
    const formGroup: { [key: string]: FormControl } = {};
    attributes.forEach(attribute => {
      formGroup[attribute] = new FormControl('');
    });
    this.lookupSearchForm = new FormGroup(formGroup);
  }

  private filterFn<U>(data: U[]): U[] {
    const filteredData = data.filter((each: U) => {
      let condition = true;
      this.searchFields.forEach(field => {
        if (this.lookupSearchForm.value[field]) {
          condition =
            condition &&
            (each[field]
              ? each[field]
                  .toLowerCase()
                  .indexOf(this.lookupSearchForm.value[field].toLowerCase()) >
                -1
              : true);
        } else {
          condition = condition && true;
        }
      });
      return condition;
    });
    return filteredData;
  }
}

@UntilDestroy()
@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css'],
  providers: [LookupService]
})
export class LookupComponent<T>
  implements OnInit, ControlValueAccessor, AfterViewInit
{
  @Input() formConfig: FormConfig;
  @Input() lookupConfig: LookupConfig<T>;
  @Input() _formValue: string | null | undefined;
  @ViewChild('formInput') formInput?: ElementRef<HTMLElement>;

  fieldErrorStateMatcher = new FormStateMatcher();

  formValue: string;
  action$: Observable<string>;
  onchange: (data: string | undefined) => void;
  ontouched: () => void;

  constructor(
    @Inject(APPEARANCE)
    readonly appearance: MatFormFieldAppearance = 'standard',
    private ngControl: NgControl,
    private readonly dialog: MatDialog,
    private readonly lookup: LookupService
  ) {
    ngControl.valueAccessor = this;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const postback = this.lookupConfig.postback;
    this.action$ = fromEvent(this.formInput.nativeElement, 'input').pipe(
      untilDestroyed(this),
      debounceTime(250),
      distinctUntilChanged(),
      map(
        (event: KeyboardEvent) =>
          (event.target as HTMLInputElement).value as string
      ),
      tap(() => this.ontouched())
    );
    if (this.lookupConfig.allowUnlistedValue) {
      this.action$.subscribe(value => this.onchange(value));
      this.ngControl.control.setErrors(null);
    } else {
      this.action$
        .pipe(
          switchMap(value => {
            return this.lookup.getLookupData<T>(this.lookupConfig.lookup).pipe(
              take(1),
              map((data: T[]) => {
                let valid = false;
                if (!value) {
                  valid = true;
                } else {
                  valid = data.some(
                    each => each[postback] === (value as unknown as T[keyof T])
                  );
                }
                if (valid) {
                  this.onchange(value);
                  this.fieldErrorStateMatcher = new FormStateMatcher();
                  this.ngControl.control.setErrors(null);
                } else {
                  this.onchange('');
                  this.fieldErrorStateMatcher = new FormStateMatcher('error');
                  this.ngControl.control.setErrors({ invalidvalue: true });
                }
              })
            );
          })
        )
        .subscribe();
    }
  }

  writeValue(value: string): void {
    if (!value) {
      this.fieldErrorStateMatcher = new FormStateMatcher();
    }
    this.formValue = value;
  }

  registerOnChange(callback: any): void {
    this.onchange = callback;
  }

  registerOnTouched(callback: any) {
    this.ontouched = callback;
  }

  launchPopup(): void {
    const dialogRef = this.dialog.open(LookupModalComponent, {
      maxWidth: '90vw',
      width: '90vw',
      height: '85vh',
      disableClose: true,
      data: this.lookupConfig
    });
    dialogRef
      .afterClosed()
      .subscribe((result: { action: string; context: any }) => {
        if (result.action === 'select') {
          if (result && result.context) {
            this.formValue = result.context.postback;
          } else {
            this.formValue = '';
          }
          this.onchange(this.formValue);
          this.fieldErrorStateMatcher = new FormStateMatcher();
        }
      });
  }
}
