"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Plus, Trash2, Printer, RotateCcw, Cloud, CloudOff, ZoomIn, ZoomOut } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────
interface PersonalInfo {
  name: string; email: string; phone: string; location: string
  linkedin: string; github: string; website: string
}
interface EduItem  { id: string; school: string; degree: string; field: string; start: string; end: string; gpa: string }
interface ExpItem  { id: string; company: string; role: string; start: string; end: string; current: boolean; description: string }
interface ProjItem { id: string; name: string; tech: string; description: string; link: string }
interface CertItem     { id: string; name: string; issuer: string; year: string }
interface AchieveItem  { id: string; title: string; description: string; year: string }
interface ResumeData {
  personal: PersonalInfo
  objective: string
  summary: string
  experience: ExpItem[]
  education: EduItem[]
  projects: ProjItem[]
  skills: string
  strengths: string
  languages: string
  hobbies: string
  certifications: CertItem[]
  achievements: AchieveItem[]
}
type TemplateId = "modern" | "classic" | "minimal" | "sharp" | "elegant"

// ─── Helpers ─────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2)

const EMPTY: ResumeData = {
  personal: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
  objective: "", summary: "", experience: [], education: [], projects: [],
  skills: "", strengths: "", languages: "", hobbies: "",
  certifications: [], achievements: [],
}

function buildDemo(name: string, email: string, phone: string, linkedin: string, github: string): ResumeData {
  return {
    personal: {
      name:     name     || "Arjun Sharma",
      email:    email    || "arjun.sharma@email.com",
      phone:    phone    || "+91 98765 43210",
      location: "Chennai, Tamil Nadu",
      linkedin: linkedin || "linkedin.com/in/arjun-sharma",
      github:   github   || "github.com/arjun-sharma",
      website:  "",
    },
    objective: "To secure a challenging position as a Software Engineer where I can apply my technical skills and contribute to innovative projects while growing professionally.",
    summary: "Motivated Computer Science graduate with hands-on experience in full-stack web development. Passionate about building scalable applications and solving real-world problems through technology.",
    experience: [
      {
        id: uid(),
        company: "TechSoft Solutions Pvt. Ltd.",
        role: "Software Engineer Intern",
        start: "Jan 2025",
        end: "Jun 2025",
        current: false,
        description: "• Developed RESTful APIs using Python Flask, improving response time by 30%\n• Built responsive UI components with React and Tailwind CSS\n• Collaborated with a team of 5 engineers in an Agile environment\n• Wrote unit tests achieving 85% code coverage",
      },
      {
        id: uid(),
        company: "Freelance Projects",
        role: "Full Stack Developer",
        start: "Jun 2024",
        end: "",
        current: true,
        description: "• Built 3 end-to-end web applications for local businesses\n• Integrated payment gateways and third-party APIs\n• Deployed apps on AWS EC2 with Nginx and SSL configuration",
      },
    ],
    education: [
      {
        id: uid(),
        school: "Sri Venkateswara Engineering College",
        degree: "B.E.",
        field: "Computer Science and Engineering",
        start: "2021",
        end: "2025",
        gpa: "8.4",
      },
      {
        id: uid(),
        school: "Bright Future Higher Secondary School",
        degree: "HSC (Class XII)",
        field: "Computer Science",
        start: "2019",
        end: "2021",
        gpa: "92%",
      },
    ],
    projects: [
      {
        id: uid(),
        name: "CareerEzi — Placement Prep Platform",
        tech: "Next.js, Flask, MySQL, Tailwind CSS",
        description: "A full-stack college placement preparation platform featuring MCQ practice, coding challenges, assignments, leaderboard, and resume builder with PDF export.",
        link: "github.com/arjun-sharma/careerezi",
      },
      {
        id: uid(),
        name: "Smart Inventory Management System",
        tech: "React, Node.js, MongoDB, Express",
        description: "Real-time inventory tracking system with role-based access control, automated low-stock alerts, and analytics dashboard for small businesses.",
        link: "github.com/arjun-sharma/inventory-mgmt",
      },
      {
        id: uid(),
        name: "AI-Powered Resume Analyser",
        tech: "Python, FastAPI, OpenAI API, React",
        description: "Tool that analyses resumes against job descriptions, gives ATS score, and suggests improvements using GPT-4.",
        link: "",
      },
    ],
    skills: "Python, JavaScript, TypeScript, Java, C++, React, Next.js, Flask, Node.js, MySQL, MongoDB, Redis, Docker, AWS, Git, REST APIs, Tailwind CSS",
    strengths: "Problem Solving, Team Collaboration, Quick Learner, Attention to Detail, Communication",
    languages: "English, Tamil, Hindi",
    hobbies: "Competitive Programming, Open Source Contributions, Tech Blogging, Chess",
    certifications: [
      { id: uid(), name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", year: "2024" },
      { id: uid(), name: "Full Stack Web Development", issuer: "Coursera (Meta)", year: "2024" },
      { id: uid(), name: "Data Structures & Algorithms", issuer: "GeeksforGeeks", year: "2023" },
    ],
    achievements: [
      { id: uid(), title: "Smart India Hackathon 2024 — Finalist", description: "Led a team of 6 to build an AI-based crop disease detection app, reaching national finals among 5,000+ teams.", year: "2024" },
      { id: uid(), title: "LeetCode — 500+ Problems Solved", description: "Ranked in top 10% globally with consistent problem-solving across data structures and algorithms topics.", year: "2024" },
      { id: uid(), title: "College Coding Championship — 1st Place", description: "Won inter-college coding contest competing against 200+ participants across 15 colleges.", year: "2023" },
    ],
  }
}

const TEMPLATES: { id: TemplateId; label: string; accent: string }[] = [
  { id: "modern",  label: "Modern",  accent: "#0E7070" },
  { id: "classic", label: "Classic", accent: "#1a1a1a" },
  { id: "minimal", label: "Minimal", accent: "#6366f1" },
  { id: "sharp",   label: "Sharp",   accent: "#059669" },
  { id: "elegant", label: "Elegant", accent: "#d97706" },
]

// ─── Small form field ─────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, disabled }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; disabled?: boolean
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      <Input
        className="bg-secondary/50 border-border text-foreground text-sm h-8"
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
      />
    </div>
  )
}

// ─── Template 1: Modern (teal sidebar) ───────────────────────────────────────
function ModernTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary, experience, education, projects, skills, strengths, languages, hobbies, certifications, achievements } = data
  const skillList      = skills.split(",").map(s => s.trim()).filter(Boolean)
  const strengthList   = strengths.split(",").map(s => s.trim()).filter(Boolean)
  const languageList   = languages.split(",").map(s => s.trim()).filter(Boolean)
  const hobbyList      = hobbies.split(",").map(s => s.trim()).filter(Boolean)
  const initials = personal.name ? personal.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?"

  return (
    <div style={{ width: 794, minHeight: 1123, display: "flex", fontFamily: "Arial, Helvetica, sans-serif", background: "white", fontSize: 12 }}>
      {/* Sidebar */}
      <div style={{ width: 230, background: "#18181b", color: "white", padding: "36px 18px", display: "flex", flexDirection: "column", gap: 20, flexShrink: 0 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#0E7070", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#18181b" }}>
            {initials}
          </div>
          <div style={{ marginTop: 10, fontSize: 15, fontWeight: 700, color: "#0E7070", lineHeight: 1.3 }}>{personal.name || "Your Name"}</div>
          {experience[0]?.role && <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>{experience[0].role}</div>}
        </div>

        <SideSection title="Contact" color="#0E7070">
          {personal.email    && <SideRow icon="✉"  text={personal.email} />}
          {personal.phone    && <SideRow icon="📱" text={personal.phone} />}
          {personal.location && <SideRow icon="📍" text={personal.location} />}
          {personal.linkedin && <SideRow icon="in" text={personal.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//,"").replace(/\/$/,"")} />}
          {personal.github   && <SideRow icon="gh" text={personal.github.replace(/https?:\/\/(www\.)?github\.com\//,"").replace(/\/$/,"")} />}
          {personal.website  && <SideRow icon="🌐" text={personal.website} />}
        </SideSection>

        {skillList.length > 0 && (
          <SideSection title="Skills" color="#0E7070">
            {skillList.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0E7070", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>{s}</span>
              </div>
            ))}
          </SideSection>
        )}

        {certifications.length > 0 && (
          <SideSection title="Certifications" color="#0E7070">
            {certifications.map(c => c.name ? (
              <div key={c.id} style={{ marginBottom: 7 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{c.name}</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
              </div>
            ) : null)}
          </SideSection>
        )}

        {strengthList.length > 0 && (
          <SideSection title="Strengths" color="#0E7070">
            {strengthList.map((s, i) => <div key={i} style={{ fontSize: 11, color: "#cbd5e1", marginBottom: 3 }}>· {s}</div>)}
          </SideSection>
        )}

        {languageList.length > 0 && (
          <SideSection title="Languages" color="#0E7070">
            {languageList.map((l, i) => <div key={i} style={{ fontSize: 11, color: "#cbd5e1", marginBottom: 3 }}>· {l}</div>)}
          </SideSection>
        )}

        {hobbyList.length > 0 && (
          <SideSection title="Interests" color="#0E7070">
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7 }}>{hobbyList.join(" · ")}</div>
          </SideSection>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "36px 28px", background: "white", color: "#1e293b" }}>
        {objective && (
          <BodySection title="Objective" borderColor="#0E7070">
            <p style={{ fontSize: 12, lineHeight: 1.75, color: "#475569" }}>{objective}</p>
          </BodySection>
        )}
        {summary && (
          <BodySection title="Profile" borderColor="#0E7070">
            <p style={{ fontSize: 12, lineHeight: 1.75, color: "#475569" }}>{summary}</p>
          </BodySection>
        )}

        {experience.length > 0 && (
          <BodySection title="Experience" borderColor="#0E7070">
            {experience.map(exp => !exp.company && !exp.role ? null : (
              <div key={exp.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{exp.role || "Role"}</div>
                    <div style={{ fontSize: 11, color: "#0E7070", fontWeight: 600 }}>{exp.company}</div>
                  </div>
                  <div style={{ fontSize: 10, color: "#64748b", flexShrink: 0, marginLeft: 8 }}>
                    {exp.start}{(exp.start && (exp.end || exp.current)) ? " – " : ""}{exp.current ? "Present" : exp.end}
                  </div>
                </div>
                {exp.description && <DescLines text={exp.description} />}
              </div>
            ))}
          </BodySection>
        )}

        {education.length > 0 && (
          <BodySection title="Education" borderColor="#0E7070">
            {education.map(edu => !edu.school ? null : (
              <div key={edu.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{edu.school}</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>{edu.start}{edu.start && edu.end ? " – " : ""}{edu.end}</div>
                </div>
                <div style={{ fontSize: 11, color: "#475569" }}>
                  {[edu.degree, edu.field ? `in ${edu.field}` : "", edu.gpa ? `GPA: ${edu.gpa}` : ""].filter(Boolean).join(" ")}
                </div>
              </div>
            ))}
          </BodySection>
        )}

        {projects.length > 0 && (
          <BodySection title="Projects" borderColor="#0E7070">
            {projects.map(proj => !proj.name ? null : (
              <div key={proj.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{proj.name}</div>
                  {proj.link && <div style={{ fontSize: 9, color: "#0E7070", wordBreak: "break-all", maxWidth: 180 }}>{proj.link}</div>}
                </div>
                {proj.tech && <div style={{ fontSize: 10, color: "#0E7070", fontWeight: 600, marginBottom: 2 }}>{proj.tech}</div>}
                {proj.description && <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.65 }}>{proj.description}</div>}
              </div>
            ))}
          </BodySection>
        )}
      </div>
    </div>
  )
}
function SideSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7, paddingBottom: 4, borderBottom: `1px solid ${color}40` }}>{title}</div>
      {children}
    </div>
  )
}
function SideRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "flex-start" }}>
      <span style={{ fontSize: 10, flexShrink: 0, opacity: 0.8 }}>{icon}</span>
      <span style={{ fontSize: 10, color: "#cbd5e1", wordBreak: "break-all", lineHeight: 1.4 }}>{text}</span>
    </div>
  )
}
function BodySection({ title, borderColor, children }: { title: string; borderColor: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#18181b", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${borderColor}` }}>{title}</div>
      {children}
    </div>
  )
}
function DescLines({ text }: { text: string }) {
  return (
    <div style={{ marginTop: 5, fontSize: 11, color: "#475569", lineHeight: 1.65 }}>
      {text.split("\n").map((l, i) => <div key={i}>{l}</div>)}
    </div>
  )
}

// ─── Template 2: Classic (serif, B&W) ────────────────────────────────────────
function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary, experience, education, projects, skills, strengths, languages, hobbies, certifications, achievements } = data
  const skillList      = skills.split(",").map(s => s.trim()).filter(Boolean)
  const strengthList   = strengths.split(",").map(s => s.trim()).filter(Boolean)
  const languageList   = languages.split(",").map(s => s.trim()).filter(Boolean)
  const hobbyList      = hobbies.split(",").map(s => s.trim()).filter(Boolean)
  const contactParts = [personal.email, personal.phone, personal.location, personal.linkedin && `linkedin: ${personal.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//,"").replace(/\/$/,"")}`, personal.github && `github: ${personal.github.replace(/https?:\/\/(www\.)?github\.com\//,"").replace(/\/$/,"")}`].filter(Boolean)

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "Georgia, 'Times New Roman', serif", background: "white", color: "#1a1a1a", padding: "44px 52px", fontSize: 12, boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{personal.name || "YOUR NAME"}</div>
        <div style={{ height: 2, background: "#1a1a1a", margin: "8px 0 6px" }} />
        <div style={{ fontSize: 10.5, color: "#555", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "3px 14px" }}>
          {contactParts.map((p, i) => <span key={i}>{p}</span>)}
          {personal.website && <span>{personal.website}</span>}
        </div>
        <div style={{ height: 1, background: "#1a1a1a", marginTop: 8 }} />
      </div>

      {objective && <ClassicSection title="Objective"><p style={{ fontSize: 12, lineHeight: 1.75, color: "#333" }}>{objective}</p></ClassicSection>}
      {summary && <ClassicSection title="Summary"><p style={{ fontSize: 12, lineHeight: 1.75, color: "#333" }}>{summary}</p></ClassicSection>}

      {experience.length > 0 && (
        <ClassicSection title="Professional Experience">
          {experience.map(exp => !exp.company && !exp.role ? null : (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{exp.company}</span>
                <span style={{ fontSize: 10.5, color: "#555" }}>{exp.start}{(exp.start && (exp.end || exp.current)) ? " – " : ""}{exp.current ? "Present" : exp.end}</span>
              </div>
              <div style={{ fontStyle: "italic", fontSize: 11.5, color: "#444", marginBottom: 4 }}>{exp.role}</div>
              {exp.description && <div style={{ fontSize: 11.5, lineHeight: 1.7 }}>{exp.description.split("\n").map((l, i) => <div key={i}>{l}</div>)}</div>}
            </div>
          ))}
        </ClassicSection>
      )}

      {education.length > 0 && (
        <ClassicSection title="Education">
          {education.map(edu => !edu.school ? null : (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{edu.school}</div>
                <div style={{ fontStyle: "italic", fontSize: 11.5, color: "#444" }}>
                  {[edu.degree, edu.field ? `— ${edu.field}` : "", edu.gpa ? `| GPA: ${edu.gpa}` : ""].filter(Boolean).join(" ")}
                </div>
              </div>
              <div style={{ fontSize: 10.5, color: "#555", flexShrink: 0, marginLeft: 12 }}>{edu.start}{edu.start && edu.end ? " – " : ""}{edu.end}</div>
            </div>
          ))}
        </ClassicSection>
      )}

      {projects.length > 0 && (
        <ClassicSection title="Projects">
          {projects.map(proj => !proj.name ? null : (
            <div key={proj.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "0 8px" }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{proj.name}</span>
                {proj.tech && <span style={{ fontSize: 11, color: "#555", fontStyle: "italic" }}>{proj.tech}</span>}
                {proj.link && <span style={{ fontSize: 10, color: "#777" }}>{proj.link}</span>}
              </div>
              {proj.description && <div style={{ fontSize: 11.5, lineHeight: 1.7, color: "#333", marginTop: 2 }}>{proj.description}</div>}
            </div>
          ))}
        </ClassicSection>
      )}

      <div style={{ display: "flex", gap: 36, marginTop: 4 }}>
        {skillList.length > 0 && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5, borderBottom: "1px solid #1a1a1a", paddingBottom: 4 }}>Skills</div>
            <div style={{ fontSize: 11.5, lineHeight: 1.8, color: "#333" }}>{skillList.join(" · ")}</div>
          </div>
        )}
        {certifications.length > 0 && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5, borderBottom: "1px solid #1a1a1a", paddingBottom: 4 }}>Certifications</div>
            {certifications.map(c => c.name ? (
              <div key={c.id} style={{ fontSize: 11.5, marginBottom: 3 }}>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                {c.issuer && <span style={{ color: "#555" }}> — {c.issuer}</span>}
                {c.year && <span style={{ color: "#777" }}> ({c.year})</span>}
              </div>
            ) : null)}
          </div>
        )}
      </div>

      {achievements.length > 0 && (
        <ClassicSection title="Achievements">
          {achievements.map(a => a.title ? (
            <div key={a.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 12 }}>{a.title}</span>
                {a.year && <span style={{ fontSize: 10.5, color: "#777" }}>{a.year}</span>}
              </div>
              {a.description && <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.65 }}>{a.description}</div>}
            </div>
          ) : null)}
        </ClassicSection>
      )}

      {(strengthList.length > 0 || languageList.length > 0 || hobbyList.length > 0) && (
        <div style={{ display: "flex", gap: 36, marginTop: 4 }}>
          {strengthList.length > 0 && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5, borderBottom: "1px solid #1a1a1a", paddingBottom: 4 }}>Strengths</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.8, color: "#333" }}>{strengthList.join(" · ")}</div>
            </div>
          )}
          {languageList.length > 0 && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5, borderBottom: "1px solid #1a1a1a", paddingBottom: 4 }}>Languages</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.8, color: "#333" }}>{languageList.join(" · ")}</div>
            </div>
          )}
          {hobbyList.length > 0 && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5, borderBottom: "1px solid #1a1a1a", paddingBottom: 4 }}>Interests</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.8, color: "#333" }}>{hobbyList.join(" · ")}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
function ClassicSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{title}</div>
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 8 }}>{children}</div>
    </div>
  )
}

// ─── Template 3: Minimal (clean, indigo accents) ──────────────────────────────
function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary, experience, education, projects, skills, strengths, languages, hobbies, certifications, achievements } = data
  const skillList      = skills.split(",").map(s => s.trim()).filter(Boolean)
  const strengthList   = strengths.split(",").map(s => s.trim()).filter(Boolean)
  const languageList   = languages.split(",").map(s => s.trim()).filter(Boolean)
  const hobbyList      = hobbies.split(",").map(s => s.trim()).filter(Boolean)

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "'Helvetica Neue', Arial, sans-serif", background: "white", color: "#111", padding: "52px 60px", fontSize: 12, boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, borderLeft: "4px solid #6366f1", paddingLeft: 16 }}>
        <div style={{ fontSize: 30, fontWeight: 300, letterSpacing: "-0.01em", color: "#111" }}>{personal.name || "Your Name"}</div>
        {experience[0]?.role && <div style={{ fontSize: 13, color: "#6366f1", marginTop: 3, fontWeight: 500 }}>{experience[0].role}</div>}
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: "2px 18px", fontSize: 10.5, color: "#888" }}>
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin.replace(/https?:\/\/(www\.)?/,"")}</span>}
          {personal.github   && <span>{personal.github.replace(/https?:\/\/(www\.)?/,"")}</span>}
          {personal.website  && <span>{personal.website}</span>}
        </div>
      </div>

      {objective && (
        <MinSection title="Objective">
          <p style={{ fontSize: 12, lineHeight: 1.85, color: "#444", maxWidth: "95%" }}>{objective}</p>
        </MinSection>
      )}
      {summary && (
        <MinSection title="About">
          <p style={{ fontSize: 12, lineHeight: 1.85, color: "#444", maxWidth: "95%" }}>{summary}</p>
        </MinSection>
      )}

      {experience.length > 0 && (
        <MinSection title="Experience">
          {experience.map(exp => !exp.company && !exp.role ? null : (
            <div key={exp.id} style={{ display: "flex", gap: 20, marginBottom: 16 }}>
              <div style={{ width: 110, flexShrink: 0, fontSize: 10, color: "#999", paddingTop: 2, lineHeight: 1.5 }}>
                {exp.start}{(exp.start && (exp.end || exp.current)) ? "–" : ""}{exp.current ? "Now" : exp.end}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{exp.role}</div>
                <div style={{ fontSize: 11.5, color: "#6366f1", marginBottom: 3, fontWeight: 500 }}>{exp.company}</div>
                {exp.description && <div style={{ fontSize: 11, color: "#444", lineHeight: 1.7 }}>{exp.description.split("\n").map((l, i) => <div key={i}>{l}</div>)}</div>}
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {education.length > 0 && (
        <MinSection title="Education">
          {education.map(edu => !edu.school ? null : (
            <div key={edu.id} style={{ display: "flex", gap: 20, marginBottom: 12 }}>
              <div style={{ width: 110, flexShrink: 0, fontSize: 10, color: "#999", paddingTop: 2 }}>
                {edu.start}{edu.start && edu.end ? "–" : ""}{edu.end}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{edu.school}</div>
                <div style={{ fontSize: 11.5, color: "#555" }}>
                  {[edu.degree, edu.field ? `· ${edu.field}` : "", edu.gpa ? `· GPA ${edu.gpa}` : ""].filter(Boolean).join(" ")}
                </div>
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {projects.length > 0 && (
        <MinSection title="Projects">
          {projects.map(proj => !proj.name ? null : (
            <div key={proj.id} style={{ display: "flex", gap: 20, marginBottom: 12 }}>
              <div style={{ width: 110, flexShrink: 0, fontSize: 10, color: "#6366f1", paddingTop: 2, lineHeight: 1.5 }}>{proj.tech}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  {proj.name}
                  {proj.link && <span style={{ fontWeight: 400, fontSize: 9.5, color: "#aaa", marginLeft: 8 }}>{proj.link}</span>}
                </div>
                {proj.description && <div style={{ fontSize: 11, color: "#444", lineHeight: 1.7, marginTop: 2 }}>{proj.description}</div>}
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {skillList.length > 0 && (
        <MinSection title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 10px" }}>
            {skillList.map((s, i) => (
              <span key={i} style={{ fontSize: 11, color: "#333", background: "#f5f5f7", padding: "2px 10px", borderRadius: 20, border: "1px solid #e5e5e5" }}>{s}</span>
            ))}
          </div>
        </MinSection>
      )}

      {certifications.length > 0 && (
        <MinSection title="Certifications">
          {certifications.map(c => c.name ? (
            <div key={c.id} style={{ fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{c.name}</span>
              {c.issuer && <span style={{ color: "#666" }}>, {c.issuer}</span>}
              {c.year && <span style={{ color: "#999" }}> ({c.year})</span>}
            </div>
          ) : null)}
        </MinSection>
      )}

      {achievements.length > 0 && (
        <MinSection title="Achievements">
          {achievements.map(a => a.title ? (
            <div key={a.id} style={{ display: "flex", gap: 20, marginBottom: 10 }}>
              <div style={{ width: 110, flexShrink: 0, fontSize: 10, color: "#999", paddingTop: 2 }}>{a.year}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 12 }}>{a.title}</div>
                {a.description && <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{a.description}</div>}
              </div>
            </div>
          ) : null)}
        </MinSection>
      )}

      {strengthList.length > 0 && (
        <MinSection title="Strengths">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 10px" }}>
            {strengthList.map((s, i) => (
              <span key={i} style={{ fontSize: 11, color: "#333", background: "#f5f5f7", padding: "2px 10px", borderRadius: 20, border: "1px solid #e5e5e5" }}>{s}</span>
            ))}
          </div>
        </MinSection>
      )}

      {(languageList.length > 0 || hobbyList.length > 0) && (
        <div style={{ display: "flex", gap: 40 }}>
          {languageList.length > 0 && (
            <MinSection title="Languages">
              <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.8 }}>{languageList.join(" · ")}</div>
            </MinSection>
          )}
          {hobbyList.length > 0 && (
            <MinSection title="Interests">
              <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.8 }}>{hobbyList.join(" · ")}</div>
            </MinSection>
          )}
        </div>
      )}
    </div>
  )
}
function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#bbb", marginBottom: 10, paddingBottom: 5, borderBottom: "1px solid #ebebeb" }}>{title}</div>
      {children}
    </div>
  )
}

// ─── Template 4: Sharp (two-column, emerald accents) ─────────────────────────
function SharpTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary, experience, education, projects, skills, strengths, languages, hobbies, certifications, achievements } = data
  const skillList      = skills.split(",").map(s => s.trim()).filter(Boolean)
  const strengthList   = strengths.split(",").map(s => s.trim()).filter(Boolean)
  const languageList   = languages.split(",").map(s => s.trim()).filter(Boolean)
  const hobbyList      = hobbies.split(",").map(s => s.trim()).filter(Boolean)
  const contactParts = [personal.phone, personal.location, personal.email].filter(Boolean)

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "Arial, Helvetica, sans-serif", background: "white", color: "#111", fontSize: 12, boxSizing: "border-box" }}>
      {/* Full-width header */}
      <div style={{ background: "#0d1f1a", padding: "28px 36px 22px" }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: "white", letterSpacing: "0.02em" }}>{personal.name || "Your Name"}</div>
        {experience[0]?.role && <div style={{ fontSize: 13, color: "#34d399", marginTop: 4, fontWeight: 500 }}>{experience[0].role}</div>}
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: "3px 20px", fontSize: 10.5, color: "#94a3b8" }}>
          {contactParts.map((p, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#059669", display: "inline-block" }} />
              {p}
            </span>
          ))}
          {personal.linkedin && <span style={{ color: "#94a3b8" }}>{personal.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//,"").replace(/\/$/,"")}</span>}
          {personal.github   && <span style={{ color: "#94a3b8" }}>{personal.github.replace(/https?:\/\/(www\.)?github\.com\//,"").replace(/\/$/,"")}</span>}
          {personal.website  && <span style={{ color: "#94a3b8" }}>{personal.website}</span>}
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: "flex", minHeight: 1000 }}>
        {/* Left column */}
        <div style={{ width: 220, background: "#f0faf6", padding: "24px 18px", borderRight: "3px solid #059669", flexShrink: 0 }}>
          {skillList.length > 0 && (
            <SharpSection title="Skills" accent="#059669">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {skillList.map((s, i) => (
                  <span key={i} style={{ fontSize: 10.5, background: "white", border: "1px solid #d1fae5", color: "#065f46", padding: "2px 8px", borderRadius: 3, fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            </SharpSection>
          )}

          {education.length > 0 && (
            <SharpSection title="Education" accent="#059669">
              {education.map(edu => !edu.school ? null : (
                <div key={edu.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 11.5, color: "#111" }}>{edu.school}</div>
                  <div style={{ fontSize: 10.5, color: "#444", marginTop: 1 }}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 1 }}>{[edu.start && edu.end ? `${edu.start} – ${edu.end}` : (edu.start || edu.end), edu.gpa ? `GPA: ${edu.gpa}` : ""].filter(Boolean).join(" · ")}</div>
                </div>
              ))}
            </SharpSection>
          )}

          {certifications.length > 0 && (
            <SharpSection title="Certifications" accent="#059669">
              {certifications.map(c => c.name ? (
                <div key={c.id} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 11, color: "#111" }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: "#666" }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
                </div>
              ) : null)}
            </SharpSection>
          )}

          {strengthList.length > 0 && (
            <SharpSection title="Strengths" accent="#059669">
              {strengthList.map((s, i) => <div key={i} style={{ fontSize: 10.5, color: "#333", marginBottom: 3 }}>· {s}</div>)}
            </SharpSection>
          )}

          {languageList.length > 0 && (
            <SharpSection title="Languages" accent="#059669">
              {languageList.map((l, i) => <div key={i} style={{ fontSize: 10.5, color: "#333", marginBottom: 3 }}>· {l}</div>)}
            </SharpSection>
          )}

          {hobbyList.length > 0 && (
            <SharpSection title="Interests" accent="#059669">
              <div style={{ fontSize: 10.5, color: "#555", lineHeight: 1.7 }}>{hobbyList.join(" · ")}</div>
            </SharpSection>
          )}
        </div>

        {/* Right column */}
        <div style={{ flex: 1, padding: "24px 28px" }}>
          {objective && (
            <SharpSection title="Objective" accent="#059669">
              <p style={{ fontSize: 12, lineHeight: 1.75, color: "#333" }}>{objective}</p>
            </SharpSection>
          )}
          {summary && (
            <SharpSection title="Profile" accent="#059669">
              <p style={{ fontSize: 12, lineHeight: 1.75, color: "#333" }}>{summary}</p>
            </SharpSection>
          )}

          {experience.length > 0 && (
            <SharpSection title="Experience" accent="#059669">
              {experience.map(exp => !exp.company && !exp.role ? null : (
                <div key={exp.id} style={{ marginBottom: 14, paddingLeft: 10, borderLeft: "2px solid #d1fae5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{exp.role}</div>
                    <div style={{ fontSize: 10, color: "#64748b", flexShrink: 0, marginLeft: 8 }}>
                      {exp.start}{(exp.start && (exp.end || exp.current)) ? " – " : ""}{exp.current ? "Present" : exp.end}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#059669", fontWeight: 600, marginBottom: 3 }}>{exp.company}</div>
                  {exp.description && <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.65 }}>{exp.description.split("\n").map((l, i) => <div key={i}>{l}</div>)}</div>}
                </div>
              ))}
            </SharpSection>
          )}

          {projects.length > 0 && (
            <SharpSection title="Projects" accent="#059669">
              {projects.map(proj => !proj.name ? null : (
                <div key={proj.id} style={{ marginBottom: 11 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{proj.name}</span>
                    {proj.tech && <span style={{ fontSize: 10, color: "#059669", fontWeight: 600 }}>{proj.tech}</span>}
                  </div>
                  {proj.link && <div style={{ fontSize: 9.5, color: "#888", marginBottom: 2 }}>{proj.link}</div>}
                  {proj.description && <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.65 }}>{proj.description}</div>}
                </div>
              ))}
            </SharpSection>
          )}

          {achievements.length > 0 && (
            <SharpSection title="Achievements" accent="#059669">
              {achievements.map(a => a.title ? (
                <div key={a.id} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: "2px solid #d1fae5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{a.title}</div>
                    {a.year && <div style={{ fontSize: 10, color: "#64748b", flexShrink: 0, marginLeft: 8 }}>{a.year}</div>}
                  </div>
                  {a.description && <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.65 }}>{a.description}</div>}
                </div>
              ) : null)}
            </SharpSection>
          )}
        </div>
      </div>
    </div>
  )
}
function SharpSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: accent, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 16, height: 2, background: accent }} />
        {title}
      </div>
      {children}
    </div>
  )
}

// ─── Template 5: Elegant (gradient header, amber accents) ────────────────────
function ElegantTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary, experience, education, projects, skills, strengths, languages, hobbies, certifications, achievements } = data
  const skillList      = skills.split(",").map(s => s.trim()).filter(Boolean)
  const strengthList   = strengths.split(",").map(s => s.trim()).filter(Boolean)
  const languageList   = languages.split(",").map(s => s.trim()).filter(Boolean)
  const hobbyList      = hobbies.split(",").map(s => s.trim()).filter(Boolean)

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "'Georgia', 'Times New Roman', serif", background: "white", color: "#1a1a1a", fontSize: 12, boxSizing: "border-box" }}>
      {/* Gradient header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "36px 44px 30px", position: "relative", overflow: "hidden" }}>
        {/* Decorative circle */}
        <div style={{ position: "absolute", right: -40, top: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(217,119,6,0.12)" }} />
        <div style={{ position: "absolute", right: 30, bottom: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(217,119,6,0.08)" }} />

        <div style={{ fontSize: 32, fontWeight: 700, color: "white", letterSpacing: "0.03em", fontFamily: "Georgia, serif" }}>{personal.name || "Your Name"}</div>
        {experience[0]?.role && (
          <div style={{ fontSize: 14, color: "#fbbf24", marginTop: 5, fontStyle: "italic", fontWeight: 400 }}>{experience[0].role}</div>
        )}
        {/* Divider */}
        <div style={{ width: 60, height: 2, background: "#d97706", margin: "12px 0" }} />
        {/* Contact row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 22px", fontSize: 10.5, color: "#cbd5e1" }}>
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//,"").replace(/\/$/,"")}</span>}
          {personal.github   && <span>{personal.github.replace(/https?:\/\/(www\.)?github\.com\//,"").replace(/\/$/,"")}</span>}
          {personal.website  && <span>{personal.website}</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "30px 44px" }}>
        {objective && (
          <ElegantSection title="Objective">
            <p style={{ fontSize: 12.5, lineHeight: 1.85, color: "#444", fontStyle: "italic" }}>{objective}</p>
          </ElegantSection>
        )}
        {summary && (
          <ElegantSection title="About Me">
            <p style={{ fontSize: 12.5, lineHeight: 1.85, color: "#444", fontStyle: "italic" }}>{summary}</p>
          </ElegantSection>
        )}

        {/* Two-col: Experience (left 60%) + Skills/Certs (right 38%) */}
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          <div style={{ flex: "0 0 58%" }}>
            {experience.length > 0 && (
              <ElegantSection title="Experience">
                {experience.map(exp => !exp.company && !exp.role ? null : (
                  <div key={exp.id} style={{ marginBottom: 15 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{exp.role}</div>
                        <div style={{ fontSize: 11.5, color: "#d97706", fontWeight: 600 }}>{exp.company}</div>
                      </div>
                      <div style={{ fontSize: 10, color: "#888", flexShrink: 0, marginLeft: 8, fontFamily: "Arial, sans-serif" }}>
                        {exp.start}{(exp.start && (exp.end || exp.current)) ? " – " : ""}{exp.current ? "Present" : exp.end}
                      </div>
                    </div>
                    {exp.description && <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.7, marginTop: 4 }}>{exp.description.split("\n").map((l, i) => <div key={i}>{l}</div>)}</div>}
                  </div>
                ))}
              </ElegantSection>
            )}

            {projects.length > 0 && (
              <ElegantSection title="Projects">
                {projects.map(proj => !proj.name ? null : (
                  <div key={proj.id} style={{ marginBottom: 11 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{proj.name}{proj.tech && <span style={{ fontWeight: 400, fontSize: 10.5, color: "#888", marginLeft: 8, fontFamily: "Arial, sans-serif" }}>{proj.tech}</span>}</div>
                    {proj.link && <div style={{ fontSize: 9.5, color: "#aaa", fontFamily: "Arial, sans-serif" }}>{proj.link}</div>}
                    {proj.description && <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.7, marginTop: 2 }}>{proj.description}</div>}
                  </div>
                ))}
              </ElegantSection>
            )}
          </div>

          <div style={{ flex: 1 }}>
            {education.length > 0 && (
              <ElegantSection title="Education">
                {education.map(edu => !edu.school ? null : (
                  <div key={edu.id} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>{edu.school}</div>
                    <div style={{ fontSize: 11, color: "#555", fontStyle: "italic" }}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</div>
                    <div style={{ fontSize: 10, color: "#999", fontFamily: "Arial, sans-serif", marginTop: 1 }}>{edu.start}{edu.start && edu.end ? ` – ${edu.end}` : ""}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</div>
                  </div>
                ))}
              </ElegantSection>
            )}

            {skillList.length > 0 && (
              <ElegantSection title="Skills">
                <div style={{ fontFamily: "Arial, sans-serif" }}>
                  {skillList.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                      <div style={{ width: 5, height: 5, background: "#d97706", transform: "rotate(45deg)", flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: "#333" }}>{s}</span>
                    </div>
                  ))}
                </div>
              </ElegantSection>
            )}

            {certifications.length > 0 && (
              <ElegantSection title="Certifications">
                {certifications.map(c => c.name ? (
                  <div key={c.id} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 11.5 }}>{c.name}</div>
                    <div style={{ fontSize: 10.5, color: "#666", fontFamily: "Arial, sans-serif" }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
                  </div>
                ) : null)}
              </ElegantSection>
            )}

            {achievements.length > 0 && (
              <ElegantSection title="Achievements">
                {achievements.map(a => a.title ? (
                  <div key={a.id} style={{ marginBottom: 9 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: 700, fontSize: 11.5 }}>{a.title}</span>
                      {a.year && <span style={{ fontSize: 10, color: "#999", fontFamily: "Arial, sans-serif" }}>{a.year}</span>}
                    </div>
                    {a.description && <div style={{ fontSize: 11, color: "#555", lineHeight: 1.65, fontFamily: "Arial, sans-serif" }}>{a.description}</div>}
                  </div>
                ) : null)}
              </ElegantSection>
            )}

            {strengthList.length > 0 && (
              <ElegantSection title="Strengths">
                <div style={{ fontFamily: "Arial, sans-serif" }}>
                  {strengthList.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                      <div style={{ width: 5, height: 5, background: "#d97706", transform: "rotate(45deg)", flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: "#333" }}>{s}</span>
                    </div>
                  ))}
                </div>
              </ElegantSection>
            )}

            {languageList.length > 0 && (
              <ElegantSection title="Languages">
                <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.8, fontFamily: "Arial, sans-serif" }}>{languageList.join(" · ")}</div>
              </ElegantSection>
            )}

            {hobbyList.length > 0 && (
              <ElegantSection title="Interests">
                <div style={{ fontSize: 11.5, color: "#555", lineHeight: 1.8, fontStyle: "italic" }}>{hobbyList.join(", ")}</div>
              </ElegantSection>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
function ElegantSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#1a1a2e" }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #d97706, transparent)" }} />
      </div>
      {children}
    </div>
  )
}

// ─── Template renderer map ────────────────────────────────────────────────────
const RENDERERS = { modern: ModernTemplate, classic: ClassicTemplate, minimal: MinimalTemplate, sharp: SharpTemplate, elegant: ElegantTemplate }

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResumePage() {
  const { user } = useAuthStore()
  const [data, setData] = useState<ResumeData>(EMPTY)
  const [template, setTemplate] = useState<TemplateId>("modern")
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  const [zoom, setZoom] = useState(0.68)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialLoad = useRef(true)

  const zoomIn  = () => setZoom(z => Math.min(+(z + 0.1).toFixed(1), 1.2))
  const zoomOut = () => setZoom(z => Math.max(+(z - 0.1).toFixed(1), 0.3))

  const downloadPDF = async () => {
    const el = document.getElementById("resume-print-area")
    if (!el) return
    el.style.display = "block"
    el.style.position = "absolute"
    el.style.left = "-9999px"
    el.style.top = "0"
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ])
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" })
      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [794, 1123] })
      pdf.addImage(imgData, "JPEG", 0, 0, 794, 1123)
      pdf.save(`${data.personal.name || "resume"}.pdf`)
    } finally {
      el.style.display = "none"
      el.style.position = ""
      el.style.left = ""
      el.style.top = ""
    }
  }

  // Load from API on mount, fall back to profile pre-fill
  useEffect(() => {
    api.get("/student/resume")
      .then(res => {
        const remote = res.data.resume_data
        if (remote && Object.keys(remote).length > 0) {
          setData({ ...EMPTY, ...remote, achievements: remote.achievements ?? [] })
        } else {
          // No saved resume — load full demo data pre-filled with real profile info
          setData(buildDemo(
            user?.name || "",
            user?.email || "",
            (user as any)?.phone || "",
            (user as any)?.linkedin || "",
            (user as any)?.github || "",
          ))
        }
      })
      .catch(() => {
        // API failed — fall back to localStorage
        const saved = localStorage.getItem("careerezi-resume")
        if (saved) {
          try { const parsed = JSON.parse(saved); setData({ ...EMPTY, ...parsed, achievements: parsed.achievements ?? [] }) } catch {}
        } else {
          setData(buildDemo(
            user?.name || "",
            user?.email || "",
            (user as any)?.phone || "",
            (user as any)?.linkedin || "",
            (user as any)?.github || "",
          ))
        }
      })
  }, []) // eslint-disable-line

  // Debounced auto-save to API (1.5s after last change)
  useEffect(() => {
    if (initialLoad.current) { initialLoad.current = false; return }
    setSaveStatus("unsaved")
    localStorage.setItem("careerezi-resume", JSON.stringify(data))
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSaveStatus("saving")
      try {
        await api.put("/student/resume", data)
        setSaveStatus("saved")
      } catch {
        setSaveStatus("unsaved")
      }
    }, 1500)
  }, [data])

  const upP = useCallback((field: keyof PersonalInfo, v: string) =>
    setData(p => ({ ...p, personal: { ...p.personal, [field]: v } })), [])

  const upExp  = (id: string, f: string, v: any) => setData(p => ({ ...p, experience:     p.experience.map(e => e.id === id ? { ...e, [f]: v } : e) }))
  const upEdu  = (id: string, f: string, v: any) => setData(p => ({ ...p, education:      p.education.map(e => e.id === id ? { ...e, [f]: v } : e) }))
  const upProj = (id: string, f: string, v: any) => setData(p => ({ ...p, projects:       p.projects.map(e => e.id === id ? { ...e, [f]: v } : e) }))
  const upCert    = (id: string, f: string, v: any) => setData(p => ({ ...p, certifications: p.certifications.map(e => e.id === id ? { ...e, [f]: v } : e) }))
  const upAchieve = (id: string, f: string, v: any) => setData(p => ({ ...p, achievements:   p.achievements.map(e => e.id === id ? { ...e, [f]: v } : e) }))

  const ActiveTemplate = RENDERERS[template]

  return (
    <>
      {/* ── Full-size print target (hidden on screen) ── */}
      <div id="resume-print-area" style={{ display: "none" }}>
        <ActiveTemplate data={data} />
      </div>

      {/* ── Main UI (hidden during print via CSS) ── */}
      <div className="resume-editor flex flex-col" style={{ height: "calc(100vh - 4rem)", margin: "-1.5rem", marginTop: "-0.5rem" }}>

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold font-serif text-foreground">Resume Builder</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              {saveStatus === "saved"   && <><Cloud className="h-3 w-3 text-emerald-400" /><span className="text-xs text-emerald-400">Saved to cloud</span></>}
              {saveStatus === "saving"  && <><Cloud className="h-3 w-3 text-muted-foreground animate-pulse" /><span className="text-xs text-muted-foreground">Saving…</span></>}
              {saveStatus === "unsaved" && <><CloudOff className="h-3 w-3 text-amber-400" /><span className="text-xs text-amber-400">Unsaved changes</span></>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Template switcher */}
            <div className="flex gap-1 overflow-x-auto">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    template === t.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: t.accent }} />
                  {t.label}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={async () => {
                if (!confirm("Clear all resume data?")) return
                setData(EMPTY)
                localStorage.removeItem("careerezi-resume")
                try { await api.put("/student/resume", {}); setSaveStatus("saved") } catch {}
                toast.success("Resume cleared")
              }}
            >
              <RotateCcw className="h-4 w-4 mr-1.5" /> Reset
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:brightness-110 text-primary-foreground"
              onClick={downloadPDF}
            >
              <Printer className="h-4 w-4 mr-1.5" /> Download PDF
            </Button>
          </div>
        </div>

        {/* Split panel */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left: Form ── */}
          <div className="w-[390px] flex-shrink-0 overflow-y-auto border-r border-border p-4 space-y-2">
            <Accordion type="multiple" defaultValue={["personal", "experience"]} className="space-y-2">

              {/* Personal */}
              <AccordionItem value="personal" className="glass-card border-0 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">Personal Info</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Full Name"  value={data.personal.name}     onChange={v => upP("name", v)} />
                    <Field label="Location"   value={data.personal.location} onChange={v => upP("location", v)} placeholder="City, State" />
                    <Field label="Email"      value={data.personal.email}    onChange={v => upP("email", v)} />
                    <Field label="Phone"      value={data.personal.phone}    onChange={v => upP("phone", v)} />
                    <Field label="LinkedIn"   value={data.personal.linkedin} onChange={v => upP("linkedin", v)} placeholder="https://linkedin.com/in/…" />
                    <Field label="GitHub"     value={data.personal.github}   onChange={v => upP("github", v)} placeholder="https://github.com/…" />
                  </div>
                  <Field label="Website / Portfolio" value={data.personal.website} onChange={v => upP("website", v)} placeholder="https://yourportfolio.com" />
                </AccordionContent>
              </AccordionItem>

              {/* Summary */}
              <AccordionItem value="summary" className="glass-card border-0 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">Professional Summary</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <Textarea
                    className="bg-secondary/50 border-border text-foreground text-sm resize-none"
                    rows={4} value={data.summary}
                    placeholder="A concise overview of your skills, experience, and career goals…"
                    onChange={e => setData(p => ({ ...p, summary: e.target.value }))}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Experience */}
              <AccordionItem value="experience" className="glass-card border-0 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">Work Experience</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-3">
                  {data.experience.map((exp, i) => (
                    <div key={exp.id} className="rounded-lg bg-secondary/30 border border-border/50 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-muted-foreground">Position {i + 1}</span>
                        <button onClick={() => setData(p => ({ ...p, experience: p.experience.filter(e => e.id !== exp.id) }))} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Company"    value={exp.company} onChange={v => upExp(exp.id, "company", v)} />
                        <Field label="Role/Title" value={exp.role}    onChange={v => upExp(exp.id, "role", v)} />
                        <Field label="Start"      value={exp.start}   onChange={v => upExp(exp.id, "start", v)} placeholder="Jun 2023" />
                        <Field label="End"        value={exp.end}     onChange={v => upExp(exp.id, "end", v)} placeholder={exp.current ? "Present" : "Dec 2023"} disabled={exp.current} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={exp.current} onCheckedChange={v => upExp(exp.id, "current", v)} className="data-[state=checked]:bg-primary" />
                        <span className="text-[11px] text-muted-foreground">Currently working here</span>
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground">Description (use • for bullets, Enter for new line)</Label>
                        <Textarea className="bg-secondary/50 border-border text-foreground text-sm resize-none mt-1" rows={3}
                          value={exp.description} onChange={e => upExp(exp.id, "description", e.target.value)}
                          placeholder="• Developed a feature that increased performance by 30%&#10;• Collaborated with cross-functional teams" />
                      </div>
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="outline" className="w-full border-dashed border-border/60 text-muted-foreground hover:text-foreground text-xs"
                    onClick={() => setData(p => ({ ...p, experience: [...p.experience, { id: uid(), company: "", role: "", start: "", end: "", current: false, description: "" }] }))}>
                    <Plus className="h-3 w-3 mr-1" /> Add Position
                  </Button>
                </AccordionContent>
              </AccordionItem>

              {/* Education */}
              <AccordionItem value="education" className="glass-card border-0 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">Education</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-3">
                  {data.education.map((edu, i) => (
                    <div key={edu.id} className="rounded-lg bg-secondary/30 border border-border/50 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-muted-foreground">Entry {i + 1}</span>
                        <button onClick={() => setData(p => ({ ...p, education: p.education.filter(e => e.id !== edu.id) }))} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                      <Field label="School / University" value={edu.school} onChange={v => upEdu(edu.id, "school", v)} />
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Degree"       value={edu.degree} onChange={v => upEdu(edu.id, "degree", v)} placeholder="B.Tech" />
                        <Field label="Field"        value={edu.field}  onChange={v => upEdu(edu.id, "field", v)}  placeholder="CSE" />
                        <Field label="Start Year"   value={edu.start}  onChange={v => upEdu(edu.id, "start", v)}  placeholder="2021" />
                        <Field label="End Year"     value={edu.end}    onChange={v => upEdu(edu.id, "end", v)}    placeholder="2025" />
                      </div>
                      <Field label="GPA (optional)" value={edu.gpa} onChange={v => upEdu(edu.id, "gpa", v)} placeholder="8.5 / 10" />
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="outline" className="w-full border-dashed border-border/60 text-muted-foreground hover:text-foreground text-xs"
                    onClick={() => setData(p => ({ ...p, education: [...p.education, { id: uid(), school: "", degree: "", field: "", start: "", end: "", gpa: "" }] }))}>
                    <Plus className="h-3 w-3 mr-1" /> Add Education
                  </Button>
                </AccordionContent>
              </AccordionItem>

              {/* Projects */}
              <AccordionItem value="projects" className="glass-card border-0 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">Projects</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-3">
                  {data.projects.map((proj, i) => (
                    <div key={proj.id} className="rounded-lg bg-secondary/30 border border-border/50 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-muted-foreground">Project {i + 1}</span>
                        <button onClick={() => setData(p => ({ ...p, projects: p.projects.filter(e => e.id !== proj.id) }))} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Project Name" value={proj.name} onChange={v => upProj(proj.id, "name", v)} />
                        <Field label="Tech Stack"   value={proj.tech} onChange={v => upProj(proj.id, "tech", v)} placeholder="React, Node.js" />
                      </div>
                      <Field label="GitHub / Live URL" value={proj.link} onChange={v => upProj(proj.id, "link", v)} placeholder="https://github.com/…" />
                      <div>
                        <Label className="text-[11px] text-muted-foreground">Description</Label>
                        <Textarea className="bg-secondary/50 border-border text-foreground text-sm resize-none mt-1" rows={2}
                          value={proj.description} onChange={e => upProj(proj.id, "description", e.target.value)} />
                      </div>
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="outline" className="w-full border-dashed border-border/60 text-muted-foreground hover:text-foreground text-xs"
                    onClick={() => setData(p => ({ ...p, projects: [...p.projects, { id: uid(), name: "", tech: "", description: "", link: "" }] }))}>
                    <Plus className="h-3 w-3 mr-1" /> Add Project
                  </Button>
                </AccordionContent>
              </AccordionItem>

              {/* Skills */}
              <AccordionItem value="skills" className="glass-card border-0 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">Skills</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Comma-separated</Label>
                  <Textarea className="bg-secondary/50 border-border text-foreground text-sm resize-none" rows={3}
                    placeholder="Python, JavaScript, React, SQL, Git, Machine Learning, AWS"
                    value={data.skills} onChange={e => setData(p => ({ ...p, skills: e.target.value }))} />
                </AccordionContent>
              </AccordionItem>

              {/* Certifications */}
              <AccordionItem value="certifications" className="glass-card border-0 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">Certifications</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-3">
                  {data.certifications.map((cert, i) => (
                    <div key={cert.id} className="rounded-lg bg-secondary/30 border border-border/50 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-muted-foreground">Cert {i + 1}</span>
                        <button onClick={() => setData(p => ({ ...p, certifications: p.certifications.filter(e => e.id !== cert.id) }))} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Certificate Name"    value={cert.name}   onChange={v => upCert(cert.id, "name", v)} />
                        <Field label="Issuing Org"         value={cert.issuer} onChange={v => upCert(cert.id, "issuer", v)} placeholder="Coursera, AWS…" />
                        <Field label="Year"                value={cert.year}   onChange={v => upCert(cert.id, "year", v)} placeholder="2024" />
                      </div>
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="outline" className="w-full border-dashed border-border/60 text-muted-foreground hover:text-foreground text-xs"
                    onClick={() => setData(p => ({ ...p, certifications: [...p.certifications, { id: uid(), name: "", issuer: "", year: "" }] }))}>
                    <Plus className="h-3 w-3 mr-1" /> Add Certification
                  </Button>
                </AccordionContent>
              </AccordionItem>

              {/* Achievements */}
              <AccordionItem value="achievements" className="glass-card border-0 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">Achievements</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-3">
                  {data.achievements.map((a, i) => (
                    <div key={a.id} className="rounded-lg bg-secondary/30 border border-border/50 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-muted-foreground">Achievement {i + 1}</span>
                        <button onClick={() => setData(p => ({ ...p, achievements: p.achievements.filter(e => e.id !== a.id) }))} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Title"  value={a.title} onChange={v => upAchieve(a.id, "title", v)} placeholder="Award / Honor" />
                        <Field label="Year"   value={a.year}  onChange={v => upAchieve(a.id, "year", v)}  placeholder="2024" />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground">Description (optional)</Label>
                        <Textarea className="bg-secondary/50 border-border text-foreground text-sm resize-none mt-1" rows={2}
                          value={a.description} onChange={e => upAchieve(a.id, "description", e.target.value)}
                          placeholder="Brief description of the achievement…" />
                      </div>
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="outline" className="w-full border-dashed border-border/60 text-muted-foreground hover:text-foreground text-xs"
                    onClick={() => setData(p => ({ ...p, achievements: [...p.achievements, { id: uid(), title: "", description: "", year: "" }] }))}>
                    <Plus className="h-3 w-3 mr-1" /> Add Achievement
                  </Button>
                </AccordionContent>
              </AccordionItem>

              {/* Objective */}
              <AccordionItem value="objective" className="glass-card border-0 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">Career Objective</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <Textarea
                    className="bg-secondary/50 border-border text-foreground text-sm resize-none"
                    rows={3} value={data.objective}
                    placeholder="A focused statement about your career goal and what you aim to achieve in your next role…"
                    onChange={e => setData(p => ({ ...p, objective: e.target.value }))}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Strengths */}
              <AccordionItem value="strengths" className="glass-card border-0 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">Strengths</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Comma-separated</Label>
                  <Textarea className="bg-secondary/50 border-border text-foreground text-sm resize-none" rows={2}
                    placeholder="Problem Solving, Leadership, Communication, Team Work"
                    value={data.strengths} onChange={e => setData(p => ({ ...p, strengths: e.target.value }))} />
                </AccordionContent>
              </AccordionItem>

              {/* Languages */}
              <AccordionItem value="languages" className="glass-card border-0 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">Languages</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Comma-separated</Label>
                  <Textarea className="bg-secondary/50 border-border text-foreground text-sm resize-none" rows={2}
                    placeholder="English (Fluent), Tamil (Native), Hindi (Conversational)"
                    value={data.languages} onChange={e => setData(p => ({ ...p, languages: e.target.value }))} />
                </AccordionContent>
              </AccordionItem>

              {/* Hobbies */}
              <AccordionItem value="hobbies" className="glass-card border-0 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">Hobbies &amp; Interests</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Comma-separated</Label>
                  <Textarea className="bg-secondary/50 border-border text-foreground text-sm resize-none" rows={2}
                    placeholder="Photography, Open Source, Chess, Travelling"
                    value={data.hobbies} onChange={e => setData(p => ({ ...p, hobbies: e.target.value }))} />
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>

          {/* ── Right: Live Preview ── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Zoom controls bar */}
            <div className="flex items-center justify-center gap-2 py-1.5 border-b border-border/40 bg-zinc-900/60 flex-shrink-0">
              <button
                onClick={zoomOut}
                disabled={zoom <= 0.3}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs text-zinc-400 tabular-nums w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={zoomIn}
                disabled={zoom >= 1.2}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setZoom(0.68)}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700 hover:border-zinc-500 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Scrollable canvas */}
            <div className="flex-1 overflow-auto bg-zinc-800 flex items-start justify-center py-8 px-4">
              <div style={{ width: 794 * zoom, flexShrink: 0 }}>
                <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: 794 }}>
                  <ActiveTemplate data={data} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
