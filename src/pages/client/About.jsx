import React from 'react';
import { Book, Target, CheckCircle, Lightbulb, Users, Award, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="font-headline font-black text-6xl text-navy-900 mb-8 leading-tight">
          Câu chuyện của <span className="text-secondary italic">TayfBook</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Mở trang sách, mở ra thế giới mới. Chúng tôi tin rằng mỗi cuốn sách là một hành trình trí tuệ vô tận, kết nối con người với những chân trời kiến thức mới mẻ.
        </p>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl relative group">
            <img 
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Library" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-navy-900/10 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div>
            <h2 className="font-headline font-black text-4xl text-navy-900 mb-8 leading-tight">Sứ mệnh của chúng tôi</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Tại TayfBook, sứ mệnh của chúng tôi vượt xa việc bán sách. Chúng tôi khao khát xây dựng một cầu nối văn hóa, nơi tri thức được lan tỏa và tình yêu đọc sách được nuôi dưỡng.
            </p>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Chúng tôi tập trung vào việc tuyển chọn những tác phẩm có giá trị nội dung sâu sắc, hỗ trợ sự phát triển tư duy và tâm hồn của cộng đồng độc giả Việt Nam. Mỗi cuốn sách tại TayfBook đều mang một thông điệp riêng, chờ đợi được khám phá.
            </p>
            <button className="px-10 py-4 bg-cam-600 text-white font-black rounded-2xl hover:bg-cam-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-cam-600/20">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>

      {/* Selection Process */}
      <div className="bg-slate-50 py-24">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="font-headline font-black text-4xl text-navy-900 mb-6 leading-tight">Quy trình tuyển chọn khắt khe</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Chúng tôi không chỉ bán sách, chúng tôi tuyển chọn tinh hoa.
          </p>
        </div>
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10">
          {[
            { icon: Book, title: "Thẩm định nội dung", desc: "Mỗi tựa sách đều trải qua quy trình đánh giá chất lượng học thuật và giá trị thực tiễn bởi đội ngũ chuyên gia." },
            { icon: Award, title: "Nguồn gốc uy tín", desc: "Hợp tác trực tiếp với các nhà xuất bản hàng đầu thế giới và trong nước để đảm bảo bản quyền và chất lượng in ấn." },
            { icon: CheckCircle, title: "Kiểm định vật lý", desc: "Từng cuốn sách được kiểm tra thủ công về tình trạng trước khi đến tay bạn, đảm bảo trải nghiệm cầm nắm hoàn hảo nhất." }
          ].map((item, i) => (
            <div key={i} className="bg-blue-50/50 p-10 rounded-[2.5rem] border border-blue-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
              <div className="w-16 h-16 bg-cam-100 rounded-2xl flex items-center justify-center text-cam-600 mb-8 group-hover:bg-cam-500 group-hover:text-white transition-colors">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-headline font-black text-navy-900 mb-6">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-navy-900 py-24 text-white">
        <div className="container mx-auto px-6 text-center mb-20">
          <h2 className="font-headline font-black text-4xl mb-6">Giá trị cốt lõi</h2>
        </div>
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            { title: "Chất lượng", desc: "Ưu tiên hàng đầu cho chiều sâu nội dung và hình thức thẩm mỹ của từng ấn phẩm." },
            { title: "Tri thức", desc: "Tôn trọng sự đa dạng trong tư duy và khuyến khích tinh thần học hỏi không ngừng." },
            { title: "Cộng đồng", desc: "Kiến tạo không gian kết nối những người yêu sách và lan tỏa văn hóa đọc văn minh." }
          ].map((val, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 hover:border-cam-500 transition-colors text-center group">
              <h3 className="text-2xl font-headline font-black text-cam-500 mb-6 group-hover:scale-110 transition-transform">{val.title}</h3>
              <p className="text-slate-300 leading-relaxed italic">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Join Community CTA */}
      <div className="container mx-auto px-6 py-24">
        <div className="relative rounded-[3rem] bg-slate-100 p-12 lg:p-20 overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cam-500 to-secondary"></div>
          <h2 className="text-4xl lg:text-5xl font-headline font-black text-navy-900 mb-8 leading-tight">
            Tham gia cùng cộng đồng TayfBook
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl italic leading-relaxed">
            Nhận tin tức về các tác phẩm mới nhất và ưu đãi đặc quyền hàng tuần.
          </p>
          <div className="w-full max-w-xl flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Email của bạn..." 
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-cam-500 transition-all"
            />
            <button className="bg-cam-600 text-white font-black px-10 py-4 rounded-2xl hover:bg-cam-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-cam-600/20">
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
