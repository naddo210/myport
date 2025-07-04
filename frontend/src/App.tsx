// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import Testimonials from "./components/Testemonial";
const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const helloWords = ["Hello", "Hola", "Bonjour", "Ciao", "नमस्ते", "こんにちは", "안녕하세요", "مرحبا"];
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  
  // Form state management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ""
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message: "Please fill in all required fields."
      });
      return;
    }
    
    // Set submitting state
    setFormStatus({
      ...formStatus,
      submitting: true,
      error: false,
      message: ""
    });
    
    try {
      // Create form data for submission
      const apiFormData = new FormData();
      apiFormData.append('access_key', 'ea85bbda-efe5-4ffa-a700-a1421b060500'); // Your Web3Forms key
      apiFormData.append('name', formData.name);
      apiFormData.append('email', formData.email);
      apiFormData.append('subject', formData.subject || 'Contact Form Submission');
      apiFormData.append('message', formData.message);
      
      // Submit form to Web3Forms
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: apiFormData
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        
        setFormStatus({
          submitting: false,
          success: true,
          error: false,
          message: "Thank you! Your message has been sent successfully."
        });
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message: error instanceof Error ? error.message : "Failed to send message. Please try again."
      });
    }
  };

  const [activeSection, setActiveSection] = useState("home");
  const [typedText, setTypedText] = useState("");
  const texts = ["Full Stack Developer", "Data Analyst"];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const typingSpeed = 150;
  const typingDelay = 2000;
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  // hello loader
  useEffect(() => {
    if (showLoader) {
      // Slide out after the words finish
      const duration = helloWords.length * 300;
  
      const slideOutTimer = setTimeout(() => {
        setIsSlidingOut(true);
      }, duration + 200); // wait till word animation ends
  
      const hideLoaderTimer = setTimeout(() => {
        setShowLoader(false);
      }, duration + 900); // wait till loader slides up
  
      return () => {
        clearTimeout(slideOutTimer);
        clearTimeout(hideLoaderTimer);
      };
    }
  }, [showLoader]);
  
  
  
  

  // Typing effect
  useEffect(() => {
    let currentIndex = 0;
    let timer: NodeJS.Timeout;
    const typeText = () => {
      const currentText = texts[currentTextIndex];
      if (currentIndex < currentText.length) {
        setTypedText(currentText.substring(0, currentIndex + 1));
        currentIndex++;
        timer = setTimeout(typeText, typingSpeed);
      } else {
        timer = setTimeout(() => {
          currentIndex = 0;
          setTypedText("");
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, typingDelay);
      }
    };
    timer = setTimeout(typeText, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentTextIndex]);
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", (!darkMode).toString());
  };
  // Initialize dark mode from local storage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(savedTheme === "true");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setDarkMode(prefersDark);
      localStorage.setItem("darkMode", prefersDark.toString());
    }
  }, []);
  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
      setMenuOpen(false);
    }
  };
  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const sections = [
        "home",
        "about",
        "skills",
        "projects",
        "achievements",
        "contact",
      ];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Initialize skills chart
  useEffect(() => {
    if (chartRef.current) {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current);
      }
      const option = {
        animation: false,
        radar: {
          indicator: [
            { name: "JavaScript", max: 100 },
            { name: "React", max: 100 },
            { name: "Python", max: 100 },
            { name: "Data Analysis", max: 100 },
            { name: "Node.js", max: 100 },
            { name: "Database", max: 100 },
          ],
          shape: "circle",
          splitNumber: 4,
          axisName: {
            color: darkMode ? "#fff" : "#333",
          },
          splitLine: {
            lineStyle: {
              color: darkMode
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            },
          },
          splitArea: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: darkMode
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            },
          },
        },
        series: [
          {
            name: "Skills",
            type: "radar",
            data: [
              {
                value: [85, 80, 85, 90, 80, 85],
                name: "Skill Level",
                areaStyle: {
                  color: darkMode
                    ? "rgba(64, 158, 255, 0.6)"
                    : "rgba(64, 158, 255, 0.4)",
                },
                lineStyle: {
                  color: darkMode ? "#409EFF" : "#409EFF",
                },
                itemStyle: {
                  color: darkMode ? "#409EFF" : "#409EFF",
                },
              },
            ],
          },
        ],
      };
      chartInstance.current.setOption(option);
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [darkMode]);
  // Update chart on window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Projects data
  const projects = [
      {
      id: 1,
      title: "Food Ordering System",
      description:
        "A comprehensive food delivery platform with real-time order tracking, restaurant management, and secure payment integration.",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      image:
        "/food.png",
      demoLink: "https://food-res-1frontend1.onrender.com/",
      sourceLink: "https://github.com/naddo210/nadeemp1",
    },
  {
      id: 2,
      title: " Mirza Hajj Umrah Tours ",
      description:
        "Property listing and management system with advanced search filters and virtual tour features.",
      technologies: ["React", "Node.js", "MongoDB", "Gsap"],
      image:
        "/kaba.png",
      demoLink: "https://www.mirza-hajj-umrah-tours.in/",
      sourceLink: "https://github.com/naddo210/MirzaT",
    },
     {
      id: 3,
      title: "A.H properties",
      description:
        "Property listing and management system with advanced search filters and virtual tour features.",
      technologies: ["Html", "Css", "Javascript", ],
      image:
        "/ahproperties.png",
      demoLink: "https://www.ahproperties.in/",
      sourceLink: "https://github.com/naddo210/property-advisor",
    },
  
      {
      id: 4,
      title: "greek-automata",
      description:
        " Led the web and registration system team for the annual techfest with 200+ participants.",
      technologies: ["Reactjs", "Gsap", "TailwindCss", "Google Forms"],
      image:
        "/techfest.png",
      demoLink: "https://xgreek-automata.vercel.app/",
      sourceLink: "#",
    },
    {
      id: 5,
      title: "E-Commerce Website",
      description:
        "Feature-rich e-commerce platform with product management, user authentication, and payment processing.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      image:
        "https://readdy.ai/api/search-image?query=Modern%20e-commerce%20website%20interface%20with%20elegant%20product%20showcase%2C%20shopping%20cart%2C%20and%20payment%20integration.%20Clean%20design%20and%20professional%20product%20photography%20on%20light%20background&width=600&height=400&seq=5&orientation=landscape",
      demoLink: "#",
      sourceLink: "#",
    },
     {
      id: 6,
      title: "Python Email Validator",
      description:
        "Advanced Python application for validating email addresses, featuring syntax checking, domain verification, and SMTP validation with comprehensive reporting.",
      technologies: ["Python"],
      image:
        "https://readdy.ai/api/search-image?query=Modern%20software%20interface%20showing%20email%20validation%20system%20with%20clean%20design%20and%20status%20indicators.%20Professional%20layout%20with%20validation%20results%20and%20statistics%20on%20light%20background&width=600&height=400&seq=3&orientation=landscape",
      demoLink: "#",
      sourceLink: "https://github.com/naddo210/emailvalidator",
    },
     {
      id: 7,
      title: "Deloitte Tableau Project",
      description:
        "Comprehensive data visualization project developed during Deloitte's Tableau course, featuring advanced analytics, custom calculations, and interactive dashboards.",
      technologies: [
        "Tableau Desktop",
        "SQL",
        "Data Analysis",
        "Visualization",
      ],
      image:
        "https://readdy.ai/api/search-image?query=Professional%20data%20visualization%20dashboard%20with%20multiple%20interactive%20charts%20and%20business%20metrics.%20Modern%20analytics%20interface%20with%20clean%20design%20and%20informative%20visualizations%20on%20light%20background&width=600&height=400&seq=2&orientation=landscape",
      demoLink: "#",
      sourceLink: "#",
    },
     {
      id: 8,
      title: "Islamic Quiz App",
      description:
        "Build a quiz app where you can check your knowledge about Islamic history and culture.",
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",

      ],
      image:
        "/ISLAMIC.png",
      demoLink: "https://islamic-quiz-786m.netlify.app/",
      sourceLink: "#",
    },
       {
      id: 9,
      title: "Video Streaming App",
      description:
        "Build a video streaming app where you can watch videos.",
      technologies: [
        "Reactjs",
        "Node.js",
        "API Integration",

      ],
      image:
        "/vidtube.png",
      demoLink: "https://ytclone-ktoy-nbk736dpe-naddo210s-projects.vercel.app/",
      sourceLink: "https://github.com/naddo210/ytclone",
    },
        {
      id: 10,
      title: "Grocery Store Analytics Dashboard",
      description:
        "Interactive Power BI dashboard analyzing sales data, customer behavior, and inventory management for a grocery store chain. Features revenue trends, top-selling products, and predictive analytics.",
      technologies: ["Power BI", "DAX", "Data Modeling", "SQL"],
      image:
        "https://readdy.ai/api/search-image?query=Professional%20business%20analytics%20dashboard%20showing%20sales%20metrics%2C%20charts%2C%20and%20KPIs%20for%20grocery%20store%20data.%20Modern%20visualization%20with%20clean%20layout%20and%20informative%20graphs%20on%20light%20background&width=600&height=400&seq=1&orientation=landscape",
      demoLink: "#",
      sourceLink: "https://github.com/naddo210/Supermarket-Analysis",
    },
        {
      id: 11,
      title: "My first Portfolio",
      description:
        " A simple portfolio website showcasing my projects, skills, and contact information. Built with HTML, CSS, and JavaScript.",
      technologies: ["HTML", "CSS", "JavaScript"],
      image:
        "/personalpp.png",
      demoLink: "https://nadeport.netlify.app/",
      sourceLink: "",
    },
  ];
  // Certificates data
  const certificates = [
    {
      id: 1,
      title: "Data analytics",
      organization: "Nasscom",
      date: "2025",
      image:
        "/Nadeem+Salmani_ certificate conv 1.png",
    },
    {
      id: 2,
      title: "Gen-AI",
      organization: "Infosys",
      date: "2025",
      image:
        "/infosysGenai conv 1.png",
    },
    {
      id: 3,
      title: "Python",
      organization: "Infosys",
      date: "2022",
      image:
        "/Python-certificate conv 1.png",
    },
    {
      id: 4,
      title: "Data Analysis",
      organization: "Deloitte",
      date: "2025",
      image:
        "/deloitte_completion_certificate conv 1.png",
    },
    {
      id: 5,
      title: "AWS Solution Architecture",
      organization: "AWS",
      date: "2025",
      image:
        "/awss.png",
    },
  ];
  // Academic data
  const academics = [
    {
      id: 1,
      degree: "Master of Computer Application",
      institution: "Mumbai University",
      year: "2025-Ongoing",
      description:
        "Specialized in Artificial Intelligence and Web Technologies",
    },
    {
      id: 2,
      degree: "Bachelor of Science Information Technology",
      institution: "Mumbai University",
      year: "2022-2025",
      description: "Information Technology with a minor in Human-Computer Interaction, focusing on software development and user-centered design.",
    },
  ];
  return (
    <>
{showLoader && (
  <div
    className={`fixed inset-0 flex items-center justify-center z-[9999] transition-transform duration-700 ease-in-out ${
      darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    } ${isSlidingOut ? "translate-y-[-100%]" : "translate-y-0"}`}
  >
    <div className="h-12 overflow-hidden">
      <div
        className="flex flex-col"
        style={{
          animation: `slideUp ${helloWords.length * 0.3}s steps(${helloWords.length}) forwards`,
        }}
      >
        {helloWords.map((word, i) => (
          <div
            key={i}
            className="h-12 flex items-center justify-center text-4xl font-bold"
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  </div>
)}




    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}
    >
      {/* Header & Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} shadow-md`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">
            <a
              href="#home"
              className="flex items-center"
              onClick={() => scrollToSection("home")}
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? "bg-blue-600" : "bg-blue-500"}`}
                >
                  <span className="text-xl text-white font-bold">NS</span>
                </div>
                <span
                  className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  Nadeem Salmani
                </span>
              </div>
            </a>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              "home",
              "about",
              "skills",
              "projects",
              "achievements",
              "contact",
            ].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item);
                }}
                className={`capitalize transition-colors duration-300 cursor-pointer hover:text-blue-500 ${activeSection === item ? "text-blue-500 font-medium" : ""}`}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-gray-700"}`}
              aria-label="Toggle dark mode"
            >
              <i
                className={`fas ${darkMode ? "fa-sun" : "fa-moon"} transition-transform duration-300 hover:rotate-90`}
              ></i>
            </button>
            {/* CV Download Button */}
          <a
  href="/Nadeem-Salmani-FlowCV-Resume-20250701.pdf"
  download
  className={`hidden md:inline-block px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer transition-colors duration-300 ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
>
  <i className="fas fa-download mr-2"></i>Download CV
</a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <i
                className={`fas ${menuOpen ? "fa-times" : "fa-bars"} text-xl`}
              ></i>
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-96" : "max-h-0"} ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="container mx-auto px-4 py-2">
            {[
              "home",
              "about",
              "skills",
              "projects",
              "achievements",
              "contact",
            ].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item);
                }}
                className={`block py-3 capitalize transition-colors duration-300 cursor-pointer hover:text-blue-500 ${activeSection === item ? "text-blue-500 font-medium" : ""}`}
              >
                {item}
              </a>
            ))}
            <a
              href="#"
              className={`block py-3 mb-2 text-center !rounded-button whitespace-nowrap cursor-pointer transition-colors duration-300 ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
            >
              <i className="fas fa-download mr-2"></i>Download CV
            </a>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section id="home" className="min-h-screen pt-24 flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Hi, I'm{" "}
                <span
                  className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  Nadeem Salmani
                </span>
              </h1>
              <div className="h-8 mb-6">
                <h2 className="text-2xl md:text-3xl font-medium">
                  <span
                    className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}
                  >
                    {typedText}
                  </span>
                  <span className="animate-pulse">|</span>
                </h2>
              </div>
              <p className="text-lg md:text-xl mb-8 max-w-2xl">
                Passionate about creating elegant, efficient, and user-friendly
                web applications. Specialized in modern JavaScript frameworks
                and responsive design.
              </p>
              <div className="flex justify-center md:justify-start space-x-4 mb-8">
                <a
                  href="https://github.com/naddo210"
                  className={`p-3 rounded-full cursor-pointer transition-colors duration-300 ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/nadeem-salmani-42913934a/"
                  className={`p-3 rounded-full cursor-pointer transition-colors duration-300 ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
          
            
              </div>
              <div className="flex justify-center md:justify-start space-x-4">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("contact");
                  }}
                  className={`px-6 py-3 !rounded-button whitespace-nowrap cursor-pointer transition-colors duration-300 ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                >
                  Contact Me
                </a>
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("projects");
                  }}
                  className={`px-6 py-3 border-2 !rounded-button whitespace-nowrap cursor-pointer transition-colors duration-300 ${darkMode ? "border-gray-600 hover:border-gray-500 text-white" : "border-gray-300 hover:border-gray-400 text-gray-800"}`}
                >
                  View Projects
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div
                className={`relative w-64 h-64 md:w-96 md:h-96 overflow-hidden transform-gpu`}
                id="model-container"
                onMouseMove={(e) => {
                  const container = document.getElementById("model-container");
                  if (container) {
                    const rect = container.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    container.style.transform = `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`;
                  }
                }}
              >
                <img
                  src="https://readdy.ai/api/search-image?query=Modern%20anime%20style%20professional%20developer%20character%20with%20neat%20short%20hair%20wearing%20smart%20business%20attire%20standing%20confidently%20against%20minimal%20tech%20themed%20background%20with%20floating%20code%20elements%20and%20UI%20interfaces%2C%20high%20quality%20digital%20art%20with%20clean%20composition%20and%20professional%20lighting&width=800&height=800&seq=9&orientation=squarish"
                  alt="Developer Character"
                  className="w-full h-full object-contain transition-transform duration-300"
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
              className="cursor-pointer"
            >
              <i
                className={`fas fa-chevron-down text-2xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              ></i>
            </a>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section
        id="about"
        className={`py-20 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <div
              className={`w-20 h-1 mx-auto ${darkMode ? "bg-blue-400" : "bg-blue-500"}`}
            ></div>
          </div>
          <div className="flex flex-col md:flex-row items-start">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h3 className="text-2xl font-semibold mb-4">Who I Am</h3>
              <p className="mb-4">
                I'm a passionate Full Stack Developer with over 2 years of
                experience in building web applications that are not only
                functional but also provide exceptional user experiences.
              </p>
              <p className="mb-4">
                My journey in web development started during my university
                years, and since then, I've been constantly learning and
                adapting to new technologies and methodologies.
              </p>
              <p className="mb-6">
                I specialize in JavaScript ecosystems, particularly React for
                frontend and Node.js for backend development. I'm also
                experienced in database design, API development, and deployment
                strategies.
              </p>
              <p className="mb-6">
              I specialize in data analysis, particularly using Python, SQL, and Excel for data manipulation and visualization. I'm also experienced in building dashboards, performing statistical analysis, and uncovering insights to support business decisions.
              </p>
              <h3 className="text-2xl font-semibold mb-4">
                Academic Background
              </h3>
              <div
                className={`space-y-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {academics.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md`}
                  >
                    <h4 className="text-lg font-semibold">{item.degree}</h4>
                    <p
                      className={`${darkMode ? "text-blue-300" : "text-blue-600"} font-medium`}
                    >
                      {item.institution}
                    </p>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {item.year}
                    </p>
                    <p className="mt-2">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">My Expertise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div
                  className={`p-5 rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md`}
                >
                  <div
                    className={`text-3xl mb-3 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                  >
                    <i className="fas fa-laptop-code"></i>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    Frontend Development
                  </h4>
                  <p>
                    Creating responsive, accessible, and performant user
                    interfaces with modern frameworks.
                  </p>
                </div>
                <div
                  className={`p-5 rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md`}
                >
                  <div
                    className={`text-3xl mb-3 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                  >
                    <i className="fas fa-server"></i>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    Backend Development
                  </h4>
                  <p>
                    Building robust APIs, services, and database architectures
                    to power applications.
                  </p>
                </div>
                <div
                  className={`p-5 rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md`}
                >
                  <div
                    className={`text-3xl mb-3 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                  >
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    Responsive Design
                  </h4>
                  <p>
                    Ensuring applications work flawlessly across all devices and
                    screen sizes.
                  </p>
                </div>
                <div
                  className={`p-5 rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md`}
                >
                  <div
                    className={`text-3xl mb-3 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                  >
                    <i className="fas fa-paint-brush"></i>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">UI/UX Design</h4>
                  <p>
                    Creating intuitive and aesthetically pleasing user
                    experiences that delight users.
                  </p>
                </div>
              </div>
              <div
                className={`p-5 rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md`}
              >
                <h4 className="text-xl font-semibold mb-4">Key Highlights</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span
                      className={`mr-2 mt-1 ${darkMode ? "text-green-400" : "text-green-500"}`}
                    >
                      <i className="fas fa-check-circle"></i>
                    </span>
                    <span>
                      Led development of 10+ successful web applications
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span
                      className={`mr-2 mt-1 ${darkMode ? "text-green-400" : "text-green-500"}`}
                    >
                      <i className="fas fa-check-circle"></i>
                    </span>
                    <span>
                      Reduced application load time by 40% through optimization
                    </span>
                  </li>
                  {/* <li className="flex items-start">
                    <span
                      className={`mr-2 mt-1 ${darkMode ? "text-green-400" : "text-green-500"}`}
                    >
                      <i className="fas fa-check-circle"></i>
                    </span>
                    <span>
                      Implemented CI/CD pipelines reducing deployment time by
                      60%
                    </span>
                  </li> */}
                  <li className="flex items-start">
                    <span
                      className={`mr-2 mt-1 ${darkMode ? "text-green-400" : "text-green-500"}`}
                    >
                      <i className="fas fa-check-circle"></i>
                    </span>
                    <span>
                      Contributed to open-source projects, enhancing community
                      engagement
                       
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">My Skills</h2>
            <div
              className={`w-20 h-1 mx-auto ${darkMode ? "bg-blue-400" : "bg-blue-500"}`}
            ></div>
            <p className="mt-4 max-w-2xl mx-auto">
              I've acquired and refined these skills through years of practical
              experience and continuous learning.
            </p>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6">
                  Technical Skills
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">
                        JavaScript / TypeScript
                      </span>
                      <span>80%</span>
                    </div>
                    <div
                      className={`w-full h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                    >
                      <div
                        className={`h-full rounded-full ${darkMode ? "bg-blue-500" : "bg-blue-600"}`}
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">React </span>
                      <span>85%</span>
                    </div>
                    <div
                      className={`w-full h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                    >
                      <div
                        className={`h-full rounded-full ${darkMode ? "bg-blue-500" : "bg-blue-600"}`}
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Node.js / Express</span>
                      <span>80%</span>
                    </div>
                    <div
                      className={`w-full h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                    >
                      <div
                        className={`h-full rounded-full ${darkMode ? "bg-blue-500" : "bg-blue-600"}`}
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">HTML5 / CSS3 / SASS</span>
                      <span>90%</span>
                    </div>
                    <div
                      className={`w-full h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                    >
                      <div
                        className={`h-full rounded-full ${darkMode ? "bg-blue-500" : "bg-blue-600"}`}
                        style={{ width: "90%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">MongoDB /SQL</span>
                      <span>75%</span>
                    </div>
                    <div
                      className={`w-full h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                    >
                      <div
                        className={`h-full rounded-full ${darkMode ? "bg-blue-500" : "bg-blue-600"}`}
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                  </div>
                  {/* <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Docker / CI/CD</span>
                      <span>70%</span>
                    </div>
                    <div
                      className={`w-full h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                    >
                      <div
                        className={`h-full rounded-full ${darkMode ? "bg-blue-500" : "bg-blue-600"}`}
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div> */}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6">Soft Skills</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  >
                    <div
                      className={`text-2xl mb-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                    >
                      <i className="fas fa-users"></i>
                    </div>
                    <h4 className="font-semibold">Team Collaboration</h4>
                  </div>
                  <div
                    className={`p-4 rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  >
                    <div
                      className={`text-2xl mb-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                    >
                      <i className="fas fa-tasks"></i>
                    </div>
                    <h4 className="font-semibold">Project Management</h4>
                  </div>
                  <div
                    className={`p-4 rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  >
                    <div
                      className={`text-2xl mb-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                    >
                      <i className="fas fa-comments"></i>
                    </div>
                    <h4 className="font-semibold">Communication</h4>
                  </div>
                  <div
                    className={`p-4 rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  >
                    <div
                      className={`text-2xl mb-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                    >
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <h4 className="font-semibold">Problem Solving</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <h3 className="text-2xl font-semibold mb-6">Skills Overview</h3>
              <div ref={chartRef} className="w-full h-80"></div>
              <div className="mt-10">
                <h3 className="text-2xl font-semibold mb-6">
                  Tools & Technologies
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <div
                    className={`p-4 text-center rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  >
                    <i className="fab fa-react text-3xl mb-2 text-blue-500"></i>
                    <p className="font-medium">React</p>
                  </div>
                  <div
                    className={`p-4 text-center rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  >
                    <i className="fab fa-node-js text-3xl mb-2 text-green-500"></i>
                    <p className="font-medium">Node.js</p>
                  </div>
                  <div
                    className={`p-4 text-center rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  >
                    <i className="fab fa-js text-3xl mb-2 text-yellow-500"></i>
                    <p className="font-medium">JavaScript</p>
                  </div>
                  <div
                    className={`p-4 text-center rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  >
                    <i className="fab fa-html5 text-3xl mb-2 text-orange-500"></i>
                    <p className="font-medium">HTML5</p>
                  </div>
                  <div
                    className={`p-4 text-center rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  >
                    <i className="fab fa-css3-alt text-3xl mb-2 text-blue-500"></i>
                    <p className="font-medium">CSS3</p>
                  </div>
                  <div
                    className={`p-4 text-center rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  >
                    <i className="fab fa-python text-3xl mb-2 text-blue-500 "></i>
                    <p className="font-medium">Python</p>
                  </div>
                
                  <div
                    className={`p-4 text-center rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  >
                    <i className="fab fa-java text-3xl mb-2 text-blue-500"></i>
                    <p className="font-medium">Java</p>
                  </div>
                  <div
                    className={`p-4 text-center rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  >
                    <i className="fab fa-github text-3xl mb-2 text-white-500"></i>
                    <p className="font-medium">Github</p>
                  </div>
                
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Projects Section */}
      <section
        id="projects"
        className={`py-20 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
            <div
              className={`w-20 h-1 mx-auto ${darkMode ? "bg-blue-400" : "bg-blue-500"}`}
            ></div>
            <p className="mt-4 max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and
              expertise.
            </p>
          </div>
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <button
              className={`px-4 py-2 rounded-full whitespace-nowrap cursor-pointer transition-colors duration-300 ${darkMode ? "bg-blue-600" : "bg-blue-500"} text-white`}
            >
              All Projects
            </button>
           
          
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105 ${darkMode ? "bg-gray-700" : "bg-white"}`}
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:transform hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p
                    className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs font-medium rounded ${darkMode ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <a
                      href={project.demoLink}
                      className={`px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer transition-colors duration-300 ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                    >
                      Live Demo
                    </a>
                    <a
                      href={project.sourceLink}
                      className={`px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer transition-colors duration-300 ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"} ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      <i className="fab fa-github mr-2"></i>Source
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
       
        </div>
      </section>
      {/* Achievements & Certificates Section */}
      <section id="achievements" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Achievements & Certificates
            </h2>
            <div
              className={`w-20 h-1 mx-auto ${darkMode ? "bg-blue-400" : "bg-blue-500"}`}
            ></div>
            <p className="mt-4 max-w-2xl mx-auto">
              Recognition of my skills and expertise through certifications and
              achievements.
            </p>
          </div>
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 text-center">
             Skills Timeline
            </h3>
            <div className="relative">
              {/* Timeline Line */}
              <div
                className={`absolute md:left-1/2 left-6 transform md:-translate-x-1/2 h-full w-1 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
              ></div>
              {/* Timeline Items */}
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/2 pl-16 md:pl-0 md:pr-12 md:text-right mb-4 md:mb-0">
                    <div
                      className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-2 ${darkMode ? "bg-blue-600 text-white" : "bg-gray-400 text-white"}`}
                    >
                      2023
                    </div>
                    <h4 className="text-xl font-semibold">
                      Frontend Developer
                    </h4>
                    <p className="mt-2">
                      Led the frontend in developing a high-traffic
                      e-commerce platform.
                    </p>
                  </div>
                  <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
                  <div
                    className={`absolute md:left-1/2 left-6 transform md:-translate-x-1/2 w-6 h-6 rounded-full border-4 ${darkMode ? "border-gray-800 bg-blue-500" : "border-white bg-blue-500"}`}
                  ></div>
                </div>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
                  <div className="w-full md:w-1/2 pl-16 md:pl-12 mb-4 md:mb-0">
                    <div
                      className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-2 ${darkMode ? "bg-blue-600 text-white" : "bg-gray-400 text-white"}`}
                    >
                      2025
                    </div>
                    <h4 className="text-xl font-semibold">
                      Full Stack Developer
                    </h4>
                    <p className="mt-2">
                      Developed and maintained multiple client projects using
                      React and Node.js.
                    </p>
                  </div>
                  <div
                    className={`absolute md:left-1/2 left-6 transform md:-translate-x-1/2 w-6 h-6 rounded-full border-4 ${darkMode ? "border-gray-800 bg-blue-500" : "border-white bg-blue-500"}`}
                  ></div>
                </div>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/2 pl-16 md:pl-0 md:pr-12 md:text-right mb-4 md:mb-0">
                    <div
                      className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-2 ${darkMode ? "bg-blue-600 text-white" : "bg-gray-400 text-white"}`}
                    >
                      2019
                    </div>
                    <h4 className="text-xl font-semibold">
                    Data Analyst
                    </h4>
                    <p className="mt-2">
                    Analyzed datasets and created interactive dashboards with a focus on data visualization and user-friendly design.
                    </p>
                  </div>
                  <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
                  <div
                    className={`absolute md:left-1/2 left-6 transform md:-translate-x-1/2 w-6 h-6 rounded-full border-4 ${darkMode ? "border-gray-800 bg-blue-500" : "border-white bg-blue-500"}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div> 
            <h3 className="text-2xl font-semibold mb-10 text-center">
              Certificates
            </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {certificates.map((cert) => (
    <div
      key={cert.id}
      className={`rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105 ${darkMode ? "bg-gray-700" : "bg-white"}`}
    >
      <div className="h-48 overflow-hidden">
        <img
          src={cert.image}
          alt={cert.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <h4 className="text-lg font-semibold mb-1">{cert.title}</h4>
        <p className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-600"} mb-2`}>
          {cert.organization}
        </p>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-4`}>
          {cert.date}
        </p>
        <div className="flex space-x-3">
          <a
            href={cert.image}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-1 text-sm !rounded-button whitespace-nowrap cursor-pointer transition-colors duration-300 ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
          >
            View
          </a>
          <a
            href={cert.image}
            download
            className={`px-3 py-1 text-sm !rounded-button whitespace-nowrap cursor-pointer transition-colors duration-300 ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"} ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            <i className="fas fa-download mr-1"></i>Download
          </a>
        </div>
      </div>
    </div>
  ))}
</div>

          </div>
        </div>
      </section>

        <section
        id="testimonials"
        className={`py-20 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
      >
        <Testimonials/>
      </section>
         
      {/* Contact Section */}
      <section
        id="contact"
        className={`py-20 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
      >
     
        <div className="container mt-5 mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get In Touch
            </h2>
            <div
              className={`w-20 h-1 mx-auto ${darkMode ? "bg-blue-400" : "bg-blue-500"}`}
            ></div>
            <p className="mt-4 max-w-2xl mx-auto">
              Feel free to contact me for any work or suggestions.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-6">Contact Me</h3>
              
              {/* Form status messages */}
              {formStatus.success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {formStatus.message}
                </div>
              )}
              
              {formStatus.error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {formStatus.message}
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-blue-400 mb-2 font-medium">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-300 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-blue-400 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-300 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                      placeholder="Your Email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-blue-400 mb-2 font-medium">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-300 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                    placeholder="Subject"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-blue-400 mb-2 font-medium">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-300 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                    placeholder="Your Message"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  className={`px-6 py-3 !rounded-button whitespace-nowrap cursor-pointer transition-colors duration-300 ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white ${formStatus.submitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {formStatus.submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-6">
                Contact Information
              </h3>
              <div
                className={`p-6 rounded-lg shadow-md mb-6 transition-colors duration-300 ${darkMode ? "bg-gray-700" : "bg-white"}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div
                      className={`p-3 rounded-full mr-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                    >
                      <i
                        className={`fas fa-map-marker-alt ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                      ></i>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Location</h4>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-600"}
                      >
                        Powai, Mumbai, INDIA.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div
                      className={`p-3 rounded-full mr-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                    >
                      <i
                        className={`fas fa-envelope ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                      ></i>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Email</h4>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-600"}
                      >
                        ns814167@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div
                      className={`p-3 rounded-full mr-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                    >
                      <i
                        className={`fas fa-phone-alt ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                      ></i>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Phone</h4>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-600"}
                      >
                        +91 8097955190
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex items-start">
                    <div
                      className={`p-3 rounded-full mr-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                    >
                      <i
                        className={`fas fa-git ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                      ></i>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Website</h4>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-600"}
                      >
                        www.johndoe.com
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Follow Me</h3>
              <div className="flex space-x-4 mb-8">
                <a
                  href="https://github.com/naddo210"
                  className={`p-3 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110 ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  <i className="fab fa-github text-xl hover:text-blue-500 transition-colors duration-300"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/nadeem-salmani-42913934a/"
                  className={`p-3 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110 ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  <i className="fab fa-linkedin text-xl hover:text-blue-500 transition-colors duration-300"></i>
                </a>
              
               
              </div>
              {/* <div
                className={`rounded-lg overflow-hidden h-64 ${darkMode ? "border border-gray-700" : "border border-gray-200"}`}
              >
             <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.2165859273134!2d72.8972095!3d19.1335835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c7fff0000001%3A0x985f8b3e586b85ee!2sSunni%20Mohammadia%20Masjid!5e0!3m2!1sen!2sin!4v1719420429831!5m2!1sen!2sin"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Morarji nagar, powai"
></iframe>

              </div> */}
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer
        className={`py-10 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Nadeem Salmani</h3>
              <p className="text-gray-400">Full Stack Developer / Data Analyst</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-6 md:mb-0">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home");
                }}
                className="hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("about");
                }}
                className="hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              >
                About
              </a>
              <a
                href="#skills"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("skills");
                }}
                className="hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              >
                Skills
              </a>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("projects");
                }}
                className="hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              >
                Projects
              </a>
              <a
                href="#achievements"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("achievements");
                }}
                className="hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              >
                Achievements
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
                className="hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              >
                Contact
              </a>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              >
                <i className="fab fa-dribbble text-xl"></i>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 Nadeem Salmani. All rights reserved.
            </p>
          
          </div>
        </div>
        {/* Back to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-110 ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-white hover:bg-gray-100 text-gray-800"}`}
          aria-label="Back to top"
        >
          <i className="fas fa-arrow-up transition-transform duration-300 hover:-translate-y-1"></i>
        </button>
      </footer>
    </div>
    </>
  );
};
export default App;
