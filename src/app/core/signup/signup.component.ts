import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { SharedService } from '../../service/shared.service';
import { AuthService } from 'src/app/service/auth.service';

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
    private authService: AuthService
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
    ).subscribe(() => {
      // Sikeres regisztráció esetén további műveletek (pl. átirányítás)
      this.router.navigate(['login']);
    },
    (error) => {
      console.error('Registration failed:', error);
      this.isRegistering = false;
      this.registerError = true;
    });
  }
}
