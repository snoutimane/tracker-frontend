import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCandidateComponent } from './add-candidate/add-candidate.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';


import { LoginComponent } from './login/login.component'; // Import your LoginComponent
import { SearchCandidatesComponent } from './search-candidates/search-candidates.component';
import { SignupComponent } from './signup/signup.component';
import { ViewCandidateComponent } from './view-candidate/view-candidate.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

const routes: Routes = [
  {path: '', component: WelcomePageComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'search',component: SearchCandidatesComponent},
  {path: 'add',component: AddCandidateComponent},
  {path: 'view',component: ViewCandidateComponent},
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
