import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

const routes: Routes = [{
  path: '', component: MainComponent, children: [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, { 
    path: 'dashboard', 
    component: DashboardComponent 
  }, {
    path: 'competition',
    component: CompetitionComponent
  }, {
    path: 'delegation',
    component: DelegationComponent
  }, {
    path: 'tech-area',
    component: TechAreaComponent
  }, {
    path: 'institution',
    component: InstitutionComponent
  }, {
    path: 'occupation',
    component: OccupationComponent
  }, {
    path: 'profile-group',
    component: ProfileGroupComponent
  }, {
    path: 'participation-profile',
    component: ParticipationProfileComponent
  }, {
    path: 'competition/:id',
    component: CompetitionComponent
  }, {
    path: 'delegation/:id',
    component: DelegationComponent
  }, {
    path: 'tech-area/:id',
    component: TechAreaComponent
  }, {
    path: 'institution/:id',
    component: InstitutionComponent
  }, {
    path: 'occupation/:id',
    component: OccupationComponent
  }, {
    path: 'profile-group/:id',
    component: ProfileGroupComponent
  }, {
    path: 'partiticpation-profile/:id',
    component: ParticipationProfileComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
