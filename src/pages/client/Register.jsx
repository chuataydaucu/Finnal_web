import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  ChevronRight, 
  Sparkles, 
  ArrowLeft,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    const result = await register(username, password);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Library"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-900/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-cam-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-white/10">
            <UserPlus className="w-4 h-4" /> Join TayfBook Today
          </div>
          <h1 className="text-6xl font-black text-white leading-tight tracking-tight mb-8">
            Trở thành một phần của cộng đồng <span className="text-cam-500 italic">yêu tri thức.</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
            Đăng ký tài khoản để lưu lại những cuốn sách yêu thích, nhận thông báo về sách mới và nhiều ưu đãi hấp dẫn khác.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-navy-900 bg-slate-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-navy-900 bg-cam-500 flex items-center justify-center text-xs font-black text-white">
                +12k
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
              Hơn 12.000 độc giả <br/> đang chờ đợi bạn
            </p>
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
          {success ? (
            <div className="text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-navy-900 mb-4">Đăng ký thành công!</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                Chào mừng bạn đến với cộng đồng TayfBook. <br/> Đang chuyển hướng bạn đến trang đăng nhập...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <h2 className="text-4xl font-black text-navy-900 tracking-tight mb-4">
                  Tạo tài khoản mới
                </h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  Bắt đầu hành trình đọc sách chuyên nghiệp cùng TayfBook
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                  <div className="group relative">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 group-focus-within:text-cam-600 transition-colors">
                      <Mail className="w-3.5 h-3.5" /> Email hoặc Tên đăng nhập
                    </label>
                    <input
                      type="text" required
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all"
                      placeholder="vidu@tayfbook.vn"
                      value={username} onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div className="group relative">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 group-focus-within:text-cam-600 transition-colors">
                      <Lock className="w-3.5 h-3.5" /> Mật khẩu
                    </label>
                    <input
                      type="password" required
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all tracking-[0.3em]"
                      placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="group relative">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 group-focus-within:text-cam-600 transition-colors">
                      <ShieldCheck className="w-3.5 h-3.5" /> Xác nhận mật khẩu
                    </label>
                    <input
                      type="password" required
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all tracking-[0.3em]"
                      placeholder="••••••••"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Đăng ký tài khoản
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>

              <div className="mt-12 text-center pt-8 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Bạn đã có tài khoản?{' '}
                  <Link to="/login" className="text-cam-600 hover:text-cam-700 transition-colors ml-1">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <p className="mt-auto text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          TayfBook Academic © 2024
        </p>
      </div>
    </div>
  );
};

export default Register;
