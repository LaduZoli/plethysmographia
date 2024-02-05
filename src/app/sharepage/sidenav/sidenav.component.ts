import { Component } from '@angular/core';

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
}
