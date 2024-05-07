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

  public hourlysMeasurementCount: number = 0;
  public todaysMeasurementCount: number = 0;
  public weeklyMeasurementCount: number = 0;
  public monthlysMeasurementCount: number = 0;
  public totalMeasurementCount: number = 0;

  public averagePulse: number = 0;
  public pulseVariance: number = 0;
  public maxPulse: number = 0;
  public minPulse: number = 0;

  viewDate: Date = new Date();
  events: CalendarEvent[] = [];


  constructor(private elementRef: ElementRef, private sharedService: SharedService, private authService: AuthService, private userService: UserService, private measurementService: MeasurementService) { }

  ngOnInit(): void {
    this.sharedService.toggleSidenavVisibility(true);   

    this.authService.getCurrentUserUid().subscribe(currentUserUid => {
      if (currentUserUid) {
        this.measurementService.getMeasurementsByUserId(currentUserUid).subscribe(measurements => {
          measurements.sort((a, b) => {
            return a.timestamp - b.timestamp;
          });

          this.measurementService.getMeasurementsForCurrentHour(currentUserUid).subscribe(measurements => {
            this.hourlysMeasurementCount = measurements.length;
          });

          this.measurementService.getTodaysMeasurements(currentUserUid).subscribe(measurements => {
            this.todaysMeasurementCount = measurements.length;
          });

          this.measurementService.getWeeklyMeasurements(currentUserUid).subscribe(measurements => {
            this.weeklyMeasurementCount = measurements.length;
          });

          this.measurementService.getMeasurementsForCurrenttMonth(currentUserUid).subscribe(measurements => {
            this.monthlysMeasurementCount = measurements.length;
          });
      
          this.measurementService.getAllMeasurements(currentUserUid).subscribe(measurements => {
            this.totalMeasurementCount = measurements.length;
          });

          this.events = measurements.map(measurement => ({
            start: measurement.timestamp,
            title: 'Measurement',
            color: {
              primary: '#ff0000', 
              secondary: '#ff0000'
            },
            hasMeasurement: true 
          }));

          if (measurements.length > 0) {
            const lastMeasurement = measurements[measurements.length - 1];
            this.lastPulse = lastMeasurement.measurement;
          
            const currentTime = new Date();
          
            const lastMeasurementTime = lastMeasurement.timestamp;
          
            const elapsedTimeInMillis = currentTime.getTime() - lastMeasurementTime.getTime();
          
            const elapsedMinutes = Math.abs(Math.floor(elapsedTimeInMillis / (1000 * 60)));
            const elapsedHours = Math.floor(elapsedMinutes / 60);
          
            if (elapsedMinutes === 0) {
              this.lastMeasurementTime = 'Jelenleg';
            } else if (elapsedMinutes < 60) {
                this.lastMeasurementTime = `${elapsedMinutes} perccel ezelőtt`;
            } else {
                this.lastMeasurementTime = `${elapsedHours} órával ezelőtt`;
            }
          }
        
          this.calculateAveragePulse(measurements);

          const pulseData = measurements.map(measurement => measurement.measurement);
          const timestampData = measurements.map(measurement => {
            const date = measurement.timestamp;
            return `${date.getFullYear()} ${date.toString().split(' ').slice(1, 4).join(' ')} ${date.toLocaleTimeString()}`;
          });
        
          this.lineChartData = [{ data: pulseData, label: 'Pulse', borderColor: 'red', backgroundColor: 'transparent',
            pointBackgroundColor: 'red', }];
          this.lineChartLabels = timestampData;
   
          this.dataLoaded = true;
  
          setTimeout(() => {
            this.createChart();
          });
        });
      }
    });
  }

  private calculateAveragePulse(measurements: any[]): void {
    if (measurements.length === 0) {
      this.averagePulse = 0;
      this.pulseVariance = 0;
      this.maxPulse = 0;
      this.minPulse = 0;
      return;
    }
    
    const sum = measurements.reduce((total, measurement) => total + measurement.measurement, 0);

    this.averagePulse = +(sum / measurements.length).toFixed(1);
  
    const squaredDifferences = measurements.map(measurement => Math.pow(measurement.measurement - this.averagePulse, 2));

    const variance = squaredDifferences.reduce((total, squaredDifference) => total + squaredDifference, 0) / measurements.length;
  
    this.pulseVariance = parseFloat(Math.sqrt(variance).toFixed(2));
  
    this.maxPulse = Math.max(...measurements.map(measurement => measurement.measurement));
    
    this.minPulse = Math.min(...measurements.map(measurement => measurement.measurement));
  }

  ngAfterViewInit(): void {
  }

  private createChart(): void {
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
              display: false 
            },
          },
          elements: {
            line: {
              tension: 0, 
              borderWidth: 3 
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
