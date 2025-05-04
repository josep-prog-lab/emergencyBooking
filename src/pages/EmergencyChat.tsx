
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Message, EmergencyRequest, Hospital } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const EmergencyChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emergencyRequest, setEmergencyRequest] = useState<EmergencyRequest | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Get the emergency request data from location state
    if (location.state?.emergencyRequest) {
      setEmergencyRequest(location.state.emergencyRequest);
      setHospital(location.state.emergencyRequest.selectedHospital);
      
      // Add initial system message
      const initialMessages: Message[] = [
        {
          id: "system-1",
          text: `Your emergency alert has been sent to ${location.state.emergencyRequest.selectedHospital?.name}. Please stay on this page for updates.`,
          sender: "hospital",
          timestamp: new Date(),
        },
      ];
      setMessages(initialMessages);
      
      // Simulate hospital typing
      setIsTyping(true);
      setTimeout(() => {
        const responseMessage: Message = {
          id: "hospital-1",
          text: `This is the emergency response team at ${location.state.emergencyRequest.selectedHospital?.name}. We have received your alert and dispatched help. Please provide any additional information about your situation.`,
          sender: "hospital",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, responseMessage]);
        setIsTyping(false);
      }, 3000);
    } else {
      // No data was provided, redirect to home
      toast({
        title: "Error",
        description: "No emergency information found. Redirecting to home page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [location.state, navigate, toast]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate hospital response
    setIsTyping(true);
    
    setTimeout(() => {
      const responseMessage: Message = {
        id: `hospital-${Date.now()}`,
        text: getRandomResponse(),
        sender: "hospital",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, responseMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const getRandomResponse = () => {
    const responses = [
      "Thank you for the information. Our team is on the way.",
      "Can you provide more details about your current condition?",
      "The ambulance is currently navigating to your location. ETA is about 5-7 minutes.",
      "Please stay calm and remain in your current location if possible.",
      "Is there anyone else with you who can assist until our team arrives?",
      "Our emergency response team has been notified and is preparing for your arrival.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  if (!emergencyRequest || !hospital) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl px-4 py-8">
      <div className="flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{hospital.name}</h1>
            <p className="text-sm text-gray-500">
              Emergency Type: {emergencyRequest.type}
            </p>
          </div>
        </div>
        
        {/* Status Card */}
        <Card className="mb-4 border-l-4 border-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="absolute -inset-1 rounded-full bg-green-500 opacity-30 animate-pulse-ring"></div>
              </div>
              <div>
                <p className="font-medium">Emergency Response Active</p>
                <p className="text-sm text-gray-600">Your location is being tracked in real-time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "600ms" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" className="bg-secondary hover:bg-secondary/90">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EmergencyChat;
