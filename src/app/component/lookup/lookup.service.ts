import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, take } from 'rxjs/operators';

@Injectable()
export class LookupService {
  constructor(private http: HttpClient) {}

  getLookupData<T>(path: string): Observable<T[]> {
    return this.http.get<T[]>(path).pipe(
      take(1),
      catchError(() => of([])),
      shareReplay(1)
    );
  }
}
