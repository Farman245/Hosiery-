import React, { createContext, useContext, useState, useEffect } from 'react';
import { Supplier, Product, Order, Delivery, Payment } from './types';
import { db, auth } from './firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

interface StoreContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;

  suppliers: Supplier[];
  products: Product[];
  orders: Order[];
  deliveries: Delivery[];
  payments: Payment[];
  
  addSupplier: (s: Omit<Supplier, 'id' | 'userId'>) => void;
  editSupplier: (id: string, s: Omit<Supplier, 'id' | 'userId'>) => void;
  deleteSupplier: (id: string) => void;

  addProduct: (p: Omit<Product, 'id' | 'userId'>) => void;
  editProduct: (id: string, p: Omit<Product, 'id' | 'userId'>) => void;
  deleteProduct: (id: string) => void;

  addOrder: (o: Omit<Order, 'id' | 'userId'>) => void;
  editOrder: (id: string, o: Omit<Order, 'id' | 'userId'>) => void;
  deleteOrder: (id: string) => void;

  addDelivery: (d: Omit<Delivery, 'id' | 'userId'>) => void;
  editDelivery: (id: string, d: Omit<Delivery, 'id' | 'userId'>) => void;
  deleteDelivery: (id: string) => void;

  addPayment: (p: Omit<Payment, 'id' | 'userId'>) => void;
  editPayment: (id: string, p: Omit<Payment, 'id' | 'userId'>) => void;
  deletePayment: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setSuppliers([]);
      setProducts([]);
      setOrders([]);
      setDeliveries([]);
      setPayments([]);
      return;
    }

    const qSuppliers = query(collection(db, 'suppliers'), where('userId', '==', user.uid));
    const unsubSuppliers = onSnapshot(qSuppliers, (snapshot) => {
      setSuppliers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier)));
    });

    const qProducts = query(collection(db, 'products'), where('userId', '==', user.uid));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });

    const qOrders = query(collection(db, 'orders'), where('userId', '==', user.uid));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    });

    const qDeliveries = query(collection(db, 'deliveries'), where('userId', '==', user.uid));
    const unsubDeliveries = onSnapshot(qDeliveries, (snapshot) => {
      setDeliveries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Delivery)));
    });

    const qPayments = query(collection(db, 'payments'), where('userId', '==', user.uid));
    const unsubPayments = onSnapshot(qPayments, (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment)));
    });

    return () => {
      unsubSuppliers();
      unsubProducts();
      unsubOrders();
      unsubDeliveries();
      unsubPayments();
    };
  }, [user]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleError = (error: unknown, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    alert('An error occurred while saving data. Please try again.');
  };

  // Suppliers
  const addSupplier = async (s: Omit<Supplier, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'suppliers'), { ...s, userId: user.uid });
    } catch (error) { handleError(error, 'create', 'suppliers'); }
  };
  const editSupplier = async (id: string, s: Omit<Supplier, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'suppliers', id), { ...s, userId: user.uid });
    } catch (error) { handleError(error, 'update', `suppliers/${id}`); }
  };
  const deleteSupplier = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'suppliers', id));
    } catch (error) { handleError(error, 'delete', `suppliers/${id}`); }
  };

  // Products
  const addProduct = async (p: Omit<Product, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'products'), { ...p, userId: user.uid });
    } catch (error) { handleError(error, 'create', 'products'); }
  };
  const editProduct = async (id: string, p: Omit<Product, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'products', id), { ...p, userId: user.uid });
    } catch (error) { handleError(error, 'update', `products/${id}`); }
  };
  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) { handleError(error, 'delete', `products/${id}`); }
  };

  // Orders
  const addOrder = async (o: Omit<Order, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'orders'), { ...o, userId: user.uid });
    } catch (error) { handleError(error, 'create', 'orders'); }
  };
  const editOrder = async (id: string, o: Omit<Order, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'orders', id), { ...o, userId: user.uid });
    } catch (error) { handleError(error, 'update', `orders/${id}`); }
  };
  const deleteOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'orders', id));
      // Also delete related deliveries and payments
      deliveries.filter(d => d.orderId === id).forEach(d => deleteDelivery(d.id));
      payments.filter(p => p.orderId === id).forEach(p => deletePayment(p.id));
    } catch (error) { handleError(error, 'delete', `orders/${id}`); }
  };

  // Deliveries
  const addDelivery = async (d: Omit<Delivery, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'deliveries'), { ...d, userId: user.uid });
    } catch (error) { handleError(error, 'create', 'deliveries'); }
  };
  const editDelivery = async (id: string, d: Omit<Delivery, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'deliveries', id), { ...d, userId: user.uid });
    } catch (error) { handleError(error, 'update', `deliveries/${id}`); }
  };
  const deleteDelivery = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'deliveries', id));
    } catch (error) { handleError(error, 'delete', `deliveries/${id}`); }
  };

  // Payments
  const addPayment = async (p: Omit<Payment, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'payments'), { ...p, userId: user.uid });
    } catch (error) { handleError(error, 'create', 'payments'); }
  };
  const editPayment = async (id: string, p: Omit<Payment, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'payments', id), { ...p, userId: user.uid });
    } catch (error) { handleError(error, 'update', `payments/${id}`); }
  };
  const deletePayment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'payments', id));
    } catch (error) { handleError(error, 'delete', `payments/${id}`); }
  };

  return (
    <StoreContext.Provider value={{
      user, loading, login, logout,
      suppliers, products, orders, deliveries, payments,
      addSupplier, editSupplier, deleteSupplier,
      addProduct, editProduct, deleteProduct,
      addOrder, editOrder, deleteOrder,
      addDelivery, editDelivery, deleteDelivery,
      addPayment, editPayment, deletePayment
    }}>
      {children}
    </StoreContext.Provider>
  );
};
