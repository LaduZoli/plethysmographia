import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../../service/shared.service';
import { AuthService } from '../../../service/auth.service';
import { MeasurementService } from '../../../service/measurement.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-measurements-list',
  templateUrl: './measurements-list.component.html',
  styleUrls: ['./measurements-list.component.css']
})
export class MeasurementsListComponent implements OnInit {
  measurementsDataSource: MatTableDataSource<MeasurementService>;
  displayedColumns: string[] = ['timestamp', 'measurement'];

  searchText: string = '';

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('measurementTable', { static: false }) measurementTable!: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private measurementService: MeasurementService,
    private exportAsService: ExportAsService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    this.measurementsDataSource = new MatTableDataSource<MeasurementService>([]);
  }

  ngOnInit(): void {
    this.sharedService.toggleSidenavVisibility(true);

    this.measurementsDataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.trim();
      const timestampString = this.datePipe.transform(data.timestamp, 'yyyy-MM-dd HH:mm', 'local') || '';
      const pulseString = data.measurement.toString();
      const dateTimeFilter = timestampString.includes(searchText);
      const pulseFilter = pulseString.includes(searchText);
      const floatFilter = !isNaN(parseFloat(searchText)) && pulseString.includes(parseFloat(searchText).toString());
      return dateTimeFilter || pulseFilter || floatFilter;
    };

    this.authService.getCurrentUserUid().subscribe(currentUserUid => {
      if (currentUserUid) {
        this.measurementService.getMeasurementsByUserId(currentUserUid).subscribe(measurements => {
          this.measurementsDataSource.data = measurements;
          this.measurementsDataSource.paginator = this.paginator; // hozzáadva
        });
      }
    });

    this.measurementsDataSource.sort = this.sort;
  }

  search() {
    if (!this.searchText) {
      this.measurementsDataSource.filter = '';
      return;
    }
  
    let filterValue: string = this.searchText.trim().toLowerCase();
    this.measurementsDataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.trim();
      const timestampString = this.datePipe.transform(data.timestamp, 'yyyy-MM-dd HH:mm', 'local') || '';
      const pulseString = data.measurement.toString();
      const dateTimeFilter = timestampString.includes(searchText);
      const pulseFilter = pulseString.includes(searchText);
      const floatFilter = !isNaN(parseFloat(searchText)) && pulseString.includes(parseFloat(searchText).toString());
      return dateTimeFilter || pulseFilter || floatFilter;
    };
    this.measurementsDataSource.filter = filterValue;
  }

  exportAsCSV() {
    const tableContent = this.measurementTable.nativeElement.innerHTML;

    const options: ExportAsConfig = {
      type: 'csv',
      elementIdOrContent: tableContent, // <-- exportálni kívánt elem azonosítója
      options: { /* CSV beállítások */ }
    };
    const exportPromise = this.exportAsService.save(options, 'measurements').toPromise();
    exportPromise.then((content) => {
      console.log('Exportált adatok:', content);
      this.snackBar.open('Exportálás CSV formátumban...', 'Bezárás', { duration: 3000 });
    }).catch((error) => {
      console.error('Hiba az exportálás során:', error);
      this.snackBar.open('Hiba az exportálás során...', 'Bezárás', { duration: 3000 });
    });
  }

  exportAsDOC() {
    const options: ExportAsConfig = {
      type: 'doc',
      elementIdOrContent: 'measurement-table',
      options: { /* pdf beállítások */ }
    };
    const exportPromise = this.exportAsService.save(options, 'measurements').toPromise();
    exportPromise.then((content) => {
      console.log('Exportált adatok:', content);
      this.snackBar.open('Exportálás DOC formátumban...', 'Bezárás', { duration: 3000 });
    }).catch((error) => {
      console.error('Hiba az exportálás során:', error);
      this.snackBar.open('Hiba az exportálás során...', 'Bezárás', { duration: 3000 });
    });
  }

  exportAsPDF() {
    const options: ExportAsConfig = {
      type: 'pdf',
      elementIdOrContent: 'measurement-table',
      options: { /* pdf beállítások */ }
    };
    const exportPromise = this.exportAsService.save(options, 'measurements').toPromise();
    exportPromise.then((content) => {
      console.log('Exportált adatok:', content);
      this.snackBar.open('Exportálás PDF formátumban...', 'Bezárás', { duration: 3000 });
    }).catch((error) => {
      console.error('Hiba az exportálás során:', error);
      this.snackBar.open('Hiba az exportálás során...', 'Bezárás', { duration: 3000 });
    });
  }

  exportAsPNG() {
    const options: ExportAsConfig = {
      type: 'png',
      elementIdOrContent: 'measurement-table',
      options: { /* pdf beállítások */ }
    };
    const exportPromise = this.exportAsService.save(options, 'measurements').toPromise();
    exportPromise.then((content) => {
      console.log('Exportált adatok:', content);
      this.snackBar.open('Exportálás PNG formátumban...', 'Bezárás', { duration: 3000 });
    }).catch((error) => {
      console.error('Hiba az exportálás során:', error);
      this.snackBar.open('Hiba az exportálás során...', 'Bezárás', { duration: 3000 });
    });
  }
}
