export namespace IDatabase {
    export interface Accounts {
        ID: number;
        Name: string;
        Email: string;
        Password: string;
        Pro: number; // Boolean
        Hex: string; // Last hex code
    }
}