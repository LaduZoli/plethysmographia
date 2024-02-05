import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { SharedService } from '../../service/shared.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  password: string = '';
  hide = true;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.toggleSidenavVisibility(false); 
  }

  login() {
    // Ide írd meg a bejelentkezési logikát (például HTTP hívás stb.)
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    this.router.navigate(['user-home']);
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

}
