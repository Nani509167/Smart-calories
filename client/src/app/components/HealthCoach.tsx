import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'motion/react';

interface HealthCoachProps {
  onNavigate: (screen: string) => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function HealthCoach({ onNavigate }: HealthCoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI Health Coach. I can help you with nutrition advice, meal suggestions, and answer questions about your calorie intake. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('protein') || lowerInput.includes('muscle')) {
      return "Great question about protein! For muscle building, aim for 1.6-2.2g per kg of body weight daily. Good sources include lean meats, fish, eggs, legumes, and dairy. Would you like specific meal suggestions?";
    } else if (lowerInput.includes('lose weight') || lowerInput.includes('deficit')) {
      return "For healthy weight loss, create a moderate calorie deficit of 300-500 calories below maintenance. Focus on whole foods, adequate protein, and stay hydrated. Aim for 0.5-1kg loss per week for sustainable results.";
    } else if (lowerInput.includes('meal') || lowerInput.includes('breakfast')) {
      return "I'd recommend balanced meals with protein, complex carbs, and healthy fats. For breakfast, try: Greek yogurt with berries and nuts, oatmeal with banana and almond butter, or scrambled eggs with whole grain toast and avocado.";
    } else if (lowerInput.includes('water') || lowerInput.includes('hydration')) {
      return "Hydration is crucial! Aim for 2-3 liters of water daily, more if you're active. Signs of good hydration include clear urine and sustained energy levels. Try drinking water before meals to support digestion.";
    } else {
      return "That's an interesting question! Based on your current intake of 1247 calories today, you're on track. Remember to maintain a balanced approach with whole foods, adequate protein, and regular physical activity. Is there anything specific you'd like to know more about?";
    }
  };

  const quickPrompts = [
    'How much protein should I eat?',
    'What are healthy breakfast ideas?',
    'Help me lose weight',
    'Best foods for energy',
  ];

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-card border-b border-border">
        <h1 className="text-[32px] font-semibold text-foreground tracking-tight">AI Health Coach</h1>
        <p className="text-muted-foreground mt-1">Your personal nutrition assistant</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-3xl px-6 py-4 shadow-sm ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground border border-border'
              }`}
            >
              <p className="leading-relaxed">{message.text}</p>
              <p
                className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-card text-foreground border border-border rounded-3xl px-6 py-4 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 rounded-full bg-muted-foreground"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 rounded-full bg-muted-foreground"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 rounded-full bg-muted-foreground"
                  />
                </div>
                <span className="text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-4"
          >
            <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInputText(prompt)}
                  className="px-4 py-2 rounded-full bg-card text-foreground border border-border shadow-sm text-sm hover:shadow-md transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 pb-28 pt-4 bg-card border-t border-border">
        <div className="flex items-center gap-3 bg-background rounded-3xl px-6 py-3 border border-border shadow-sm">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about nutrition..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              inputText.trim()
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
