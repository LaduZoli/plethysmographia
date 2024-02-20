import { Injectable } from '@angular/core';
import { catchError, from, Observable, throwError  } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth
  ) { }

  login(params: LogIn): Observable<any> {
    return from(this.auth.signInWithEmailAndPassword(
      params.email, params.password
    )).pipe(
      catchError((error: FirebaseError) => 
        throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
      )
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return new Observable((observer) => {
      this.auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Sikeres regisztráció esetén a felhasználó bejelentkeztetése vagy más műveletek
          // Például: felhasználó név beállítása
          userCredential.user?.updateProfile({
            displayName: name
          });
          observer.next(userCredential);
          observer.complete();
        })
        .catch((error) => {
          // Hiba kezelése regisztráció közben
          observer.error(error);
          observer.complete();
        });
    });
  }

  private translateFirebaseErrorMessage({code, message}: FirebaseError) {
    if (code === "auth/user-not-found") {
      return "User not found.";
    }
    if (code === "auth/wrong-password") {
      return "User not found.";
    }
    return message;
  }
}

type LogIn = {
  email: string,
  password: string
}

type FirebaseError = {
  code: string;
  message: string
};
