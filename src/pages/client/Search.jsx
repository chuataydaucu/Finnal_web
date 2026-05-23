import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import { Search as SearchIcon, ArrowLeft, X, Filter } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryId = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:3000/products'),
          fetch('http://localhost:3000/categories')
        ]);
        
        if (!productsRes.ok) throw new Error('Không thể tải dữ liệu tìm kiếm');
        
        const allProducts = await productsRes.json();
        const allCategories = await categoriesRes.json();
        setCategories(allCategories);
        
        // Client-side cross-filtering
        const lowerQuery = query.toLowerCase();
        const filteredProducts = allProducts.filter(p => {
          // Lọc theo từ khóa
          const matchQuery = !query || 
            (p.name && p.name.toLowerCase().includes(lowerQuery)) ||
            (p.author && p.author.toLowerCase().includes(lowerQuery)) ||
            (p.description && p.description.toLowerCase().includes(lowerQuery));
            
          // Lọc theo danh mục (Hỗ trợ product.categoryIds là mảng)
          const matchCategory = !categoryId || categoryId === 'all' || (p.categoryIds && p.categoryIds.includes(categoryId));
          
          // Lọc theo khoảng giá
          const matchMinPrice = !minPrice || p.price >= Math.max(0, Number(minPrice));
          const matchMaxPrice = !maxPrice || p.price <= Math.max(0, Number(maxPrice));
          
          return matchQuery && matchCategory && matchMinPrice && matchMaxPrice;
        });
        
        setResults(filteredProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (query || categoryId || minPrice || maxPrice) {
      fetchSearchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, categoryId, minPrice, maxPrice]);

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : 'Đang cập nhật';
  };

  const hasFilters = query || categoryId || minPrice || maxPrice;

  return (
    <div className="py-8 max-w-7xl mx-auto">

      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-headline font-black text-navy-900 mb-4 flex items-center gap-3 uppercase tracking-tight">
          <SearchIcon className="w-8 h-8 text-cam-500" />
          Kết quả tìm kiếm
        </h1>
        
        {hasFilters ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-600 font-medium mr-2 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Bộ lọc đang áp dụng:
            </span>
            
            {query && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 text-sm font-medium">
                Từ khóa: "{query}"
                <Link to={`/search?${new URLSearchParams(Array.from(searchParams.entries()).filter(([k]) => k !== 'q')).toString()}`} className="hover:text-blue-900">
                  <X className="w-3.5 h-3.5" />
                </Link>
              </span>
            )}
            
            {categoryId && categoryId !== 'all' && categories.length > 0 && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200 text-sm font-medium">
                Danh mục: {getCategoryName(categoryId)}
                <Link to={`/search?${new URLSearchParams(Array.from(searchParams.entries()).filter(([k]) => k !== 'category')).toString()}`} className="hover:text-purple-900">
                  <X className="w-3.5 h-3.5" />
                </Link>
              </span>
            )}
            
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 text-sm font-medium">
                Giá: {minPrice && Number(minPrice) > 0 ? formatCurrency(Number(minPrice)) : '0đ'} - {maxPrice && Number(maxPrice) > 0 ? formatCurrency(Number(maxPrice)) : 'Trở lên'}
                <Link to={`/search?${new URLSearchParams(Array.from(searchParams.entries()).filter(([k]) => k !== 'minPrice' && k !== 'maxPrice')).toString()}`} className="hover:text-green-900">
                  <X className="w-3.5 h-3.5" />
                </Link>
              </span>
            )}
            
            <Link to="/search" className="text-sm text-red-500 hover:text-red-700 underline ml-2 font-medium">
              Xóa tất cả bộ lọc
            </Link>
          </div>
        ) : (
          <p className="text-slate-600">Vui lòng nhập từ khóa hoặc sử dụng bộ lọc để tìm kiếm sách.</p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Đang tìm kiếm...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <SearchIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-navy-900 mb-2">Không tìm thấy kết quả</h2>
          <p className="text-slate-500">Rất tiếc, chúng tôi không tìm thấy cuốn sách nào khớp với từ khóa của bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <div key={product.id} className="animate-fade-in-up">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
