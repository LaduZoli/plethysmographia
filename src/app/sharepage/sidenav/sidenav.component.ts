import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{
  badgevisible = false;
  badgevisibility() {
    this.badgevisible = true;
  }

  userDisplayName!: Observable<string>;

  shouldShowSidenav() :boolean {
    return true;
  }

  constructor(private authService : AuthService,  private router: Router) {}

  ngOnInit(): void {
    this.userDisplayName! = this.authService.getUserDisplayName(); 
  }

  logout() {
    this.authService.logout().then(() => {
      console.log('Logged out successfully.');
      this.router.navigate(['/home']);
    }).catch(error => {
      console.error(error);
    });
  }
}
