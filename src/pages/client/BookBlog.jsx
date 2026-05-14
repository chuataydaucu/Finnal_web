import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, BookOpen, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="container mx-auto px-6 py-20 text-center text-slate-400">Đang tải bài viết...</div>
  );

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Modern Magazine Style Header */}
      <div className="relative mb-24 py-16 px-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-1 h-full bg-cam-500"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cam-50 rounded-full blur-[100px]"></div>
        <div className="absolute top-10 right-10 text-navy-900/5 font-black text-[120px] leading-none select-none animate-fade-in-right">
          BLOG
        </div>

        <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 animate-fade-in-left">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-cam-500"></div>
              <span className="text-[10px] font-black text-navy-900 uppercase tracking-[0.4em]">Kiến thức & Review</span>
            </div>
            <h1 className="font-headline font-black text-6xl lg:text-7xl text-navy-900 mb-8 leading-tight tracking-tight">
              Góc <span className="text-cam-500 italic">Suy Ngẫm</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed italic">
              Nơi những tâm hồn yêu sách hội ngộ, chia sẻ và lan tỏa những giá trị tri thức vượt thời gian.
            </p>
          </div>

          <div className="lg:col-span-6 animate-fade-in-up delay-300">
            <div className="relative p-10 bg-navy-900 rounded-[2.5rem] shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-700 group">
              <Quote className="absolute -top-6 -right-6 w-16 h-16 text-cam-500 opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative z-10">
                <p className="text-2xl lg:text-3xl font-medium text-white leading-relaxed italic mb-10">
                  "Mỗi cuốn sách bạn đọc là một hành trình riêng biệt bắt đầu từ tâm hồn."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cam-500 flex items-center justify-center text-white">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-cam-500 uppercase tracking-widest mb-1">Cảm hứng TayfBook</div>
                    <div className="text-[10px] text-slate-400">Dành cho những người yêu chữ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Blog */}
      {blogs.length > 0 && (
        <div className="relative rounded-[2.5rem] overflow-hidden mb-24 group shadow-2xl animate-fade-in-up delay-500">
          <div className="aspect-[21/9]">
            <img 
              src={blogs[0].image} 
              alt={blogs[0].title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent flex flex-col justify-end p-12">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1.5 bg-cam-500 text-white text-xs font-black uppercase tracking-widest rounded-full mb-6 shadow-lg">Nổi bật</span>
              <h2 className="text-4xl font-headline font-black text-white mb-6 leading-tight group-hover:text-cam-200 transition-colors">
                {blogs[0].title}
              </h2>
              <p className="text-slate-200 text-lg mb-8 line-clamp-2 italic">
                {blogs[0].summary}
              </p>
              <div className="flex items-center gap-8 text-sm text-slate-300 mb-8 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cam-500" />
                  <span>14 Tháng 5, 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cam-500" />
                  <span>Ban Biên Tập</span>
                </div>
              </div>
              <button className="flex items-center gap-3 px-8 py-4 bg-white text-navy-900 font-black rounded-2xl hover:bg-cam-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl">
                Đọc bài viết <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Grid Title */}
      <div className="flex items-center justify-between mb-12 animate-fade-in-up">
        <h2 className="text-3xl font-headline font-black text-navy-900">Bài viết <span className="text-cam-500 italic">Mới nhất</span></h2>
        <div className="h-[2px] flex-1 mx-8 bg-slate-100 hidden md:block"></div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-cam-500"></div>
          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {blogs.slice(1).map((blog, idx) => (
          <div 
            key={blog.id} 
            className="group flex flex-col h-full bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-cam-100 transition-all duration-500 p-4 animate-fade-in-up"
            style={{ animationDelay: `${idx * 100 + 700}ms` }}
          >
            <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-6">
              <img src="https://cdn.tuoitrethudo.vn/stores/news_dataimages/2024/022024/27/09/sach-sbooks-220240227094654.jpg?rt=20240227094857" 
                alt="Top 10 cuốn sách kinh điển nên đọc một lần"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm text-navy-900">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="px-2 flex flex-col flex-grow">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                <span>13 Tháng 5, 2024</span>
                <span className="w-1 h-1 bg-cam-500 rounded-full"></span>
                <span>Review Sách</span>
              </div>
              <h3 className="text-xl font-headline font-black text-navy-900 mb-4 line-clamp-2 leading-tight group-hover:text-cam-600 transition-colors">
                {blog.title}
              </h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                {blog.summary}
              </p>
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                <span className="text-[10px] font-black uppercase tracking-widest text-navy-900">TayfBook Editorial</span>
                <button className="text-cam-600 font-black text-sm flex items-center gap-2 group/btn">
                  Xem thêm <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Block */}
      <div className="mt-24 relative rounded-[3rem] bg-navy-900 overflow-hidden p-12 lg:p-20 shadow-2xl animate-fade-in-up">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-cam-500/10 skew-x-12 translate-x-1/2"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-headline font-black text-white mb-6 leading-tight">
              Yêu sách? Hãy đăng ký <span className="text-cam-500 italic">Bản tin</span> của chúng tôi
            </h2>
            <p className="text-slate-300 text-lg">
              Nhận ngay những bài review chất lượng và mã giảm giá độc quyền hàng tuần.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Email của bạn..." 
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cam-500 placeholder-white/30 backdrop-blur-md transition-all"
            />
            <button className="bg-cam-500 text-white font-black px-10 py-4 rounded-2xl hover:bg-cam-600 transition-all transform hover:-translate-y-1 shadow-lg shadow-cam-500/20">
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookBlog;
