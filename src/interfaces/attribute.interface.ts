import { AttributeValue } from './attributeValue.interface';

export interface Attribute {
  id: number; // primary key
  name: string;
  created_at: Date;
  updated_at: Date;
  attributeValues?: AttributeValue[];
}
