export interface ILoginData {
    email: string;
    pwd: string;
}

export interface IClientData {
    name: string
    email: string;
    pro: boolean;
    colors: INamedColor[];
}

export interface ICreateAccount {
    name: string;
    email: string;
    pwd: string;
}

export interface INamedColor {
    name: string;
    hex: string;
}

export interface IIdentifyColor {
    id?: number;
    hex?: string;
    index?: number;
}

export enum ActivePage {
    None,
    Login,
    Main,
    Create
}