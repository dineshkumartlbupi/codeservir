import { useEffect } from 'react';

interface ChatbotWidgetProps {
    chatbotId?: string;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
    chatbotId = 'YOUR_CHATBOT_ID_HERE' // Replace with your actual chatbot ID
}) => {
    useEffect(() => {
        // Create and inject the chatbot script
        const script = document.createElement('script');
        script.src = 'https://codeservir-api.vercel.app/widget.js';
        script.async = true;
        script.setAttribute('data-chatbot-id', chatbotId);

        // Append to document
        (document.head || document.documentElement).appendChild(script);

        // Cleanup function
        return () => {
            // Remove script when component unmounts
            const existingScript = document.querySelector(`script[data-chatbot-id="${chatbotId}"]`);
            if (existingScript) {
                existingScript.remove();
            }

            // Remove chatbot widget if it exists
            const chatbotWidget = document.getElementById('codeservir-chatbot-widget');
            if (chatbotWidget) {
                chatbotWidget.remove();
            }
        };
    }, [chatbotId]);

    // This component doesn't render anything visible
    return null;
};

export default ChatbotWidget;
