export interface Milestone {
  period: string;
  role: string;
  organization: string;
  location: string;
  description: string;
  skills: string[];
}

export const experiencesData: Milestone[] = [
  {
    period: "Present",
    role: "College Student",
    organization: "Physics Wallah – Institute of Innovation (PW IOI)",
    location: "India",
    description:
      "Pursuing my college education focused on computer science, programming fundamentals, and technology innovation. Actively building projects, learning by doing, and collaborating with fellow student peers.",
    skills: ["Programming Fundamentals", "Computer Science", "Learning by Building", "Web Development"],
  },
  {
    period: "2024 — Present",
    role: "Exploring Programming & Web Development",
    organization: "Learning by Building & College Projects",
    location: "Self-Driven & College",
    description:
      "Hands-on experimentation with HTML, CSS, JavaScript, and Bootstrap. Practising coding in Java and Python, building college projects like Brightloop, and taking part in hackathons to test and improve my skills.",
    skills: ["HTML & CSS", "JavaScript", "Bootstrap", "Python", "Java", "Brightloop Project"],
  },
  {
    period: "Future Goal",
    role: "Aspiring AI/ML Engineer",
    organization: "Exploring New Technologies",
    location: "Long-Term Ambition",
    description:
      "My long-term ambition is to become an exceptional AI/ML Engineer. I am currently building my mathematical foundation, practicing with Python, and learning the concepts behind artificial intelligence and machine learning step by step.",
    skills: ["Python", "Machine Learning Basics", "Mathematics Foundations", "Step-by-Step Learning"],
  },
];
