import React from "react";
import { motion } from "framer-motion";
import { Book, Laptop, Globe, Users, FileText, Brain } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const services = [
  {
    icon: <Book size={36} className="text-primary" />,
    title: "Online Courses",
    desc: `We offer a variety of structured online courses in programming, data science, AI, and web development. Each course includes video lectures, assignments, and live sessions. These courses are self-paced, designed for both beginners and professionals.`,
  },
  {
    icon: <Laptop size={36} className="text-success" />,
    title: "Project Guidance",
    desc: `Stuck in your final year project or hackathon idea? We provide full support from planning, architecture, to deployment. Our expert team helps students with backend logic, frontend UI, and even cloud hosting for their apps.`,
  },
  {
    icon: <Globe size={36} className="text-warning" />,
    title: "Global Learning Platform",
    desc: `Our platform is accessible worldwide with multilingual support. Students from different regions can collaborate, attend webinars, and access shared project repositories. Knowledge knows no boundaries here.`,
  },
  {
    icon: <Users size={36} className="text-danger" />,
    title: "Mentorship Community",
    desc: `Join our mentorship community and get paired with industry experts. Whether it's resume building, interview prep, or deep tech topics, our mentors guide you through each challenge in your career journey.`,
  },
  {
    icon: <FileText size={36} className="text-info" />,
    title: "Documentation & Templates",
    desc: `We provide ready-to-use SRS, project reports, and documentation templates that follow academic and industrial standards. This helps students focus more on logic rather than formatting.`,
  },
  {
    icon: <Brain size={36} className="text-dark" />,
    title: "AI and Automation Labs",
    desc: `Explore AI-powered tools and automation ideas. Get hands-on experience with bots, intelligent assistants, and automated systems. Perfect for aspiring software engineers and tech innovators.`,
  },
];

const Services = () => {
  return (
    <div className="container my-5">
      <style>{`
        .services-modern-bg {
          background: linear-gradient(120deg, #f8fafc 0%, #e0f7fa 100%);
          border-radius: 2.5rem;
          padding: 3rem 1.5rem;
          box-shadow: 0 4px 32px #00c6ff11;
        }
        .service-modern-card {
          border-radius: 1.5rem;
          background: #fff;
          border: 1px solid #e0f7fa;
          transition: box-shadow 0.2s, transform 0.2s;
          box-shadow: 0 2px 16px #00c6ff11;
          position: relative;
          overflow: hidden;
        }
        .service-modern-card:hover {
          box-shadow: 0 8px 32px #00c6ff44;
          transform: translateY(-8px) scale(1.04);
        }
        .service-modern-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          margin: 0 auto 1.5rem auto;
          border-radius: 50%;
          background: linear-gradient(135deg, #00c6ff22 0%, #fff 100%);
          box-shadow: 0 2px 12px #00c6ff22;
          font-size: 2rem;
        }
        .service-modern-title {
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #0f2027;
          font-size: 1.25rem;
        }
        .service-modern-desc {
          color: #3a3a3a;
          font-size: 1.05rem;
          min-height: 80px;
        }
        .service-modern-gradient-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: linear-gradient(90deg, #00c6ff 0%, #2c5364 100%);
        }
        @media (max-width: 576px) {
          .services-modern-bg {
            padding: 1.5rem 0.5rem;
            border-radius: 1.2rem;
          }
          .service-modern-card {
            border-radius: 1rem;
          }
        }
      `}</style>
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-4 fw-bold"
        style={{
          letterSpacing: "2.5px",
          color: "#00c6ff",
          textShadow: "0 2px 8px #00c6ff22",
        }}
      >
        Smart Voice & AI Solutions
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-secondary mb-5"
        style={{ fontSize: "1.18rem" }}
      >
        Transform your workflow with advanced voice recognition, intelligent automation, and seamless collaboration tools.
      </motion.p>

      <div className="services-modern-bg">
        <div className="row g-4">
          {[
            {
              icon: <Book size={36} className="text-primary" />,
              title: "Speech-to-Text",
              desc: `Convert audio and video into accurate, readable text for your projects, meetings, or accessibility needs. Integrate seamless transcription into your applications for real-time or batch processing.`,
            },
            {
              icon: <Laptop size={36} className="text-success" />,
              title: "AI Insights",
              desc: `Analyze, summarize, and extract valuable insights from your data. Enhance productivity with automated content generation, smart recommendations, and natural language understanding.`,
            },
            {
              icon: <Globe size={36} className="text-warning" />,
              title: "Multilingual Support",
              desc: `Break language barriers with AI-driven translation and transcription. Our platform supports multiple languages, enabling global collaboration and accessibility for users worldwide.`,
            },
            {
              icon: <Users size={36} className="text-danger" />,
              title: "Collaborative Workflows",
              desc: `Empower teams to work together using AI-powered tools. Share transcriptions, generated content, and insights in real time, streamlining communication and project management.`,
            },
            {
              icon: <FileText size={36} className="text-info" />,
              title: "Automated Documentation",
              desc: `Generate comprehensive documentation from audio, meetings, or brainstorming sessions. Create structured, searchable records for your projects effortlessly.`,
            },
            {
              icon: <Brain size={36} className="text-dark" />,
              title: "Intelligent Automation",
              desc: `Integrate AI-driven automation into your workflow. From voice commands to smart content creation, harness the power of advanced technology to boost efficiency and innovation.`,
            },
          ].map((service, idx) => (
            <motion.div
              key={idx}
              className="col-12 col-md-6 col-lg-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
            >
              <div className="service-modern-card h-100 shadow-sm">
                <div className="service-modern-gradient-bar" />
                <div className="card-body d-flex flex-column align-items-center pt-4 pb-3 px-3">
                  <div className="service-modern-icon">{service.icon}</div>
                  <h5 className="service-modern-title text-center mt-2 mb-3">
                    {service.title}
                  </h5>
                  <p className="service-modern-desc text-center">
                    {service.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
