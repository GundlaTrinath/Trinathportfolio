Portfolio link : https://gundlatrinath.github.io/Trinathportfolio/

## AI Chatbot Setup

The portfolio includes an AI chatbot powered by GPT-OSS-20B via OpenRouter API with streaming responses.

### Setup Instructions

1. **Get OpenRouter API Key:**
   - Visit https://openrouter.ai/keys
   - Sign up/login and create an API key

2. **Configure Environment Variable:**
   - Create a `.env` file in the root directory
   - Add your API key:
     ```
     REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
     ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run the Application:**
   ```bash
   npm start
   ```

### Features

- **Real-time Streaming:** Responses stream in real-time for better UX
- **Markdown Formatting:** Rich text formatting with code blocks, lists, and links
- **Agentic Design:** Context-aware responses with conversation history
- **RAG Integration:** Uses portfolio knowledge base for accurate answers
- **Conversational:** Natural, friendly responses powered by GPT-OSS-20B

### Fallback Mode

If no API key is configured, the chatbot will use a demo mode with template-based responses.