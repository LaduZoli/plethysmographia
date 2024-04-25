import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CoreComponent } from './core/core.component';
import { HomeComponent } from './core/home/home.component';
import { FooterComponent } from './sharepage/footer/footer.component';
import { NavbarComponent } from './sharepage/navbar/navbar.component';
import { LoginComponent } from './core/login/login.component';
import { MaterialModule } from './material-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SidenavComponent } from './sharepage/sidenav/sidenav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { UserHomeComponent } from './core/user/user-home/user-home.component';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './core/signup/signup.component';
import { SharedService } from './service/shared.service';
import { AngularFireModule } from '@angular/fire/compat'; 
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; 
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; 
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { CalendarModule, DateAdapter } from 'angular-calendar'; // Importáld be a CalendarModule-t
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'; // Importálja be a date adapter factory-t
import { MeasurementsListComponent } from './core/user/measurements-list/measurements-list.component'
import { MatSortModule } from '@angular/material/sort';
import { ExportAsModule } from 'ngx-export-as';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    CoreComponent,
    HomeComponent,
    FooterComponent,
    NavbarComponent,
    LoginComponent,
    SidenavComponent,
    UserHomeComponent,
    SignupComponent,
    MeasurementsListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MaterialModule,
    HttpClientModule,
    LayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BaseChartDirective,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    MatSortModule,
    ExportAsModule
  ],
  exports: [RouterModule],
  providers: [SharedService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
function provideFirebaseApp(arg0: () => import("@firebase/app").FirebaseApp): any[] | import("@angular/core").Type<any> | import("@angular/core").ModuleWithProviders<{}> {
  throw new Error('Function not implemented.');
}

function provideAuth(arg0: () => any): any[] | import("@angular/core").Type<any> | import("@angular/core").ModuleWithProviders<{}> {
  throw new Error('Function not implemented.');
}

function getAuth(): any {
  throw new Error('Function not implemented.');
}

