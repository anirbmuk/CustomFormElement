import { InjectionToken } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';

export interface FormConfig {
  placeholder: string;
  label: string;
  color: string;
}

export interface LookupConfig<T> {
  lookup: string;
  fetchOnLoad: boolean;
  allowUnlistedValue: boolean;
  searchFields?: string[];
  displayFields: string[];
  postback: keyof T;
  fieldConfig: {
    [key in keyof Partial<T>]: {
      controlname: string;
      type: string;
      label: string;
      header: string;
    };
  };
}

export const APPEARANCE = new InjectionToken<MatFormFieldAppearance>(
  'appearance'
);
