import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, throwError  } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService
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
          const userUid = userCredential.user?.uid; // Firebase Authentication által visszaadott UID
          if (userUid) { // Ellenőrizzük, hogy userUid nem undefined
            // Sikeres regisztráció esetén a felhasználó bejelentkeztetése vagy más műveletek
            // Például: felhasználó név beállítása
            userCredential.user?.updateProfile({
              displayName: name
            }).then(() => {
              // Felhasználó regisztrálása a Firestore-ban
              this.userService.addUser(userUid, name, email)
                .then(() => {
                  observer.next(userCredential);
                  observer.complete();
                })
                .catch((error) => {
                  observer.error(error);
                  observer.complete();
                });
            }).catch((error) => {
              observer.error(error);
              observer.complete();
            });
          } else {
            observer.error("A felhasználó azonosítója nem érvényes.");
            observer.complete();
          }
        })
        .catch((error) => {
          // Hiba kezelése regisztráció közben
          observer.error(error);
          observer.complete();
        });
    });
  }
  

  isLoggedIn() {
    return this.auth.authState.pipe(map(user => !!user));
  }

  logout() {
    return this.auth.signOut();
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
