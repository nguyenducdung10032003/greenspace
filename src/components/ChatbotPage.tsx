// import { useState } from "react";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Avatar, AvatarFallback } from "./ui/avatar";
// import { ScrollArea } from "./ui/scroll-area";
// import { Send, RefreshCw, Bot, User } from "lucide-react";

// interface Message {
//   id: number;
//   text: string;
//   sender: "user" | "bot";
//   timestamp: Date;
// }

// export function ChatbotPage() {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       text: "Hello there! How can I help you today?",
//       sender: "bot",
//       timestamp: new Date()
//     }
//   ]);
  
//   const [inputMessage, setInputMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);

//   const botResponses: Record<string, string> = {
//     "chăm sóc": "Để chăm sóc cây tốt, bạn cần chú ý:\n• Tưới nước đúng lượng\n• Đảm bảo ánh sáng phù hợp\n• Bón phân định kỳ\n• Kiểm tra sâu bệnh thường xuyên",
//     "tưới nước": "Nguyên tắc tưới nước:\n• Kiểm tra độ ẩm đất bằng tay\n• Tưới khi đất khô 2-3cm\n• Tưới từ từ, đều khắp\n• Tránh để nước đọng",
//     "ánh sáng": "Về ánh sáng cho cây:\n• Đặt cây gần cửa sổ có ánh sáng gián tiếp\n• Tránh ánh nắng trực tiếp vào buổi trưa\n• Xoay chậu định kỳ để cây phát triển đều",
//     "phân bón": "Hướng dẫn bón phân:\n• Bón phân lỏng 2 tuần/lần\n• Pha loãng theo hướng dẫn\n• Bón vào buổi sáng sớm hoặc chiều mát\n• Tưới nước trước khi bón phân",
//     "sâu bệnh": "Cách xử lý sâu bệnh:\n• Kiểm tra lá thường xuyên\n• Cách ly cây bị bệnh\n• Sử dụng thuốc sinh học\n• Tăng cường thông gió"
//   };

//   const quickQuestions = [
//     "Cách chăm sóc cây cảnh?",
//     "Khi nào tưới nước?",
//     "Cây cần bao nhiêu ánh sáng?",
//     "Cách bón phán cho cây?",
//     "Xử lý sâu bệnh như thế nào?"
//   ];

//   const findBotResponse = (message: string): string => {
//     const lowerMessage = message.toLowerCase();
    
//     for (const [key, response] of Object.entries(botResponses)) {
//       if (lowerMessage.includes(key)) {
//         return response;
//       }
//     }
    
//     return "Tôi hiểu bạn đang hỏi về chăm sóc cây cảnh. Để được hỗ trợ tốt hơn, bạn có thể hỏi về:\n• Cách tưới nước\n• Ánh sáng cho cây\n• Bón phân\n• Xử lý sâu bệnh\n• Chăm sóc tổng quả";
//   };

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const newMessage: Message = {
//       id: messages.length + 1,
//       text: inputMessage,
//       sender: "user",
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, newMessage]);
//     setInputMessage("");
//     setIsTyping(true);

//     // Simulate bot thinking time
//     setTimeout(() => {
//       const botResponse = findBotResponse(inputMessage);
//       const botMessage: Message = {
//         id: messages.length + 2,
//         text: botResponse,
//         sender: "bot",
//         timestamp: new Date()
//       };
      
//       setMessages(prev => [...prev, botMessage]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   const handleQuickQuestion = (question: string) => {
//     setInputMessage(question);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const clearChat = () => {
//     setMessages([{
//       id: 1,
//       text: "Hello there! How can I help you today?",
//       sender: "bot",
//       timestamp: new Date()
//     }]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* Header */}
//       <div className="bg-green-600 text-white px-4 py-4 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <Bot className="h-6 w-6" />
//           <h1 className="text-lg font-semibold">ChatBot AI chăm sóc cây</h1>
//         </div>
//         <Button 
//           variant="ghost" 
//           size="sm"
//           onClick={clearChat}
//           className="text-white hover:bg-green-700"
//         >
//           <RefreshCw className="h-4 w-4" />
//         </Button>
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-1 p-4">
//         <ScrollArea className="h-[calc(100vh-200px)]">
//           <div className="space-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex gap-3 ${
//                   message.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {message.sender === "bot" && (
//                   <Avatar className="w-8 h-8 flex-shrink-0">
//                     <AvatarFallback className="bg-green-100">
//                       <Bot className="h-4 w-4 text-green-600" />
//                     </AvatarFallback>
//                   </Avatar>
//                 )}
                
//                 <div
//                   className={`max-w-[80%] rounded-2xl px-4 py-3 ${
//                     message.sender === "user"
//                       ? "bg-green-600 text-white rounded-br-none"
//                       : "bg-white text-gray-800 rounded-bl-none shadow-sm border"
//                   }`}
//                 >
//                   <p className="whitespace-pre-line text-sm">{message.text}</p>
//                 </div>
                
//                 {message.sender === "user" && (
//                   <Avatar className="w-8 h-8 flex-shrink-0">
//                     <AvatarFallback className="bg-blue-100">
//                       <User className="h-4 w-4 text-blue-600" />
//                     </AvatarFallback>
//                   </Avatar>
//                 )}
//               </div>
//             ))}
            
//             {isTyping && (
//               <div className="flex gap-3 justify-start">
//                 <Avatar className="w-8 h-8">
//                   <AvatarFallback className="bg-green-100">
//                     <Bot className="h-4 w-4 text-green-600" />
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border">
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </ScrollArea>

//         {/* Quick Questions */}
//         {messages.length === 1 && (
//           <div className="mt-4 space-y-2">
//             <p className="text-sm text-gray-600 font-medium">Câu hỏi gợi ý:</p>
//             <div className="flex flex-wrap gap-2">
//               {quickQuestions.map((question, index) => (
//                 <Button
//                   key={index}
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleQuickQuestion(question)}
//                   className="text-xs bg-white hover:bg-green-50 border-green-200"
//                 >
//                   {question}
//                 </Button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Input Area */}
//       <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4">
//         <div className="flex gap-2">
//           <Input
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Nhập câu hỏi về cây..."
//             className="flex-1 rounded-full border-gray-300 focus:border-green-500"
//           />
//           <Button
//             onClick={handleSendMessage}
//             disabled={!inputMessage.trim() || isTyping}
//             size="sm"
//             className="rounded-full bg-green-600 hover:bg-green-700 p-3"
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }