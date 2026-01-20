'use client';
import Link from 'next/link';

export default function CategoryBoxes() {
  const categories = [
    {
      name: 'Men',
      slug: 'men',
      image: '/mens.jpg', // replace with your image
    },
    {
      name: 'Women',
      slug: 'women',
      image: '/womens.jpg', // replace with your image
    },
    {
      name: 'Kids',
      slug: 'kids',
      image: '/kids.jpg', // replace with your image
    },
  ];

  return (
    <section className="w-full py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">
          Shop by Category
        </h2>

        {/* Category Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => (
            <div key={cat.slug} className="relative group h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition duration-300"></div>
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-4">{cat.name}</h3>
                <Link
                  href={`/category/${cat.slug}`}
                  className="btn-primary text-white px-6 py-2 rounded shadow-lg hover:bg-dark transition"
                >
                  Explore {cat.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}





// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';

// export default function CategoryMenu({ categories = [] }) {
//   // Hardcoded top-level parent categories
//   const parentCategories = [
//     { _id: 'women', name: 'Women', slug: 'women' },
//     { _id: 'men', name: 'Men', slug: 'men' },
//     { _id: 'kids', name: 'Kids', slug: 'kids' },
//   ];

//   const [activeParent, setActiveParent] = useState(null);

//   return (
//     <div className="flex space-x-4 relative">
//       {parentCategories.map((parent) => {
//         const childCategories = categories.filter(
//           (c) => c.parentName === parent.name
//         );

//         return (
//           <div
//             key={parent._id}
//             className="relative"
//             onMouseEnter={() => setActiveParent(parent.name)}
//             onMouseLeave={() => setActiveParent(null)}
//           >
//             {/* Parent category */}
//             <Link
//               href={`/category/${parent.slug}`}
//               className="px-4 py-2 rounded hover:bg-gray-100 font-semibold"
//             >
//               {parent.name}
//             </Link>

//             {/* Dropdown for children */}
//             {childCategories.length > 0 && activeParent === parent.name && (
//               <div className="absolute left-0 mt-2 bg-white shadow-lg border rounded min-w-37.5 z-10">
//                 {childCategories.map((child) => (
//                   <Link
//                     key={child._id}
//                     href={`/category/${child.slug}`}
//                     className="block px-4 py-2 hover:bg-gray-100"
//                   >
//                     {child.name}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
