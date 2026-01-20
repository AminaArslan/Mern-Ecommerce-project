// app/admin/layout.jsx
'use client';
import AdminLayout from "@/componenets/admin/adminlayout";

export default function AdminWrapperLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
