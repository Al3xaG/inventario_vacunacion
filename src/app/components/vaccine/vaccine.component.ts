import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { EmployeeService } from '../../core/services/employee.service';
import { User } from '../../core/models/user.model';
import { Employee } from '../../core/models/employee.model';
import { Vaccine } from '../../core/models/vaccine.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Component({
  selector: 'app-vaccine',
  templateUrl: './vaccine.component.html',
  styleUrls: ['./vaccine.component.scss']
})
export class VaccineComponent implements OnInit {
  public form: FormGroup;
  vaccine: any;
  vaccineType: any;
  vaccineDoses: any;
  isVaccined: boolean;
  isNotVaccined: boolean = false;
  myItem: any;
  user: User;
  employee: Employee;
  selectedVaccine: string;
  selectedDoses: string;
  fullName: string;
  identityNumber: string;
  email: string;
  birthday: string;
  dateVaccine: Date;
  dateBorn: Date;
  disableSelect: boolean = false;
  constructor(private userService: UserService, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    
    this.form = new FormGroup({
      address: new FormControl('', [Validators.required, Validators.maxLength(35)]),
      phone: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      picker: new FormControl(new Date(),[ Validators.required]),
      picker2: new FormControl(new Date(),[ Validators.required]),
      });

      this.initInformation();

      
  }

  async initInformation(){
    this.myItem = JSON.parse(localStorage.getItem('user'));
    await this.getUser(this.myItem.id);
    setTimeout(() => {
      this.form.controls['address'].setValue(this.employee.address);
      this.form.controls['phone'].setValue(this.employee.cellphone);
      this.isVaccined = this.employee.isVaccinated;
      this.isNotVaccined = !this.employee.isVaccinated;
      this.selectedVaccine = this.employee.vaccine.vaccineType;
      this.selectedDoses = this.employee.vaccine.dosesNumber.toString();
      this.fullName = `${this.user.name} ${this.user.lastname}`;
      this.email = this.user.email;
      this.identityNumber = this.user.identityNumber;
      this.birthday = this.employee.birthday;
      this.dateVaccine = this.employee.vaccine.date ? new Date(this.employee.vaccine.date) : new Date();
      this.form.controls['picker'].setValue(this.dateVaccine);
      this.dateBorn = this.employee.birthday ? new Date(this.employee.birthday) : new Date();
      this.form.controls['picker2'].setValue(this.dateBorn);
    }, 1000)
  }

  selectVaccine(event: any){
    if(event === "vaccine") {
      this.isVaccined = true;
      this.disableSelect = false;
    }
    else {
      this.isVaccined = false;
      this.disableSelect = true;
    }
  }

  selectVaccineType(event: any){
    this.selectedVaccine = event;
  }

  selectVaccineDoses(event: any){
   this.selectedDoses = event;
  }

  async registerVaccine(){
    const { picker, picker2, address, phone } = this.form.value;
    const dateVaccine = this.formatDate(picker);
    const dateOfBirth = this.formatDate(picker2);
    let vaccine: Vaccine = {
        date: dateVaccine,
        dosesNumber: Number(this.selectedDoses),
        status:this.isVaccined,
        vaccineType: this.selectedVaccine
    }
    if(!this.isVaccined){
      vaccine = {
        date: "",
        dosesNumber: 0,
        status:this.isVaccined,
        vaccineType: ""
    }
    }
    const emp: Employee = {
      id: this.employee.id,
      userId: this.employee.userId,
      birthday: dateOfBirth,
      address,
      cellphone: phone,
      isActive: true,
      isVaccinated: this.isVaccined,
      vaccine
    }
    await this.employeeService.updateEmployee(emp);
    this.showMessage("success", "Vacuna registrada exitosamente");
    await this.initInformation();
  }

  async getUser(id: string){
    const user = await this.userService.getUserById(id);
    const _employees = await this.employeeService.getEmployees();
    const employee = _employees.filter(emp => (emp.userId === id)).map(u => Object.assign({},u))[0];
    this.user =user;
    this.employee = employee;
  }

  padTo2Digits(num: any) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date: Date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
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
