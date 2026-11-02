export interface LearningArea {
  name: string;
  status: string;
  category: string;
}

export interface AbilityCardData {
  name: string;
  title: string;
  institution: string;
  learningAreas: LearningArea[];
  backQuote: {
    heading: string;
    subheading: string;
  };
  footerInfo: {
    institution: string;
    focus: string;
    location: string;
  };
}

export const abilityCardData: AbilityCardData = {
  name: "Sarthak",
  title: "Aspiring AI/ML Engineer",
  institution: "Physics Wallah – Institute of Innovation",
  learningAreas: [
    {
      name: "HTML & CSS",
      status: "Building Foundations",
      category: "Web Fundamentals",
    },
    {
      name: "JavaScript",
      status: "Currently Learning",
      category: "Frontend Scripting",
    },
    {
      name: "Java",
      status: "Core Programming",
      category: "Object-Oriented Fundamentals",
    },
    {
      name: "Python",
      status: "Exploring AI Foundations",
      category: "Data & Scripting",
    },
    {
      name: "Bootstrap",
      status: "Responsive Layouts",
      category: "UI Styling",
    },
    {
      name: "AI & Machine Learning",
      status: "Future Destination",
      category: "Long-term Ambition",
    },
  ],
  backQuote: {
    heading: "Learning Today. Building Tomorrow.",
    subheading:
      "Every step is part of my journey towards becoming an excellent AI/ML Engineer.",
  },
  footerInfo: {
    institution: "Student @ PW IOI",
    focus: "Learning by Building",
    location: "India",
  },
};
