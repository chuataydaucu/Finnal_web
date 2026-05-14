import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Mail, 
  Lock, 
  ChevronRight, 
  Sparkles, 
  ArrowLeft,
  User,
  ShieldCheck
} from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      let from = location.state?.from?.pathname || '/';
      if (from === '/login' || from === '/register') from = '/';
      
      if (result.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex animate-fade-in">
      {/* Left side - Visual Hero */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-navy-900 overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Library"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-900/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-cam-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-white/10">
            <Sparkles className="w-4 h-4" /> TayfBook Community
          </div>
          <h1 className="text-6xl font-black text-white leading-tight tracking-tight mb-8">
            Tri thức là sức mạnh, sẻ chia là <span className="text-cam-500 italic">siêu năng lực.</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
            Hành trình khám phá thế giới qua những trang sách bắt đầu từ đây. Hãy cùng chúng tôi lan tỏa văn hóa đọc.
          </p>
          <div className="flex items-center gap-8 border-t border-white/10 pt-10">
            <div>
              <p className="text-3xl font-black text-white">50k+</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Đầu sách</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">12k+</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Thành viên</p>
            </div>
          </div>
        </div>

        {/* Floating Decoration */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-cam-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-navy-400/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-2/5 flex flex-col p-8 sm:p-16 lg:p-24 bg-white relative">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-navy-900 transition-colors mb-20 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại trang chủ
        </Link>

        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-navy-900 tracking-tight mb-4">
              Chào mừng trở lại!
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Vui lòng đăng nhập để tiếp tục khám phá tri thức
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-8">
              <div className="group relative">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 group-focus-within:text-cam-600 transition-colors">
                  <User className="w-3.5 h-3.5" /> Email hoặc Tên đăng nhập
                </label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all"
                  placeholder="Nhập tài khoản của bạn"
                  value={username} onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="group relative">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 group-focus-within:text-cam-600 transition-colors">
                    <Lock className="w-3.5 h-3.5" /> Mật khẩu
                  </label>
                  <Link to="#" className="text-[10px] font-black text-cam-500 uppercase tracking-widest hover:text-cam-600 transition-colors">
                    Quên mật khẩu?
                  </Link>
                </div>
                <input
                  type="password" required
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all tracking-[0.3em]"
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-100 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-navy-900 hover:bg-navy-800 text-white py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-navy-900/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
              >
                Đăng nhập ngay
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-slate-50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Bạn chưa có tài khoản?{' '}
              <Link to="/register" className="text-cam-600 hover:text-cam-700 transition-colors ml-1">
                Đăng ký thành viên mới
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-auto text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          TayfBook Academic © 2024
        </p>
      </div>
    </div>
  );
};

export default Login;
