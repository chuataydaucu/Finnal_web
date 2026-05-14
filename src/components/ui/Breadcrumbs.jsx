import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // Fetch product info if we are on a product detail page
  useEffect(() => {
    const match = location.pathname.match(/\/product\/([^/]+)/);
    if (match) {
      fetch(`http://localhost:3000/products/${match[1]}`)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(() => setProduct(null));
    } else {
      setProduct(null);
    }
  }, [location.pathname]);

  const pathnames = location.pathname.split('/').filter(x => x);
  
  if (pathnames.length === 0) return null; // Don't show on home page

  const getBreadcrumbName = (path, index) => {
    // Custom mapping for static routes
    const map = {
      'cart': 'Giỏ hàng',
      'checkout': 'Thanh toán',
      'profile': 'Hồ sơ cá nhân',
      'search': 'Tìm kiếm',
      'login': 'Đăng nhập',
      'register': 'Đăng ký',
      'book-hot': 'Sách Hot',
      'blog': 'Blog Sách',
      'about': 'Về chúng tôi',
      'all-categories': 'Tất cả danh mục',
      'order-history': 'Lịch sử đơn hàng',
      'wishlist': 'Danh sách yêu thích'
    };

    if (map[path]) return map[path];

    // Check if it's a category ID
    const category = categories.find(c => c.id === path);
    if (category) return category.name;

    // Check if it's a product ID (last item in /product/:id)
    if (index > 0 && pathnames[index-1] === 'product' && product) {
      return product.name;
    }

    if (path === 'product') return 'Sách';

    return path;
  };

  const renderBreadcrumbs = () => {
    const breadcrumbs = [];

    // Always start with Home
    breadcrumbs.push({
      name: 'Trang chủ',
      path: '/',
      icon: <Home className="w-3.5 h-3.5" />
    });

    // Handle Product Detail Page specifically for dynamic path
    const productMatch = location.pathname.match(/\/product\/([^/]+)/);
    if (productMatch) {
      const fromPath = location.state?.from;
      const fromName = location.state?.fromName;

      if (fromPath && fromPath !== '/') {
        // Simple mapping for middle breadcrumb
        const name = fromName || getBreadcrumbName(fromPath.split('/').filter(x => x).pop(), 0);
        breadcrumbs.push({
          name: name,
          path: fromPath
        });
      } else if (fromName) {
        // Case where we came from a specific section on Home
        breadcrumbs.push({
          name: fromName,
          path: '/'
        });
      } else if (product?.categoryIds?.[0]) {
        // Fallback: show the first category of the product
        const cat = categories.find(c => c.id === product.categoryIds[0]);
        if (cat) {
          breadcrumbs.push({
            name: cat.name,
            path: `/all-categories#cat-${cat.id}`
          });
        }
      }

      // Add current product
      breadcrumbs.push({
        name: product?.name || 'Sách',
        path: location.pathname,
        isCurrent: true
      });
    } else {
      // Normal hierarchical breadcrumbs for other pages
      let currentPath = '';
      pathnames.forEach((value, index) => {
        currentPath += `/${value}`;
        breadcrumbs.push({
          name: getBreadcrumbName(value, index),
          path: currentPath,
          isCurrent: index === pathnames.length - 1
        });
      });
    }

    return breadcrumbs.map((crumb, i) => (
      <React.Fragment key={crumb.path + i}>
        {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
        {crumb.isCurrent ? (
          <span className="text-navy-900 truncate max-w-[250px]">{crumb.name}</span>
        ) : (
          <Link to={crumb.path} className="flex items-center gap-1 hover:text-cam-500 transition-colors">
            {crumb.icon}
            <span>{crumb.name}</span>
          </Link>
        )}
      </React.Fragment>
    ));
  };

  return (
    <nav className="container mx-auto px-6 py-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
      {renderBreadcrumbs()}
    </nav>
  );
};

export default Breadcrumbs;
