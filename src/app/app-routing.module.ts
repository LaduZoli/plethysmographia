import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './core/login/login.component';
import { SignupComponent } from './core/signup/signup.component';
import { UserHomeComponent } from './core/user/user-home/user-home.component';
import { AuthGuard } from './service/auth.guard';
import { MeasurementsListComponent } from './core/user/measurements-list/measurements-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component:HomeComponent},
  { path: 'login', component:LoginComponent},
  { path: 'signup', component:SignupComponent},
  { path: 'user-home', component:UserHomeComponent, canActivate: [AuthGuard]},
  { path: 'user-measurements', component:MeasurementsListComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
