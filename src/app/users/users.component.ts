import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../app/service/shared.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.toggleSidenavVisibility(true); 
  }

}
