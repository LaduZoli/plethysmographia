import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import { SharedService } from '../../service/shared.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  hide = true;
  form!: FormGroup;
  isLoggingIn = false;
  loginError = false;

  constructor(
    private router: Router, 
    private sharedService: SharedService, 
    private formBuilder: FormBuilder,
    private authService: AuthService,
    ) { }

  ngOnInit(): void {
    this.sharedService.toggleSidenavVisibility(false); 
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    this.isLoggingIn = true;
    this.loginError = false;

    this.authService.login({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe(() => {
      this.router.navigate(['user-home']);
    },
    (error) => {
      console.error('Authentication failed:', error);
      this.isLoggingIn = false;
      this.loginError = true; 
    });
  }
}
