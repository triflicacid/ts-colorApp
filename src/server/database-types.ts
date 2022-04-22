export namespace IDatabase {
    export interface Accounts {
        ID: number;
        Name: string;
        Email: string;
        Password: string;
        Pro: number; // Boolean
    }

    export interface Colors {
        ID: number;
        AccountID: number;
        PaletteID: number | null;
        Name: string;
        Hex: string;
    }
}