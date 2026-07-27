import { portfolioKnowledge } from '../data/portfolioKnowledge';

// API Configuration - Using NVIDIA Build API (Free tier/credits)
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_MODEL = 'meta/llama-3.1-405b-instruct'; // You can also use 'meta/llama-3.1-70b-instruct' or 'meta/llama-3.1-8b-instruct'

// Response cache to reduce API calls
const responseCache = new Map();

// Get API key from environment variables
const getNvidiaApiKey = () => {
  return process.env.REACT_APP_NVIDIA_API_KEY || '';
};

// Agentic Features: Analyze user intent and conversation context
function analyzeIntent(userQuery, conversationHistory) {
  const query = userQuery.toLowerCase();
  const analysis = {
    intent: 'general',
    topics: [],
    needsComparison: false,
    needsRecommendation: false,
    isFollowUp: false,
    suggestedActions: []
  };

  // Detect intent
  if (query.includes('compare') || query.includes('difference') || query.includes('vs')) {
    analysis.intent = 'comparison';
    analysis.needsComparison = true;
  } else if (query.includes('recommend') || query.includes('suggest') || query.includes('should i')) {
    analysis.intent = 'recommendation';
    analysis.needsRecommendation = true;
  } else if (query.includes('how') || query.includes('explain') || query.includes('tell me about')) {
    analysis.intent = 'deep_dive';
  } else if (query.includes('what') || query.includes('which')) {
    analysis.intent = 'information';
  }

  // Detect topics
  if (query.includes('skill') || query.includes('technology') || query.includes('tech')) {
    analysis.topics.push('skills');
  }
  if (query.includes('project') || query.includes('work') || query.includes('built')) {
    analysis.topics.push('projects');
  }
  if (query.includes('experience') || query.includes('job') || query.includes('role')) {
    analysis.topics.push('experience');
  }
  if (query.includes('ai') || query.includes('ml') || query.includes('llm') || query.includes('rag')) {
    analysis.topics.push('ai');
  }

  // Check if it's a follow-up
  if (conversationHistory.length > 0) {
    const lastUserMsg = conversationHistory.filter(m => m.sender === 'user').slice(-1)[0];
    if (lastUserMsg && (
      query.includes('more') || 
      query.includes('also') || 
      query.includes('what about') || 
      query.includes('how about') ||
      query.length < 30
    )) {
      analysis.isFollowUp = true;
    }
  }

  return analysis;
}

// Generate proactive suggestions based on context
function generateSuggestions(conversationHistory) {
  const askedAbout = new Set();
  
  conversationHistory.forEach(msg => {
    const text = msg.text.toLowerCase();
    if (text.includes('skill')) askedAbout.add('skills');
    if (text.includes('project')) askedAbout.add('projects');
    if (text.includes('experience')) askedAbout.add('experience');
  });

  const suggestions = [];
  if (!askedAbout.has('projects')) {
    suggestions.push("Ask about my impressive AI projects like the Multimodal Defect Intelligence System");
  }
  if (!askedAbout.has('skills')) {
    suggestions.push("Learn about my expertise in GenAI, RAG, and LangChain");
  }
  if (!askedAbout.has('experience')) {
    suggestions.push("Discover my 2+ years of AI/ML engineering experience");
  }

  return suggestions;
}

// Build agentic system prompt with reasoning capabilities
function buildSystemPrompt(userQuery, conversationHistory) {
  const intent = analyzeIntent(userQuery, conversationHistory);
  const suggestions = generateSuggestions(conversationHistory);

  return `You are an intelligent AGENTIC AI assistant representing Trinath Gundla, an AI Software Engineer.

**AGENTIC CAPABILITIES:**
You have advanced reasoning abilities:
1. **Intent Understanding** - Detect what the user really wants
2. **Context Awareness** - Remember previous conversation
3. **Proactive Guidance** - Suggest relevant information
4. **Comparison Skills** - Compare technologies, projects, etc.
5. **Recommendations** - Suggest based on user interests
6. **Chain-of-Thought** - Show reasoning for complex queries

**CURRENT CONTEXT:**
- User Intent: ${intent.intent}
- Topics Mentioned: ${intent.topics.join(', ') || 'general'}
- Is Follow-up: ${intent.isFollowUp}
- Conversation Length: ${conversationHistory.length} messages

**PORTFOLIO KNOWLEDGE:**
${JSON.stringify(portfolioKnowledge, null, 2)}

**YOUR BEHAVIOR:**
1. **For Comparisons**: Break down differences clearly with pros/cons
2. **For Recommendations**: Explain reasoning behind suggestions
3. **For Deep Dives**: Provide detailed explanations with examples
4. **For Follow-ups**: Build on previous context smoothly
5. **Always**: Be conversational, insightful, and helpful

**PROACTIVE FEATURES:**
- Ask clarifying questions when intent is unclear
- Suggest related topics the user might find interesting
- Connect different aspects of Trinath's experience
- Highlight unique achievements and impact
${suggestions.length > 0 ? `\n**SUGGESTED NEXT TOPICS:**\n${suggestions.map(s => `- ${s}`).join('\n')}` : ''}

**FORMATTING RULES:**
- Use markdown for clarity (**bold**, lists, code blocks)
- **ALWAYS format URLs as clickable markdown links**: [Link Text](URL)
- For contact info, ALWAYS use this format:
  - LinkedIn: [linkedin.com/in/trinath-gundla-298828210](https://linkedin.com/in/trinath-gundla-298828210)
  - GitHub: [github.com/GundlaTrinath](https://github.com/GundlaTrinath)
  - Portfolio: [gundlatrinath.github.io/Trinathportfolio](https://gundlatrinath.github.io/Trinathportfolio)
  - Email: [trinathgundla358@gmail.com](mailto:trinathgundla358@gmail.com)
- **For Resume Download**: Always mention that users can download the resume and provide the link:
  - Resume: [Download Resume PDF](https://gundlatrinath.github.io/Trinathportfolio/Trinath_Gundla_AI_Software_Engineer.pdf)
- Add emojis sparingly for engagement
- Keep responses concise but comprehensive
- End with a relevant follow-up question when appropriate`;
}

// Build user message with context
function buildUserMessage(userQuery, conversationHistory = []) {
  let historyContext = '';
  if (conversationHistory.length > 0) {
    historyContext = '\n\nRecent Conversation:\n';
    conversationHistory.slice(-5).forEach(msg => {
      historyContext += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
    });
  }
  return `${userQuery}${historyContext}`;
}

// Try NVIDIA Build API
async function* tryNvidiaAPI(userQuery, conversationHistory) {
  const apiKey = getNvidiaApiKey();
  if (!apiKey) {
    return null;
  }

  const userMessage = buildUserMessage(userQuery, conversationHistory);
  const systemPrompt = buildSystemPrompt(userQuery, conversationHistory);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory
            .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
            .slice(-10)
            .map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
          { role: 'user', content: userMessage }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1024
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your NVIDIA API key.');
      }
      return null;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';
    const cacheKey = userQuery.toLowerCase().trim();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            if (fullResponse) {
              responseCache.set(cacheKey, fullResponse);
            }
            return;
          }
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              yield content;
            }
          } catch (e) {
            // Skip invalid JSON chunks
          }
        }
      }
    }

    if (fullResponse) {
      responseCache.set(cacheKey, fullResponse);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection and try again.');
    } else if (error.message) {
      throw error;
    }
    return null;
  }
}

// Main streaming function
export async function* streamRAGAgent(userQuery, conversationHistory = []) {
  // Check cache first
  const cacheKey = userQuery.toLowerCase().trim();
  if (responseCache.has(cacheKey)) {
    const cachedResponse = responseCache.get(cacheKey);
    const words = cachedResponse.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    return;
  }

  // Call NVIDIA API
  const nvidiaGenerator = tryNvidiaAPI(userQuery, conversationHistory);
  if (nvidiaGenerator) {
    let hasContent = false;
    for await (const chunk of nvidiaGenerator) {
      if (chunk) {
        hasContent = true;
        yield chunk;
      }
    }
    if (hasContent) return;
  }

  // Fallback response if API fails or key is missing
  const errorMessage = `I apologize, but I'm currently unable to connect to the AI service. However, I can still help you with information from Trinath's portfolio!\n\n📧 **Contact:** [trinathgundla358@gmail.com](mailto:trinathgundla358@gmail.com)\n🔗 **LinkedIn:** [linkedin.com/in/trinath-gundla-298828210](https://linkedin.com/in/trinath-gundla-298828210)\n📄 **Resume:** [Download Resume PDF](https://gundlatrinath.github.io/Trinathportfolio/Trinath_Gundla_AI_Software_Engineer.pdf)`;
  
  const words = errorMessage.split(' ');
  for (const word of words) {
    yield word + ' ';
    await new Promise(resolve => setTimeout(resolve, 30));
  }
}

// Get greeting message
export function getGreetingMessage() {
  return `Hello! 👋 I'm Trinath's **Agentic AI Assistant** powered by NVIDIA Build.\n\nHow can I help you explore Trinath's portfolio today?`;
}
