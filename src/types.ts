export interface Supplier {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  category: string;
  rate: number;
}

export interface Order {
  id: string;
  userId: string;
  supplierId: string;
  productId: string;
  totalQuantity: number;
  rate: number;
  date: string;
}

export interface Delivery {
  id: string;
  userId: string;
  orderId: string;
  quantity: number;
  date: string;
  note: string;
}

export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  date: string;
  note: string;
}
