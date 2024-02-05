import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private shouldShowSidenavSubject = new BehaviorSubject<boolean>(false);
  shouldShowSidenav$: Observable<boolean> = this.shouldShowSidenavSubject.asObservable();

  toggleSidenavVisibility(shouldShow: boolean): void {
    this.shouldShowSidenavSubject.next(shouldShow);
  }
}
