
import dotenv from 'dotenv';
import chatbotService from '../services/chatbot.service';
import chatbotModel from '../models/chatbot.model';
import path from 'path';

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function debugLimit() {
    const email = 'ravi2025verma@gmail.com';
    console.log(`🔍 Debugging limit for: ${email}`);

    try {
        console.log('Checking raw count from model...');
        const count = await chatbotModel.countByEmail(email);
        console.log(`🔢 Raw Count from DB: ${count} (Type: ${typeof count})`);

        console.log('Checking service limit logic...');
        const limitInfo = await chatbotService.checkLimit(email);
        console.log('📋 Service Response:', JSON.stringify(limitInfo, null, 2));

        if (!limitInfo.canCreate) {
            console.error('❌ ERROR: User blocked despite expecting to be allowed (assuming count < 5)');
        } else {
            console.log('✅ SUCCESS: User is allowed to create.');
        }

    } catch (error) {
        console.error('💥 Error during debug:', error);
    }
}

debugLimit();
