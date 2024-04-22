import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, parse } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {

  constructor(private auth: AngularFirestore) { }

  getMeasurementsByUserId(userId: string): Observable<any[]> {
    return this.auth.collection('Measurements', ref => ref.where('userId', '==', userId))
      .valueChanges();
  }

  getTodaysMeasurements(userId: string): Observable<any[]> {
    const todayStart = startOfDay(new Date()); // Mai nap kezdete
    const todayEnd = endOfDay(new Date()); // Mai nap vége
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
    const weekStart = startOfWeek(new Date()); // A jelenlegi hét kezdete
    const weekEnd = endOfWeek(new Date()); // A jelenlegi hét vége
    return this.auth.collection('Measurements', ref => ref
        .where('userId', '==', userId)
        .where('timestamp', '>=', weekStart)
        .where('timestamp', '<=', weekEnd))
      .valueChanges()
      .pipe();
  }

  // Az összes mérési adat lekérése
  getAllMeasurements(userId: string): Observable<any[]> {
    return this.auth.collection('Measurements', ref => ref.where('userId', '==', userId))
      .valueChanges()
      .pipe();
  }
}
