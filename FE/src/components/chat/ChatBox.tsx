'use client';

import { useState } from 'react';
import Icon from '@/components/ui/Icon';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          style={{ backgroundColor: '#E21C34', boxShadow: '0 10px 25px rgba(226, 28, 52, 0.3)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E21C34'}
          title="Trò chuyện với chúng tôi"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="text-white p-4 rounded-t-lg flex items-center justify-between" style={{ backgroundColor: '#E21C34' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#dc2626' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Hỗ trợ khách hàng</h3>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Trực tuyến</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-white transition-colors"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isUser
                      ? 'text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                  style={message.isUser ? { backgroundColor: '#E21C34' } : {}}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? '' : 'text-gray-500'
                  }`}
                  style={message.isUser ? { color: 'rgba(255, 255, 255, 0.8)' } : {}}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-3 py-2 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="disabled:bg-gray-300 text-white px-3 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: !inputText.trim() ? '#d1d5db' : '#E21C34' }}
                onMouseEnter={(e) => !inputText.trim() ? null : e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => !inputText.trim() ? null : e.currentTarget.style.backgroundColor = '#E21C34'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-4">
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setInputText('Tôi muốn hỏi về sản phẩm')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
              >
                Hỏi về sản phẩm
              </button>
              <button
                onClick={() => setInputText('Làm sao để đặt hàng?')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
              >
                Cách đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
