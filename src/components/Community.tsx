// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Button } from "./ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Badge } from "./ui/badge";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import { 
//   Heart, 
//   MessageCircle, 
//   Share2, 
//   Plus, 
//   Search, 
//   TrendingUp,
//   Award,
//   Users,
//   Camera,
//   MapPin,
//   Clock
// } from "lucide-react";
// import { ImageWithFallback } from "./figma/ImageWithFallback";

// interface Post {
//   id: number;
//   author: {
//     name: string;
//     avatar: string;
//     level: string;
//     verified: boolean;
//   };
//   content: string;
//   image?: string;
//   tags: string[];
//   likes: number;
//   comments: number;
//   shares: number;
//   timestamp: string;
//   location?: string;
// }

// interface User {
//   id: number;
//   name: string;
//   avatar: string;
//   level: string;
//   points: number;
//   plantsCount: number;
//   followers: number;
//   following: number;
// }

// export function Community() {
//   const [activeTab, setActiveTab] = useState("posts");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
//   const [newPost, setNewPost] = useState({ content: "", image: "", tags: "" });

//   const [posts, setPosts] = useState<Post[]>([
//     {
//       id: 1,
//       author: {
//         name: "Minh Thư",
//         avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&q=80",
//         level: "Chuyên gia",
//         verified: true
//       },
//       content: "Monstera của mình sau 3 tháng chăm sóc 🌿 Lá to đẹp quá! Bí quyết là tưới đều đặn và để nơi có ánh sáng gián tiếp. Ai cần tư vấn cứ hỏi nhé!",
//       image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
//       tags: ["Monstera", "Chăm sóc", "Kinh nghiệm"],
//       likes: 156,
//       comments: 23,
//       shares: 12,
//       timestamp: "2 giờ trước",
//       location: "TP. Hồ Chí Minh"
//     },
//     {
//       id: 2,
//       author: {
//         name: "Hoàng Anh",
//         avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
//         level: "Người mới",
//         verified: false
//       },
//       content: "Xin tư vấn: Cây lan ý nhà mình lá bị vàng từng đốm như thế này. Có ai biết nguyên nhân không ạ? 😔",
//       image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&q=80",
//       tags: ["Tư vấn", "Lan ý", "Bệnh cây"],
//       likes: 34,
//       comments: 18,
//       shares: 5,
//       timestamp: "4 giờ trước",
//       location: "Hà Nội"
//     },
//     {
//       id: 3,
//       author: {
//         name: "Thảo Nguyên",
//         avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
//         level: "Có kinh nghiệm",
//         verified: true
//       },
//       content: "Góc cây cảnh mini trong phòng làm việc 🌱 Năng suất tăng vọt khi có xanh quanh mình hihi. Setup này ai thích không?",
//       image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
//       tags: ["Office plants", "Decor", "Setup"],
//       likes: 89,
//       comments: 12,
//       shares: 25,
//       timestamp: "1 ngày trước",
//       location: "Đà Nẵng"
//     }
//   ]);

//   const topUsers: User[] = [
//     {
//       id: 1,
//       name: "Minh Thư",
//       avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&q=80",
//       level: "Chuyên gia",
//       points: 2450,
//       plantsCount: 67,
//       followers: 1234,
//       following: 234
//     },
//     {
//       id: 2,
//       name: "Việt Anh",
//       avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
//       level: "Có kinh nghiệm",
//       points: 1890,
//       plantsCount: 45,
//       followers: 892,
//       following: 156
//     },
//     {
//       id: 3,
//       name: "Thảo Nguyên",
//       avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
//       level: "Có kinh nghiệm",
//       points: 1654,
//       plantsCount: 38,
//       followers: 567,
//       following: 189
//     }
//   ];

//   const trendingTags = [
//     { name: "Monstera", count: 234 },
//     { name: "Sen đá", count: 189 },
//     { name: "Decor", count: 156 },
//     { name: "Tư vấn", count: 134 },
//     { name: "Bệnh cây", count: 98 },
//     { name: "Office plants", count: 87 }
//   ];

//   const handleLike = (postId: number) => {
//     setPosts(posts.map(post => 
//       post.id === postId 
//         ? { ...post, likes: post.likes + 1 }
//         : post
//     ));
//   };

//   const handleCreatePost = () => {
//     if (newPost.content.trim()) {
//       const post: Post = {
//         id: posts.length + 1,
//         author: {
//           name: "Bạn",
//           avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
//           level: "Người mới",
//           verified: false
//         },
//         content: newPost.content,
//         image: newPost.image || undefined,
//         tags: newPost.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
//         likes: 0,
//         comments: 0,
//         shares: 0,
//         timestamp: "Vừa xong"
//       };
      
//       setPosts([post, ...posts]);
//       setNewPost({ content: "", image: "", tags: "" });
//       setIsCreatePostOpen(false);
//     }
//   };

//   const getLevelColor = (level: string) => {
//     switch (level) {
//       case "Chuyên gia": return "bg-purple-100 text-purple-800";
//       case "Có kinh nghiệm": return "bg-blue-100 text-blue-800";
//       case "Người mới": return "bg-green-100 text-green-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   const filteredPosts = posts.filter(post =>
//     post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Cộng đồng PlantCare</h1>
//             <p className="text-muted-foreground">
//               Kết nối với những người yêu cây cảnh trên khắp Việt Nam
//             </p>
//           </div>
//           <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
//             <DialogTrigger asChild>
//               <Button className="bg-green-600 hover:bg-green-700">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Tạo bài viết
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[500px]">
//               <DialogHeader>
//                 <DialogTitle>Tạo bài viết mới</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <Textarea
//                   placeholder="Chia sẻ kinh nghiệm chăm sóc cây của bạn..."
//                   value={newPost.content}
//                   onChange={(e) => setNewPost({...newPost, content: e.target.value})}
//                   className="min-h-[100px]"
//                 />
//                 <Input
//                   placeholder="URL hình ảnh (tùy chọn)"
//                   value={newPost.image}
//                   onChange={(e) => setNewPost({...newPost, image: e.target.value})}
//                 />
//                 <Input
//                   placeholder="Tags (phân cách bằng dấu phẩy)"
//                   value={newPost.tags}
//                   onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
//                 />
//                 <div className="flex justify-end gap-2">
//                   <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
//                     Hủy
//                   </Button>
//                   <Button onClick={handleCreatePost} className="bg-green-600 hover:bg-green-700">
//                     Đăng bài
//                   </Button>
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Search */}
//         <div className="relative mb-6">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Tìm kiếm bài viết, tags..."
//             className="pl-9"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Sidebar */}
//         <div className="lg:col-span-1 space-y-6">
//           {/* Community Stats */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Users className="h-5 w-5 text-green-600" />
//                 Thống kê cộng đồng
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-sm text-muted-foreground">Thành viên</span>
//                 <span className="font-semibold">12,456</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-muted-foreground">Bài viết hôm nay</span>
//                 <span className="font-semibold">89</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-muted-foreground">Người online</span>
//                 <span className="font-semibold text-green-600">1,234</span>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Trending Tags */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <TrendingUp className="h-5 w-5 text-orange-600" />
//                 Tags thịnh hành
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 {trendingTags.map((tag, index) => (
//                   <div key={index} className="flex justify-between items-center">
//                     <Badge 
//                       variant="outline" 
//                       className="cursor-pointer hover:bg-green-50"
//                       onClick={() => setSearchTerm(tag.name)}
//                     >
//                       #{tag.name}
//                     </Badge>
//                     <span className="text-sm text-muted-foreground">{tag.count}</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Top Contributors */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Award className="h-5 w-5 text-yellow-600" />
//                 Top cống hiến
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {topUsers.map((user, index) => (
//                   <div key={user.id} className="flex items-center gap-3">
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm font-bold text-muted-foreground w-4">
//                         {index + 1}
//                       </span>
//                       <Avatar className="w-8 h-8">
//                         <AvatarImage src={user.avatar} alt={user.name} />
//                         <AvatarFallback>{user.name[0]}</AvatarFallback>
//                       </Avatar>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium truncate">{user.name}</p>
//                       <p className="text-xs text-muted-foreground">{user.points} điểm</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content */}
//         <div className="lg:col-span-3">
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="posts">Bài viết</TabsTrigger>
//               <TabsTrigger value="questions">Hỏi đáp</TabsTrigger>
//               <TabsTrigger value="showcase">Khoe cây</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="posts" className="space-y-6 mt-6">
//               {filteredPosts.map((post) => (
//                 <Card key={post.id} className="overflow-hidden">
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <Avatar className="w-10 h-10">
//                           <AvatarImage src={post.author.avatar} alt={post.author.name} />
//                           <AvatarFallback>{post.author.name[0]}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <div className="flex items-center gap-2">
//                             <p className="font-semibold">{post.author.name}</p>
//                             {post.author.verified && (
//                               <Badge variant="secondary" className="text-xs">
//                                 ✓ Xác thực
//                               </Badge>
//                             )}
//                           </div>
//                           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                             <Badge className={getLevelColor(post.author.level)} variant="outline">
//                               {post.author.level}
//                             </Badge>
//                             <span>•</span>
//                             <Clock className="h-3 w-3" />
//                             <span>{post.timestamp}</span>
//                             {post.location && (
//                               <>
//                                 <span>•</span>
//                                 <MapPin className="h-3 w-3" />
//                                 <span>{post.location}</span>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardHeader>
                  
//                   <CardContent className="pt-0">
//                     <p className="mb-4">{post.content}</p>
                    
//                     {post.image && (
//                       <div className="mb-4">
//                         <ImageWithFallback
//                           src={post.image}
//                           alt="Post image"
//                           className="w-full h-64 object-cover rounded-lg"
//                         />
//                       </div>
//                     )}
                    
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       {post.tags.map((tag, index) => (
//                         <Badge 
//                           key={index} 
//                           variant="secondary" 
//                           className="cursor-pointer hover:bg-green-50"
//                           onClick={() => setSearchTerm(tag)}
//                         >
//                           #{tag}
//                         </Badge>
//                       ))}
//                     </div>
                    
//                     <div className="flex items-center justify-between pt-3 border-t">
//                       <div className="flex items-center gap-4">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleLike(post.id)}
//                           className="flex items-center gap-1 hover:text-red-600"
//                         >
//                           <Heart className="h-4 w-4" />
//                           <span>{post.likes}</span>
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="flex items-center gap-1 hover:text-blue-600"
//                         >
//                           <MessageCircle className="h-4 w-4" />
//                           <span>{post.comments}</span>
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="flex items-center gap-1 hover:text-green-600"
//                         >
//                           <Share2 className="h-4 w-4" />
//                           <span>{post.shares}</span>
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </TabsContent>
            
//             <TabsContent value="questions" className="space-y-6 mt-6">
//               <Card>
//                 <CardContent className="p-8 text-center">
//                   <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold mb-2">Mục hỏi đáp</h3>
//                   <p className="text-muted-foreground mb-4">
//                     Nơi các thành viên đặt câu hỏi và nhận được lời tư vấn từ cộng đồng
//                   </p>
//                   <Button className="bg-green-600 hover:bg-green-700">
//                     Đặt câu hỏi đầu tiên
//                   </Button>
//                 </CardContent>
//               </Card>
//             </TabsContent>
            
//             <TabsContent value="showcase" className="space-y-6 mt-6">
//               <Card>
//                 <CardContent className="p-8 text-center">
//                   <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold mb-2">Khoe cây của bạn</h3>
//                   <p className="text-muted-foreground mb-4">
//                     Chia sẻ những bức ảnh đẹp về cây cảnh và không gian xanh của bạn
//                   </p>
//                   <Button className="bg-green-600 hover:bg-green-700">
//                     Khoe cây ngay
//                   </Button>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// }