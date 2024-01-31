import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    // Ide írd meg a bejelentkezési logikát (például HTTP hívás stb.)
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    this.router.navigate(['user-home']);
  }

}
