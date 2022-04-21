export interface ILoginData {
    email: string;
    pwd: string;
}

export interface IClientData {
    name: string
    email: string;
    pro: boolean;
    hex: string;
}

export interface ICreateAccount {
    name: string;
    email: string;
    pwd: string;
}

export enum ActivePage {
    None,
    Login,
    Main,
    Create
}