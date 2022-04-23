import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiEmployeeURL = `${environment.apiURL}/employees`

  constructor(private http:HttpClient) { }

  getEmployees(): Promise<Employee[]>{
    return this.http.get<Employee[]>(this.apiEmployeeURL).toPromise();
  }

  getURLEmployeesById(id: string): string{
    const url = `${this.apiEmployeeURL}/${id}`;
    return url;
  }

  getEmployeeById(employee: Employee): Observable<Employee>{
    return this.http.get<Employee>(this.getURLEmployeesById(employee.id));
  }

  deleteEmployee(employee: Employee): Promise<Employee>{
    return this.http.put<Employee>(this.getURLEmployeesById(employee.id), 
                                {...employee, isActive: false}, 
                                  httpOptions).toPromise();
  }

  updateEmployee(employee: Employee): Promise<Employee>{
    return this.http.put<Employee>(this.getURLEmployeesById(employee.id), 
                                employee, 
                                httpOptions).toPromise();
  }

  createEmployee(employee: Employee): Promise<Employee>{
    return this.http.post<Employee>(this.apiEmployeeURL, 
                                employee, 
                                httpOptions).toPromise();
  }
}
