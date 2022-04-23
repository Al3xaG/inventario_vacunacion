import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';  
import { CryptoService } from '../../core/services/crypto.service';
import { Employee } from '../../core/models/employee.model';
import { Vaccine } from '../../core/models/vaccine.model';
import { EmployeeService } from '../../core/services/employee.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  public form: FormGroup;
  constructor(private userService: UserService,
               private cryptoService: CryptoService,  
               private employeeService: EmployeeService,
               private router:Router) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]),
      identityNumber: new FormControl('', [Validators.required, Validators.maxLength(10),Validators.minLength(10), Validators.pattern('^[0-9 ]+$')]),
      email: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.email]),
      });
  }

  public myError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  async save(){
    const {email, name, lastname, identityNumber} = this.form.value;
    const id = uuidv4();
    const employeeId = uuidv4();
    const password = this.cryptoService.encrypt(identityNumber);
    const users = await this.getUsers(identityNumber);
    if(users.length > 0){
      this.showMessage('error', 'Usuario ya existe')
    } else {
      const newUser: User = {
        email,
        name,
        lastname,
        identityNumber,
        id,
        password,
        username: identityNumber,
        isActive: true,
        role: "EMPLEADO"
      }
      const emptyVaccine: Vaccine = {
        date: '',
        dosesNumber:0,
        status: false,
        vaccineType: ''
      }
      const newEmployee: Employee ={
        userId: id,
        id: employeeId,
        birthday: '',
        address: '',
        cellphone: '',
        isActive: true,
        isVaccinated: false,
        vaccine: emptyVaccine
      }
      await this.userService.createUser(newUser);
      await this.employeeService.createEmployee(newEmployee);
      this.showMessage("success", "Empleado creado exitosamente");
      this.router.navigateByUrl('/admin');
    }
  }

  async getUsers(identityNumber: string){
    const _users = await this.userService.getUsers();
    const users = _users.filter(user => (user.isActive && user.identityNumber === identityNumber)).map(u => Object.assign({},u));
    return users;
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
