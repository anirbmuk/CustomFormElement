import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, take } from 'rxjs/operators';

@Injectable()
export class LookupService {
  constructor(private http: HttpClient) {}

  getLookupData<T>(path: string): Observable<T[]> {
    return this.http.get<T[]>(path).pipe(take(1), shareReplay(1));
  }
}
