import React from "react";
import {
  Mail,
  Instagram,
  Linkedin,
  Phone,
  BookOpen,
  Users,
  ArrowRight,
} from "lucide-react";
import "../../css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Contact = () => {
  return (
    <div className="contact-page  min-vh-100 d-flex flex-column">
      {/* Section 1 - Intro */}
      <section className="container py-5">
        <h2 className="text-center mb-3 fw-bold display-5 gradient-text">
          Contact Us
        </h2>
        <p className="text-center lead text-secondary mb-0">
          I'm <span className="fw-semibold text-primary">Akash Gupta</span>, a passionate BCA student, tech enthusiast, and developer.<br />
          I build software solutions, full-stack applications, and cloud-connected platforms.<br />
          I love solving problems, creating products that matter, and helping students and developers grow.<br />
          <span className="fw-semibold text-info">Let’s connect!</span>
        </p>
      </section>

      {/* Section 2 - Contact Cards */}
      <section className="container py-4">
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="contact-card shadow-lg p-4 rounded-4 text-center h-100 bg-white border-0 hover-card">
              <Instagram size={36} className="mb-3 text-danger" />
              <h5 className="fw-bold mb-2 text-danger">Instagram</h5>
              <p>
                <a
                  href="https://www.instagram.com/i_am_akashit"
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none text-dark"
                >
                  @i_am_akashit
                </a>
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="contact-card bg-light shadow-lg p-4 rounded-4 text-center h-100  hover-card">
              <Linkedin size={36} className="mb-3 text-primary" />
              <h5 className="fw-bold text-primary mb-2">LinkedIn</h5>
              <p>
                <a
                  href="https://www.linkedin.com/in/akash-gupta-718363296/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none text-secondary"
                >
                  akash-gupta
                </a>
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="contact-card shadow-lg p-4 rounded-4 text-center h-100 bg-white border-0 hover-card">
              <Mail size={36} className="mb-3 text-success" />
              <h5 className="fw-bold text-success mb-2">Email</h5>
              <p>
                <a
                  href="mailto:akashgupta01082002@gmail.com"
                  className="text-decoration-none text-dark"
                >
                  mail-to-akash-gupta
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Help & Docs */}
      <section className="py-5 mt-5 border-top">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className=" rounded-4 col-md-4">
              <div className="info-card p-4 shadow-lg rounded-4 h-100 border-0 hover-card">
                <Users size={36} className="text-primary mb-2" />
                <h5 className="fw-bold">Sales Team</h5>
                <p className="text-secondary">
                  Explore pricing, discounts, and deployment options tailored for your needs.
                </p>
                <a href="#" className="text-decoration-none text-primary fw-semibold d-inline-flex align-items-center gap-1">
                  Talk to Sales <ArrowRight size={18} />
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="info-card p-4 shadow-lg rounded-4 h-100 border-0 hover-card">
                <Phone size={36} className="text-success mb-2" />
                <h5 className="fw-bold">Product Support</h5>
                <p className="text-secondary">
                  Get technical guidance to troubleshoot or optimize your project implementation.
                </p>
                <a href="#" className="text-decoration-none text-success fw-semibold d-inline-flex align-items-center gap-1">
                  Contact Support <ArrowRight size={18} />
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="info-card p-4 shadow-lg rounded-4 h-100 border-0 hover-card">
                <BookOpen size={36} className="text-warning mb-2" />
                <h5 className="fw-bold">Documentation</h5>
                <p className="text-secondary">
                  Read API docs, guides, tutorials, and best practices for developers.
                </p>
                <a href="#" className="text-decoration-none text-warning fw-semibold d-inline-flex align-items-center gap-1">
                  View Docs <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
