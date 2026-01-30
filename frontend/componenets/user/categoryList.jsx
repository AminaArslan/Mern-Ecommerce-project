'use client';
import Link from 'next/link';

export default function CategoryBoxes() {
  const categories = [
    { name: 'Men', slug: 'men', image: '/category/mens.jpg' },
    { name: 'Women', slug: 'women', image: '/category/womens.jpg' },
    { name: 'Kids', slug: 'kids', image: '/category/kids.jpg' },
  ];

  return (
    <section className="w-full py-12 lg:py-26">
      <div className="container mx-auto px-4">
        <div className='mb-14 flex flex-col justify-center items-center'> 
        <span className=" font-medium text-base mb-6 text-gray-600 relative group inline-block cursor-pointer uppercase underline underline-offset-4">
          Shop by categories
        </span>
        <h1 className=' font-normal text-center lg:text-4xl md:text-3xl sm:text-2xl text-xl'>
   Elevated essentials and statement<br className='hidden sm:flex'/> styles for modern living.
        </h1>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="relative group h-64 md:h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500"
            >
              <div className="absolute inset-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/20 group-hover:from-black/50 group-hover:via-black/20 group-hover:to-black/10 transition duration-500" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
                <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-4 transition-transform duration-500 group-hover:scale-105">
                  {cat.name}
                </h3>
                <Link
                  href={`/category/${cat.slug}`}
                  className="inline-block bg-accent text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-accent/90 hover:scale-105 transition transform duration-300"
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
