import { Component, OnInit } from '@angular/core';
import { User } from '../../core/models/user.model';
import { take } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { filterIsVaccinated } from './filters';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  displayedColumns: string[] = ['name', 'lastname', 'identityNumber', 'email','isVaccinated','vaccineType','dosesNumber','dateVaccine', 'tools'];
  dataSource: any[] = [];
  isVaccinateFilter: any;
  typeVaccine: any;

  constructor(private userService: UserService, 
            private employeeService: EmployeeService,
            private router:Router) { }

  ngOnInit(): void {
      this.getDataSource();
  }

  async getUsers(){
    const _users = await this.userService.getUsers();
    const users = _users.filter(user => (user.isActive && user.role === "EMPLEADO")).map(u => Object.assign({},u));
    console.log(users);
    return users;
  }

  async getEmployees(){
    const _employees = await this.employeeService.getEmployees();
    const employees = _employees.filter(emp => (emp.isActive)).map(u => Object.assign({},u));
    console.log(employees);
    return employees;
  }

  async getDataSource(){
    const users = await this.getUsers();
    const employees = await this.getEmployees();
    const list = [];
    users.forEach((usr) => {
        employees.forEach((emp) => {
            if(emp.userId === usr.id){
              console.log("debug");
              const {name, lastname, email, identityNumber, id, password, isActive,
                role,
                username} = usr;
              const {isVaccinated, vaccine, birthday, cellphone, address, id: empId} = emp;
              const employeeInfo = {
                name, lastname, email, identityNumber, userId: id,
                isVaccinated, vaccine,  birthday, cellphone, address, empId, password, isActive,
                role, username
              }
              list.push(employeeInfo);
            }
        });
    });
    this.dataSource = list;
    console.log(this.dataSource);
  }

  async selectIsVaccinated(event: any){
    console.log(this.isVaccinateFilter);
    this.isVaccinateFilter = event;
    await this.getDataSource();
    const list = filterIsVaccinated(this.isVaccinateFilter,this.typeVaccine, this.dataSource);
    this.dataSource = list;
    }
  
  async selectVaccine(event: any){
      console.log(event);
      this.typeVaccine = event;
      await this.getDataSource();
      const list = filterIsVaccinated(this.isVaccinateFilter,this.typeVaccine, this.dataSource);
      this.dataSource = list;
    }
  
    addEmployee(){
      this.router.navigateByUrl('/register-employee');
    }

    async deleteEmployee(userElement: any){
      try {
        const {
          name, lastname, email, identityNumber, userId, password, isActive,
          role, username, isVaccinated, vaccine,  birthday, cellphone, address, empId
        } = userElement
        const user: User ={
          id: userId, email, password, identityNumber, lastname, name, isActive, role, username
        }
        const employee: Employee = {
          isVaccinated, vaccine,  birthday, cellphone, address, id: empId, userId,isActive
        }
        await this.userService.deleteUser(user)
        await this.employeeService.deleteEmployee(employee);
        this.showMessage("success", "Usuario eliminado exitosamente");
        await this.getDataSource();
      } catch (error) {
        console.error(error);
        this.showMessage("error", "No se ha podido eliminar");
      }
    }

    async editEmployee(userElement: any){
      this.router.navigateByUrl(`/edit-employee/${userElement.userId}`);
    }

    showMessage(icon: string, msg: string){
      Swal.fire({  
        position: 'center',  
        icon: icon,  
        title: msg,  
        showConfirmButton: false,  
        timer: 1500  
      })  
    }
  }
