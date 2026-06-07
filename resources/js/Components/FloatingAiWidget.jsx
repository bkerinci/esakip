import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function FloatingAiWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'system', text: 'Halo! Saya adalah SIPANDAI AI Assistant. Ada yang bisa saya bantu terkait informasi kinerja SAKIP?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        
        if (!inputMessage.trim()) return;

        const userMsg = inputMessage;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post('/api/ai/chat', { message: userMsg });
            setMessages(prev => [...prev, { sender: 'ai', text: response.data.response }]);
        } catch (error) {
            console.error('Chat error', error);
            const errorMsg = error.response?.data?.response || 'Maaf, terjadi kesalahan saat menghubungi server AI.';
            setMessages(prev => [...prev, { sender: 'system', text: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickPrompt = (prompt) => {
        setInputMessage(prompt);
        // Timeout to allow state to update before sending (since we send inputMessage in handleSendMessage)
        setTimeout(() => {
            document.getElementById('ai-chat-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }, 50);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform origin-bottom-right" style={{ height: '500px' }}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-4 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm shadow-inner">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-wide">SIPANDAI AI</h3>
                                <p className="text-xs text-blue-200">Government Assistant</p>
                            </div>
                        </div>
                        <button onClick={toggleChat} className="text-white/70 hover:text-white transition rounded-full p-1 hover:bg-white/10">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                                    msg.sender === 'user' 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : msg.sender === 'system'
                                            ? 'bg-red-50 text-red-600 border border-red-100 rounded-bl-none text-sm'
                                            : 'bg-white text-slate-700 border border-gray-100 rounded-bl-none'
                                }`}>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 text-slate-500 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Prompts */}
                    <div className="px-4 py-2 bg-white border-t border-gray-100 flex overflow-x-auto space-x-2 hide-scrollbar">
                        {['Ringkasan Kota', 'Top OPD', 'OPD Terbawah', 'Apa itu SAKIP?'].map((prompt, idx) => (
                            <button 
                                key={idx}
                                onClick={() => handleQuickPrompt(prompt)}
                                className="whitespace-nowrap px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-full transition font-medium border border-blue-100"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form id="ai-chat-form" onSubmit={handleSendMessage} className="flex relative items-center">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Tanyakan seputar capaian SAKIP..."
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition shadow-inner"
                                disabled={isLoading}
                            />
                            <button 
                                type="submit" 
                                disabled={isLoading || !inputMessage.trim()}
                                className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition shadow-md"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button 
                onClick={toggleChat}
                className={`flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90 scale-90' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-110 hover:shadow-blue-500/50'}`}
            >
                {isOpen ? (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                    <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                )}
            </button>
        </div>
    );
}
