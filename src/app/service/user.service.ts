import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: AngularFirestore) { }

  addUser(uid: string, name: string, email: string): Promise<void> {
    return this.auth.collection('Users').doc(uid).set({
      id: uid, // Az UID-t használjuk
      name: name,
      email: email,
    });
  }
  
}
