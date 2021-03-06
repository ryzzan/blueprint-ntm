import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatChipsModule, MatNativeDateModule, MatCardModule, MatDialogModule, MatSelectModule, MatCheckboxModule,
  MatInputModule,MatSnackBarModule, MatIconModule, MatButtonModule, MatSlideToggleModule,MatToolbarModule, MatProgressBarModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';

import 'hammerjs';

/**
 * Components
 */
import { CountdownComponent } from './components/countdown/countdown.component';
import { DeleteConfirmComponent } from './components/delete-confirm/delete-confirm.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MenuSidenavComponent } from './components/menu-sidenav/menu-sidenav.component';
import { TableDataComponent } from './components/table-data/table-data.component';
import { ScheduleComponent } from './components/schedule/schedule.component';

/**
 * Guards
 */
import { AuthGuard } from './guards/auth.guard';

/**
 * Modules
 */
import { TextMaskModule } from 'angular2-text-mask';

/**
 * Services
 */
import { AuthenticationService } from './services/laravel/authentication.service';
import { CrudService } from './services/laravel/crud.service';
import { MainService } from './../modules/main/main.service';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatToolbarModule,
    ReactiveFormsModule,
    TextMaskModule
  ],
  exports:[
    CountdownComponent,
    DeleteConfirmComponent,
    LoginComponent,
    LogoutComponent,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatButtonModule,
    MenuSidenavComponent,
    MatSlideToggleModule,
    MatToolbarModule,
    ScheduleComponent,
    TableDataComponent,
    TextMaskModule
  ],
  declarations: [
    CountdownComponent,
    DeleteConfirmComponent,
    LoginComponent,
    LogoutComponent,
    MenuSidenavComponent,
    TableDataComponent,
    ScheduleComponent
  ],
  providers: [
    AuthenticationService,
    AuthGuard,
    CrudService,
    MainService
  ],
  entryComponents: [
    DeleteConfirmComponent
  ]
})
export class SharedModule { }
