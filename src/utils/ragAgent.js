import { portfolioKnowledge } from '../data/portfolioKnowledge';

// API Configuration - NVIDIA NIM models, called through a serverless proxy (Vercel gateway).
// IMPORTANT: NVIDIA's integrate.api.nvidia.com endpoint has no CORS headers, so it can NEVER
// be called directly from a browser (GitHub Pages is a static site with no backend). All requests
// must go through this gateway, which calls NVIDIA server-side and holds the API key server-side
// (nothing secret ships in this bundle). NVIDIA also frequently retires free-tier models, so the
// fallback list below is periodically re-verified against what the gateway currently accepts.
const NVIDIA_API_URL = 'https://nvidia-gateway-6h5d.vercel.app/api/chat';
const NVIDIA_MODELS = [
  'openai/gpt-oss-20b',
  'z-ai/glm-5.3',
  'nvidia/nemotron-3-super-120b-a12b'
];

// Response cache to reduce API calls
const responseCache = new Map();

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

// Maps a user query to a portfolio page section so the UI can auto-scroll to it.
// Returns a DOM element id ("about" | "skills" | "projects" | "experience" | "resume" | "contact") or null.
export function detectRelevantSection(userQuery) {
  const query = userQuery.toLowerCase();

  const sectionKeywords = [
    { id: 'resume', keywords: ['resume', 'cv', 'download resume', 'pdf'] },
    { id: 'contact', keywords: ['contact', 'email', 'phone number', 'reach out', 'get in touch', 'hire you', 'available for'] },
    { id: 'experience', keywords: ['experience', 'job', 'career', 'timeline', 'work history', 'pratt', 'vale', 'anddhen', 'zee media', 'years of experience', 'internship', 'employment'] },
    { id: 'projects', keywords: ['project', 'built', 'case study', 'defect intelligence', 'mining map', 'verification platform', 'parts data', 'built anything', 'portfolio work'] },
    { id: 'skills', keywords: ['skill', 'tech stack', 'technology', 'technologies', 'proficient', 'expertise in', 'langchain', 'rag ', 'genai', 'python', 'flask', 'opencv', 'mongodb', 'mysql'] },
    { id: 'about', keywords: ['about you', 'who are you', 'introduce yourself', 'tell me about yourself', 'your background', 'who is trinath'] },
  ];

  for (const section of sectionKeywords) {
    if (section.keywords.some(keyword => query.includes(keyword))) {
      return section.id;
    }
  }

  return null;
}

// Generate proactive suggestions based on context
export function generateSuggestions(conversationHistory) {
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

  return `You are an intelligent AGENTIC AI assistant representing Trinath Gundla, an AI Software Engineer. You also double as a general-purpose knowledgeable assistant.

**SCOPE OF KNOWLEDGE:**
- You are NOT limited to portfolio topics. Freely and accurately answer general knowledge, coding, math, science, and technology questions (e.g. "what is Fibonacci", "explain recursion", "what is a REST API") just like a capable AI assistant would.
- Use the PORTFOLIO KNOWLEDGE below whenever the question relates to Trinath (skills, projects, experience, contact, resume, etc.).
- Never refuse a question just because it isn't about Trinath. Answer it directly and well.
- When natural (not forced), you may briefly relate the answer back to Trinath's work (e.g. if asked about RAG, algorithms, or AI concepts, mention how he applied it in his projects) — but this is optional, not required.

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

// NVIDIA NIM API (free tier, OpenAI-compatible), proxied through the Vercel gateway.
// NOTE: the gateway's SSE passthrough is unreliable (it can mangle the stream into a
// malformed JSON blob), so we request a plain (non-streaming) completion and simulate
// the typing effect client-side instead - this is robust and still feels like streaming.
async function* tryNvidiaAPI(userQuery, conversationHistory) {
  const userMessage = buildUserMessage(userQuery, conversationHistory);
  const systemPrompt = buildSystemPrompt(userQuery, conversationHistory);
  const cacheKey = userQuery.toLowerCase().trim();

  // Try each NVIDIA model in order until one succeeds
  for (const model of NVIDIA_MODELS) {
    try {
      const response = await fetch(NVIDIA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
          stream: false,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        continue; // Model unavailable/retired (e.g. 410 Gone) - try next model
      }

      const json = await response.json();
      const fullResponse = json.choices?.[0]?.message?.content;
      if (!fullResponse) {
        continue; // Empty/unexpected response - try next model
      }

      responseCache.set(cacheKey, fullResponse);

      // Simulate streaming word-by-word for a consistent typing UX
      const words = fullResponse.split(' ');
      for (const word of words) {
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      return; // Success, exit
    } catch (error) {
      continue; // Try next model
    }
  }

  return null; // All NVIDIA models failed
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

  // Try NVIDIA NIM
  const nvidiaGenerator = tryNvidiaAPI(userQuery, conversationHistory);
  if (nvidiaGenerator) {
    let hasContent = false;
    for await (const chunk of nvidiaGenerator) {
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
  return `Hello! 👋 I'm Trinath's **Agentic AI Assistant** powered by NVIDIA NIM.\n\nI can help you:\n✨ Explore his AI/ML projects and achievements\n🎯 Compare technologies and approaches\n💡 Get recommendations based on your interests\n🔍 Deep dive into specific areas of expertise\n\nWhat would you like to discover first?`;
}
