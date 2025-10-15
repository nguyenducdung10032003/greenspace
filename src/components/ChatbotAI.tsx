import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Send,
  RefreshCw,
  Bot,
  User,
  Camera,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Clock,
  TrendingUp,
  Plus,
  X,
  Upload,
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
  type?: "text" | "analysis" | "recommendation";
  image?: string;
}

interface ChatSession {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: string;
}

export function ChatbotAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Xin chào! Tôi là Green AI Assistant - trợ lý thông minh chuyên về chăm sóc cây cảnh 🌱\n\nTôi có thể giúp bạn:\n• Chẩn đoán bệnh cây qua hình ảnh\n• Tư vấn cách chăm sóc cụ thể\n• Gợi ý loại cây phù hợp\n• Hỗ trợ thiết kế không gian xanh\n\nBạn cần hỗ trợ gì hôm nay?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "Chẩn đoán bệnh cây",
        "Tư vấn loại cây",
        "Hướng dẫn chăm sóc",
        "Thiết kế vườn",
      ],
      type: "text",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSession, setActiveSession] = useState(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 1,
      title: "Tư vấn chăm sóc Monstera",
      lastMessage: "Xin chào! Tôi là Green AI Assistant...",
      timestamp: "Hôm nay",
    },
    {
      id: 2,
      title: "Chẩn đoán lá vàng sen đá",
      lastMessage: "Dựa trên hình ảnh, cây của bạn...",
      timestamp: "Hôm qua",
    },
    {
      id: 3,
      title: "Gợi ý cây cho văn phòng",
      lastMessage: "Tôi khuyên bạn nên chọn...",
      timestamp: "2 ngày trước",
    },
  ]);

  const quickQuestions = [
    {
      category: "Chăm sóc cơ bản",
      questions: [
        "Cách tưới nước đúng cách?",
        "Khi nào nên bón phân?",
        "Cây cần bao nhiêu ánh sáng?",
        "Làm sao biết cây khỏe mạnh?",
      ],
    },
    {
      category: "Chẩn đoán vấn đề",
      questions: [
        "Lá cây bị vàng, nguyên nhân?",
        "Cây bị sâu bệnh xử lý thế nào?",
        "Cây héo úa mặc dù tưới nước?",
        "Lá có đốm nâu là bệnh gì?",
      ],
    },
    {
      category: "Lựa chọn cây",
      questions: [
        "Cây nào dễ chăm nhất?",
        "Cây phù hợp cho người mới?",
        "Cây nào lọc không khí tốt?",
        "Cây chịu được ít ánh sáng?",
      ],
    },
  ];

  const botResponses: Record<string, any> = {
    "tưới nước": {
      text: "🚿 **HƯỚNG DẪN TƯỚI NƯỚC ĐÚNG CÁCH**\n\n**Nguyên tắc vàng:**\n• Kiểm tra độ ẩm đất bằng ngón tay (2-3cm)\n• Tưới khi đất khô 70-80%\n• Tưới từ từ, đều khắp bề mặt\n• Đảm bảo nước thoát hết, không đọng\n\n**Dấu hiệu cần tưới:**\n• Đất khô, có vết nứt nhỏ\n• Lá hơi cong, mất độ căng\n• Chậu nhẹ hơn bình thường\n\n**Lưu ý theo mùa:**\n• Mùa hè: 2-3 ngày/lần\n• Mùa đông: 5-7 ngày/lần",
      type: "recommendation",
    },
    "bón phân": {
      text: "🌱 **HƯỚNG DẪN BÓN PHÂN CHO CÂY CẢNH**\n\n**Loại phân phù hợp:**\n• NPK 20-20-20 (cây lá)\n• NPK 10-30-20 (cây hoa)\n• Phân hữu cơ (compost, phân trùn)\n\n**Thời điểm bón:**\n• Mùa xuân-hè: 2-3 tuần/lần\n• Mùa thu-đông: 1 tháng/lần hoặc ngưng\n• Buổi sáng sớm hoặc chiều mát\n\n**Cách pha:**\n• Phân lỏng: pha loãng theo hướng dẫn\n• Tưới nước trước, bón phân sau\n• Không bón khi cây ốm, vừa thay chậu",
      type: "recommendation",
    },
    "lá vàng": {
      text: "🍃 **CHẨN ĐOÁN LÁ VÀNG**\n\n**Nguyên nhân phổ biến:**\n\n**1. Tưới quá nhiều nước (70% trường hợp)**\n• Lá vàng từ dưới lên\n• Đất ẩm ướt liên tục\n• Có thể có mùi hôi ở rễ\n\n**2. Thiếu nước**\n• Lá vàng, khô giòn\n• Đất khô cứng\n• Lá cong, nhăn\n\n**3. Thiếu ánh sáng**\n• Lá vàng nhạt, rụng nhiều\n• Cây phát triển chậm\n• Thân cây yếu\n\n**4. Thiếu dinh dưỡng**\n• Lá già vàng trước\n• Vân lá vẫn xanh\n• Cây không lớn\n\n**Cách khắc phục:**\n• Điều chỉnh lượng nước\n• Kiểm tra vị trí đặt cây\n• Bón phân bổ sung",
      type: "analysis",
    },
    "cây dễ chăm": {
      text: '🌿 **TOP 7 CÂY DỄ CHĂM CHO NGƯỜI MỚI**\n\n**1. Cây Lưỡi Hổ (Sansevieria)**\n• Chịu hạn cực tốt\n• Ít ánh sáng vẫn sống\n• Tưới 2-3 tuần/lần\n\n**2. Cây ZZ Plant**\n• "Không thể giết chết"\n• Chịu được bỏ quên\n• Ánh sáng yếu OK\n\n**3. Cây Trầu Bà (Pothos)**\n• Phát triển nhanh\n• Có thể trồng trong nước\n• Báo hiệu rõ khi cần nước\n\n**4. Cây Nhện (Spider Plant)**\n• Tự nhân giống\n• Lọc không khí tốt\n• Chịu được sai sót\n\n**5. Sen đá (Succulent)**\n• Cần ít nước\n• Đa dạng hình dáng\n• Dễ nhân giống\n\n**6. Cây Cao Su (Rubber Plant)**\n• Lá to, đẹp\n• Chịu ít ánh sáng\n• Phát triển ổn định\n\n**7. Cây Lan Ý**\n• Hoa đẹp\n• Lọc không khí\n• Báo hiệu rõ nhu cầu',
      type: "recommendation",
    },
  };
  const validateApiKey = () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (
      !apiKey ||
      apiKey === "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"
    ) {
      console.error("❌ API key chưa được cấu hình đúng");
      return false;
    }
    return true;
  };

  // Sử dụng trong component
  useEffect(() => {
    if (!validateApiKey()) {
      console.warn("⚠️ Vui lòng cấu hình OpenAI API key trong file .env.local");
    }
  }, []);
  const findBotResponse = (message: string): any => {
    const lowerMessage = message.toLowerCase();

    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    return {
      text: "Tôi hiểu bạn đang cần hỗ trợ về chăm sóc cây cảnh! 🌱\n\nĐể tôi có thể tư vấn chính xác hơn, bạn có thể:\n\n📸 **Chụp ảnh cây** - Tôi sẽ phân tích tình trạng\n📝 **Mô tả chi tiết** - Triệu chứng, môi trường sống\n🏷️ **Cho biết loại cây** - Để tư vấn phù hợp\n\nHoặc bạn có thể chọn một trong những câu hỏi phổ biến bên dưới!",
      type: "text",
      suggestions: [
        "Chẩn đoán qua ảnh",
        "Hướng dẫn tưới nước",
        "Chọn cây cho người mới",
        "Xử lý lá vàng",
      ],
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage || "Hãy phân tích hình ảnh cây này cho tôi",
      sender: "user",
      timestamp: new Date(),
      image: imagePreview || undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    const currentInput = inputMessage;
    const currentImage = imagePreview;
    setInputMessage("");
    removeImage();
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error("API key not configured");
      }
      let aiResponse = "";

      if (currentImage) {
        // Call Vision API for image analysis
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o", // Vision model
              messages: [
                {
                  role: "system",
                  content: `Bạn là chuyên gia chăm sóc cây cảnh tại Việt Nam. Hãy phân tích hình ảnh cây cảnh và đưa ra chẩn đoán chính xác.

NHIỆM VỤ PHÂN TÍCH ẢNH:
- Xác định loại cây (nếu có thể)
- Đánh giá tình trạng sức khỏe tổng thể
- Phát hiện dấu hiệu bệnh tật, sâu hại
- Nhận biết thiếu hụt dinh dưỡng
- Đánh giá điều kiện môi trường

CUNG CẤP:
🔍 **CHẨN ĐOÁN**: Mô tả chi tiết tình trạng
🌡️ **NGUYÊN NHÂN**: Lý do gây ra vấn đề  
💊 **GIẢI PHÁP**: Hướng dẫn điều trị cụ thể
⚠️ **LƯU Ý**: Những điều cần tránh
📅 **THEO DÕI**: Lịch kiểm tra và chăm sóc

Sử dụng thuật ngữ tiếng Việt, emoji phù hợp và đưa ra lời khuyên thực tế cho khí hậu Việt Nam.`,
                },
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text:
                        currentInput ||
                        "Hãy phân tích tình trạng cây cảnh trong ảnh này và đưa ra lời khuyên chăm sóc.",
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: currentImage,
                      },
                    },
                  ],
                },
              ],
              max_tokens: 1000,
              temperature: 0.3,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `API Error: ${errorData.error?.message || response.statusText}`
          );
        }

        const data = await response.json();
        aiResponse = data.choices[0].message.content;
      } else {
        // Call regular text API
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini", // More cost-effective option
              messages: [
                {
                  role: "system",
                  content: `Bạn là Green AI Assistant - chuyên gia chăm sóc cây cảnh tại Việt Nam. 

NHIỆM VỤ:
- Tư vấn chăm sóc cây cảnh, chẩn đoán bệnh cây
- Gợi ý loại cây phù hợp với điều kiện khí hậu Việt Nam
- Hướng dẫn kỹ thuật trồng, chăm sóc cụ thể
- Giải đáp về sâu bệnh, dinh dưỡng, tưới nước

PHONG CÁCH:
- Thân thiện, chuyên nghiệp
- Sử dụng emoji phù hợp 🌱🌿🍃
- Cung cấp hướng dẫn chi tiết, dễ hiểu
- Gợi ý các bước thực hiện cụ thể

ĐỊNH DẠNG TRẮC LỰ:
- Sử dụng bullet points cho danh sách
- In đậm tiêu đề quan trọng
- Phân chia thành các phần rõ ràng
- Đưa ra 2-3 gợi ý tiếp theo

LƯUY Ý:
- Ưu tiên cây phổ biến ở Việt Nam
- Tính đến khí hậu nhiệt đới
- Gợi ý cửa hàng, phân bón địa phương khi cần`,
                },
                {
                  role: "user",
                  content: currentInput,
                },
              ],
              max_tokens: 800,
              temperature: 0.7,
              presence_penalty: 0.6,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("API call failed");
        }

        const data = await response.json();
        aiResponse = data.choices[0].message.content;
      }

      // Determine message type based on content
      let messageType = "text";
      let suggestions: string[] = [];

      if (
        aiResponse.includes("phân tích") ||
        aiResponse.includes("chẩn đoán")
      ) {
        messageType = "analysis";
        suggestions = [
          "Cần thêm thông tin gì?",
          "Cách xử lý tiếp theo?",
          "Thuốc trị bệnh nào tốt?",
          "Phòng ngừa như thế nào?",
        ];
      } else if (
        aiResponse.includes("gợi ý") ||
        aiResponse.includes("khuyên")
      ) {
        messageType = "recommendation";
        suggestions = [
          "Hỏi chi tiết hơn",
          "Cây khác tương tự?",
          "Mua ở đâu tốt nhất?",
          "Combo cây phù hợp?",
        ];
      } else {
        suggestions = [
          "Chẩn đoán qua ảnh",
          "Hướng dẫn chi tiết",
          "Gợi ý cây mới",
          "Thiết kế vườn",
        ];
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
        suggestions: suggestions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("OpenAI API Error:", error);

      // Fallback to local responses
      const botResponse = findBotResponse(currentInput);
      const botMessage: Message = {
        id: messages.length + 2,
        text:
          botResponse.text +
          "\n\n⚠️ *Đang sử dụng chế độ offline. Kết nối API để có trải nghiệm tốt nhất.*",
        sender: "bot",
        timestamp: new Date(),
        suggestions: botResponse.suggestions,
        type: botResponse.type || "text",
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Xin chào! Tôi là Green AI Assistant - trợ lý thông minh chuyên về chăm sóc cây cảnh 🌱\n\nBạn cần hỗ trợ gì hôm nay?",
        sender: "bot",
        timestamp: new Date(),
        suggestions: [
          "Chẩn đoán bệnh cây",
          "Tư vấn loại cây",
          "Hướng dẫn chăm sóc",
          "Thiết kế vườn",
        ],
      },
    ]);
    removeImage();
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "analysis":
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case "recommendation":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          AI Hỗ trợ chăm sóc cây
        </h1>
        <p className="text-gray-600 mt-2">
          Trợ lý AI thông minh giúp bạn chẩn đoán, tư vấn và chăm sóc cây cảnh
          hiệu quả
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                Tính năng AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <Camera className="h-8 w-8 text-blue-600 bg-blue-100 p-2 rounded-lg" />
                <div>
                  <h4 className="font-medium text-sm">Phân tích hình ảnh</h4>
                  <p className="text-xs text-gray-600">
                    Chẩn đoán bệnh qua ảnh
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <Bot className="h-8 w-8 text-green-600 bg-green-100 p-2 rounded-lg" />
                <div>
                  <h4 className="font-medium text-sm">Tư vấn thông minh</h4>
                  <p className="text-xs text-gray-600">Gợi ý dựa trên AI</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <Lightbulb className="h-8 w-8 text-yellow-600 bg-yellow-100 p-2 rounded-lg" />
                <div>
                  <h4 className="font-medium text-sm">Gợi ý cá nhân</h4>
                  <p className="text-xs text-gray-600">Phù hợp với điều kiện</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Cuộc trò chuyện
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setActiveSession(session.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeSession === session.id
                        ? "bg-green-50 border border-green-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <h4 className="font-medium text-sm line-clamp-1">
                      {session.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {session.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {session.timestamp}
                    </p>
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                <Plus className="h-4 w-4 mr-2" />
                Cuộc trò chuyện mới
              </Button>
            </CardContent>
          </Card>

          {/* Quick Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Câu hỏi phổ biến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quickQuestions.map((category, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-sm mb-2 text-green-700">
                      {category.category}
                    </h4>
                    <div className="space-y-1">
                      {category.questions.map((question, qIndex) => (
                        <Button
                          key={qIndex}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-2 text-xs"
                          onClick={() => handleSuggestionClick(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-green-100">
                      <Bot className="h-4 w-4 text-green-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      Green AI Assistant
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800 mt-1">
                      Online
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.sender === "bot" && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-green-100">
                            <Bot className="h-4 w-4 text-green-600" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.sender === "user"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {message.sender === "bot" &&
                            getMessageIcon(message.type)}
                          {message.type === "analysis" && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              Phân tích
                            </Badge>
                          )}
                          {message.type === "recommendation" && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Gợi ý
                            </Badge>
                          )}
                        </div>
                        <p className="whitespace-pre-line leading-relaxed">
                          {message.text}
                        </p>
                        {message.suggestions && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium opacity-80">
                              Gợi ý cho bạn:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs bg-white/90 hover:bg-white border-gray-300"
                                  onClick={() =>
                                    handleSuggestionClick(suggestion)
                                  }
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-xs opacity-60 mt-2">
                          {message.timestamp.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {message.sender === "user" && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-blue-100">
                            <User className="h-4 w-4 text-blue-600" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-4 justify-start">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-green-100">
                          <Bot className="h-4 w-4 text-green-600" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <div className="border-t p-4">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() =>
                    handleSuggestionClick("Tôi muốn gửi ảnh cây để chẩn đoán")
                  }
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Chụp ảnh
                </Button>
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Hỏi về cây cảnh của bạn..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-green-600 hover:bg-green-700 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                💡 Mẹo: Chụp ảnh và mô tả chi tiết sẽ giúp AI tư vấn chính xác
                hơn
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
