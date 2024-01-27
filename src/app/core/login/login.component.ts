import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  login() {
    // Ide írd meg a bejelentkezési logikát (például HTTP hívás stb.)
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }

}
