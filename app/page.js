import Link from 'next/link';


export const dynamic = 'force-dynamic';

// ฟังก์ชันช่วยแปลงตัวเลขให้อยู่ในรูปแบบ K (พัน) หรือ M (ล้าน)
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toLocaleString();
}

import { supabase } from '../lib/supabaseClient';

// ฟังก์ชันสำหรับดึงข้อมูลหมวดหมู่ที่ไม่ซ้ำกัน
async function getUniqueCategories() {
  const { data, error } = await supabase.from('products').select('category');
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  // สร้าง Set ของ category เพื่อเอาเฉพาะค่าที่ไม่ซ้ำกัน, และกรองค่า null ออก
  const uniqueCategories = [...new Set((data || []).map(item => item.category === 'อุปกรณ์อิเล็กทรอนิกส์' ? 'เครื่องใช้ไฟฟ้าและอิเล็กทรอนิกส์' : item.category).filter(Boolean))].filter(cat => cat !== 'อื่นๆ');
  return uniqueCategories.sort(); // เรียงตามตัวอักษร
}

// ฟังก์ชันสำหรับดึงข้อมูลสินค้า (สามารถกรองตามหมวดหมู่ได้)
async function getProducts(category) {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
}

// Page component ของเรา รับ searchParams มาจาก URL เพื่อใช้ในการกรอง
export default async function HomePage({ searchParams }) {
  const selectedCategory = (await searchParams).category;
  
  // ดึงข้อมูลทั้งสองอย่างพร้อมกันเพื่อความรวดเร็ว
  const [products, categories] = await Promise.all([
    getProducts(selectedCategory),
    getUniqueCategories(),
  ]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">My Shopee Affiliate</h1>
            {/* สามารถเพิ่มเมนูอื่นๆ ได้ที่นี่ */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">หมวดหมู่สินค้า</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/" className={`px-4 py-2 rounded-full text-sm font-medium ${!selectedCategory ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              ทั้งหมด
            </Link>
            {categories.map(category => (
              <Link
                key={category}
                href={`/?category=${category}`}
                className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {category}
              </Link>
            ))}
          </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group transform hover:-translate-y-1 transition-all duration-300">
              <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer" className="block"> {/* Make the whole card clickable */} 
                <div className="relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                </div>
                <div className="p-3 md:p-4 pb-3 md:pb-4 flex flex-col justify-between">
                  <h2 className="text-sm md:text-base font-normal text-gray-800 truncate-3-lines" title={product.name}>
                    {product.name}
                  </h2>
                  <p className="text-lg md:text-xl font-bold text-orange-500 mt-2">
                     ฿{product.price}
                  </p>
                  {product.sold_count > 0 && (
                     <p className="text-xs text-gray-500 mt-1">
                        ขายแล้ว {formatNumber(product.sold_count)} ชิ้น
                     </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <span>{product.rating}</span>
                    <span className="mx-1">|</span>
                    <span>รีวิว ({formatNumber(product.review_count)})</span>
                  </div>
                </div>
              </a> {/* Close the main clickable area here */}

            </div>
          ))}
        </div>
        {products.length === 0 && (
            <div className="text-center py-16">
                <p className="text-gray-600 text-lg">ไม่พบสินค้าในหมวดหมู่นี้</p>
            </div>
        )}
        </div>
        </main>

      {/* Footer */}
      <footer className="bg-white mt-12">
        <div className="container mx-auto px-8 py-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} My Shopee Affiliate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// เพิ่ม CSS สำหรับการตัดข้อความหลายบรรทัด
const globalStyles = `
  .truncate-2-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .truncate-3-lines {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;  
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// เราไม่สามารถใส่ <style> tag โดยตรงใน App Router ได้
// แต่วิธีที่ง่ายที่สุดสำหรับตอนนี้คือการสร้าง component ที่ render style tag
// ในโปรเจกต์จริงจะเอาไปไว้ในไฟล์ layout.js
function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{ __html: globalStyles }} />;
}
