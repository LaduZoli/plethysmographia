import { Component, OnInit, AfterViewInit, ElementRef, NgModule } from '@angular/core';
import { SharedService } from '../../../service/shared.service';
import { UserService } from '../../../service/user.service';
import { AuthService } from '../../../service/auth.service';
import { MeasurementService } from '../../../service/measurement.service';
import Chart, { ChartDataset, ChartOptions, ChartType } from 'chart.js/auto';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit, AfterViewInit {
  public lineChartData: ChartDataset<'line'>[] = [];
  public lineChartLabels: string[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: false
  };
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];
  public dataLoaded = false;

  public lastPulse: number = 0;
  public lastMeasurementTime: string = '';

  public todaysMeasurementCount: number = 0;
  public weeklyMeasurementCount: number = 0;
  public totalMeasurementCount: number = 0;

  // Az összes mérés átlagpulzusa
  public averagePulse: number = 0;
  public pulseVariance: number = 0;
  public maxPulse: number = 0;
  public minPulse: number = 0;

  viewDate: Date = new Date();
  events: CalendarEvent[] = [];


  constructor(private elementRef: ElementRef, private sharedService: SharedService, private authService: AuthService, private userService: UserService, private measurementService: MeasurementService) { }

  ngOnInit(): void {
    this.sharedService.toggleSidenavVisibility(true);   
  
    // Aktuális felhasználó azonosítójának megszerzése
    this.authService.getCurrentUserUid().subscribe(currentUserUid => {
      if (currentUserUid) {
        // Felhasználó méréseinek lekérése
        this.measurementService.getMeasurementsByUserId(currentUserUid).subscribe(measurements => {
          // Adatok rendezése a timestamp alapján
          measurements.sort((a, b) => {
            return a.timestamp.toDate() - b.timestamp.toDate();
          });

          // A mai nap méréseinek száma
          this.measurementService.getTodaysMeasurements(currentUserUid).subscribe(measurements => {
            this.todaysMeasurementCount = measurements.length;
          });

          // A héten mért adatok száma
          this.measurementService.getWeeklyMeasurements(currentUserUid).subscribe(measurements => {
            this.weeklyMeasurementCount = measurements.length;
          });
        
          // Összes mérések száma
          this.measurementService.getAllMeasurements(currentUserUid).subscribe(measurements => {
            this.totalMeasurementCount = measurements.length;
          });

          // Események létrehozása a naptárhoz
          this.events = measurements.map(measurement => ({
            start: measurement.timestamp.toDate(),
            title: 'Measurement',
            color: {
              primary: '#ff0000', // Piros szív
              secondary: '#ff0000' // Piros szív
            },
            hasMeasurement: true // Mérés jelzése
          }));

          // Utolsó mért pulzus értékének és idejének meghatározása
          if (measurements.length > 0) {
            const lastMeasurement = measurements[measurements.length - 1];
            this.lastPulse = lastMeasurement.measurement;
          
            // Az aktuális idő lekérése
            const currentTime = new Date();
          
            // Az utolsó mérés időpontjának lekérése
            const lastMeasurementTime = lastMeasurement.timestamp.toDate();
          
            // Az eltelt idő meghatározása milliszekundumban
            const elapsedTimeInMillis = currentTime.getTime() - lastMeasurementTime.getTime();
          
            // Az eltelt idő megosztása percekre és órákra
            const elapsedMinutes = Math.abs(Math.floor(elapsedTimeInMillis / (1000 * 60)));
            const elapsedHours = Math.floor(elapsedMinutes / 60);
          
            // A megfelelő üzenet kiválasztása és formázása
            if (elapsedMinutes < 60) {
              this.lastMeasurementTime = `${elapsedMinutes} perccel ezelőtt`;
            } else {
              this.lastMeasurementTime = `${elapsedHours} órával ezelőtt`;
            }
          }
          
          // Átlagpulzus kiszámítása
          this.calculateAveragePulse(measurements);

          // Adatok előkészítése
          const pulseData = measurements.map(measurement => measurement.measurement);
          // Dátumok formázása a kívánt formátumba
          const timestampData = measurements.map(measurement => {
            const date = measurement.timestamp.toDate();
            return `${date.getFullYear()} ${date.toString().split(' ').slice(1, 4).join(' ')} ${date.toLocaleTimeString()}`;
          });
        
          // A Chart.js által használt adatformátum
          this.lineChartData = [{ data: pulseData, label: 'Pulse', borderColor: 'red', backgroundColor: 'transparent',
            pointBackgroundColor: 'red', }];
          this.lineChartLabels = timestampData;
          
          // A diagram csak akkor jelenik meg, ha az adatok betöltődtek
          this.dataLoaded = true;
  
          // Várjon, amíg az összes nézet inicializálódik, mielőtt meghívja a createChart metódust
          setTimeout(() => {
            this.createChart();
          });
        });
      }
    });
  }

  // Átlagpulzus kiszámítása
  private calculateAveragePulse(measurements: any[]): void {
    // Összegzés az összes pulzusértékhez
    const sum = measurements.reduce((total, measurement) => total + measurement.measurement, 0);
    // Átlagpulzus kiszámítása
    this.averagePulse = sum / measurements.length;

    // Négyzetes eltérések kiszámítása
  const squaredDifferences = measurements.map(measurement => Math.pow(measurement.measurement - this.averagePulse, 2));
  // Szórásnégyzet kiszámítása
  const variance = squaredDifferences.reduce((total, squaredDifference) => total + squaredDifference, 0) / measurements.length;
  // Szórás kiszámítása
  this.pulseVariance = parseFloat(Math.sqrt(variance).toFixed(2));

  // A legnagyobb mért érték keresése
  this.maxPulse = Math.max(...measurements.map(measurement => measurement.measurement));
  // A legkisebb mért érték keresése
  this.minPulse = Math.min(...measurements.map(measurement => measurement.measurement));
  }

  ngAfterViewInit(): void {
    // Itt semmit sem teszünk, mivel a createChart metódusban hozzuk létre a diagramot
  }

  private createChart(): void {
    // Diagram létrehozása itt történik, miután a nézetek beállítódtak
    const canvas = this.elementRef.nativeElement.querySelector('#myChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    const context = canvas.getContext('2d');
    if (context) {
      const chart = new Chart(context, {
        type: 'line',
        data: {
          labels: this.lineChartLabels,
          datasets: this.lineChartData
        },
        options: {
          plugins: {
            legend: {
              display: false // A Pulse felirat elrejtése
            },
          },
          elements: {
            line: {
              tension: 0, // A vonalak egyenes vonalak lesznek
              borderWidth: 3 // Vonalvastagság beállítása
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Idő',
                color: 'black'
              },
              ticks: {
                color: 'black'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Érték',
                color: 'black'
              },
              ticks: {
                color: 'black'
              }
            }
          }
        }
      });
    } else {
      console.error('Cannot acquire context from the given item');
    }
  }
}
