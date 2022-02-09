import { Clients } from "./clients";

export interface User {
    id: number;
    clientname: string;
    username: string;
    fullname: string;
    msisdn: string;
    emailaddress: string;
    canaccessui: string;
    passwordstatus: string;
    idnumber: string;
    active: string;
    client: Clients;
}