import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, parse, startOfHour, endOfHour, startOfMonth, endOfMonth } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  timestamp: Date | undefined;
  measurement: number | undefined;

  constructor(private auth: AngularFirestore) { }

  private adjustTimestamp(timestamp: Date): Date {
    return new Date(timestamp.getTime() - (2 * 60 * 60 * 1000));
  }

  getMeasurementsByUserId(userId: string): Observable<any[]> {
    return this.auth.collection('Measurements', ref => ref.where('userId', '==', userId))
      .valueChanges()
      .pipe(
        map((measurements: any[]) => measurements.map(measurement => ({
          ...measurement,
          timestamp: this.adjustTimestamp(new Date(measurement.timestamp.seconds * 1000))
        })))
      );
  }

  getMeasurementsForCurrentHour(userId: string): Observable<any[]> {
    const currentHourStart = startOfHour(new Date()); 
    const currentHourEnd = endOfHour(new Date()); 
    
    const currentHourStartAdjusted = new Date(currentHourStart.getTime() + (2 * 60 * 60 * 1000));
    const currentHourEndAdjusted = new Date(currentHourEnd.getTime() + (2 * 60 * 60 * 1000));
    
    return this.auth.collection('Measurements', ref => ref
        .where('userId', '==', userId)
        .where('timestamp', '>=', currentHourStartAdjusted)
        .where('timestamp', '<=', currentHourEndAdjusted))
      .valueChanges()
      .pipe(
        tap(measurements => console.log('Measurements for current hour:', measurements))
      );
  }

  getTodaysMeasurements(userId: string): Observable<any[]> {
    const todayStart = startOfDay(new Date()); 
    const todayEnd = endOfDay(new Date()); 
    return this.auth.collection('Measurements', ref => ref
        .where('userId', '==', userId)
        .where('timestamp', '>=', todayStart)
        .where('timestamp', '<=', todayEnd))
      .valueChanges()
      .pipe(
        tap(measurements => console.log('Todays measurements:', measurements))
      );
  }
  
  getWeeklyMeasurements(userId: string): Observable<any[]> {
    const weekStart = startOfWeek(new Date()); 
    const weekEnd = endOfWeek(new Date()); 
    return this.auth.collection('Measurements', ref => ref
        .where('userId', '==', userId)
        .where('timestamp', '>=', weekStart)
        .where('timestamp', '<=', weekEnd))
      .valueChanges()
      .pipe();
  }

  getMeasurementsForCurrenttMonth(userId: string): Observable<any[]> {
    const currentHourStart = startOfMonth(new Date()); 
    const currentHourEnd = endOfMonth(new Date()); 
    return this.auth.collection('Measurements', ref => ref
        .where('userId', '==', userId)
        .where('timestamp', '>=', currentHourStart)
        .where('timestamp', '<=', currentHourEnd))
      .valueChanges()
      .pipe(
        tap(measurements => console.log('Measurements for current hour:', measurements))
      );
  }

  getAllMeasurements(userId: string): Observable<any[]> {
    return this.auth.collection('Measurements', ref => ref.where('userId', '==', userId))
      .valueChanges()
      .pipe();
  }
}
