import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: AngularFirestore) { }

  addUser(name: string, email: string): Promise<void> {
    const id = this.auth.createId();
    
    return this.auth.collection('Users').doc(id).set({
      id: id,
      name: name,
      email: email,
    });
  }
}
