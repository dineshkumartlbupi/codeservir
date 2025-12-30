# 🤖 Create CodeServir Chatbot - Complete Guide

**Created:** 2025-12-31  
**Purpose:** Add an AI chatbot to CodeServir.com website

---

## 📋 **Step 1: Create the Chatbot**

### **Option A: Use Your Own Platform (Recommended)**

Since you have the CodeServir platform, create a chatbot for yourself:

1. **Go to:** http://localhost:3000/create (or https://codeservir.com/create)

2. **Fill in the form:**

```
Owner Name: Dinesh Kumar
Business Name: CodeServir
Website URL: https://codeservir.com
Contact Email: support@codeservir.com
Contact Number: +1 (555) 123-4567
Business Address: Your business address
Business Description: CodeServir is an AI-powered chatbot platform that helps businesses create intelligent chatbots for their websites in minutes. No coding required. Features include instant setup, full customization, AI-powered responses, mobile responsiveness, easy training, and 24/7 customer support.
Primary Color: #6366f1 (purple)
Secondary Color: #8b5cf6 (pink)
```

3. **Click "Create Chatbot"**

4. **Save the Chatbot ID** (you'll get something like: `cs_abc123xyz`)

---

## 📋 **Step 2: Train Your Chatbot**

After creating, train it with CodeServir-specific Q&A:

### **Training Data for CodeServir:**

```json
[
  {
    "question": "What is CodeServir?",
    "answer": "CodeServir is an AI-powered chatbot platform that helps businesses create intelligent chatbots for their websites in minutes. No coding required!"
  },
  {
    "question": "How much does it cost?",
    "answer": "We offer three plans: Starter (Free forever), Professional ($29/month), and Enterprise (custom pricing). The free plan includes 1 chatbot and 100 conversations per month."
  },
  {
    "question": "How do I create a chatbot?",
    "answer": "Simply go to our Create Chatbot page, fill in your business details, customize the colors, and click create. You'll get an embed code instantly that you can add to your website."
  },
  {
    "question": "Do I need coding skills?",
    "answer": "No! CodeServir is designed for everyone. Just fill out a simple form, and we'll generate everything you need. Copy and paste the embed code into your website."
  },
  {
    "question": "Can I customize the chatbot?",
    "answer": "Yes! You can customize colors to match your brand, train it with custom Q&A pairs, and configure its behavior. Professional and Enterprise plans offer even more customization options."
  },
  {
    "question": "How does the AI work?",
    "answer": "Our chatbot uses advanced AI to understand context and provide intelligent responses. It learns from your website content and the custom training data you provide."
  },
  {
    "question": "Is it mobile-friendly?",
    "answer": "Absolutely! All CodeServir chatbots are fully responsive and work perfectly on desktop, tablet, and mobile devices. We also support mobile app integration via WebView."
  },
  {
    "question": "How do I integrate it into my website?",
    "answer": "After creating your chatbot, you'll receive a simple JavaScript code snippet. Just paste it before the closing </body> tag in your website's HTML. It takes less than 2 minutes!"
  },
  {
    "question": "Can I train the chatbot?",
    "answer": "Yes! You can add custom Q&A pairs through our training interface. This helps your chatbot answer specific questions about your business accurately."
  },
  {
    "question": "What support do you offer?",
    "answer": "We offer email support for all plans, priority support for Professional plans, and dedicated support for Enterprise customers. You can reach us at support@codeservir.com."
  },
  {
    "question": "Is my data secure?",
    "answer": "Yes! We use enterprise-grade security with data encryption, GDPR compliance, and secure hosting. Your data and your customers' data are always protected."
  },
  {
    "question": "Can I use it on multiple websites?",
    "answer": "The Starter plan allows 1 chatbot, Professional allows 5 chatbots, and Enterprise offers unlimited chatbots. Each chatbot can be customized for different websites."
  },
  {
    "question": "How long does setup take?",
    "answer": "You can create and deploy your chatbot in under 2 minutes! Just fill out the form, get your embed code, and add it to your website."
  },
  {
    "question": "What languages are supported?",
    "answer": "Our chatbots support 20+ languages with auto-translation and localization features, making it easy to serve global audiences."
  },
  {
    "question": "Can I see analytics?",
    "answer": "Yes! Professional and Enterprise plans include conversation tracking, user analytics, and performance metrics to help you understand your customers better."
  }
]
```

---

## 📋 **Step 3: Get the Embed Code**

After creating your chatbot, you'll receive code like this:

```html
<script>
(function () {
  var s = document.createElement("script");
  s.src = "https://codeservir-api.vercel.app/widget.js";
  s.async = true;
  s.setAttribute("data-chatbot-id", "YOUR_CHATBOT_ID_HERE");
  (document.head || document.documentElement).appendChild(s);
})();
</script>
```

**Replace `YOUR_CHATBOT_ID_HERE` with your actual chatbot ID!**

---

## 📋 **Step 4: Add to Your Website**

### **Method 1: Add to index.html (Recommended)**

Add the script to your `public/index.html` file before the closing `</body>` tag:

**File:** `/Users/dineshkumar/Documents/codeservir/frontend/public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... existing head content ... -->
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    
    <!-- CodeServir Chatbot Widget -->
    <script>
    (function () {
      var s = document.createElement("script");
      s.src = "https://codeservir-api.vercel.app/widget.js";
      s.async = true;
      s.setAttribute("data-chatbot-id", "YOUR_CHATBOT_ID_HERE");
      (document.head || document.documentElement).appendChild(s);
    })();
    </script>
  </body>
</html>
```

### **Method 2: Create a React Component**

Create a new component for the chatbot:

**File:** `src/components/ChatbotWidget.tsx`

```tsx
import { useEffect } from 'react';

const ChatbotWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://codeservir-api.vercel.app/widget.js';
    script.async = true;
    script.setAttribute('data-chatbot-id', 'YOUR_CHATBOT_ID_HERE');
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(script);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ChatbotWidget;
```

Then add it to your `App.tsx`:

```tsx
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          {/* ... your routes ... */}
        </Routes>
        <Footer />
        <ChatbotWidget />  {/* Add this line */}
      </div>
    </Router>
  );
}
```

---

## 📋 **Step 5: Test Your Chatbot**

1. **Start your dev server:**
   ```bash
   npm start
   ```

2. **Open:** http://localhost:3000

3. **Look for the chatbot widget** (usually bottom-right corner)

4. **Click it and test:**
   - Ask: "What is CodeServir?"
   - Ask: "How much does it cost?"
   - Ask: "How do I create a chatbot?"

---

## 🎨 **Customization Options**

### **Colors**
Your chatbot will use:
- **Primary Color:** #6366f1 (purple) - matches your brand
- **Secondary Color:** #8b5cf6 (pink) - matches your brand

### **Position**
The widget appears in the bottom-right corner by default.

### **Greeting Message**
Customize the initial greeting in your chatbot settings.

---

## 📊 **Quick Reference**

### **Your Chatbot Details:**

```
Business: CodeServir
Website: https://codeservir.com
Email: support@codeservir.com
Colors: Purple (#6366f1) & Pink (#8b5cf6)
```

### **API Endpoint:**
```
https://codeservir-api.vercel.app
```

### **Widget Script:**
```
https://codeservir-api.vercel.app/widget.js
```

---

## 🚀 **Deployment Checklist**

- [ ] Create chatbot on CodeServir platform
- [ ] Save chatbot ID
- [ ] Train chatbot with Q&A data
- [ ] Get embed code
- [ ] Add script to index.html or create component
- [ ] Replace `YOUR_CHATBOT_ID_HERE` with actual ID
- [ ] Test locally (npm start)
- [ ] Commit changes
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Test on production site

---

## 💡 **Pro Tips**

1. **Train Regularly:** Add new Q&A pairs as you get customer questions
2. **Monitor Conversations:** Check what users are asking
3. **Update Responses:** Improve answers based on feedback
4. **Test Thoroughly:** Try different questions before going live
5. **Mobile Test:** Check on mobile devices too

---

## 🔧 **Troubleshooting**

### **Chatbot not appearing?**
- Check if script is loaded (inspect browser console)
- Verify chatbot ID is correct
- Clear browser cache
- Check if widget.js is accessible

### **Chatbot not responding?**
- Verify backend API is running
- Check if chatbot is trained
- Look for errors in browser console

### **Styling issues?**
- Check if colors are set correctly
- Verify no CSS conflicts
- Test on different browsers

---

## 📞 **Need Help?**

- **Email:** support@codeservir.com
- **Docs:** https://codeservir.com/docs
- **Contact:** https://codeservir.com/contact

---

## ✅ **Next Steps**

1. **Create your chatbot** using the form
2. **Copy the chatbot ID**
3. **Add the script** to your website
4. **Test it** locally
5. **Deploy** to production
6. **Monitor** and improve!

---

**Ready to add your chatbot? Let's do it!** 🚀

---

**Created for CodeServir.com**
