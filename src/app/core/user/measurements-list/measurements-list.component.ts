import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../service/shared.service';
import { UserService } from '../../../service/user.service';
import { AuthService } from '../../../service/auth.service';
import { MeasurementService } from '../../../service/measurement.service';

@Component({
  selector: 'app-measurements-list',
  templateUrl: './measurements-list.component.html',
  styleUrl: './measurements-list.component.css'
})
export class MeasurementsListComponent implements OnInit{

  measurements: MeasurementService[] = [];
  displayedColumns: string[] = ['timestamp', 'measurement'];

  constructor(private sharedService: SharedService, private authService: AuthService, private measurementService: MeasurementService) {}

  ngOnInit(): void {
    this.sharedService.toggleSidenavVisibility(true); 

    this.authService.getCurrentUserUid().subscribe(currentUserUid => {
      if (currentUserUid) {
        this.measurementService.getMeasurementsByUserId(currentUserUid).subscribe(measurements => {
          this.measurements = measurements;
        });
      }
    });
  }
}
