import { Attribute } from './attribute.interface';
import { Category } from './category.interface';

export interface Product {
  id: number; // primary key
  name: string;
  cat_id: string; // array of foreign keys to id in Categories table
  attribute_id: string; // array of foreign keys to id in Attributes table
  price: number; // decimal
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  categories?: Category;
  attributes?: Attribute;
}
