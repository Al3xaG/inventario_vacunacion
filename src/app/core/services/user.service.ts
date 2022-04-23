import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUserURL = `${environment.apiURL}/users`

  constructor(private http:HttpClient) { }

  getUsers(): Promise<User[]>{
    return this.http.get<User[]>(this.apiUserURL).toPromise();
  }

  getURLUsersById(id: string): string{
    const url = `${this.apiUserURL}/${id}`;
    return url;
  }

  getUserById(userId: string): Promise<User>{
    return this.http.get<User>(this.getURLUsersById(userId)).toPromise();
  }

  deleteUser(user: User): Promise<User>{
    return this.http.put<User>(this.getURLUsersById(user.id), 
                                {...user, isActive: false}, 
                                  httpOptions).toPromise();
  }

  updateUser(user: User): Promise<User>{
    return this.http.put<User>(this.getURLUsersById(user.id), 
                                user, 
                                httpOptions).toPromise();
  }

  createUser(user: User): Promise<User>{
    return this.http.post<User>(this.apiUserURL, 
                                user, 
                                httpOptions).toPromise();
  }
}
