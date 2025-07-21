'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CategoryDropdown({ categories, selectedCategory }) {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState(selectedCategory || '');

  useEffect(() => {
    setCurrentCategory(selectedCategory || '');
  }, [selectedCategory]);

  const handleChange = (event) => {
    const newCategory = event.target.value;
    setCurrentCategory(newCategory);
    if (newCategory === '') {
      router.push('/');
    } else {
      router.push(`/?category=${newCategory}`);
    }
  };

  return (
    <div className="mb-8">
      <select
        value={currentCategory}
        onChange={handleChange}
        className="block w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      >
        <option value="">ทั้งหมด</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}