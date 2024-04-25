import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../../service/shared.service';
import { AuthService } from '../../../service/auth.service';
import { MeasurementService } from '../../../service/measurement.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

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
    
      // Dátum és idő string
      const timestampString = this.datePipe.transform(data.timestamp.toDate(), 'yyyy-MM-dd HH:mm', 'local') || '';
    
      // Pulzus érték string
      const pulseString = data.measurement.toString();
    
      // Dátum és idő szűrése
      const dateTimeFilter = timestampString.includes(searchText);
    
      // Pulzus szűrése
      const pulseFilter = pulseString.includes(searchText);
    
      // Lebegőpontos számok szűrése
      const floatFilter = !isNaN(parseFloat(searchText)) && pulseString.includes(parseFloat(searchText).toString());
    
      // Minden adatkomponensre történő szűrés
      return dateTimeFilter || pulseFilter || floatFilter;
    };
    
    this.authService.getCurrentUserUid().subscribe(currentUserUid => {
      if (currentUserUid) {
        this.measurementService.getMeasurementsByUserId(currentUserUid).subscribe(measurements => {
          this.measurementsDataSource.data = measurements;
        });
      }
    });

    this.measurementsDataSource.sort = this.sort;
  }

  search() {
    if (!this.searchText) {
      // Ha a keresőmező üres, töröljük a szűrést
      this.measurementsDataSource.filter = '';
      return;
    }
  
    let filterValue: string = this.searchText.trim().toLowerCase(); // Keresőmező értékének kisbetűssé alakítása és szóközök levágása
    
    // Az eredeti filterPredicate használata
    this.measurementsDataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.trim();
    
      // Dátum és idő string
      const timestampString = this.datePipe.transform(data.timestamp.toDate(), 'yyyy-MM-dd HH:mm', 'local') || '';
    
      // Pulzus érték string
      const pulseString = data.measurement.toString();
    
      // Dátum és idő szűrése
      const dateTimeFilter = timestampString.includes(searchText);
    
      // Pulzus szűrése
      const pulseFilter = pulseString.includes(searchText);
    
      // Lebegőpontos számok szűrése
      const floatFilter = !isNaN(parseFloat(searchText)) && pulseString.includes(parseFloat(searchText).toString());
    
      // Minden adatkomponensre történő szűrés
      return dateTimeFilter || pulseFilter || floatFilter;
    };
  
    // Szűrés az időbélyeg és a pulzus alapján
    this.measurementsDataSource.filter = filterValue;
  }

  exportAsCSV() {
    const options: ExportAsConfig = {
      type: 'csv',
      elementIdOrContent: 'measurement-table',
      options: { /* CSV beállítások */ }
    };
    // Az Observable-t Promise-vé alakítjuk
    const exportPromise = this.exportAsService.save(options, 'measurements').toPromise();

    // Most már használhatjuk a then és catch metódusokat
    exportPromise.then((content) => {
      console.log('Exportált adatok:', content);
      this.snackBar.open('Exportálás CSV formátumban...', 'Bezárás', {
        duration: 3000, // Az üzenet megjelenési ideje milliszekundumban
      });
    }).catch((error) => {
      console.error('Hiba az exportálás során:', error);
      this.snackBar.open('Hiba az exportálás során...', 'Bezárás', {
        duration: 3000, // Az üzenet megjelenési ideje milliszekundumban
      });
    });
  }

  exportAsDOC() {
    const options: ExportAsConfig = {
      type: 'doc',
      elementIdOrContent: 'measurement-table',
      options: { /* pdf beállítások */ }
    };
    // Az Observable-t Promise-vé alakítjuk
    const exportPromise = this.exportAsService.save(options, 'measurements').toPromise();

    // Most már használhatjuk a then és catch metódusokat
    exportPromise.then((content) => {
      console.log('Exportált adatok:', content);
      this.snackBar.open('Exportálás DOC formátumban...', 'Bezárás', {
        duration: 3000, // Az üzenet megjelenési ideje milliszekundumban
      });
    }).catch((error) => {
      console.error('Hiba az exportálás során:', error);
      this.snackBar.open('Hiba az exportálás során...', 'Bezárás', {
        duration: 3000, // Az üzenet megjelenési ideje milliszekundumban
      });
    });
  }

  exportAsPDF() {
    const options: ExportAsConfig = {
      type: 'pdf',
      elementIdOrContent: 'measurement-table',
      options: { /* pdf beállítások */ }
    };
    // Az Observable-t Promise-vé alakítjuk
    const exportPromise = this.exportAsService.save(options, 'measurements').toPromise();

    // Most már használhatjuk a then és catch metódusokat
    exportPromise.then((content) => {
      console.log('Exportált adatok:', content);
      this.snackBar.open('Exportálás PDF formátumban...', 'Bezárás', {
        duration: 3000, // Az üzenet megjelenési ideje milliszekundumban
      });
    }).catch((error) => {
      console.error('Hiba az exportálás során:', error);
      this.snackBar.open('Hiba az exportálás során...', 'Bezárás', {
        duration: 3000, // Az üzenet megjelenési ideje milliszekundumban
      });
    });
  }

  exportAsPNG() {
    const options: ExportAsConfig = {
      type: 'png',
      elementIdOrContent: 'measurement-table',
      options: { /* pdf beállítások */ }
    };
    // Az Observable-t Promise-vé alakítjuk
    const exportPromise = this.exportAsService.save(options, 'measurements').toPromise();

    // Most már használhatjuk a then és catch metódusokat
    exportPromise.then((content) => {
      console.log('Exportált adatok:', content);
      this.snackBar.open('Exportálás PNG formátumban...', 'Bezárás', {
        duration: 3000, // Az üzenet megjelenési ideje milliszekundumban
      });
    }).catch((error) => {
      console.error('Hiba az exportálás során:', error);
      this.snackBar.open('Hiba az exportálás során...', 'Bezárás', {
        duration: 3000, // Az üzenet megjelenési ideje milliszekundumban
      });
    });
  }
}
