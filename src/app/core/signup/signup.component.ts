import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { SharedService } from '../../service/shared.service';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  
  hide = true;
  hide1 = true;
  registerForm!: FormGroup;
  isRegistering = false;
  registerError = false;
  
  constructor(
    private router: Router, 
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.sharedService.toggleSidenavVisibility(false); 
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')!.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')!.setErrors(null);
    }
  }

  register() {
    this.isRegistering = true;
    this.registerError = false;
  
    this.authService.register(
      this.registerForm.value.name,
      this.registerForm.value.email,
      this.registerForm.value.password
    ).subscribe((userData: any) => {
      const userUid = userData.user.uid; // Firebase Authentication által visszaadott UID
      const userName = this.registerForm.value.name;
      const userEmail = this.registerForm.value.email;
  
      // Most létrehozhatod a felhasználó dokumentumot a Firestore-ban
      this.userService.addUser(userUid, userName, userEmail)
        .then(() => {
          this.router.navigate(['login']);
        })
        .catch(error => {
          console.error('Failed to add user to database:', error);
          this.isRegistering = false;
          this.registerError = true;
        });
    },
    (error) => {
      console.error('Registration failed:', error);
      this.isRegistering = false;
      this.registerError = true;
    });
  }
}
