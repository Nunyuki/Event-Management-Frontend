import { Category } from './category';

export interface Post {
    id: string;
    title: string;
    content: string;
    createdDate: Date;
    category: Category;
}