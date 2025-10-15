// import { useState } from "react";
// import { Card, CardContent, CardHeader } from "./ui/card";
// import { Button } from "./ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Badge } from "./ui/badge";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import { 
//   Plus, 
//   Heart, 
//   MessageCircle, 
//   Share2, 
//   Search,
//   Image as ImageIcon,
//   Send,
//   MoreHorizontal,
//   Clock
// } from "lucide-react";
// import { ImageWithFallback } from "./figma/ImageWithFallback";

// interface Post {
//   id: number;
//   author: {
//     name: string;
//     avatar: string;
//     verified?: boolean;
//   };
//   content: string;
//   image?: string;
//   timestamp: string;
//   likes: number;
//   comments: Comment[];
//   shares: number;
//   isPersonal: boolean;
//   tags?: string[];
// }

// interface Comment {
//   id: number;
//   author: {
//     name: string;
//     avatar: string;
//   };
//   content: string;
//   timestamp: string;
//   likes: number;
// }

// export function BlogPage() {
//   const [activeTab, setActiveTab] = useState("community");
//   const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);
//   const [newComment, setNewComment] = useState("");

//   const [posts, setPosts] = useState<Post[]>([
//     {
//       id: 1,
//       author: {
//         name: "Minh Thư",
//         avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&q=80",
//         verified: true
//       },
//       content: "Monstera của mình sau 3 tháng chăm sóc 🌿 Từ một cây nhỏ giờ đã to thế này! Bí quyết là tưới đều đặn và để nơi có ánh sáng gián tiếp. Các bạn có tips gì hay chia sẻ thêm nhé!",
//       image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
//       timestamp: "2 giờ trước",
//       likes: 156,
//       comments: [
//         {
//           id: 1,
//           author: {
//             name: "Hoàng Anh",
//             avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
//           },
//           content: "Cây đẹp quá! Cho mình hỏi bao lâu tưới một lần ạ?",
//           timestamp: "1 giờ trước",
//           likes: 12
//         },
//         {
//           id: 2,
//           author: {
//             name: "Thu Hà",
//             avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
//           },
//           content: "Wow, lá to và xanh tươi thế! Mình cũng muốn trồng một cây như vậy.",
//           timestamp: "45 phút trước",
//           likes: 8
//         }
//       ],
//       shares: 23,
//       isPersonal: false,
//       tags: ["Monstera", "Chăm sóc cây", "Kinh nghiệm"]
//     },
//     {
//       id: 2,
//       author: {
//         name: "Trần Thị B",
//         avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&q=80"
//       },
//       content: "Hôm nay tưới nước và bón phân cho tất cả cây trong vườn. Cảm giác thật thư giãn khi chăm sóc cây cối 🌱 Ai cũng thích không gian xanh trong nhà không?",
//       image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
//       timestamp: "4 giờ trước",
//       likes: 67,
//       comments: [
//         {
//           id: 3,
//           author: {
//             name: "Văn Đức",
//             avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
//           },
//           content: "Mình cũng vậy! Chăm cây giúp tâm trạng thoải mái hơn nhiều.",
//           timestamp: "3 giờ trước",
//           likes: 5
//         }
//       ],
//       shares: 12,
//       isPersonal: true,
//       tags: ["Vườn nhà", "Thư giãn"]
//     },
//     {
//       id: 3,
//       author: {
//         name: "Quốc Anh",
//         avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
//       },
//       content: "Xin tư vấn: Sen đá của mình lá bị nhăn và mềm như thế này. Có ai biết nguyên nhân không ạ? Cảm ơn mọi người! 😔",
//       image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&q=80",
//       timestamp: "6 giờ trước",
//       likes: 34,
//       comments: [
//         {
//           id: 4,
//           author: {
//             name: "Chuyên gia Hương",
//             avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&q=80"
//           },
//           content: "Có thể do tưới quá nhiều nước. Sen đá cần ít nước, tưới khi đất khô hoàn toàn nhé!",
//           timestamp: "5 giờ trước",
//           likes: 25
//         }
//       ],
//       shares: 8,
//       isPersonal: false,
//       tags: ["Sen đá", "Tư vấn", "Cứu cây"]
//     }
//   ]);

//   const [newPost, setNewPost] = useState({
//     content: "",
//     image: "",
//     tags: "",
//     isPersonal: true
//   });

//   const currentUser = {
//     name: "Trần Thị B",
//     avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&q=80"
//   };

//   const popularTags = [
//     "Monstera", "Sen đá", "Chăm sóc cây", "Tư vấn", "Kinh nghiệm", 
//     "Vườn nhà", "Cây trong nhà", "Bệnh cây", "Phân bón", "Tưới nước"
//   ];

//   const handleCreatePost = () => {
//     if (!newPost.content.trim()) return;

//     const post: Post = {
//       id: posts.length + 1,
//       author: currentUser,
//       content: newPost.content,
//       image: newPost.image || undefined,
//       timestamp: "Vừa xong",
//       likes: 0,
//       comments: [],
//       shares: 0,
//       isPersonal: newPost.isPersonal,
//       tags: newPost.tags ? newPost.tags.split(",").map(tag => tag.trim()) : undefined
//     };

//     setPosts([post, ...posts]);
//     setNewPost({ content: "", image: "", tags: "", isPersonal: true });
//     setIsCreatePostOpen(false);
//   };

//   const handleLikePost = (postId: number) => {
//     setPosts(posts.map(post => 
//       post.id === postId 
//         ? { ...post, likes: post.likes + 1 }
//         : post
//     ));
//   };

//   const handleLikeComment = (postId: number, commentId: number) => {
//     setPosts(posts.map(post => {
//       if (post.id === postId) {
//         return {
//           ...post,
//           comments: post.comments.map(comment =>
//             comment.id === commentId
//               ? { ...comment, likes: comment.likes + 1 }
//               : comment
//           )
//         };
//       }
//       return post;
//     }));
//   };

//   const handleAddComment = () => {
//     if (!newComment.trim() || !selectedPost) return;

//     const comment: Comment = {
//       id: Date.now(),
//       author: currentUser,
//       content: newComment,
//       timestamp: "Vừa xong",
//       likes: 0
//     };

//     setPosts(posts.map(post => {
//       if (post.id === selectedPost.id) {
//         return {
//           ...post,
//           comments: [...post.comments, comment]
//         };
//       }
//       return post;
//     }));

//     setNewComment("");
//     setSelectedPost({
//       ...selectedPost,
//       comments: [...selectedPost.comments, comment]
//     });
//   };

//   const filteredPosts = posts.filter(post => {
//     const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
//     const matchesTab = activeTab === "community" ? !post.isPersonal : 
//                       activeTab === "personal" ? post.isPersonal : true;
    
//     return matchesSearch && matchesTab;
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* Header */}
//       <div className="bg-green-600 text-white p-4">
//         <h1 className="text-xl font-semibold">Blog & Cộng đồng</h1>
//         <p className="text-sm opacity-90">Chia sẻ và học hỏi kinh nghiệm chăm sóc cây</p>
//       </div>

//       <div className="p-4 space-y-4">
//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Tìm kiếm bài viết, tác giả..."
//             className="pl-9 bg-white"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* Popular Tags */}
//         <div className="bg-white p-4 rounded-lg shadow-sm">
//           <h3 className="font-semibold mb-3">Thẻ phổ biến</h3>
//           <div className="flex flex-wrap gap-2">
//             {popularTags.slice(0, 6).map((tag, index) => (
//               <Badge
//                 key={index}
//                 variant="outline"
//                 className="cursor-pointer hover:bg-green-50 hover:border-green-200"
//                 onClick={() => setSearchTerm(tag)}
//               >
//                 #{tag}
//               </Badge>
//             ))}
//           </div>
//         </div>

//         {/* Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="community">Cộng đồng</TabsTrigger>
//             <TabsTrigger value="personal">Cá nhân</TabsTrigger>
//           </TabsList>

//           {/* Create Post Button */}
//           <div className="mt-4">
//             <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
//               <DialogTrigger asChild>
//                 <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Tạo bài viết mới
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[500px]">
//                 <DialogHeader>
//                   <DialogTitle>Tạo bài viết mới</DialogTitle>
//                 </DialogHeader>
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3">
//                     <Avatar className="w-10 h-10">
//                       <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
//                       <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="font-medium">{currentUser.name}</p>
//                       <div className="flex gap-2">
//                         <Button
//                           variant={newPost.isPersonal ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setNewPost({...newPost, isPersonal: true})}
//                           className="text-xs"
//                         >
//                           Cá nhân
//                         </Button>
//                         <Button
//                           variant={!newPost.isPersonal ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setNewPost({...newPost, isPersonal: false})}
//                           className="text-xs"
//                         >
//                           Cộng đồng
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <Textarea
//                     placeholder="Chia sẻ kinh nghiệm chăm sóc cây của bạn..."
//                     value={newPost.content}
//                     onChange={(e) => setNewPost({...newPost, content: e.target.value})}
//                     className="min-h-[120px] resize-none"
//                   />
                  
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <ImageIcon className="h-4 w-4 text-gray-500" />
//                       <span className="text-sm text-gray-600">Thêm hình ảnh</span>
//                     </div>
//                     <Input
//                       placeholder="URL hình ảnh (tùy chọn)"
//                       value={newPost.image}
//                       onChange={(e) => setNewPost({...newPost, image: e.target.value})}
//                     />
//                   </div>
                  
//                   <Input
//                     placeholder="Thêm thẻ (phân cách bằng dấu phẩy)"
//                     value={newPost.tags}
//                     onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
//                   />
                  
//                   <div className="flex gap-2">
//                     <Button variant="outline" onClick={() => setIsCreatePostOpen(false)} className="flex-1">
//                       Hủy
//                     </Button>
//                     <Button onClick={handleCreatePost} className="flex-1 bg-green-600 hover:bg-green-700">
//                       Đăng bài
//                     </Button>
//                   </div>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>

//           {/* Posts */}
//           <TabsContent value={activeTab} className="space-y-4 mt-4">
//             {filteredPosts.length === 0 ? (
//               <Card className="bg-white shadow-sm">
//                 <CardContent className="p-8 text-center">
//                   <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold mb-2">Chưa có bài viết nào</h3>
//                   <p className="text-gray-500 mb-4">
//                     {activeTab === "personal" 
//                       ? "Bạn chưa có bài viết cá nhân nào. Hãy chia sẻ kinh nghiệm của bạn!"
//                       : "Chưa có bài viết nào phù hợp với tìm kiếm của bạn."
//                     }
//                   </p>
//                   <Button 
//                     onClick={() => setIsCreatePostOpen(true)}
//                     className="bg-green-600 hover:bg-green-700"
//                   >
//                     Tạo bài viết đầu tiên
//                   </Button>
//                 </CardContent>
//               </Card>
//             ) : (
//               filteredPosts.map((post) => (
//                 <Card key={post.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
//                   <CardHeader className="pb-3">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <Avatar className="w-10 h-10">
//                           <AvatarImage src={post.author.avatar} alt={post.author.name} />
//                           <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <div className="flex items-center gap-2">
//                             <p className="font-semibold">{post.author.name}</p>
//                             {post.author.verified && (
//                               <Badge variant="secondary" className="text-xs px-1 py-0">
//                                 ✓
//                               </Badge>
//                             )}
//                             <Badge 
//                               variant="outline" 
//                               className={`text-xs ${post.isPersonal ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}
//                             >
//                               {post.isPersonal ? 'Cá nhân' : 'Cộng đồng'}
//                             </Badge>
//                           </div>
//                           <div className="flex items-center gap-1 text-sm text-gray-500">
//                             <Clock className="h-3 w-3" />
//                             <span>{post.timestamp}</span>
//                           </div>
//                         </div>
//                       </div>
//                       <Button variant="ghost" size="sm">
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </CardHeader>
                  
//                   <CardContent className="pt-0">
//                     <p className="mb-4 text-gray-800 leading-relaxed">{post.content}</p>
                    
//                     {post.image && (
//                       <div className="mb-4">
//                         <ImageWithFallback
//                           src={post.image}
//                           alt="Post image"
//                           className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-95"
//                         />
//                       </div>
//                     )}
                    
//                     {post.tags && post.tags.length > 0 && (
//                       <div className="flex flex-wrap gap-2 mb-4">
//                         {post.tags.map((tag, index) => (
//                           <Badge 
//                             key={index} 
//                             variant="secondary" 
//                             className="cursor-pointer hover:bg-green-50 text-xs"
//                             onClick={() => setSearchTerm(tag)}
//                           >
//                             #{tag}
//                           </Badge>
//                         ))}
//                       </div>
//                     )}
                    
//                     <div className="flex items-center justify-between pt-3 border-t">
//                       <div className="flex items-center gap-6">
//                         <button
//                           onClick={() => handleLikePost(post.id)}
//                           className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
//                         >
//                           <Heart className="h-5 w-5" />
//                           <span className="text-sm">{post.likes}</span>
//                         </button>
//                         <button
//                           onClick={() => setSelectedPost(post)}
//                           className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
//                         >
//                           <MessageCircle className="h-5 w-5" />
//                           <span className="text-sm">{post.comments.length}</span>
//                         </button>
//                         <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
//                           <Share2 className="h-5 w-5" />
//                           <span className="text-sm">{post.shares}</span>
//                         </button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </TabsContent>
//         </Tabs>

//         {/* Comments Dialog */}
//         <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
//           <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
//             <DialogHeader>
//               <DialogTitle>Bình luận</DialogTitle>
//             </DialogHeader>
//             {selectedPost && (
//               <div className="flex-1 overflow-hidden flex flex-col">
//                 {/* Post Content */}
//                 <div className="border-b pb-4 mb-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Avatar className="w-8 h-8">
//                       <AvatarImage src={selectedPost.author.avatar} alt={selectedPost.author.name} />
//                       <AvatarFallback>{selectedPost.author.name.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <span className="font-medium">{selectedPost.author.name}</span>
//                     <span className="text-sm text-gray-500">{selectedPost.timestamp}</span>
//                   </div>
//                   <p className="text-sm">{selectedPost.content}</p>
//                 </div>

//                 {/* Comments List */}
//                 <div className="flex-1 overflow-y-auto space-y-3 mb-4">
//                   {selectedPost.comments.map((comment) => (
//                     <div key={comment.id} className="flex gap-3">
//                       <Avatar className="w-8 h-8 flex-shrink-0">
//                         <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
//                         <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1 bg-gray-50 rounded-lg p-3">
//                         <div className="flex justify-between items-start mb-1">
//                           <span className="font-medium text-sm">{comment.author.name}</span>
//                           <span className="text-xs text-gray-500">{comment.timestamp}</span>
//                         </div>
//                         <p className="text-sm text-gray-800 mb-2">{comment.content}</p>
//                         <button
//                           onClick={() => handleLikeComment(selectedPost.id, comment.id)}
//                           className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500"
//                         >
//                           <Heart className="h-3 w-3" />
//                           {comment.likes}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Add Comment */}
//                 <div className="border-t pt-3">
//                   <div className="flex gap-2">
//                     <Avatar className="w-8 h-8 flex-shrink-0">
//                       <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
//                       <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 flex gap-2">
//                       <Input
//                         placeholder="Viết bình luận..."
//                         value={newComment}
//                         onChange={(e) => setNewComment(e.target.value)}
//                         onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
//                         className="flex-1"
//                       />
//                       <Button
//                         onClick={handleAddComment}
//                         disabled={!newComment.trim()}
//                         size="sm"
//                         className="bg-green-600 hover:bg-green-700"
//                       >
//                         <Send className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }