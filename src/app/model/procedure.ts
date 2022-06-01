import { Question } from "./question";

export interface Procedure {
    procedureID: number;
    procedureName: string;
    description: string;
    category: string;
    subCategory: string;
    type: string;
    subType: string;
    cost: string;
    city: string;
    dateCreated: string;
    question: Question[]
}
