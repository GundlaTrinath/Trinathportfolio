// Portfolio Knowledge Base for RAG Agent
export const portfolioKnowledge = {
  personalInfo: {
    name: "Trinath Gundla",
    title: "AI Software Engineer",
    email: "trinathgundla358@gmail.com",
    phone: "+91 8522994206",
    location: "Hyderabad, India",
    portfolio: "https://gundlatrinath.github.io/Trinathportfolio",
    portfolioDisplay: "gundlatrinath.github.io/Trinathportfolio",
    linkedin: "https://linkedin.com/in/trinath-gundla-298828210",
    linkedinDisplay: "linkedin.com/in/trinath-gundla-298828210",
    github: "https://github.com/GundlaTrinath",
    githubDisplay: "github.com/GundlaTrinath",
    resume: {
      filename: "Trinath_Gundla_AI_Software_Engineer.pdf",
      path: "/Trinath_Gundla_AI_Software_Engineer.pdf",
      downloadUrl: "https://gundlatrinath.github.io/Trinathportfolio/Trinath_Gundla_AI_Software_Engineer.pdf",
      available: true,
      description: "Complete resume with work experience, projects, skills, and education"
    }
  },

  summary: {
    text: "AI Software Engineer with 2+ years of experience designing and deploying production-grade AI systems using Python, LangChain, and Retrieval-Augmented Generation (RAG). Proven expertise in building multimodal AI pipelines, semantic search, vector similarity systems, and AI automation solutions for enterprise use cases.",
    expertise: [
      "Multimodal AI systems",
      "RAG (Retrieval-Augmented Generation)",
      "LangChain and LangGraph",
      "Vector databases and semantic search",
      "AI workflow orchestration",
      "REST-based inference services",
      "Scalable AI system design"
    ]
  },

  skills: {
    generativeAI: [
      "GenAI applications",
      "Agent-based AI systems",
      "LLM-powered workflows"
    ],
    promptEngineering: [
      "Prompt design",
      "Context management"
    ],
    aiFrameworks: [
      "Retrieval-Augmented Generation (RAG)",
      "LangChain",
      "LangGraph",
      "Ollama"
    ],
    computerVision: [
      "OpenCV",
      "Image preprocessing",
      "Tesseract OCR"
    ],
    programming: [
      "Python"
    ],
    backend: [
      "FastAPI",
      "Flask",
      "REST APIs"
    ],
    dataProcessing: [
      "Pandas",
      "NumPy",
      "Data cleaning"
    ],
    databases: [
      "MySQL",
      "MongoDB"
    ],
    tools: [
      "Git",
      "GitHub",
      "Postman"
    ]
  },

  projects: [
    {
      title: "Multimodal Defect Intelligence System",
      client: "Pratt & Whitney",
      description: "Multimodal AI chatbot to identify visually and textually similar historical defects using vision-based and text-based RAG pipelines. Designed a hybrid image-text retrieval workflow to compute contextual similarity between new defect inputs and historical defect cases.",
      technologies: ["Python", "LangChain", "Ollama Vision", "RAG", "Flask", "MongoDB", "REST APIs"],
      achievements: [
        "Improved matched defect case accuracy by approximately 30%",
        "Reduced investigation time by 35%",
        "Significantly enhanced cross-case analysis efficiency"
      ],
      features: [
        "Multimodal AI chatbot",
        "Vision-based and text-based RAG pipelines",
        "Hybrid image-text retrieval",
        "Excel-based defect logs integration",
        "Unstructured documents processing",
        "Real-time semantic and visual comparison"
      ]
    },
    {
      title: "Mining Maps Deduplication System",
      client: "VALE",
      description: "Multimodal LLM-based deduplication system to automatically detect and remove redundant mining maps. Used CLIP embeddings to represent visual map data and performed similarity search using FAISS vector database.",
      technologies: ["Python", "CLIP", "FAISS", "Vector Database", "LLM"],
      achievements: [
        "90% reduction in duplicate maps",
        "Approximately $450K in annual savings",
        "Improved data integrity and retrieval accuracy",
        "Significantly reduced manual verification effort and storage usage"
      ],
      features: [
        "Multimodal LLM-based deduplication",
        "CLIP embeddings for visual representation",
        "FAISS vector database for similarity search",
        "Embedding-based similarity search",
        "Traditional comparison logic integration"
      ]
    },
    {
      title: "AI Verification & Validation Platform",
      client: "Enterprise",
      description: "AI-powered Verification & Validation (V&V) platform to automatically generate structured test cases from technical documentation. Leveraged LangChain with RAG pipelines to enhance contextual understanding and output accuracy.",
      technologies: ["Python", "LangChain", "RAG", "Ollama", "MySQL", "REST APIs"],
      achievements: [
        "Increased test case relevance and precision by 25%",
        "Reduced data inconsistencies by 25%",
        "Improved response performance by 20%"
      ],
      features: [
        "Automatic test case generation",
        "LangChain with RAG pipelines",
        "Vector databases integration",
        "Semantic similarity retrieval",
        "MySQL-backed validation workflows",
        "REST APIs for integration"
      ]
    },
    {
      title: "Automatic Parts Data Intelligence System",
      client: "Anddhen Group",
      description: "Automated data extraction and standardization system to convert unstructured scanned PDFs and images into structured formats such as XML and Excel. Built automated pipelines using Python and Pandas to extract, clean, and normalize parts data across multiple file formats.",
      technologies: ["Python", "Pandas", "Tesseract OCR", "OpenCV"],
      achievements: [
        "Reduced manual data formatting effort by 40%",
        "Improved text extraction accuracy through OCR preprocessing"
      ],
      features: [
        "Automated data extraction",
        "OCR preprocessing (noise removal, thresholding, contour detection)",
        "Multi-format support (PDF, images, XML, Excel)",
        "Data cleaning and normalization",
        "Validation and transformation workflows"
      ]
    }
  ],

  experience: [
    {
      role: "Software Engineer - AI & GenAI Systems",
      company: "Cyient",
      location: "Hyderabad, India",
      duration: "Dec 2023 - Present",
      type: "Full-time",
      description: "Designing and deploying production-grade AI systems using Python, LangChain, and RAG. Building multimodal AI pipelines, semantic search, vector similarity systems, and AI automation solutions for enterprise clients including Pratt & Whitney and VALE.",
      keyProjects: [
        "Multimodal Defect Intelligence System for Pratt & Whitney",
        "Mining Maps Deduplication System for VALE",
        "AI Verification & Validation Platform"
      ],
      achievements: [
        "Built multimodal AI systems for Fortune 500 companies",
        "Improved defect detection accuracy by 30% for Pratt & Whitney",
        "Reduced processing time by 60% for VALE mining operations",
        "Delivered 3+ production AI systems serving enterprise clients"
      ]
    },
    {
      role: "Software Engineer",
      company: "Anddhen Group",
      duration: "Mar 2023 - Nov 2023",
      type: "Full-time",
      location: "Remote",
      description: "Developed automated data extraction and standardization systems using Python, Pandas, Tesseract OCR, and OpenCV. Built automated pipelines to extract, clean, and normalize parts data across multiple file formats.",
      keyProjects: [
        "Automatic Parts Data Intelligence System"
      ],
      achievements: [
        "Reduced manual data formatting effort by 40%",
        "Improved text extraction accuracy through OCR preprocessing",
        "Automated end-to-end data processing workflow"
      ]
    },
    {
      role: "Python & NLP Intern",
      company: "Zee Media Corporation",
      duration: "Jun 2021 - Sep 2021",
      type: "Internship",
      location: "Remote",
      description: "Developed multimedia automation application processing video inputs to extract audio, convert speech to text, and clean generated text. Implemented Named Entity Recognition (NER) using SpaCy to tag and extract key information from transcribed multimedia content.",
      achievements: [
        "Automated export of structured NER results into Excel formats",
        "Integrated complete workflow into Tkinter-based desktop application",
        "Processed and analyzed multimedia content for news organization"
      ]
    }
  ],

  education: {
    degree: "B.Tech - Information Technology",
    institution: "Vidya Jyothi Institute of Technology",
    location: "Hyderabad",
    duration: "June 2019 - May 2023"
  },

  certifications: [
    "Most Valuable Performer - Bronze",
    "AI Agents Intensive Course - Google",
    "Crash Course on Python - Coursera"
  ],

  keywords: {
    ai: ["AI", "artificial intelligence", "machine learning", "ML", "deep learning"],
    rag: ["RAG", "retrieval-augmented generation", "vector search", "semantic search"],
    langchain: ["LangChain", "LangGraph", "LLM", "large language model"],
    python: ["Python", "programming", "development"],
    projects: ["projects", "work", "portfolio", "experience"],
    skills: ["skills", "expertise", "technologies", "tools"],
    contact: ["contact", "email", "phone", "reach out", "connect", "linkedin", "github"],
    resume: ["resume", "cv", "download resume", "get resume", "resume pdf", "download cv"]
  },

  resumeInfo: {
    available: true,
    filename: "Trinath_Gundla_AI_Software_Engineer.pdf",
    downloadUrl: "https://gundlatrinath.github.io/Trinathportfolio/Trinath_Gundla_AI_Software_Engineer.pdf",
    directPath: "/Trinath_Gundla_AI_Software_Engineer.pdf",
    description: "You can download Trinath's complete resume (PDF format) directly from the website. The resume includes detailed information about his work experience, projects, technical skills, education, and certifications.",
    instructions: "The resume is available for download on the portfolio website. You can access it directly or ask me to provide the download link."
  },

  // Clear work history summary
  workHistory: {
    current: {
      position: "Software Engineer - AI & GenAI Systems",
      employmentType: "Freelance/Contract Work",
      clients: ["Pratt & Whitney (Aerospace)", "VALE (Mining)", "Multiple Enterprise Clients"],
      duration: "Dec 2023 - Present",
      location: "Hyderabad, India",
      focus: "Building production-grade AI systems for Fortune 500 companies"
    },
    companies: [
      {
        name: "Freelance/Contract (Current)",
        role: "Software Engineer - AI & GenAI Systems",
        period: "Dec 2023 - Present",
        type: "Contract",
        majorClients: ["Pratt & Whitney", "VALE"]
      },
      {
        name: "Anddhen Group",
        role: "Software Engineer",
        period: "Mar 2023 - Nov 2023",
        type: "Full-time"
      },
      {
        name: "Zee Media Corporation",
        role: "Python & NLP Intern",
        period: "Jun 2021 - Sep 2021",
        type: "Internship"
      }
    ]
  }
};

