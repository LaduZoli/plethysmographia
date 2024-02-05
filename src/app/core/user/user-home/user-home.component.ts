import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.toggleSidenavVisibility(true); 
  }
}
