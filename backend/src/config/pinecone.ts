import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

let pinecone: Pinecone | null = null;
try {
    if (process.env.PINECONE_API_KEY) {
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
    } else {
        console.warn('⚠️ PINECONE_API_KEY is missing. Vector search will not work.');
    }
} catch (error) {
    console.error('❌ Failed to instantiate Pinecone client:', error);
}

const indexName = process.env.PINECONE_INDEX_NAME || 'codeservir-embeddings';

export const getPineconeIndex = () => {
    if (!pinecone) {
        throw new Error('Pinecone client not initialized (Missing API Key?)');
    }
    return pinecone.index(indexName);
};

export const initializePinecone = async () => {
    try {
        if (!pinecone) {
            console.warn('⚠️ Skipping Pinecone initialization: Client not initialized (Missing API Key?)');
            return undefined;
        }

        const pc = pinecone;

        console.log('🔄 Initializing Pinecone...');

        // Check if index exists
        const indexes = await pc.listIndexes();
        const indexExists = indexes.indexes?.some(index => index.name === indexName);

        if (!indexExists) {
            console.log(`📝 Creating Pinecone index: ${indexName}`);
            await pc.createIndex({
                name: indexName,
                dimension: 1536, // OpenAI embedding dimension
                metric: 'cosine',
                spec: {
                    serverless: {
                        cloud: 'aws',
                        region: 'us-east-1'
                    }
                }
            });
            console.log('✅ Pinecone index created successfully');
        } else {
            console.log('✅ Pinecone index already exists');
        }

        return getPineconeIndex();
    } catch (error) {
        console.error('❌ Failed to initialize Pinecone:', error);
        // Don't throw, just log. Allow server to start without Vector DB.
        return undefined;
    }
};

export default pinecone;
