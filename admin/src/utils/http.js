import { QueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export const queryClient = new QueryClient();

export async function createProduct(formData) {
  try {
    const { data } = await api.post("/admin/products", formData);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllProducts() {
  try {
    const { data } = await api.get("/admin/products");

    if (!Array.isArray(data)) {
      console.error("Products response not array:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("getAllProducts error:", error.response?.data || error);
    return [];
  }
}

export async function updateProduct({ id, formData }) {
  try {
    const { data } = await api.put(`/admin/products/${id}`, formData);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProduct(id) {
  try {
    const { data } = await api.delete(`/admin/products/${id}`);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllCustomers() {
  try {
    const { data } = await api.get("/admin/customers");
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getDashboardStats() {
  try {
    const { data } = await api.get("/admin/stats");
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllOrders() {
  try {
    const { data } = await api.get("/admin/orders");
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateOrderStatus({ orderId, status }) {
  try {
    const { data } = await api.patch(`/admin/orders/${orderId}/status`, {
      status,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
}
