// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Badge } from "./ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import { Search, Star, Droplets, Sun, Scissors } from "lucide-react";
// import { ImageWithFallback } from "./figma/ImageWithFallback";

// export function PlantLibrary() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");

//   const categories = [
//     { id: "all", name: "Tất cả" },
//     { id: "indoor", name: "Cây trong nhà" },
//     { id: "succulent", name: "Cây sen đá" },
//     { id: "flowering", name: "Cây có hoa" },
//     { id: "air-purifying", name: "Lọc không khí" },
//     { id: "low-light", name: "Ít ánh sáng" }
//   ];

//   const plants = [
//     {
//       id: 1,
//       name: "Cây Lan Ý",
//       scientificName: "Spathiphyllum",
//       category: "air-purifying",
//       difficulty: "Dễ",
//       image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&q=80",
//       care: {
//         water: "Mỗi tuần 1-2 lần",
//         light: "Ánh sáng gián tiếp",
//         humidity: "60-70%",
//         fertilizer: "Tháng 1 lần"
//       },
//       benefits: ["Lọc không khí", "Dễ chăm sóc", "Hoa đẹp"],
//       tips: "Lá vàng thường do tưới quá nhiều nước hoặc ánh sáng quá mạnh."
//     },
//     {
//       id: 2,
//       name: "Cây Trầu Bà",
//       scientificName: "Epipremnum aureum",
//       category: "indoor",
//       difficulty: "Rất dễ",
//       image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&q=80",
//       care: {
//         water: "Khi đất khô",
//         light: "Ánh sáng yếu - vừa",
//         humidity: "40-60%",
//         fertilizer: "2 tháng 1 lần"
//       },
//       benefits: ["Lọc không khí", "Phát triển nhanh", "Chịu bóng"],
//       tips: "Có thể trồng trong nước hoặc đất. Cắt tỉa thường xuyên để cây bụi hơn."
//     },
//     {
//       id: 3,
//       name: "Cây Lưỡi Hổ",
//       scientificName: "Sansevieria trifasciata",
//       category: "low-light",
//       difficulty: "Rất dễ",
//       image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&q=80",
//       care: {
//         water: "2-3 tuần 1 lần",
//         light: "Ít ánh sáng",
//         humidity: "30-50%",
//         fertilizer: "3 tháng 1 lần"
//       },
//       benefits: ["Lọc không khí ban đêm", "Chịu hạn", "Không độc"],
//       tips: "Tránh tưới nước vào lõi cây. Rất chịu được bỏ quên."
//     },
//     {
//       id: 4,
//       name: "Sen Đá Echeveria",
//       scientificName: "Echeveria elegans",
//       category: "succulent",
//       difficulty: "Dễ",
//       image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80",
//       care: {
//         water: "7-10 ngày 1 lần",
//         light: "Ánh sáng mạnh",
//         humidity: "30-40%",
//         fertilizer: "Mùa xuân hè"
//       },
//       benefits: ["Đẹp", "Compact", "Ít chăm sóc"],
//       tips: "Tưới vào gốc, tránh nước đọng trên lá. Cần ánh sáng mạnh."
//     }
//   ];

//   const articles = [
//     {
//       id: 1,
//       title: "5 Lỗi thường gặp khi chăm sóc cây trong nhà",
//       excerpt: "Tìm hiểu những sai lầm phổ biến và cách khắc phục...",
//       readTime: "5 phút",
//       category: "Hướng dẫn"
//     },
//     {
//       id: 2,
//       title: "Cách bố trí cây cảnh trong phòng khách",
//       excerpt: "Làm thế nào để tạo không gian xanh hài hòa...",
//       readTime: "8 phút",
//       category: "Decor"
//     },
//     {
//       id: 3,
//       title: "Top 10 cây lọc không khí tốt nhất",
//       excerpt: "Những loài cây giúp thanh lọc không khí hiệu quả...",
//       readTime: "6 phút",
//       category: "Sức khỏe"
//     }
//   ];

//   const filteredPlants = plants.filter(plant => {
//     const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === "all" || plant.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case "Rất dễ": return "bg-green-100 text-green-800";
//       case "Dễ": return "bg-blue-100 text-blue-800";
//       case "Trung bình": return "bg-yellow-100 text-yellow-800";
//       case "Khó": return "bg-red-100 text-red-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-4">Thư viện cây cảnh</h1>
//         <p className="text-muted-foreground mb-6">
//           Khám phá hơn 500+ loài cây cảnh với hướng dẫn chăm sóc chi tiết
//         </p>
        
//         {/* Search */}
//         <div className="relative mb-6">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Tìm kiếm cây cảnh..."
//             className="pl-9"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* Categories */}
//         <div className="flex flex-wrap gap-2 mb-6">
//           {categories.map((category) => (
//             <Button
//               key={category.id}
//               variant={selectedCategory === category.id ? "default" : "outline"}
//               size="sm"
//               onClick={() => setSelectedCategory(category.id)}
//               className={selectedCategory === category.id ? "bg-green-600 hover:bg-green-700" : ""}
//             >
//               {category.name}
//             </Button>
//           ))}
//         </div>
//       </div>

//       <Tabs defaultValue="plants" className="w-full">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="plants">Danh sách cây</TabsTrigger>
//           <TabsTrigger value="articles">Bài viết</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="plants" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredPlants.map((plant) => (
//               <Card key={plant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//                 <div className="relative">
//                   <ImageWithFallback
//                     src={plant.image}
//                     alt={plant.name}
//                     className="w-full h-48 object-cover"
//                   />
//                   <Badge className={`absolute top-2 right-2 ${getDifficultyColor(plant.difficulty)}`}>
//                     {plant.difficulty}
//                   </Badge>
//                 </div>
//                 <CardHeader>
//                   <CardTitle className="flex justify-between items-start">
//                     <div>
//                       <h3>{plant.name}</h3>
//                       <p className="text-sm text-muted-foreground italic">{plant.scientificName}</p>
//                     </div>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div className="flex items-center gap-1">
//                         <Droplets className="h-3 w-3 text-blue-500" />
//                         <span>{plant.care.water}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Sun className="h-3 w-3 text-yellow-500" />
//                         <span>{plant.care.light}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex flex-wrap gap-1">
//                       {plant.benefits.slice(0, 2).map((benefit, index) => (
//                         <Badge key={index} variant="secondary" className="text-xs">
//                           {benefit}
//                         </Badge>
//                       ))}
//                     </div>
                    
//                     <p className="text-sm text-muted-foreground">{plant.tips}</p>
                    
//                     <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
//                       Xem chi tiết
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>
        
//         <TabsContent value="articles" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {articles.map((article) => (
//               <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow">
//                 <CardHeader>
//                   <div className="flex justify-between items-start mb-2">
//                     <Badge variant="outline">{article.category}</Badge>
//                     <span className="text-sm text-muted-foreground">{article.readTime}</span>
//                   </div>
//                   <CardTitle className="leading-tight">{article.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground mb-4">{article.excerpt}</p>
//                   <Button variant="outline" size="sm">
//                     Đọc thêm
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }