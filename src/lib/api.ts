
import type { Product, Customer, Supplier } from '@/types';
import { mockCustomers } from './mockData'; // Keep mockCustomers for now
import { supabase } from './supabaseClient';

// Simulate API delay - No longer needed for Supabase calls, but kept if other mock functions use it.
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchAllProducts(): Promise<Product[]> {
  // Assumed Supabase column names: id, name, description, category, supplier_id, price, sale_price (TEXT), stock, optimum_stock, image_url
  const { data: rawProducts, error } = await supabase
    .from('Products') // Assuming your table is named 'Products'
    .select('*');

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    throw error; // Or return empty array / handle error as preferred
  }

  if (!rawProducts) {
    return [];
  }

  return rawProducts.map((rawProduct: any) => {
    let salePrice: number | undefined = undefined; // Changed to undefined to match Product type
    if (rawProduct.sale_price && rawProduct.sale_price.trim() !== "") {
        const parsed = parseFloat(rawProduct.sale_price);
        if (!isNaN(parsed)) {
            salePrice = parsed;
        } else {
            console.warn(`Invalid sale_price format for product ID ${rawProduct.id}: ${rawProduct.sale_price}`);
        }
    }

    return {
      id: rawProduct.id, // Assuming 'SKU / Product ID' is 'id'
      name: rawProduct.name,
      description: rawProduct.description,
      category: rawProduct.category,
      price: rawProduct.price, // Assuming 'Regular Price ($) \$' is 'price'
      salePrice: salePrice,
      imageUrl: rawProduct.image_url, // Assuming 'Product Image URL' is 'image_url'
      stock: rawProduct.stock, // Assuming 'Stock Quantity' is 'stock'
      optimumStock: rawProduct.optimum_stock ?? null, // Assuming 'Optimum Stock' is 'optimum_stock'
      supplierId: rawProduct.supplier_id ?? null, // Assuming 'Supplier ID' (FK) is 'supplier_id'
    };
  });
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  const { data: rawProduct, error } = await supabase
    .from('Products')
    .select('*')
    .eq('id', id) // Assuming PK is 'id'
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // PostgREST error for "Searched for one row, but found 0"
        console.warn(`Product with ID ${id} not found in Supabase.`);
        return undefined;
    }
    console.error(`Error fetching product ID ${id} from Supabase:`, error);
    throw error;
  }

  if (!rawProduct) {
    return undefined;
  }
  
  let salePrice: number | undefined = undefined;
    if (rawProduct.sale_price && rawProduct.sale_price.trim() !== "") {
        const parsed = parseFloat(rawProduct.sale_price);
        if (!isNaN(parsed)) {
            salePrice = parsed;
        } else {
            console.warn(`Invalid sale_price format for product ID ${rawProduct.id}: ${rawProduct.sale_price}`);
        }
    }

  return {
    id: rawProduct.id,
    name: rawProduct.name,
    description: rawProduct.description,
    category: rawProduct.category,
    price: rawProduct.price,
    salePrice: salePrice,
    imageUrl: rawProduct.image_url,
    stock: rawProduct.stock,
    optimumStock: rawProduct.optimum_stock ?? null,
    supplierId: rawProduct.supplier_id ?? null,
  };
}

export async function fetchAllCustomers(): Promise<Customer[]> {
  // await delay(400); // Keep using mock data for customers for now
  return mockCustomers;
}

export async function fetchCustomerById(id: string): Promise<Customer | undefined> {
  // await delay(250); // Keep using mock data for customers for now
  return mockCustomers.find(customer => customer.id === id);
}

export async function fetchAllSuppliers(): Promise<Supplier[]> {
  // Assumed Supabase column names for Suppliers: id, name, contact_person, email, phone, 
  // address_street, address_city, address_state, address_zip, notes
  const { data: rawSuppliers, error } = await supabase
    .from('Suppliers') // Assuming your table is named 'Suppliers'
    .select('*');

  if (error) {
    console.error('Error fetching suppliers from Supabase:', error);
    throw error;
  }

  if (!rawSuppliers) {
    return [];
  }

  return rawSuppliers.map((rawSupplier: any) => ({
    id: rawSupplier.id, // Assuming 'Supplier ID' is 'id'
    name: rawSupplier.name,
    contactPerson: rawSupplier.contact_person ?? null,
    email: rawSupplier.email,
    phone: rawSupplier.phone ?? null,
    address: (rawSupplier.address_street && rawSupplier.address_city && rawSupplier.address_state && rawSupplier.address_zip) ? {
      street: rawSupplier.address_street,
      city: rawSupplier.address_city,
      state: rawSupplier.address_state,
      zip: rawSupplier.address_zip,
    } : null,
    notes: rawSupplier.notes ?? null,
  }));
}

export async function fetchSupplierById(id: string): Promise<Supplier | undefined> {
  const { data: rawSupplier, error } = await supabase
    .from('Suppliers')
    .select('*')
    .eq('id', id) // Assuming PK is 'id'
    .single();
  
  if (error) {
     if (error.code === 'PGRST116') { 
        console.warn(`Supplier with ID ${id} not found in Supabase.`);
        return undefined;
    }
    console.error(`Error fetching supplier ID ${id} from Supabase:`, error);
    throw error;
  }

  if (!rawSupplier) {
    return undefined;
  }

  return {
    id: rawSupplier.id,
    name: rawSupplier.name,
    contactPerson: rawSupplier.contact_person ?? null,
    email: rawSupplier.email,
    phone: rawSupplier.phone ?? null,
    address: (rawSupplier.address_street && rawSupplier.address_city && rawSupplier.address_state && rawSupplier.address_zip) ? {
      street: rawSupplier.address_street,
      city: rawSupplier.address_city,
      state: rawSupplier.address_state,
      zip: rawSupplier.address_zip,
    } : null,
    notes: rawSupplier.notes ?? null,
  };
}
