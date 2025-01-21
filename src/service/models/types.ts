export interface List {
  id: string;
  created_at: string;
  title: string;
  share_key: string;
  description: string;
  budget: number;
  user_id: string;
  products: Product[];
  owner: Owner;
  shared_with: SharedWith[];
}

export interface Product {
  id: string;
  created_at: string;
  checked: boolean;
  unit: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  list_id: string;
}

export interface Owner {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface SharedWith {
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Session {
  token: string;
  expires_in: number;
}
