import { portfolioKnowledge } from '../data/portfolioKnowledge';

// API Configuration - Using Groq (Free, Fast, Reliable)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant'; // Fast and free

// Fallback to OpenRouter if Groq fails
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.2-3b-instruct:free'
];

// Response cache to reduce API calls
const responseCache = new Map();

// Get API keys from environment variables
const getGroqApiKey = () => {
  return process.env.REACT_APP_GROQ_API_KEY || '';
};

const getOpenRouterApiKey = () => {
  return process.env.REACT_APP_OPENROUTER_API_KEY || '';
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

// Try Groq API first (most reliable) with agentic features
async function* tryGroqAPI(userQuery, conversationHistory) {
  const apiKey = getGroqApiKey();
  
  if (!apiKey) {
    return null;
  }

  const userMessage = buildUserMessage(userQuery, conversationHistory);
  const systemPrompt = buildSystemPrompt(userQuery, conversationHistory);

  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
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
        max_tokens: 1000
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Groq API key.');
      } else if (response.status >= 500) {
        throw new Error('Service temporarily unavailable. Please try again in a moment.');
      }
      return null;
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';
    const cacheKey = userQuery.toLowerCase().trim();

    let lastChunkTime = Date.now();
    const STREAM_TIMEOUT = 60000; // 60 seconds timeout for stream

    while (true) {
      // Check for stream timeout
      if (Date.now() - lastChunkTime > STREAM_TIMEOUT) {
        throw new Error('Stream timeout. The response is taking too long.');
      }

      const { done, value } = await reader.read();
      if (done) break;

      lastChunkTime = Date.now();
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            if (fullResponse) {
              responseCache.set(cacheKey, fullResponse);
              if (responseCache.size > 50) {
                const firstKey = responseCache.keys().next().value;
                responseCache.delete(firstKey);
              }
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
            
            // Check for errors in response
            if (json.error) {
              throw new Error(json.error.message || 'API returned an error');
            }
          } catch (e) {
            // Skip invalid JSON, but throw for actual errors
            if (e.message && e.message.includes('error')) {
              throw e;
            }
          }
        }
      }
    }

    // Cache successful response
    if (fullResponse) {
      responseCache.set(cacheKey, fullResponse);
    }
  } catch (error) {
    // Re-throw specific errors so they can be handled upstream
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection and try again.');
    } else if (error.message) {
      throw error; // Re-throw with message
    }
    return null;
  }
}

// Try OpenRouter as fallback with agentic features
async function* tryOpenRouterAPI(userQuery, conversationHistory) {
  const apiKey = getOpenRouterApiKey();
  
  if (!apiKey) {
    return null;
  }

  const userMessage = buildUserMessage(userQuery, conversationHistory);
  const systemPrompt = buildSystemPrompt(userQuery, conversationHistory);

  // Try each OpenRouter model
  for (const model of OPENROUTER_MODELS) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin || 'https://gundlatrinath.github.io',
          'X-Title': 'Trinath Portfolio AI Assistant'
        },
        body: JSON.stringify({
          model: model,
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
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        continue; // Try next model
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
              // Skip invalid JSON
            }
          }
        }
      }

      if (fullResponse) {
        responseCache.set(cacheKey, fullResponse);
      }
      return; // Success, exit
    } catch (error) {
      continue; // Try next model
    }
  }

  return null; // All models failed
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

  // Try Groq first (most reliable)
  const groqGenerator = tryGroqAPI(userQuery, conversationHistory);
  if (groqGenerator) {
    let hasContent = false;
    for await (const chunk of groqGenerator) {
      if (chunk) {
        hasContent = true;
        yield chunk;
      }
    }
    if (hasContent) return; // Success!
  }

  // Fallback to OpenRouter
  const openRouterGenerator = tryOpenRouterAPI(userQuery, conversationHistory);
  if (openRouterGenerator) {
    let hasContent = false;
    for await (const chunk of openRouterGenerator) {
      if (chunk) {
        hasContent = true;
        yield chunk;
      }
    }
    if (hasContent) return; // Success!
  }

  // If all APIs failed, provide helpful information using knowledge base
  const errorMessage = `I apologize, but I'm currently unable to connect to the AI services. However, I can still help you with information from Trinath's portfolio!\n\n**Here's what I can tell you:**\n\n📧 **Contact Information:**\n- Email: [trinathgundla358@gmail.com](mailto:trinathgundla358@gmail.com)\n- Phone: +91 8522994206\n- Location: Hyderabad, India\n\n🔗 **Professional Links:**\n- LinkedIn: [linkedin.com/in/trinath-gundla-298828210](https://linkedin.com/in/trinath-gundla-298828210)\n- GitHub: [github.com/GundlaTrinath](https://github.com/GundlaTrinath)\n- Portfolio: [gundlatrinath.github.io/Trinathportfolio](https://gundlatrinath.github.io/Trinathportfolio)\n\n📄 **Resume:**\n- [Download Resume PDF](https://gundlatrinath.github.io/Trinathportfolio/Trinath_Gundla_AI_Software_Engineer.pdf)\n\n**About Trinath:**\nAI Software Engineer with 2+ years of experience in AI/GenAI systems, specializing in RAG, LangChain, and multimodal AI pipelines. Currently working on enterprise AI solutions for clients like Pratt & Whitney and VALE.\n\nWould you like to know more about his skills, projects, or experience?`;
  
  const words = errorMessage.split(' ');
  for (const word of words) {
    yield word + ' ';
    await new Promise(resolve => setTimeout(resolve, 30));
  }
}

// Get greeting message with agentic touch
export function getGreetingMessage() {
  return `Hello! 👋 I'm Trinath's **Agentic AI Assistant** powered by Groq.\n\nI can help you:\n✨ Explore his AI/ML projects and achievements\n🎯 Compare technologies and approaches\n💡 Get recommendations based on your interests\n🔍 Deep dive into specific areas of expertise\n\nWhat would you like to discover first?`;
}
