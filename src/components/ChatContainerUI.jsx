import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    ConversationHeader,
    Avatar,
    Sidebar,
    Search,
    ConversationList,
    Conversation
} from '@chatscope/chat-ui-kit-react';

const ChatContainerUI = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [finalResponse, setFinalResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState({
        Kai: [{ direction: 'incoming', message: 'Hey', position: 'single', sender: 'Kai' }],
    });

    const handleConversationSelect = (conversation) => {
        setSelectedConversation(conversation);
    };


    const generateContent = async (inputResponce) => {
        if (!selectedConversation) return;
        setLoading(true);
        // const apiKey = import.meta.env.VITE_APP_GENERATIVE_AI_API_KEY_2;  
        const apiKey = "AIzaSyCiom6WuInXVTxjFoih3RXPmg5HCu76qnU";  

        if (!apiKey) {
            console.error('Missing Generative AI API Key! Please provide a valid key.');
            setLoading(false);
            return;
        }

        try {
            const plainText = inputResponce.replace(/<\/?[^>]+(>|$)/g, "");
            const newPrompt = 'chat like you are genuine user of social media app : ' +plainText;
            console.log('Text Prompt : ', plainText);
            setPrompt(newPrompt);

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
            const result = await model.generateContent(newPrompt);
            const responseResult = await result.response;
            const textResponse = await responseResult.text();
            console.log("Generated Text Response: ", textResponse);
            setFinalResponse(textResponse);
            const newMessage = {
                direction: 'incoming',
                message: `${textResponse}`,
                position: 'single',
                sender: 'Kai'
            };
            setMessages(prevMessages => ({
                ...prevMessages,
                [selectedConversation]: [...prevMessages[selectedConversation], newMessage]
            }));
        } catch (error) {
            console.error(error);
            setFinalResponse('Error: Failed to generate text. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleSendMessage = async (text) => {
        if (!selectedConversation) return;

        setLoading(true);
        // const apiKey = import.meta.env.VITE_APP_GENERATIVE_AI_API_KEY_3;
        const apiKey = 'AIzaSyCcpeuReqLSvUbxt1QhyF2FLBtMxQU8zIM';

        if (!apiKey) {
            console.error('Missing Generative AI API Key! Please provide a valid key.');
            setLoading(false);
            return;
        }

        try {
            const plainText = text.replace(/<\/?[^>]+(>|$)/g, "");
            const newPrompt = " convert this text in english language : " + plainText;
            console.log('Text Prompt', plainText);
            setPrompt(newPrompt);

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
            const result = await model.generateContent(newPrompt);
            const responseResult = await result.response;
            const textResponse = await responseResult.text();
            console.log("Generated Text Response: ", textResponse);
            setFinalResponse(textResponse);
            const newMessage = {
                direction: 'outgoing',
                message: `${text} \n\n ${textResponse}`,
                position: 'single',
                sender: 'me'
            };
            setMessages(prevMessages => ({
                ...prevMessages,
                [selectedConversation]: [...prevMessages[selectedConversation], newMessage]
            }));
            // generateContent(textResponse);
        } catch (error) {
            console.error(error);
            setFinalResponse('Error: Failed to generate text. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getAvatarUrl = (conversationName) => {
        const avatarUrls = {
            Kai: 'https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg',
        };
        return avatarUrls[conversationName] || 'https://example.com/default-avatar.svg';
    };

    return (
        <MainContainer  responsive style={{ height: '600px', fontFamily: 'sans-serif' }}>
            <Sidebar position="left">
                <h4 style={{ margin: "12px 18px" }}>Chats</h4>
                <Search placeholder="Search..." />
                <ConversationList>
                    {Object.keys(messages).map((conversationName) => (
                        <Conversation
                            key={conversationName}
                            info={messages[conversationName][0].message}
                            lastSenderName={messages[conversationName][0].sender}
                            name={conversationName}
                            onClick={() => handleConversationSelect(conversationName)}
                        >
                            <Avatar
                                name={conversationName}
                                src={getAvatarUrl(conversationName)}
                                status="available"
                            />
                        </Conversation>
                    ))}
                </ConversationList>
            </Sidebar>
            <ChatContainer>
                <ConversationHeader>
                    <ConversationHeader.Back onClick={() => setSelectedConversation(null)} />
                    {selectedConversation && (
                        <Avatar
                            name={selectedConversation}
                            src={getAvatarUrl(selectedConversation)}
                        />
                    )}
                    {selectedConversation && (
                        <ConversationHeader.Content
                            userName={selectedConversation}
                            info={messages[selectedConversation] && messages[selectedConversation][0] && messages[selectedConversation][0].message}
                        />
                    )}
                </ConversationHeader>

                <MessageList>
                    {selectedConversation && messages[selectedConversation] && messages[selectedConversation].map((message, index) => (
                        <Message key={index} model={message}>
                            {message.direction === 'incoming' && (
                                <Avatar
                                    name={message.sender}
                                    src={getAvatarUrl(message.sender)}
                                />
                            )}
                        </Message>
                    ))}
                </MessageList>
                {selectedConversation && <MessageInput placeholder="Type message here" onSend={handleSendMessage} />}
            </ChatContainer>
        </MainContainer>
    );
};

export default ChatContainerUI;







