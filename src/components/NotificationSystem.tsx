import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Bell, 
  X, 
  Clock, 
  Droplets, 
  Sun, 
  Calendar,
  CheckCircle2
} from "lucide-react";

interface Notification {
  id: number;
  type: "care_reminder" | "community" | "achievement" | "system";
  title: string;
  message: string;
  plantComboId?: number;
  dueDate?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onDismiss: (id: number) => void;
}

export function NotificationSystem({ 
  notifications, 
  onMarkAsRead, 
  onDismiss 
}: NotificationSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNotifications, setCurrentNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Lọc thông báo chưa đọc và đến hạn
    const now = new Date();
    const activeNotifications = notifications.filter(notification => {
      if (notification.read) return false;
      
      if (notification.type === "care_reminder" && notification.dueDate) {
        const dueDate = new Date(notification.dueDate);
        // Hiển thị thông báo vào ngày đến hạn
        return dueDate.toDateString() === now.toDateString();
      }
      
      return true;
    });

    setCurrentNotifications(activeNotifications);

    // Tự động hiển thị thông báo nếu có nhiệm vụ đến hạn
    if (activeNotifications.length > 0) {
      setIsOpen(true);
    }
  }, [notifications]);

  const unreadCount = currentNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "care_reminder":
        return <Droplets className="h-5 w-5 text-blue-600" />;
      case "community":
        return <Bell className="h-5 w-5 text-purple-600" />;
      case "achievement":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "care_reminder":
        return "border-l-blue-500 bg-blue-50";
      case "community":
        return "border-l-purple-500 bg-purple-50";
      case "achievement":
        return "border-l-green-500 bg-green-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-white shadow-lg hover:shadow-xl"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-600">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute top-12 right-0 w-80 max-h-96 overflow-y-auto shadow-xl">
          <div className="sticky top-0 bg-white border-b p-3 flex justify-between items-center">
            <h3 className="font-semibold">Thông báo</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <CardContent className="p-0">
            {currentNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Không có thông báo mới</p>
              </div>
            ) : (
              <div className="divide-y">
                {currentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 border-l-4 ${getNotificationColor(notification.type)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDismiss(notification.id)}
                            className="h-6 w-6 p-0 hover:bg-red-100"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        
                        {notification.dueDate && (
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            Đến hạn: {new Date(notification.dueDate).toLocaleDateString('vi-VN')}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.createdAt)}
                          </span>
                          
                          {!notification.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onMarkAsRead(notification.id)}
                              className="h-6 text-xs px-2"
                            >
                              Đánh dấu đã đọc
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}