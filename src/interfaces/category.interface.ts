export interface Category {
  id: number; // primary key
  name: string;
  parent_id: number | null; // foreign key to id in Categories table (nullable)
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
