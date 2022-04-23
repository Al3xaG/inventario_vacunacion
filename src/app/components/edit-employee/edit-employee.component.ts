import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { UserService } from '../../core/services/user.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';  


@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  public form: FormGroup; 
  public id: string;
  user: User;
  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]),
      identityNumber: new FormControl('', [Validators.required, Validators.maxLength(10),Validators.minLength(10), Validators.pattern('^[0-9 ]+$')]),
      email: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.email]),
      });
      this.id = this.route.snapshot.paramMap.get('id');
      this.getUsers();
      this.getInfo();
  }

  public myError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  async save(){
    try {
      const { name, lastname, identityNumber, email } = this.form.value;
    const user: User = {
      id: this.id,
      email,
      name,
      lastname,
      identityNumber,
      isActive: true,
      password: this.user.password,
      role: this.user.role,
      username: this.user.username
    }
    await this.userService.updateUser(user);
    this.showMessage("success", "Empleado actualizado exitosamente");
    await this.getUsers();
    this.getInfo();
    } catch (error) {
      this.showMessage("error", "Error al actualizar");
    }
    
  }
  async getUsers(){
    const _users = await this.userService.getUsers();
    const user = _users.filter(user => (user.isActive && user.role === "EMPLEADO" && user.id === this.id)).map(u => Object.assign({},u))[0];
    this.user = user;
  }

  getInfo(){
    setTimeout(() => {
      this.form.controls['name'].setValue(this.user.name);
      this.form.controls['lastname'].setValue(this.user.lastname);
      this.form.controls['identityNumber'].setValue(this.user.identityNumber);
      this.form.controls['email'].setValue(this.user.email);
    }, 1000)
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
