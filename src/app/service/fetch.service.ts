import { OnDestroy, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { takeUntil, shareReplay } from 'rxjs/operators';

@Injectable()
export class FetchService implements OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getLookupData<T>(path: string): Observable<T[]> {
    const api = `api/${path}`;
    return this.http.get<T[]>(api).pipe(
      takeUntil(this.destroy$),
      shareReplay(1)
    );
  }
}
