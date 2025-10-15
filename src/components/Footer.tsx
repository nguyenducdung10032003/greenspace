import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="font-bold text-xl">PlantCare</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Nền tảng chăm sóc cây cảnh thông minh với AI, giúp bạn trở thành chuyên gia chăm cây.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-blue-600 cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-pink-600 cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

          {/* Tính năng */}
          <div>
            <h4 className="font-semibold mb-4">Tính năng</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-green-600">Thư viện cây cảnh</a></li>
              <li><a href="#" className="hover:text-green-600">Quản lý vườn cây</a></li>
              <li><a href="#" className="hover:text-green-600">Lịch chăm sóc</a></li>
              <li><a href="#" className="hover:text-green-600">AI tư vấn</a></li>
              <li><a href="#" className="hover:text-green-600">Cộng đồng</a></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-green-600">Hướng dẫn sử dụng</a></li>
              <li><a href="#" className="hover:text-green-600">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-green-600">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-green-600">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-green-600">Liên hệ</a></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@plantcare.vn</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>1900 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 PlantCare. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}