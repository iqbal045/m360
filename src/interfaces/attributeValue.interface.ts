import { Attribute } from './attribute.interface';

export interface AttributeValue {
  id: number; // primary key
  attribute_id: number; // foreign key to id in Attributes table
  value: string;
  created_at: Date;
  updated_at: Date;
  attribute?: Attribute;
}
