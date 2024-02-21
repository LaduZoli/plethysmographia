import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  badgevisible = false;
  badgevisibility() {
    this.badgevisible = true;
  }

  shouldShowSidenav() :boolean {
    return true;
  }

  constructor(private authService : AuthService,  private router: Router) {}

  logout() {
    this.authService.logout().then(() => {
      console.log('Logged out successfully.');
      this.router.navigate(['/home']);
    }).catch(error => {
      console.error(error);
    });
  }
}
