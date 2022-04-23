import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { first, take } from 'rxjs/operators';
import { Employee } from '../../core/models/employee.model';
import { EmployeeService } from '../../core/services/employee.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CryptoService } from '../../core/services/crypto.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';  


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  users: User[] = []
  employees: Employee[] = []
  public form: FormGroup;
  constructor(private userService: UserService, 
            private cryptoService: CryptoService,
            private router:Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      user: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      });
  }

  public myError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  async getUser(username: string, password: string){
    const _users = await this.userService.getUsers();
    const users = _users.filter(user => (user.isActive && user.username === username && user.password === password))
                        .map(u => Object.assign({},u));
    return users[0];
  }
  
  async login(){
    const {user, password} = this.form.value;
    const encrypted = this.cryptoService.encrypt(password)
    const userLogged = await this.getUser(user, encrypted);
    if(userLogged){
      if(userLogged.role === "ADMINISTRADOR"){
        this.storeUser(userLogged);
        this.router.navigateByUrl('/admin');
        this.showMessage("success", "Ingreso exitoso");
      }
      if(userLogged.role === "EMPLEADO"){
        this.storeUser(userLogged);
        this.router.navigateByUrl('/employee');
        this.showMessage("success", "Ingreso exitoso");
      }
    }else{
      this.showMessage("error", "Credenciales incorrectas");
    }
  }

  storeUser(user: any){
    localStorage.setItem('user', JSON.stringify(user));
   // this.myItem = localStorage.getItem(this.key);
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
