import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Leaf, Mail, Lock, User, Phone, MapPin } from "lucide-react";

interface AuthProps {
  onLogin: (userData: any) => void;
  onRegister: (userData: any) => void;
}

const API_BASE_URL = "http://localhost:3001/api";

export function Auth({ onLogin, onRegister }: AuthProps) {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    // Validation
    if (!loginForm.email || !loginForm.password) {
      setErrors(["Vui lòng điền đầy đủ thông tin"]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save to localStorage and call onLogin
        localStorage.setItem("greenspace_user", JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setErrors([data.message]);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors(["Lỗi kết nối. Vui lòng thử lại."]);
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    // Validation
    const newErrors: string[] = [];
    if (!registerForm.name) newErrors.push("Vui lòng nhập họ tên");
    if (!registerForm.email) newErrors.push("Vui lòng nhập email");
    if (!registerForm.password) newErrors.push("Vui lòng nhập mật khẩu");
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.push("Mật khẩu xác nhận không khớp");
    }
    if (registerForm.password && registerForm.password.length < 6) {
      newErrors.push("Mật khẩu phải có ít nhất 6 ký tự");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          phone: registerForm.phone,
          location: registerForm.location,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save to localStorage and call onRegister
        localStorage.setItem("greenspace_user", JSON.stringify(data.user));
        onRegister(data.user);
      } else {
        setErrors([data.message]);
      }
    } catch (error) {
      console.error("Register error:", error);
      setErrors(["Lỗi kết nối. Vui lòng thử lại."]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-10 w-10 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Green Space</h1>
          </div>
          <p className="text-gray-600">Nền tảng chăm sóc cây cảnh thông minh</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Chào mừng bạn đến với Green Space
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>

              {/* Error Messages */}
              {errors.length > 0 && (
                <Alert className="mt-4 border-red-200 bg-red-50">
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index} className="text-red-600">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        className="pl-9"
                        placeholder="your.email@example.com"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        className="pl-9"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Demo: Bạn có thể sử dụng bất kỳ email và password nào để
                    đăng nhập
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Họ và tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        className="pl-9"
                        placeholder="Nguyễn Văn A"
                        value={registerForm.name}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        className="pl-9"
                        placeholder="your.email@example.com"
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Mật khẩu</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type="password"
                          className="pl-9"
                          placeholder="••••••••"
                          value={registerForm.password}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              password: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">
                        Xác nhận
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-confirm-password"
                          type="password"
                          className="pl-9"
                          placeholder="••••••••"
                          value={registerForm.confirmPassword}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">
                      Số điện thoại (tùy chọn)
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-phone"
                        className="pl-9"
                        placeholder="0900000000"
                        value={registerForm.phone}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-location">
                      Địa chỉ (tùy chọn)
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-location"
                        className="pl-9"
                        placeholder="TP. Hồ Chí Minh"
                        value={registerForm.location}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Bằng việc đăng ký, bạn đồng ý với{" "}
            <a href="#" className="text-green-600 hover:underline">
              Điều khoản sử dụng
            </a>{" "}
            và{" "}
            <a href="#" className="text-green-600 hover:underline">
              Chính sách bảo mật
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
