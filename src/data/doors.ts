export interface DoorProject {
  title: string;
  category: string;
  description: string;
  tech: string[];
  metrics: string;
  url: string;
}

export interface SkillDoor {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  doorSign: string;
  doorColor: string;
  frameColor: string;
  accentColor: string;
  glowColor: string;
  checklist: string[];
  description: string;
  tools: string[];
  projects: DoorProject[];
}

export const skillDoors: SkillDoor[] = [
  {
    id: "door-web-dev",
    number: "01",
    title: "Web Development",
    subtitle: "Building for the web",
    doorSign: "WEB DEVELOPMENT",
    doorColor: "#183256", // Navy Blue
    frameColor: "#10213a",
    accentColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    checklist: [
      "HTML & CSS",
      "JavaScript",
      "Bootstrap",
      "Exploring frontend development",
      "Learning responsive website design",
    ],
    description:
      "Currently learning frontend fundamentals, semantic markup, and responsive design patterns. Practising with HTML, CSS, JavaScript, and Bootstrap to understand how modern websites are structured, styled, and brought to life.",
    tools: ["HTML & CSS", "JavaScript", "Bootstrap", "Responsive Layouts", "Learning by Building"],
    projects: [
      {
        title: "Personal Developer Portfolio",
        category: "Learning Project",
        description:
          "An interactive portfolio built to practice modern web development, responsive styling, and clean user experience.",
        tech: ["HTML & CSS", "JavaScript", "Next.js", "Tailwind CSS"],
        metrics: "Learning Build",
        url: "#",
      },
      {
        title: "Responsive Web Layouts",
        category: "Frontend Practice",
        description:
          "Practical exercises building clean, responsive layouts exploring CSS Grid, Flexbox, and Bootstrap design patterns.",
        tech: ["HTML5", "CSS3", "Bootstrap"],
        metrics: "Hands-on Practice",
        url: "#",
      },
    ],
  },
  {
    id: "door-programming",
    number: "02",
    title: "Programming",
    subtitle: "Learning to think in code",
    doorSign: "PROGRAMMING",
    doorColor: "#48263c", // Muted Burgundy
    frameColor: "#2f1727",
    accentColor: "#c084fc",
    glowColor: "rgba(192, 132, 252, 0.4)",
    checklist: [
      "Java programming",
      "Python programming",
      "Object-oriented programming fundamentals",
      "Problem solving",
      "Coding practice",
    ],
    description:
      "Building my foundation in programming through consistent coding practice, object-oriented concepts, and problem solving in Java and Python as a student at Physics Wallah's Institute of Innovation.",
    tools: ["Java", "Python", "OOP Fundamentals", "Problem Solving", "Coding Practice"],
    projects: [
      {
        title: "OOP Concepts & Practice",
        category: "Foundations",
        description:
          "Structured exercises practicing core object-oriented principles, classes, methods, and logic building in Java and Python.",
        tech: ["Java", "Python", "OOP"],
        metrics: "Core Practice",
        url: "#",
      },
      {
        title: "Problem Solving Exercises",
        category: "Coding Practice",
        description:
          "Regular programming challenges and exercises aimed at strengthening logical thinking, data handling, and clean coding habits.",
        tech: ["Python", "Logic Building"],
        metrics: "Step by Step",
        url: "#",
      },
    ],
  },
  {
    id: "door-ai-ml",
    number: "03",
    title: "AI & Machine Learning",
    subtitle: "My future destination",
    doorSign: "AI & MACHINE LEARNING",
    doorColor: "#3d5c44", // Sage Green
    frameColor: "#273d2d",
    accentColor: "#86efac",
    glowColor: "rgba(134, 239, 172, 0.4)",
    checklist: [
      "Exploring Artificial Intelligence",
      "Discovering Machine Learning",
      "Building programming foundations",
      "Learning step by step",
      "Aspiring AI/ML Engineer",
    ],
    description:
      "My long-term ambition is to become an exceptional AI/ML Engineer. I am currently building my foundation by exploring core concepts, studying mathematical principles, and practicing Python programming step by step.",
    tools: ["Python", "AI & ML Concepts", "Math Foundations", "Exploring New Technologies"],
    projects: [
      {
        title: "AI & ML Learning Journey",
        category: "Exploration & Study",
        description:
          "Documenting notes, foundational concepts, and hands-on exercises exploring foundational machine learning principles.",
        tech: ["Python", "Math Foundations", "Exploratory Studies"],
        metrics: "Currently Exploring",
        url: "#",
      },
      {
        title: "Python Data & Logic Experiments",
        category: "Hands-on Practice",
        description:
          "Early scripts and exercises exploring data manipulation, mathematical operations, and learning algorithms in Python.",
        tech: ["Python", "Data Basics"],
        metrics: "Growing Step by Step",
        url: "#",
      },
    ],
  },
  {
    id: "door-projects-journey",
    number: "04",
    title: "Projects & Journey",
    subtitle: "Learning by building",
    doorSign: "PROJECTS & JOURNEY",
    doorColor: "#8e4a24", // Rust / Warm Terracotta
    frameColor: "#613015",
    accentColor: "#fdba74",
    glowColor: "rgba(253, 186, 116, 0.4)",
    checklist: [
      "College projects",
      "Hackathon experience",
      "Brightloop – Subscription Management System",
      "Personal portfolio",
      "Continuous learning",
    ],
    description:
      "I believe deeply in learning by building. As a student at PW IOI, I work on college projects, participate in hackathons to test my skills, and continuously build projects like Brightloop to grow one step at a time.",
    tools: ["Brightloop", "College Projects", "Hackathons", "PW IOI Community"],
    projects: [
      {
        title: "Brightloop",
        category: "Subscription Management System",
        description:
          "A practical project built to help users organize, monitor, and manage recurring digital subscriptions and recurring spending.",
        tech: ["Web Development", "UI Design", "State Management"],
        metrics: "Learning by Building",
        url: "#",
      },
      {
        title: "College & Hackathon Experiences",
        category: "Student Innovation",
        description:
          "Team-based projects and collaborative prototypes built during college hackathons and coursework at PW Institute of Innovation.",
        tech: ["Teamwork", "Problem Solving", "Rapid Prototyping"],
        metrics: "Collaborative Learning",
        url: "#",
      },
    ],
  },
];
