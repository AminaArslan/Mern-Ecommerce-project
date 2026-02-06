'use client';
import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaCircle } from 'react-icons/fa';

export default function CategoryTable({ categories, onEdit, onDelete }) {
  if (!categories || categories.length === 0) return (
    <div className="p-8 text-center text-gray-400 text-xs uppercase tracking-widest">
      No categories found.
    </div>
  );

  // Flatten nested structure for easier rendering if needed, 
  // but we are keeping the grouping structure as per plan.

  return (
    <>
      {categories.map((parent) => (
        <React.Fragment key={parent._id}>
          {/* ===== PARENT HEADER ROW ===== */}
          <tr className="bg-gray-50 border-b border-gray-100 group">
            <td colSpan={4} className="py-4 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-serif font-bold text-dark uppercase tracking-wider">
                    {parent.name}
                  </h3>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${parent.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                    {parent.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Parent Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(parent)}
                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-white rounded-sm transition-all"
                    title="Edit Parent Category"
                  >
                    <FiEdit size={14} />
                  </button>
                </div>
              </div>
            </td>
          </tr>

          {/* ===== CHILDREN ROWS ===== */}
          {parent.children && parent.children.length > 0 ? (
            parent.children.map((child) => (
              <tr key={child._id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-b-0">

                <td className="px-6 py-3 pl-10 border-l-4 border-l-transparent hover:border-l-amber-500 transition-all">
                  <p className="text-sm text-gray-600 font-medium">{child.name}</p>
                </td>

                <td className="px-6 py-3 text-xs text-gray-400 uppercase tracking-wider">
                  {parent.name}
                </td>

                <td className="px-6 py-3">
                  <span className={`flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider w-fit border ${child.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                    <FaCircle className="text-[5px]" />
                    {child.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>

                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(child)}
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-sm transition-all cursor-pointer"
                      title="Edit Subcategory"
                    >
                      <FiEdit size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(child._id)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all cursor-pointer"
                      title="Delete Subcategory"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-3 text-[10px] text-gray-300 italic pl-20">
                No subcategories
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
