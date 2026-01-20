'use client';
import React from 'react';

export default function CategoryTable({ categories, onEdit, onDelete }) {
  if (!categories || categories.length === 0) return null;

  // Flatten nested
  const flatten = (cats, result = []) => {
    cats.forEach((cat) => {
      result.push(cat);
      if (cat.children?.length) flatten(cat.children, result);
    });
    return result;
  };

  const flat = flatten(categories);

  return (
    <>
      {categories.map((parent) => (
        <React.Fragment key={parent._id}>
          {/* ===== PARENT HEADER ===== */}
          <tr className="bg-primary/10">
            <td
              colSpan={4}
              className="text-center font-extrabold text-xl py-3 uppercase tracking-wide text-dark"
            >
              {parent.name}
            </td>
          </tr>

          {/* ===== CHILDREN ===== */}
          {flat
            .filter((c) => c.parentId === parent._id)
            .map((child) => (
              <tr key={child._id} className="hover:bg-primary/20 transition-all">
                <td className="border px-4 py-2 pl-6 text-dark">{child.name}</td>

                <td className="border px-4 py-2 text-dark">{parent.name}</td>

                <td className="border px-4 py-2 ">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold  ${
                      child.isActive ? 'bg-accent/20 text-accent' : 'bg-dark/20 text-dark'
                    }`}
                  >
                    {child.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td className="border px-4 py-2 flex gap-2">
                  <button
                    onClick={() => onEdit(child)}
                    className="bg-accent text-light px-3 py-1 rounded hover:bg-dark transition hover:scale-105 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(child._id)}
                    className="bg-dark text-light px-3 py-1 rounded hover:bg-deep transition hover:scale-105 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </React.Fragment>
      ))}
    </>
  );
}
