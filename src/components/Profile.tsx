import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  Edit, 
  Mail,
  MapPin,
  Phone,
  Calendar,
  Save
} from "lucide-react";

interface ProfileProps {
  currentUser: any;
  updateAppData: (data: any) => void;
  appData: any;
}

const API_BASE_URL = 'http://localhost:3001/api';

export function Profile({ currentUser, updateAppData, appData }: ProfileProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [editForm, setEditForm] = useState(currentUser);

  // Cập nhật user khi currentUser thay đổi
  useEffect(() => {
    setUser(currentUser);
    setEditForm(currentUser);
  }, [currentUser]);

  const handleSaveProfile = async () => {
    try {
      // Gọi API để cập nhật thông tin user
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          updates: editForm
        })
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        
        // Update app data
        const updatedData = {
          ...appData,
          user: data.user
        };
        updateAppData(updatedData);
        
        // Update localStorage
        localStorage.setItem('greenspace_user', JSON.stringify(data.user));
        
        setIsEditingProfile(false);
      } else {
        console.error('Update failed:', data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Vui lòng đăng nhập để xem hồ sơ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        <p className="text-gray-600 mt-2">Quản lý thông tin và theo dõi hoạt động của bạn</p>
      </div>

      <div className="grid grid-cols-1">
        {/* Profile Card */}
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xl">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
                <Badge className="mt-2 bg-green-100 text-green-800">{user.level || "Người mới bắt đầu"}</Badge>

                <div className="mt-4 space-y-2 text-left">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2"></span>
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2"></span>
                      <Phone className="h-4 w-4 mr-2" />
                      {user.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2"></span>
                    <MapPin className="h-4 w-4 mr-2" />
                    {user.location || "Hà Nội"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2"></span>
                    <Calendar className="h-4 w-4 mr-2" />
                    Tham gia từ {new Date(user.joinDate || "2025-09-26").toLocaleDateString('vi-VN')}
                  </div>
                </div>

                {user.bio && (
                  <p className="text-sm text-gray-600 mt-4 text-left">{user.bio}</p>
                )}

                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-4" variant="outline">
                      <span className="text-green-600 mr-2">✓</span>
                      Chỉnh sửa hồ sơ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Họ và tên</Label>
                          <Input
                            id="name"
                            value={editForm.name || ""}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Số điện thoại</Label>
                          <Input
                            id="phone"
                            value={editForm.phone || ""}
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email || ""}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Địa chỉ</Label>
                        <Input
                          id="location"
                          value={editForm.location || ""}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Giới thiệu</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio || ""}
                          onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="flex-1">
                          Hủy
                        </Button>
                        <Button onClick={handleSaveProfile} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Lưu
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}