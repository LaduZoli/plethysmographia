import { Component, OnInit } from '@angular/core';
import { SharedService } from './service/shared.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SharedService] 
})
export class AppComponent implements OnInit {

  shouldShowSidenav$: Observable<boolean> | null = null;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.shouldShowSidenav$ = this.sharedService.shouldShowSidenav$;
  }

  toggleSidenavVisibility(shouldShow: boolean): void {
    this.sharedService.toggleSidenavVisibility(shouldShow);
  }
}
