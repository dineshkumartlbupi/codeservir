#!/bin/bash

# CodeServir Chatbot Setup Script
# This script helps you create and integrate a chatbot for CodeServir.com

echo "🤖 CodeServir Chatbot Setup"
echo "============================"
echo ""

# API endpoint
API_URL="https://codeservir-api.vercel.app/api/chatbot/create"

# Chatbot details
OWNER_NAME="Dinesh Kumar"
BUSINESS_NAME="CodeServir"
WEBSITE_URL="https://codeservir.com"
CONTACT_EMAIL="support@codeservir.com"
CONTACT_NUMBER="+91 9519202509"
BUSINESS_ADDRESS="4/37, 2nd Floor, Vibhav khad, Gomtinagar, Uttar Pradesh, India"
BUSINESS_DESCRIPTION="CodeServir is an AI-powered chatbot platform that helps businesses create intelligent chatbots for their websites in minutes. No coding required. Features include instant setup, full customization, AI-powered responses, mobile responsiveness, easy training, and 24/7 customer support."
PRIMARY_COLOR="#6366f1"
SECONDARY_COLOR="#8b5cf6"

echo "📋 Creating chatbot with these details:"
echo "  Business: $BUSINESS_NAME"
echo "  Website: $WEBSITE_URL"
echo "  Email: $CONTACT_EMAIL"
echo ""

# Create chatbot
echo "🚀 Creating chatbot..."
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"ownerName\": \"$OWNER_NAME\",
    \"businessName\": \"$BUSINESS_NAME\",
    \"websiteUrl\": \"$WEBSITE_URL\",
    \"contactEmail\": \"$CONTACT_EMAIL\",
    \"contactNumber\": \"$CONTACT_NUMBER\",
    \"businessAddress\": \"$BUSINESS_ADDRESS\",
    \"businessDescription\": \"$BUSINESS_DESCRIPTION\",
    \"primaryColor\": \"$PRIMARY_COLOR\",
    \"secondaryColor\": \"$SECONDARY_COLOR\"
  }")

# Extract chatbot ID
CHATBOT_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['chatbotId'])" 2>/dev/null)

if [ -z "$CHATBOT_ID" ]; then
    echo "❌ Failed to create chatbot"
    echo "Response: $RESPONSE"
    exit 1
fi

echo "✅ Chatbot created successfully!"
echo ""
echo "📝 Your Chatbot Details:"
echo "========================"
echo "Chatbot ID: $CHATBOT_ID"
echo ""

# Generate embed code
echo "📋 Embed Code:"
echo "=============="
cat << EOF
<script>
(function () {
  var s = document.createElement("script");
  s.src = "https://codeservir-api.vercel.app/widget.js";
  s.async = true;
  s.setAttribute("data-chatbot-id", "$CHATBOT_ID");
  (document.head || document.documentElement).appendChild(s);
})();
</script>
EOF
echo ""

# Generate mobile URL
echo "📱 Mobile App URL:"
echo "=================="
echo "https://codeservir-api.vercel.app/embed/$CHATBOT_ID"
echo ""

# Save to file
echo "💾 Saving details to CHATBOT_DETAILS.txt..."
cat > CHATBOT_DETAILS.txt << EOF
CodeServir Chatbot Details
==========================
Created: $(date)

Chatbot ID: $CHATBOT_ID

Embed Code:
-----------
<script>
(function () {
  var s = document.createElement("script");
  s.src = "https://codeservir-api.vercel.app/widget.js";
  s.async = true;
  s.setAttribute("data-chatbot-id", "$CHATBOT_ID");
  (document.head || document.documentElement).appendChild(s);
})();
</script>

Mobile App URL:
---------------
https://codeservir-api.vercel.app/embed/$CHATBOT_ID

Training Endpoint:
------------------
POST https://codeservir-api.vercel.app/api/chatbot/$CHATBOT_ID/train

Next Steps:
-----------
1. Add the embed code to your website (public/index.html)
2. Or update ChatbotWidget.tsx with the chatbot ID
3. Train your chatbot with custom Q&A pairs
4. Test on localhost
5. Deploy to production

EOF

echo "✅ Details saved to CHATBOT_DETAILS.txt"
echo ""

# Ask if user wants to train now
echo "🎓 Would you like to train your chatbot now? (y/n)"
read -r TRAIN_NOW

if [ "$TRAIN_NOW" = "y" ] || [ "$TRAIN_NOW" = "Y" ]; then
    echo "📚 Training chatbot with CodeServir Q&A data..."
    
    # Training data
    TRAINING_DATA='[
      {"question": "What is CodeServir?", "answer": "CodeServir is an AI-powered chatbot platform that helps businesses create intelligent chatbots for their websites in minutes. No coding required!"},
      {"question": "How much does it cost?", "answer": "We offer three plans: Starter (Free forever), Professional ($29/month), and Enterprise (custom pricing). The free plan includes 1 chatbot and 100 conversations per month."},
      {"question": "How do I create a chatbot?", "answer": "Simply go to our Create Chatbot page, fill in your business details, customize the colors, and click create. You'\''ll get an embed code instantly that you can add to your website."},
      {"question": "Do I need coding skills?", "answer": "No! CodeServir is designed for everyone. Just fill out a simple form, and we'\''ll generate everything you need. Copy and paste the embed code into your website."},
      {"question": "Can I customize the chatbot?", "answer": "Yes! You can customize colors to match your brand, train it with custom Q&A pairs, and configure its behavior. Professional and Enterprise plans offer even more customization options."}
    ]'
    
    TRAIN_RESPONSE=$(curl -s -X POST "https://codeservir-api.vercel.app/api/chatbot/$CHATBOT_ID/train" \
      -H "Content-Type: application/json" \
      -d "{\"trainingData\": $TRAINING_DATA}")
    
    echo "✅ Training complete!"
    echo "Response: $TRAIN_RESPONSE"
fi

echo ""
echo "🎉 All done! Your chatbot is ready to use!"
echo ""
echo "📖 Next steps:"
echo "  1. Open CHATBOT_DETAILS.txt for your chatbot info"
echo "  2. Add the embed code to your website"
echo "  3. Test it on localhost:3000"
echo "  4. Deploy to production"
echo ""
echo "📚 For more details, see CREATE_CODESERVIR_CHATBOT.md"
