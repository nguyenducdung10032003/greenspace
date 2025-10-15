import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  Search,
  Clock,
  MoreHorizontal,
  Send,
  Bookmark,
  Edit,
  Trash2,
  LogIn
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Post {
  id: number;
  author: {
    id: number;
    name: string;
    avatar: string;
    level: string;
    verified?: boolean;
  };
  title?: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  bookmarks: number;
  isPersonal: boolean;
  tags?: string[];
  category?: string;
}

interface Comment {
  id: number;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface User {
  id: number;
  name: string;
  email: string;
  location: string;
  bio: string;
  avatar: string;
  joinDate: string;
  level: string;
  points: number;
}

interface BlogCommunityProps {
  appData?: any;
}

const API_BASE_URL = "http://localhost:3001";

export function BlogCommunity({ appData }: BlogCommunityProps) {
  const [activeTab, setActiveTab] = useState("community");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    image: "",
    tags: "",
    category: "Chia sẻ",
    isPersonal: false
  });

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "Hướng dẫn", name: "Hướng dẫn" },
    { id: "Chia sẻ", name: "Chia sẻ" },
    { id: "Hỏi đáp", name: "Hỏi đáp" },
    { id: "Đánh giá", name: "Đánh giá" },
    { id: "Tin tức", name: "Tin tức" }
  ];

  const postCategories = ["Chia sẻ", "Hướng dẫn", "Hỏi đáp", "Đánh giá", "Tin tức"];

  const popularTags = [
    "Monstera", "Sen đá", "Chăm sóc", "Tưới nước", "Bón phân", 
    "Ánh sáng", "Cây trong nhà", "Cây văn phòng", "Kinh nghiệm", "Mùa đông"
  ];

  // Hàm kiểm tra trạng thái đăng nhập
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

  // Hàm fetch posts từ API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const user = checkAuthStatus();

      if (!user) {
        setError("Vui lòng đăng nhập để xem bài viết");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      
      if (activeTab === "personal") {
        params.append('userId', user.id.toString());
      }
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/blog/posts?${params}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setPosts([]);
          return;
        }
        throw new Error("Không thể tải dữ liệu bài viết");
      }

      const data = await response.json();
      setPosts(data.posts || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err instanceof Error ? err.message : "Lỗi khi tải dữ liệu");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim() || !currentUser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: currentUser,
          title: newPost.title || undefined,
          content: newPost.content,
          image: newPost.image || undefined,
          isPersonal: newPost.isPersonal,
          tags: newPost.tags ? newPost.tags.split(",").map(tag => tag.trim()) : undefined,
          category: newPost.category,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error("Không thể tạo bài viết mới");
      }

      const createdPost = await response.json();
      setPosts([createdPost, ...posts]);
      setNewPost({ title: "", content: "", image: "", tags: "", category: "Chia sẻ", isPersonal: false });
      setIsCreatePostOpen(false);
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      setError("Lỗi khi tạo bài viết");
    }
  };

  const handleEditPost = async () => {
    if (!editingPost || !currentUser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingPost,
          tags: editingPost.tags || undefined,
          category: editingPost.category || "Chia sẻ"
        })
      });

      if (!response.ok) {
        throw new Error("Không thể cập nhật bài viết");
      }

      const updatedPost = await response.json();
      setPosts(posts.map(post => 
        post.id === editingPost.id ? updatedPost : post
      ));
      
      if (selectedPost && selectedPost.id === editingPost.id) {
        setSelectedPost(updatedPost);
      }
      
      setEditingPost(null);
      setIsEditPostOpen(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
      setError("Lỗi khi cập nhật bài viết");
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/posts/${postId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error("Không thể xóa bài viết");
      }

      setPosts(posts.filter(post => post.id !== postId));
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(null);
      }
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error);
      setError("Lỗi khi xóa bài viết");
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/posts/${postId}/like`, {
        method: 'PATCH'
      });
      
      if (!response.ok) {
        throw new Error("Không thể like bài viết");
      }

      const data = await response.json();
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: data.likes }
          : post
      ));
      
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({ ...selectedPost, likes: data.likes });
      }
    } catch (error) {
      console.error('Lỗi khi like bài viết:', error);
    }
  };

  const handleBookmarkPost = async (postId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/posts/${postId}/bookmark`, {
        method: 'PATCH'
      });
      
      if (!response.ok) {
        throw new Error("Không thể bookmark bài viết");
      }

      const data = await response.json();
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, bookmarks: data.bookmarks }
          : post
      ));
    } catch (error) {
      console.error('Lỗi khi bookmark bài viết:', error);
    }
  };

  const handleLikeComment = async (postId: number, commentId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/posts/${postId}/comments/${commentId}/like`, {
        method: 'PATCH'
      });
      
      if (!response.ok) {
        throw new Error("Không thể like bình luận");
      }

      const data = await response.json();
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, likes: data.likes }
                : comment
            )
          };
        }
        return post;
      }));

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          comments: selectedPost.comments.map(comment =>
            comment.id === commentId
              ? { ...comment, likes: data.likes }
              : comment
          )
        });
      }
    } catch (error) {
      console.error('Lỗi khi like bình luận:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost || !currentUser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/posts/${selectedPost.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: currentUser,
          content: newComment,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error("Không thể thêm bình luận");
      }

      const createdComment = await response.json();
      
      const updatedPosts = posts.map(post => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            comments: [...post.comments, createdComment]
          };
        }
        return post;
      });
      
      setPosts(updatedPosts);
      setSelectedPost({
        ...selectedPost,
        comments: [...selectedPost.comments, createdComment]
      });
      setNewComment("");
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error);
      setError("Lỗi khi thêm bình luận");
    }
  };

  // Sắp xếp bài viết
  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.likes + b.comments.length * 2) - (a.likes + a.comments.length * 2);
      case "commented":
        return b.comments.length - a.comments.length;
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "Vừa xong";
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Vừa xong";
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      
      return date.toLocaleDateString('vi-VN');
    } catch {
      return timestamp;
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  useEffect(() => {
    const user = checkAuthStatus();
    if (user) {
      setCurrentUser(user);
      fetchPosts();
    } else {
      setLoading(false);
      setError("Vui lòng đăng nhập để xem bài viết");
    }
  }, [activeTab, selectedCategory, searchTerm, appData]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
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
            Bạn cần đăng nhập để xem và viết bài trong cộng đồng.
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog & Cộng đồng</h1>
          <p className="text-gray-600 mt-2">
            Chia sẻ kinh nghiệm và học hỏi từ cộng đồng yêu cây cảnh
            {currentUser && ` - Chào ${currentUser.name}`}
          </p>
        </div>
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Viết bài mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo bài viết mới</DialogTitle>
              <DialogDescription>
                Chia sẻ kinh nghiệm và kiến thức về chăm sóc cây cảnh
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <div className="flex gap-2">
                    <Button
                      variant={newPost.isPersonal ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewPost({...newPost, isPersonal: true})}
                      className="text-xs"
                    >
                      Cá nhân
                    </Button>
                    <Button
                      variant={!newPost.isPersonal ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewPost({...newPost, isPersonal: false})}
                      className="text-xs"
                    >
                      Cộng đồng
                    </Button>
                  </div>
                </div>
              </div>

              {/* Post Form */}
              <div className="space-y-4">
                {!newPost.isPersonal && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tiêu đề (tùy chọn)</label>
                    <Input
                      placeholder="Tiêu đề bài viết..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nội dung</label>
                  <Textarea
                    placeholder={newPost.isPersonal ? 
                      "Chia sẻ về trải nghiệm chăm sóc cây của bạn..." : 
                      "Viết bài hướng dẫn, chia sẻ kinh nghiệm..."
                    }
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    rows={8}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Danh mục</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newPost.category}
                      onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    >
                      {postCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hình ảnh (URL)</label>
                    <Input
                      placeholder="https://..."
                      value={newPost.image}
                      onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Thẻ tag</label>
                  <Input
                    placeholder="Monstera, chăm sóc, kinh nghiệm..."
                    value={newPost.tags}
                    onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {popularTags.slice(0, 6).map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => {
                          const currentTags = newPost.tags ? newPost.tags.split(",").map(t => t.trim()) : [];
                          if (!currentTags.includes(tag)) {
                            setNewPost({...newPost, tags: [...currentTags, tag].join(", ")});
                          }
                        }}
                      >
                        #{tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsCreatePostOpen(false)} className="flex-1">
                  Hủy
                </Button>
                <Button onClick={handleCreatePost} className="flex-1 bg-green-600 hover:bg-green-700">
                  Đăng bài
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm bài viết..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="p-2 border rounded-md text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <select
                    className="p-2 border rounded-md text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="latest">Mới nhất</option>
                    <option value="popular">Phổ biến</option>
                    <option value="commented">Nhiều bình luận</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thẻ phổ biến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 hover:bg-green-50 hover:border-green-200"
                    onClick={() => setSearchTerm(tag)}
                  >
                    #{tag}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thống kê cộng đồng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Thành viên</span>
                  <span className="font-semibold">12,456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bài viết hôm nay</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Người online</span>
                  <span className="font-semibold text-green-600">1,234</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="community">Cộng đồng</TabsTrigger>
              <TabsTrigger value="personal">Bài viết của tôi</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6 mt-6">
              {sortedPosts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có bài viết nào</h3>
                    <p className="text-gray-500 mb-4">
                      {activeTab === "personal" 
                        ? "Bạn chưa có bài viết nào. Hãy chia sẻ kinh nghiệm của bạn!"
                        : "Không tìm thấy bài viết nào phù hợp."
                      }
                    </p>
                    <Button 
                      onClick={() => setIsCreatePostOpen(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Viết bài đầu tiên
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                sortedPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{post.author.name}</p>
                              {post.author.verified && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  ✓
                                </Badge>
                              )}
                              <Badge className="text-xs bg-blue-100 text-blue-700">
                                {post.author.level}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(post.timestamp)}</span>
                              {post.category && (
                                <>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-xs">
                                    {post.category}
                                  </Badge>
                                </>
                              )}
                              {post.isPersonal && (
                                <>
                                  <span>•</span>
                                  <Badge className="text-xs bg-green-100 text-green-700">
                                    Cá nhân
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          {/* Menu dropdown cho chủ bài viết */}
                          {post.author.id === currentUser.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                              <div className="py-1">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-sm"
                                  onClick={() => {
                                    setEditingPost(post);
                                    setIsEditPostOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Chỉnh sửa
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-sm text-red-600 hover:text-red-700"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Xóa bài viết
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {post.title && (
                        <h2 className="text-xl font-semibold mb-3 text-gray-900">{post.title}</h2>
                      )}
                      
                      <div className="mb-4">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                          {post.content.length > 300 ? 
                            `${post.content.substring(0, 300)}...` : 
                            post.content
                          }
                        </p>
                        {post.content.length > 300 && (
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-green-600 hover:text-green-700"
                            onClick={() => setSelectedPost(post)}
                          >
                            Xem thêm
                          </Button>
                        )}
                      </div>
                      
                      {post.image && (
                        <div className="mb-4">
                          <ImageWithFallback
                            src={post.image}
                            alt="Post image"
                            className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-95"
                            onClick={() => setSelectedPost(post)}
                          />
                        </div>
                      )}
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 hover:bg-green-50 hover:border-green-200"
                              onClick={() => setSearchTerm(tag)}
                            >
                              #{tag}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-5 w-5" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button
                            onClick={() => setSelectedPost(post)}
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
                          >
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-sm">{post.comments.length}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                            <Share2 className="h-5 w-5" />
                            <span className="text-sm">{post.shares}</span>
                          </button>
                        </div>
                        <button
                          onClick={() => handleBookmarkPost(post.id)}
                          className="flex items-center gap-2 text-gray-500 hover:text-yellow-500 transition-colors"
                        >
                          <Bookmark className="h-5 w-5" />
                          <span className="text-sm">{post.bookmarks}</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title || "Chi tiết bài viết"}</DialogTitle>
            <DialogDescription>
              Xem chi tiết bài viết và tham gia thảo luận
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Post Content */}
              <div className="border-b pb-4 mb-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedPost.author.avatar} alt={selectedPost.author.name} />
                      <AvatarFallback>{selectedPost.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedPost.author.name}</span>
                        {selectedPost.author.verified && (
                          <Badge variant="secondary" className="text-xs">✓</Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{formatTimestamp(selectedPost.timestamp)}</span>
                    </div>
                  </div>
                  {selectedPost.author.id === currentUser.id && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPost(selectedPost);
                          setIsEditPostOpen(true);
                          setSelectedPost(null);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(selectedPost.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {selectedPost.content}
                  </p>
                  
                  {selectedPost.image && (
                    <ImageWithFallback
                      src={selectedPost.image}
                      alt="Post image"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  
                  {selectedPost.tags && (
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                <h4 className="font-medium">Bình luận ({selectedPost.comments.length})</h4>
                {selectedPost.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-800 mb-2">{comment.content}</p>
                      <button
                        onClick={() => handleLikeComment(selectedPost.id, comment.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500"
                      >
                        <Heart className="h-3 w-3" />
                        {comment.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="border-t pt-3 flex-shrink-0">
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Viết bình luận..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={isEditPostOpen} onOpenChange={setIsEditPostOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
            <DialogDescription>
              Cập nhật nội dung bài viết của bạn
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <div className="space-y-6">
              {/* Post Form */}
              <div className="space-y-4">
                {!editingPost.isPersonal && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <Input
                      placeholder="Tiêu đề bài viết..."
                      value={editingPost.title || ""}
                      onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nội dung</label>
                  <Textarea
                    placeholder="Nội dung bài viết..."
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                    rows={8}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Danh mục</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={editingPost.category || "Chia sẻ"}
                      onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                    >
                      {postCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hình ảnh (URL)</label>
                    <Input
                      placeholder="https://..."
                      value={editingPost.image || ""}
                      onChange={(e) => setEditingPost({...editingPost, image: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Thẻ tag</label>
                  <Input
                    placeholder="Monstera, chăm sóc, kinh nghiệm..."
                    value={editingPost.tags ? editingPost.tags.join(", ") : ""}
                    onChange={(e) => setEditingPost({...editingPost, tags: e.target.value.split(",").map(tag => tag.trim())})}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsEditPostOpen(false)} className="flex-1">
                  Hủy
                </Button>
                <Button onClick={handleEditPost} className="flex-1 bg-green-600 hover:bg-green-700">
                  Cập nhật
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}