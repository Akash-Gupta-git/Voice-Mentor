import React from "react";
import {
  Lightbulb,
  Target,
  HeartHandshake,
  Briefcase,
  Settings,
  Users,
  GraduationCap,
  NotebookPen,
  HelpingHand,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const sections = [
  {
    title: "Innovative Speech Intelligence",
    icon: <Lightbulb size={30} />,
    text: "We deliver advanced speech recognition and understanding, enabling seamless voice-to-text conversion and real-time transcription for diverse applications. Our solutions empower users to extract meaningful insights from audio content efficiently.",
    image: "about.jpg",
  },
  {
    title: "Conversational AI Excellence",
    icon: <Target size={30} />,
    text: "Our mission is to provide robust conversational AI that interprets, summarizes, and generates human-like responses. We focus on delivering accurate, context-aware interactions for businesses and developers.",
    image: "about.jpg",
  },
  {
    title: "Ethical AI Values",
    icon: <HeartHandshake size={30} />,
    text: "We prioritize transparency, privacy, and responsible AI development. Our commitment is to build trustworthy solutions that respect user data and promote ethical use of artificial intelligence.",
    image: "about.jpg",
  },
  {
    title: "Cutting-Edge Research",
    icon: <Briefcase size={30} />,
    text: "Our team advances the state of natural language processing and speech technologies, integrating the latest research into practical, scalable products for real-world impact.",
    image: "about.jpg",
  },
  {
    title: "Comprehensive Developer Tools",
    icon: <Settings size={30} />,
    text: "We offer APIs, SDKs, and documentation that simplify integration of speech and language capabilities into any application, supporting rapid development and deployment.",
    image: "about.jpg",
  },
  {
    title: "Collaboration and Community",
    icon: <Users size={30} />,
    text: "We foster a vibrant ecosystem where developers, businesses, and researchers collaborate to push the boundaries of AI-powered communication and understanding.",
    image: "about.jpg",
  },
  {
    title: "Empowering Users",
    icon: <GraduationCap size={30} />,
    text: "Our platform enables users to transcribe, analyze, and interact with audio and text data, unlocking new possibilities for productivity, accessibility, and knowledge discovery.",
    image: "about.jpg",
  },
  {
    title: "AI-Driven Solutions",
    icon: <NotebookPen size={30} />,
    text: "We deliver intelligent tools for summarization, content generation, and information extraction, helping users make sense of large volumes of spoken and written data.",
    image: "about.jpg",
  },
  {
    title: "Transforming Communication",
    icon: <HelpingHand size={30} />,
    text: "Our technology bridges the gap between speech and understanding, making communication more accessible, efficient, and insightful for everyone.",
    image: "about.jpg",
  },
];

const About = () => {
  return (
    <div className="container my-5">
      <style>{`
        .about-card {
          background: linear-gradient(120deg, #f8fcff 60%, #e0f7fa 100%);
          border-radius: 1.5rem;
          box-shadow: 0 4px 32px #00c6ff22;
          transition: transform 0.18s, box-shadow 0.18s;
          padding: 2.5rem 2rem;
          margin-bottom: 2.5rem;
          border: none;
        }
        .about-card:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow: 0 8px 40px #00c6ff44;
        }
        .about-icon {
          background: linear-gradient(135deg, #00c6ff33 60%, #2c536422 100%);
          border-radius: 50%;
          padding: 0.7rem;
          margin-right: 1rem;
          color: #00c6ff;
          box-shadow: 0 2px 12px #00c6ff22;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .about-title {
          font-weight: 700;
          color: #0f2027;
          letter-spacing: 1px;
        }
        .about-img {
          border-radius: 1.2rem;
          box-shadow: 0 2px 16px #00c6ff22;
          border: 2px solid #e0f7fa;
          object-fit: cover;
        }
        @media (max-width: 767px) {
          .about-card {
            padding: 1.2rem 0.7rem;
          }
        }
      `}</style>
      <h1 className="text-center fw-bold mb-5" style={{ color: "#00c6ff", letterSpacing: "2px", textShadow: "0 2px 8px #00c6ff33" }}>
        About Us
      </h1>
      {sections.map((section, idx) => (
        <div className="row align-items-center" key={idx}>
          <div className={`col-md-6 mb-4 mb-md-0 ${idx % 2 === 0 ? "" : "order-md-2"}`}>
            <img
              src={section.image}
              alt={section.title}
              className="img-fluid about-img"
              style={{ maxHeight: "320px", width: "100%" }}
            />
          </div>
          <div className="col-md-6">
            <div className="about-card">
              <div className="d-flex align-items-center mb-3">
                <div className="about-icon">{section.icon}</div>
                <h3 className="about-title mb-0">{section.title}</h3>
              </div>
              <p style={{ textAlign: "justify", color: "#0f2027" }}>{section.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default About;
