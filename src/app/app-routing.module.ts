import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { LoginComponent } from './components/login/login.component';
import { VaccineComponent } from './components/vaccine/vaccine.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthAdminGuard } from './core/guards/auth-admin.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'edit-employee', component: EditEmployeeComponent, canActivate: [AuthAdminGuard]},
  { path: 'edit-employee/:id', component: EditEmployeeComponent, canActivate: [AuthAdminGuard]},
  { path: 'register-employee', component: EmployeeComponent, canActivate: [AuthAdminGuard]},
  { path: 'employee', component: VaccineComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

