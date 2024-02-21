import { Component, OnInit } from '@angular/core';
import { SharedService } from './service/shared.service';
import { Observable } from 'rxjs';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SharedService] 
})
export class AppComponent implements OnInit {

  loggedInUser?: firebase.default.User | null; 

  shouldShowSidenav$: Observable<boolean> | null = null;

  constructor(private sharedService: SharedService, private authService: AuthService) {}

  ngOnInit(): void {
    this.shouldShowSidenav$ = this.sharedService.shouldShowSidenav$;
  }

  toggleSidenavVisibility(shouldShow: boolean): void {
    this.sharedService.toggleSidenavVisibility(shouldShow);
  }
}
