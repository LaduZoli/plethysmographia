import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  firestore: any;

  constructor(private auth: AngularFirestore) { }

  addUser(uid: string, name: string, email: string): Promise<void> {
    return this.auth.collection('Users').doc(uid).set({
      id: uid, // Az UID-t használjuk
      name: name,
      email: email,
    });
  }

  getUser(uid: string): Observable<any> {
    return this.auth.collection('Users').doc(uid).valueChanges();
  }
  
}
