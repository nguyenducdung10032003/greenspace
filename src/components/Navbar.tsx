import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Leaf,
  Home,
  BookOpen,
  Calendar,
  MessageCircle,
  Bot,
  User,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  currentUser: any;
  onLogout: () => void;
}

export function Navbar({
  activeSection,
  setActiveSection,
  currentUser,
  onLogout,
}: NavbarProps) {
  const [notifications] = useState(3);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigation = [
    { id: "home", label: "Trang chủ", icon: Home },
    { id: "garden", label: "Vườn cây", icon: Leaf },
    { id: "diary", label: "Nhật ký", icon: Calendar },
    { id: "blog", label: "Blog", icon: BookOpen },
    { id: "chatbot", label: "AI Hỗ trợ", icon: Bot },
    { id: "profile", label: "Hồ sơ", icon: User },
  ];

  // Hàm xử lý logout
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Gọi API logout
      const response = await fetch("http://localhost:3001/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        console.log("Đăng xuất thành công");
        // Gọi callback từ parent component để xử lý sau khi logout
        onLogout();
      } else {
        console.error("Lỗi khi đăng xuất:", result.message);
        // Vẫn thực hiện logout trên client nếu server có lỗi
        onLogout();
      }
    } catch (error) {
      console.error("Lỗi kết nối khi đăng xuất:", error);
      // Vẫn thực hiện logout trên client nếu có lỗi kết nối
      onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Sử dụng currentUser từ props
  const user = currentUser || {
    name: "User",
    email: "user@greenspace.vn",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&q=80",
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setActiveSection("home")}
              className="flex items-center space-x-2"
            >
              <Leaf className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">Green Space</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-white bg-green-800 bg-opacity-50"
                      : "text-green-100 hover:text-white hover:bg-green-800 hover:bg-opacity-30"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="text-white text-sm hidden sm:block">
              Xin chào,{" "}
              <span className="font-medium">{user?.name || "User"}</span>
            </div>

            {/* Simple Logout Button with Dropdown */}
            <div className="relative group">
              {/* Avatar Button */}
              <button
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 rounded-full p-1 transition-colors"
                onClick={() => console.log("Avatar clicked")}
              >
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-green-400 text-white font-medium">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </button>

              {/* Dropdown Menu - Simple Version */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform group-hover:translate-y-0 translate-y-2">
                {/* User Info Section */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-green-500 text-white font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {user.email}
                      </p>
                      <p className="text-green-600 text-xs font-medium mt-1">
                        {user.level || "Thành viên"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button
                    onClick={() => setActiveSection("profile")}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <User className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Hồ sơ cá nhân</span>
                  </button>

                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    <Settings className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Cài đặt tài khoản</span>
                  </button>

                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    <Bell className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Thông báo</span>
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </button>
                </div>

                {/* Logout Section */}
                <div className="p-2 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="font-medium">
                      {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Logout Button (Fallback) */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="sm:hidden flex items-center space-x-1 bg-red-400 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? "..." : "Đăng xuất"}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
