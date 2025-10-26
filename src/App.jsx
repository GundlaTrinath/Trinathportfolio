import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCode,
  FaBrain,
  FaRocket,
  FaDownload,
} from "react-icons/fa";
import {
  SiPython,
  SiReact,
  SiFlask,
  SiOpencv,
  SiMongodb,
  SiMysql,
  SiTailwindcss,
} from "react-icons/si";

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Custom Magnetic Cursor */}
      <motion.div
        className="hidden md:block fixed w-8 h-8 border-2 border-emerald-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: cursorVariant === "hover" ? 2 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 origin-left z-50"
        style={{ scaleX: smoothProgress }}
      />

      {/* Floating Resume Download Button */}
      <motion.a
        href={`${process.env.PUBLIC_URL}/Trinath_2yr_fullstack.pdf`}
        download="Trinath_Gundla_Resume.pdf"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-40 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-pulse" />
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all">
            <FaDownload className="w-6 h-6 text-white" />
          </div>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-zinc-700">
            Download Resume
          </div>
        </div>
      </motion.a>

      <MagneticHero setCursorVariant={setCursorVariant} />
      <RevealSkills />
      <ImmersiveProjects setCursorVariant={setCursorVariant} />
      <FluidTimeline />
      <ResumeDownloadSection setCursorVariant={setCursorVariant} />
      <ParticleContact setCursorVariant={setCursorVariant} />
    </div>
  );
}

// Hero Section
function MagneticHero({ setCursorVariant }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-400 opacity-20 blur-[120px] rounded-full"
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500 opacity-20 blur-[120px] rounded-full"
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: 1,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-purple-500 opacity-20 blur-[120px] rounded-full"
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{
            duration: 14,
            repeat: Infinity,
            delay: 2,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div style={{ y }} className="text-center max-w-6xl mx-auto">
          {/* Giant Logo */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-[8rem] md:text-[12rem] lg:text-[15rem] font-black leading-none tracking-tighter">
              <span className="relative block">
                <span
                  className="absolute inset-0 text-emerald-400 opacity-50 blur-sm"
                  style={{ transform: "translate(-2px, 2px)" }}
                >
                  TG
                </span>
                <span className="relative bg-gradient-to-r from-white via-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  TG
                </span>
              </span>
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Trinath Gundla
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Architecting the future with{" "}
            <span className="text-emerald-400 font-semibold">AI</span>,{" "}
            <span className="text-blue-500 font-semibold">RAG</span>, and{" "}
            <span className="text-purple-500 font-semibold">
              Vision Systems
            </span>
          </motion.p>

          {/* Role Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center gap-4 md:gap-6 mb-16 flex-wrap px-4"
          >
            {[
              {
                icon: <FaBrain />,
                text: "AI Engineer",
                gradient: "from-emerald-400 to-green-500",
              },
              {
                icon: <FaCode />,
                text: "Full Stack",
                gradient: "from-blue-500 to-cyan-400",
              },
              {
                icon: <FaRocket />,
                text: "RAG Specialist",
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
                className="group relative px-6 py-3 md:px-8 md:py-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-emerald-400 transition-all cursor-pointer overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${badge.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div className="relative flex items-center gap-2 md:gap-3 text-base md:text-lg font-semibold">
                  {badge.icon}
                  <span className="hidden sm:inline">{badge.text}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center gap-4 md:gap-6 flex-wrap px-4"
          >
            <motion.a
              href="https://github.com/GundlaTrinath"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(16, 185, 129, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setCursorVariant("hover")}
              onMouseLeave={() => setCursorVariant("default")}
              className="group relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-emerald-400 to-green-500 text-black rounded-2xl font-bold text-base md:text-lg flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <FaGithub size={24} />
                <span className="hidden sm:inline">View Projects</span>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>

            <motion.a
              href={`${process.env.PUBLIC_URL}/Trinath_2yr_fullstack.pdf`}
              download="Trinath_Gundla_Resume.pdf"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setCursorVariant("hover")}
              onMouseLeave={() => setCursorVariant("default")}
              className="group relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-base md:text-lg flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <FaDownload size={20} />
                <span className="hidden sm:inline">Resume</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/trinath-gundla-298828210/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setCursorVariant("hover")}
              onMouseLeave={() => setCursorVariant("default")}
              className="px-8 py-4 md:px-10 md:py-5 border-2 border-zinc-700 hover:border-emerald-400 rounded-2xl font-bold text-base md:text-lg flex items-center gap-3 transition-colors"
            >
              <FaLinkedin size={24} />
              Connect
            </motion.a>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-gray-400 px-4"
          >
            {[
              {
                icon: <FaEnvelope className="text-emerald-400" />,
                text: "trinathgundla358@gmail.com",
              },
              {
                icon: <FaPhone className="text-blue-500" />,
                text: "+91 8522994206",
              },
              {
                icon: <FaMapMarkerAlt className="text-purple-500" />,
                text: "Hyderabad",
              },
            ].map((contact, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800"
              >
                {contact.icon}
                <span className="hidden md:inline">{contact.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-700 rounded-full flex justify-center pt-2"
            >
              <div className="w-1 h-2 bg-emerald-400 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// Skills Section
function RevealSkills() {
  const skills = [
    {
      icon: <SiPython />,
      name: "Python",
      level: 95,
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: <SiReact />,
      name: "React",
      level: 90,
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: <SiFlask />,
      name: "Flask",
      level: 88,
      color: "from-gray-400 to-gray-600",
    },
    {
      icon: "🤖",
      name: "LangChain",
      level: 92,
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: <SiOpencv />,
      name: "OpenCV",
      level: 85,
      color: "from-red-400 to-pink-500",
    },
    {
      icon: <SiMongodb />,
      name: "MongoDB",
      level: 82,
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: <SiMysql />,
      name: "MySQL",
      level: 86,
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: <SiTailwindcss />,
      name: "Tailwind",
      level: 94,
      color: "from-cyan-300 to-teal-500",
    },
  ];

  return (
    <section className="py-24 md:py-40 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-center mb-16 md:mb-24 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
        >
          Tech Arsenal
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {skills.map((skill, idx) => (
            <SkillCard key={idx} skill={skill} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-zinc-900 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-zinc-800 hover:border-emerald-400 transition-all cursor-pointer overflow-hidden group"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity`}
      />

      <div className="relative z-10">
        <div className="text-5xl md:text-7xl mb-4 md:mb-6 text-emerald-400">
          {skill.icon}
        </div>
        <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">
          {skill.name}
        </h3>

        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={
              isInView ? { width: isHovered ? `${skill.level}%` : "0%" } : {}
            }
            transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
            className={`h-full bg-gradient-to-r ${skill.color}`}
          />
        </div>
        <p className="text-right text-xs md:text-sm text-gray-500 mt-2">
          {skill.level}%
        </p>
      </div>
    </motion.div>
  );
}

// Projects Section
function ImmersiveProjects({ setCursorVariant }) {
  const projects = [
    {
      title: "Neural Validation Engine",
      subtitle: "Verification & Validation Platform",
      desc: "Enterprise AI system using LLaMA 3.1 and RAG for automated intelligent test case generation",
      metrics: { accuracy: "+25%", speed: "2x", success: "98%" },
      tech: ["Python", "LLaMA 3.1", "LangChain", "RAG", "Flask", "MySQL"],
      gradient: "from-emerald-400 to-green-500",
      emoji: "🧠",
    },
    {
      title: "Vision Defect Analyzer",
      subtitle: "Pratt & Whitney AI Chatbot",
      desc: "Multimodal vision-language system for intelligent defect similarity detection and analysis",
      metrics: { precision: "+30%", time: "-35%", recall: "94%" },
      tech: ["Ollama Vision", "LangChain", "RAG", "Python", "Flask"],
      gradient: "from-blue-500 to-cyan-400",
      emoji: "👁️",
    },
    {
      title: "Document Intelligence Matrix",
      subtitle: "Automatic Parts Catalog",
      desc: "Advanced OCR and extraction system processing multi-format documents with AI precision",
      metrics: { automation: "+40%", accuracy: "92%", speed: "3x" },
      tech: ["Tesseract OCR", "Pandas", "Flask", "OpenPyXL"],
      gradient: "from-purple-500 to-pink-400",
      emoji: "📊",
    },
  ];

  return (
    <section className="py-24 md:py-40 px-6 bg-zinc-950">
      <div className="container mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-center mb-16 md:mb-24 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
        >
          Featured Work
        </motion.h2>

        <div className="space-y-16 md:space-y-32">
          {projects.map((project, idx) => (
            <ProjectCard
              key={idx}
              project={project}
              index={idx}
              setCursorVariant={setCursorVariant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, setCursorVariant }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-150px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={`flex flex-col ${
        index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
      } gap-8 md:gap-12 items-center`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        onMouseEnter={() => setCursorVariant("hover")}
        onMouseLeave={() => setCursorVariant("default")}
        className="w-full lg:w-1/2 relative group cursor-pointer"
      >
        <div
          className={`relative bg-gradient-to-br ${project.gradient} p-[2px] rounded-2xl md:rounded-3xl`}
        >
          <div className="bg-zinc-900 p-8 md:p-12 rounded-2xl md:rounded-3xl">
            <div className="aspect-video bg-black rounded-xl md:rounded-2xl flex items-center justify-center text-6xl md:text-8xl">
              {project.emoji}
            </div>
          </div>
        </div>
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-30 blur-3xl transition-opacity`}
        />
      </motion.div>

      <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p
            className={`text-xs md:text-sm font-mono bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent mb-2`}
          >
            {project.subtitle}
          </p>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4">
            {project.title}
          </h3>
          <p className="text-base md:text-xl text-gray-400 leading-relaxed">
            {project.desc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex gap-6 md:gap-8"
        >
          {Object.entries(project.metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div
                className={`text-2xl md:text-4xl font-black bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}
              >
                {value}
              </div>
              <div className="text-xs uppercase text-gray-500">{key}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-2 md:gap-3"
        >
          {project.tech.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 md:px-4 md:py-2 bg-zinc-900 border border-zinc-800 rounded-lg md:rounded-full text-xs md:text-sm font-mono"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Timeline
function FluidTimeline() {
  const experiences = [
    {
      year: "2024",
      role: "Software Engineer",
      company: "CYIENT",
      duration: "Jan 2024 - Present",
      desc: "Leading AI initiatives, building RAG systems and computer vision solutions for Fortune 500 clients",
      type: "Full-time",
    },
    {
      year: "2022",
      role: "Full Stack Intern",
      company: "Anddhen Group",
      duration: "Jun 2022 - Nov 2022",
      desc: "Developed web applications with React, Node.js & Firebase authentication",
      type: "Internship",
    },
    {
      year: "2021",
      role: "Python NLP Intern",
      company: "Zee Media Corporation",
      duration: "Jun 2021 - Sep 2021",
      desc: "Built multimedia automation with SpaCy and Transformer-based NLP techniques",
      type: "Internship",
    },
  ];

  return (
    <section className="py-24 md:py-40 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-center mb-20 md:mb-32 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
        >
          Journey
        </motion.h2>

        <div className="relative">
          <div className="hidden md:block absolute left-12 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald-400 via-blue-500 to-purple-500" />

          <div className="space-y-16 md:space-y-24">
            {experiences.map((exp, idx) => (
              <TimelineItem key={idx} experience={exp} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ experience, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={`relative ${
        index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:ml-auto"
      } md:w-1/2`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`hidden md:block absolute ${
          index % 2 === 0 ? "md:right-0" : "md:left-0"
        } top-8 w-6 h-6 rounded-full bg-emerald-400`}
        style={{ boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
      />

      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-zinc-900 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-zinc-800 hover:border-emerald-400 transition-all"
      >
        <div className="text-4xl md:text-6xl font-black text-emerald-400 mb-4">
          {experience.year}
        </div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-2xl md:text-3xl font-bold">{experience.role}</h3>
          <span
            className={`px-3 py-1 text-xs rounded-full ${
              experience.type === "Full-time"
                ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
            }`}
          >
            {experience.type}
          </span>
        </div>
        <p className="text-lg md:text-xl text-blue-400 mb-2">
          {experience.company}
        </p>
        <p className="text-sm text-gray-500 mb-4">{experience.duration}</p>
        <p className="text-gray-400">{experience.desc}</p>
      </motion.div>
    </motion.div>
  );
}

// Resume Download Section
function ResumeDownloadSection({ setCursorVariant }) {
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #00ff88 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Want to Know More?
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-12">
            Download my complete resume with detailed project descriptions
          </p>

          <motion.a
            href={`${process.env.PUBLIC_URL}/Trinath_2yr_fullstack.pdf`}
            download="Trinath_Gundla_Resume.pdf"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setCursorVariant("hover")}
            onMouseLeave={() => setCursorVariant("default")}
            className="group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 text-white rounded-2xl font-bold text-xl shadow-2xl relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-4">
              <FaDownload className="text-2xl" />
              Download Full Resume
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight />
              </motion.div>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>

          <div className="grid grid-cols-3 gap-8 mt-16">
            {[
              { value: "2+", label: "Years Experience" },
              { value: "15+", label: "Projects" },
              { value: "100%", label: "Dedication" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Contact
function ParticleContact({ setCursorVariant }) {
  return (
    <section className="py-24 md:py-40 px-6 relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 opacity-30">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 md:mb-12 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
        >
          Let's Build
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 mb-12 md:mb-16"
        >
          Ready to create something extraordinary?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-6 md:gap-8 mb-16 md:mb-20"
        >
          {[
            {
              icon: <FaGithub size={32} />,
              link: "https://github.com/GundlaTrinath",
            },
            {
              icon: <FaLinkedin size={32} />,
              link: "https://www.linkedin.com/in/trinath-gundla-298828210/",
            },
            {
              icon: <FaEnvelope size={32} />,
              link: "mailto:trinathgundla358@gmail.com",
            },
          ].map((social, idx) => (
            <motion.a
              key={idx}
              href={social.link}
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setCursorVariant("hover")}
              onMouseLeave={() => setCursorVariant("default")}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center"
              style={{ boxShadow: "0 0 40px rgba(16, 185, 129, 0.3)" }}
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>

        <p className="text-gray-600 text-sm md:text-base">
          © 2025 Trinath Gundla • Crafted with Neural Precision
        </p>
      </div>
    </section>
  );
}

export default App;
