import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Leaf, 
  Calendar, 
  MessageCircle, 
  Bot, 
  BookOpen,
  TrendingUp,
  Users,
  Award,
  Activity,
  LogIn,
  AlertCircle
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  setActiveSection: (section: string) => void;
  appData?: any;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  level?: string;
  points?: number;
  location?: string;
  bio?: string;
  joinDate?: string;
}

interface PlantCombo {
  id: number;
  userId: number;
  name: string;
  comboType: string;
  category: string;
  image: string;
  plants: any[];
  careSchedule: any[];
}

interface DiaryEntry {
  id: number;
  userId: number;
  date: string;
  plantName: string;
  plantId: number;
  activities: any[];
  notes?: string;
  mood?: string;
}

interface BlogPost {
  id: number;
  author: any;
  title: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: any[];
}

const API_BASE_URL = "http://localhost:3001";

export function HomePage({ setActiveSection, appData }: HomePageProps) {
  const [userData, setUserData] = useState<User | null>(null);
  const [plantCombos, setPlantCombos] = useState<PlantCombo[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm kiểm tra trạng thái đăng nhập - GIỐNG BlogCommunity
  const checkAuthStatus = (): User | null => {
    if (appData?.user) {
      return appData.user;
    }

    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("currentUser");

      if (token && userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
      return null;
    }
  };

  // Hàm fetch user data từ API
  const fetchUserData = async () => {
    try {
      const user = checkAuthStatus();
      if (!user) return;
      
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user || data);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  // Hàm fetch plant combos từ API
  const fetchPlantCombos = async () => {
    try {
      const user = checkAuthStatus();
      if (!user) return;
      
      const response = await fetch(`${API_BASE_URL}/api/plant-combos?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setPlantCombos(data.plantCombos || []);
      }
    } catch (err) {
      console.error("Error fetching plant combos:", err);
    }
  };

  // Hàm fetch diary entries từ API
  const fetchDiaryEntries = async () => {
    try {
      const user = checkAuthStatus();
      if (!user) return;
      
      const response = await fetch(`${API_BASE_URL}/api/diary-entries?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setDiaryEntries(data.diaryEntries || []);
      } else if (response.status === 404) {
        setDiaryEntries([]);
      }
    } catch (err) {
      console.error("Error fetching diary entries:", err);
    }
  };

  // Hàm fetch blog posts từ API
  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog-posts`);
      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data.blogPosts || []);
      }
    } catch (err) {
      console.error("Error fetching blog posts:", err);
    }
  };

  // Load all data khi component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const user = checkAuthStatus();
        
        if (!user) {
          setError("Vui lòng đăng nhập để xem trang chủ");
          setLoading(false);
          return;
        }

        setUserData(user);

        // Load all data in parallel
        await Promise.all([
          fetchUserData(),
          fetchPlantCombos(),
          fetchDiaryEntries(),
          fetchBlogPosts()
        ]);
        
        setError(null);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [appData]);

  // Thống kê
  const stats = [
    { 
      label: "Combo cây đang chăm sóc", 
      value: plantCombos.length.toString(), 
      icon: Leaf, 
      color: "text-green-600" 
    },
    { 
      label: "Hoạt động tuần này", 
      value: diaryEntries.filter((entry: DiaryEntry) => {
        const entryDate = new Date(entry.date);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return entryDate >= oneWeekAgo;
      }).length.toString(), 
      icon: Activity, 
      color: "text-blue-600" 
    },
    { 
      label: "Tổng số cây", 
      value: plantCombos.reduce((total: number, combo: PlantCombo) => 
        total + (combo.plants?.length || 0), 0).toString(), 
      icon: Users, 
      color: "text-purple-600" 
    }
  ];

  // Hoạt động gần đây từ diaryEntries
  const getRecentActivities = () => {
    const activities = diaryEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map((entry: DiaryEntry, index: number) => ({
        id: entry.id || index,
        action: entry.activities?.[0]?.name || "Chăm sóc cây",
        plant: entry.plantName || "Cây trong vườn",
        time: formatTimeAgo(entry.date),
        icon: getActivityIcon(entry.activities?.[0]?.type)
      }));
    
    return activities.length > 0 ? activities : [
      {
        id: 1,
        action: "Bắt đầu hành trình",
        plant: "Thêm cây đầu tiên của bạn",
        time: "Bây giờ",
        icon: "🌱"
      }
    ];
  };

  // Hàm hỗ trợ định dạng thời gian
  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  }

  // Hàm lấy icon cho hoạt động
  function getActivityIcon(activityType: string): string {
    const icons: { [key: string]: string } = {
      watering: "💧",
      fertilizing: "🌱",
      pruning: "✂️",
      sunbath: "☀️",
      soil: "🪴",
      inspection: "👀",
      default: "🌿"
    };
    return icons[activityType] || icons.default;
  }

  // Bài viết nổi bật từ blogPosts
  const getTrendingPosts = () => {
    const trending = blogPosts
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3)
      .map((post: BlogPost) => ({
        id: post.id,
        title: post.title,
        author: post.author?.name || "Thành viên",
        likes: post.likes || 0,
        image: post.image || getDefaultPlantImage()
      }));
    
    return trending.length > 0 ? trending : [
      {
        id: 1,
        title: "Chào mừng đến với cộng đồng!",
        author: "Hệ thống",
        likes: 25,
        image: getDefaultPlantImage()
      },
      {
        id: 2,
        title: "Hướng dẫn chăm sóc cây cơ bản",
        author: "Chuyên gia",
        likes: 18,
        image: getDefaultPlantImage()
      }
    ];
  };

  // Hàm lấy ảnh mặc định cho cây
  function getDefaultPlantImage(): string {
    const plantImages = [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80",
      "https://images.unsplash.com-1459411621453-7b03977f4bfc?w=300&q=80",
      "https://images.unsplash.com-1416879595882-3373a0480b5b?w=300&q=80"
    ];
    return plantImages[Math.floor(Math.random() * plantImages.length)];
  }

  // Nhiệm vụ hôm nay từ plantCombos
  const getTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    const tasks = [];
    
    // Kiểm tra cây cần tưới nước từ careSchedule
    plantCombos.forEach((combo: PlantCombo) => {
      combo.careSchedule?.forEach((task: any) => {
        if (task.nextDue === today && !task.completed) {
          tasks.push({
            id: `task-${combo.id}-${task.id}`,
            task: `${task.name} ${combo.name}`,
            time: "Hôm nay",
            completed: false
          });
        }
      });
    });

    // Thêm task mặc định nếu không có task nào
    if (tasks.length === 0) {
      tasks.push(
        {
          id: 'default-1',
          task: 'Kiểm tra tình trạng cây',
          time: 'Cả ngày',
          completed: false
        },
        {
          id: 'default-2',
          task: 'Quan sát sâu bệnh',
          time: 'Chiều nay',
          completed: false
        }
      );
    }

    return tasks.slice(0, 3);
  };

  const quickActions = [
    {
      title: "Quản lý vườn cây",
      description: "Thêm cây mới và theo dõi tình trạng",
      icon: Leaf,
      color: "bg-green-100 text-green-600",
      action: () => setActiveSection("garden")
    },
    {
      title: "Ghi nhật ký",
      description: "Ghi lại hoạt động chăm sóc hôm nay",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
      action: () => setActiveSection("diary")
    },
    {
      title: "Hỏi AI",
      description: "Nhận tư vấn từ chuyên gia AI",
      icon: Bot,
      color: "bg-purple-100 text-purple-600",
      action: () => setActiveSection("chatbot")
    },
    {
      title: "Viết blog",
      description: "Chia sẻ kinh nghiệm với cộng đồng",
      icon: BookOpen,
      color: "bg-orange-100 text-orange-600",
      action: () => setActiveSection("blog")
    }
  ];

  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  // Render loading
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  // Render not authenticated - GIỐNG BlogCommunity
  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-full p-4 mb-4">
            <LogIn className="h-12 w-12 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Bạn cần đăng nhập để xem trang chủ và quản lý khu vườn của mình.
          </p>
          <Button
            onClick={handleLoginRedirect}
            className="bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Đăng nhập ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chào mừng trở lại, {userData.name || 'Người làm vườn'}! 🌱
        </h1>
        <p className="text-gray-600">
          {plantCombos.length > 0 
            ? `Bạn đang chăm sóc ${plantCombos.reduce((total: number, combo: PlantCombo) => total + (combo.plants?.length || 0), 0)} cây xanh. Hôm nay là ngày tuyệt vời!`
            : "Hãy bắt đầu bằng cách thêm cây đầu tiên vào khu vườn của bạn!"
          }
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <div className="text-red-700 text-sm">{error}</div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className="p-4 border rounded-lg hover:shadow-md transition-all hover:border-green-300 text-left"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRecentActivities().map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.plant}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setActiveSection("diary")}
              >
                Xem tất cả hoạt động
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Nhiệm vụ hôm nay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTodayTasks().map((task) => (
                  <div key={task.id} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 ${
                      task.completed ? 'bg-green-500 border-green-500' : 'border-blue-500'
                    }`}></div>
                    <span className="text-sm">
                      {task.task} {task.time && `(${task.time})`}
                    </span>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => setActiveSection("diary")}
              >
                Quản lý lịch chăm sóc
              </Button>
            </CardContent>
          </Card>

          {/* Trending Posts */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                {blogPosts.length > 0 ? "Bài viết nổi bật" : "Bài viết gợi ý"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getTrendingPosts().map((post) => (
                  <div key={post.id} className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                    <div className="flex space-x-3">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs text-gray-500">bởi {post.author}</span>
                          <Badge variant="secondary" className="text-xs">
                            {post.likes} ❤️
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => setActiveSection("blog")}
              >
                {blogPosts.length > 0 ? "Xem thêm bài viết" : "Viết bài đầu tiên"}
              </Button>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Cộng đồng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tổng số cây</span>
                  <span className="font-semibold">
                    {plantCombos.reduce((total: number, combo: PlantCombo) => 
                      total + (combo.plants?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hoạt động tháng</span>
                  <span className="font-semibold">
                    {diaryEntries.filter((entry: DiaryEntry) => {
                      const entryDate = new Date(entry.date);
                      const oneMonthAgo = new Date();
                      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                      return entryDate >= oneMonthAgo;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bài viết</span>
                  <span className="font-semibold text-green-600">
                    {blogPosts.filter((post: BlogPost) => 
                      post.author?.id === userData?.id
                    ).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}