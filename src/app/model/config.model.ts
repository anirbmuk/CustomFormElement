export interface FormConfig {
  placeholder: string;
  label: string;
  color: string;
}

export interface LookupConfig {
  lookup: string;
  fetchOnLoad: boolean;
  allowUnlistedValue: boolean;
  searchFields?: string[];
  displayFields: string[];
  postback: string;
  fieldConfig: {
    [key: string]: {
      controlname: string;
      type: string;
      label: string;
      header: string;
    }
  }
}
