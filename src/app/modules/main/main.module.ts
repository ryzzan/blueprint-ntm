import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Modules
 */
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from './../../shared/shared.module';

/**
 * Components
 */
import { CompetitionComponent } from './components/competition/competition.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DelegationComponent } from './components/delegation/delegation.component';
import { InstitutionComponent } from './components/institution/institution.component';
import { MainComponent } from './main.component';
import { OccupationComponent } from './components/occupation/occupation.component';
import { ParticipationProfileComponent } from './components/participation-profile/participation-profile.component';
import { ProfileGroupComponent } from './components/profile-group/profile-group.component';
import { TechAreaComponent } from './components/tech-area/tech-area.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    CompetitionComponent, 
    DashboardComponent, 
    DelegationComponent, 
    InstitutionComponent, 
    MainComponent, 
    OccupationComponent, 
    ParticipationProfileComponent, 
    ProfileGroupComponent, 
    TechAreaComponent
  ]
})
export class MainModule { }
