import { Vaccine } from './vaccine.model';

export interface Employee{
    id: string,
    userId: string;
    birthday: string,
    cellphone: string,
    address: string,
    isActive: boolean,
    isVaccinated: boolean,
    vaccine: Vaccine
}