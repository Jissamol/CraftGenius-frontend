import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../services/Api';
import { X, Send, Bot, User, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm the CraftGenius Artisan Matchmaker. Looking for a unique handcrafted gift or a specific item? Ask me!",
            products: []
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await Api.post('chat/', { message: userMsg });
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.response,
                products: response.data.products || []
            }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I'm having trouble connecting right now. Please make sure the Gemini API key is configured in the backend!"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl z-50 text-white flex items-center justify-center transition-colors ${isOpen ? 'hidden' : 'bg-[#1C1C1C] hover:bg-[#2C2C2C]'}`}
            >
                <Sparkles className="w-6 h-6" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-[#E5E5E5] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#1C1C1C] p-4 flex items-center justify-between text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[15px]">Artisan Matchmaker</h3>
                                    <p className="text-xs text-gray-300 flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    {/* Avatar */}
                                    <div className="shrink-0">
                                        {msg.role === 'assistant' ? (
                                            <div className="w-8 h-8 rounded-full bg-[#F5E6E0] flex items-center justify-center text-[#8C7A6B]">
                                                <Bot className="w-4 h-4" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white">
                                                <User className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                                        <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                                            msg.role === 'user'
                                                ? 'bg-[#1C1C1C] text-white rounded-tr-sm'
                                                : 'bg-white text-gray-700 border border-[#E5E5E5] rounded-tl-sm shadow-sm'
                                        }`}>
                                            {msg.content}
                                        </div>

                                        {/* Product Cards (if any) */}
                                        {msg.products && msg.products.length > 0 && (
                                            <div className="mt-3 space-y-2 w-full">
                                                {msg.products.map(product => (
                                                    <div 
                                                        key={product.id}
                                                        onClick={() => navigate(`/customer/product/${product.id}`)}
                                                        className="bg-white border border-[#E5E5E5] rounded-xl p-2 flex gap-3 cursor-pointer hover:border-[#1C1C1C] hover:shadow-md transition-all group"
                                                    >
                                                        <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                            {product.primary_image_url ? (
                                                                <img src={product.primary_image_url} alt={product.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                            <h4 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h4>
                                                            <p className="text-xs text-[#8C7A6B] font-medium mt-0.5">₹{product.price}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center px-1 text-gray-300 group-hover:text-[#1C1C1C] transition-colors">
                                                            <ChevronRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-[#F5E6E0] flex items-center justify-center text-[#8C7A6B]">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white border border-[#E5E5E5] rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#8C7A6B] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-[#8C7A6B] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-[#8C7A6B] rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-[#E5E5E5] shrink-0">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about gifts, materials..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1C1C1C] focus:border-[#1C1C1C] transition-all"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="bg-[#1C1C1C] text-white p-2.5 rounded-xl hover:bg-[#2C2C2C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default ChatAssistant;
