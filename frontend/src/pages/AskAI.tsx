import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Shirt,
  Palette,
  Lightbulb,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const suggestedQuestions = [
  {
    icon: Shirt,
    title: "Kombinasi Outfit",
    question:
      "Bagaimana cara mengombinasikan kemeja putih dengan celana jeans?",
  },
  {
    icon: Palette,
    title: "Color Matching",
    question: "Warna apa yang cocok dengan dress hijau emerald?",
  },
  {
    icon: Lightbulb,
    title: "Style Tips",
    question: "Tips berpakaian untuk acara formal di musim panas",
  },
];

export default function AskAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan.");
      }

      const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(`${VITE_API_BASE_URL}/ask/gemini`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: textToSend,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error dari server: ${response.status} ${response.statusText}`
        );
      }

      if (!response.body) {
        throw new Error("Response body tidak tersedia.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (error: any) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  error.message ||
                  "Maaf, terjadi kesalahan. Silakan coba lagi.",
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-sky-500 to-purple-600 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Ask AI Fashion
            </h1>
            <p className="text-slate-600">
              Tanyakan apapun tentang fashion dan style
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <Card className="w-full flex flex-col shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-700">
                Chat dengan AI Fashion
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col p-0">
              <ScrollArea className="px-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center py-12">
                    <div className="p-4 bg-slate-100 rounded-full mb-4">
                      <Bot className="h-12 w-12 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-700 mb-2">
                      Mulai percakapan dengan AI Fashion
                    </h3>
                    <p className="text-slate-500 mb-6 max-w-md">
                      Tanyakan tentang kombinasi outfit, tips fashion, color
                      matching, atau apapun seputar style!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 py-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-r from-sky-500 to-purple-600 text-white text-xs">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            message.role === "user"
                              ? "bg-sky-600 text-white ml-auto"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          <div className="text-sm leading-relaxed">
                            {message.isStreaming && !message.content ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">
                                  AI sedang mengetik...
                                </span>
                              </div>
                            ) : (
                              <div
                                className={`prose prose-sm max-w-none  ${
                                  message.role === "user"
                                    ? "text-white"
                                    : "text-slate-700"
                                }`}
                              >
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                              </div>
                            )}
                          </div>
                          <div
                            className={`text-xs mt-2 ${
                              message.role === "user"
                                ? "opacity-70"
                                : "text-slate-500"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        {message.role === "user" && (
                          <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                            <AvatarFallback className="bg-slate-600 text-white text-xs">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              <Separator />

              <div className="p-4">
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tanyakan tentang fashion, outfit, atau style..."
                    className="min-h-[60px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="bg-sky-600 hover:bg-sky-700 px-4"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <div className="space-y-4 sticky top-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-700">
                  Pertanyaan Populer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(item.question)}
                    disabled={isLoading}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg flex-shrink-0">
                        <item.icon className="h-4 w-4 text-sky-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-slate-700 mb-1">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-600 leading-relaxed">
                          {item.question}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-700">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-slate-600">
                  <Badge variant="outline" className="mb-2 text-xs">
                    💡 Tips
                  </Badge>
                  <p className="leading-relaxed">
                    Berikan detail spesifik untuk mendapatkan saran yang lebih
                    akurat!
                  </p>
                </div>
                <div className="text-sm text-slate-600">
                  <Badge variant="outline" className="mb-2 text-xs">
                    🎨 Color
                  </Badge>
                  <p className="leading-relaxed">
                    Sebutkan warna spesifik untuk rekomendasi yang tepat
                  </p>
                </div>
                <div className="text-sm text-slate-600">
                  <Badge variant="outline" className="mb-2 text-xs">
                    👗 Occasion
                  </Badge>
                  <p className="leading-relaxed">
                    Jelaskan acara atau situasi penggunaan outfit
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
