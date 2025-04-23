import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BookOpen,
  Code,
  Database,
  LineChart,
  Github,
  Linkedin,
} from "lucide-react";

// Import profile image
import profilePhoto from "../../../assets/profile.jpg";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-800 to-gray-900 py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Kusal Sai Ayinala
                </h2>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-300">
                  Data Analyst & Programmer
                </h2>
                <p className="text-lg leading-relaxed mb-8 text-gray-400">
                  Data Analyst with 2+ years of experience in the healthcare
                  industry, skilled in data visualization, SQL, Python, Power BI
                  and Tableau. Passionate about leveraging data-driven
                  strategies to optimize efficiency.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="#contact-section">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Me
                    </Button>
                  </a>
                  <a href="/KUSAL SAI_Ayinala.pdf" download>
                    <Button
                      variant="outline"
                      className="border-indigo-600 text-indigo-400 hover:bg-indigo-900/20"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Resume
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div 
                  className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-indigo-600 shadow-xl shadow-indigo-900/30"
                  style={{ 
                    display: "flex",
                    alignItems: "center", 
                    justifyContent: "center",
                    position: "relative"
                  }}
                >
                  <img
                    src={profilePhoto}
                    alt="Kusal Sai Ayinala"
                    style={{ 
                      position: "absolute",
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      objectPosition: "center 30%",
                      top: "0",
                      left: "0"
                    }}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gray-800 px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">
                      Available for Work
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent inline-block">
              About Me
            </h2>
            <div className="h-1 w-20 bg-indigo-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-400 flex items-center">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Information
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Mail className="mr-3 h-5 w-5 text-gray-400" />
                    <span className="text-gray-400">kusalsai1234@gmail.com</span>
                  </li>
                  <li className="flex items-center">
                    <Phone className="mr-3 h-5 w-5 text-gray-400" />
                    <span className="text-gray-400">+1 (940) 331-8321</span>
                  </li>
                  <li className="flex items-center">
                    <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                    <span className="text-gray-400">Denton, Texas</span>
                  </li>
                  <li className="flex items-center">
                    <Github className="mr-3 h-5 w-5 text-gray-400" />
                    <span className="text-gray-400">github.com</span>
                  </li>
                  <li className="flex items-center">
                    <Linkedin className="mr-3 h-5 w-5 text-gray-400" />
                    <span className="text-gray-400">linkedin.com/in/kusal-sai-ayinala-0895b2181</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-400 flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Education
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-sm text-gray-400">MS in Data Science</h4>

                      <Badge className="bg-indigo-900 text-indigo-200">
                        2024-2025
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      University of North Texas, Denton, TX, USA
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Courses: Applied Machine Learning for Data science, Data
                      Mining, Data Analysis
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-sm text-gray-400">
                        Bachelor of Technology in Electronics & Communication
                        Engineering
                      </h4>
                      <Badge className="bg-indigo-900 text-indigo-200">
                        2017-2021
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">JNTUA, AP, India</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Courses: Electronic & Devices, Signals & Systems,
                      Probability & Statistics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent inline-block">
              Technical Skills
            </h2>
            <div className="h-1 w-20 bg-indigo-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700 hover:border-indigo-600 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-400 flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  Programming Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    Python
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    SQL
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    C
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    JavaScript
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    HTML
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    CSS
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-indigo-600 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-400 flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Tools & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    MySQL
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    MongoDB
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    Power BI
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    Tableau
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    VS Code
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    Jupyter
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    IBM ACE
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    IBM BAW
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    Postman
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-indigo-600 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-400 flex items-center">
                  <LineChart className="mr-2 h-5 w-5" />
                  Data Science
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    RAG
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    Llama index
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    Pandas
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    NumPy
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    Matplotlib
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    Scikit-learn
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    TensorFlow
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    Beautifulsoup
                  </Badge>
                  <Badge className="bg-gray-700 hover:bg-indigo-900 transition-colors">
                    Agile
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent inline-block">
              Work Experience
            </h2>
            <div className="h-1 w-20 bg-indigo-600 mx-auto"></div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-indigo-600"></div>

              {/* Experience 1 */}
              <div className="relative pl-12 mb-12">
                <div className="absolute left-0 top-1 w-10 h-10 bg-gray-900 border-2 border-indigo-600 rounded-full flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-indigo-400" />
                </div>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-indigo-400">
                        Data Analyst
                      </h3>
                      <Badge className="bg-indigo-900 text-indigo-200">
                        March 2023 – Jan 2024
                      </Badge>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Cognizant Technology Solutions | Hyderabad, India
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      <li>
                        Analyzed and processed large healthcare datasets using
                        SQL, Tableau, and Python.
                      </li>
                      <li>
                        Designed and developed interactive dashboards using
                        Power BI & Tableau to track key performance metrics.
                      </li>
                      <li>
                        Identified trends and patterns in medical claims data,
                        leading to a 15% reduction in processing errors.
                      </li>
                      <li>
                        Automated data cleaning processes, reducing manual
                        effort by 30%.
                      </li>
                      <li>
                        Conducted data storytelling to present findings to
                        stakeholders and enhance decision-making.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Experience 2 */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-10 h-10 bg-gray-900 border-2 border-indigo-600 rounded-full flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-indigo-400" />
                </div>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-indigo-400">
                        Programmer Analyst
                      </h3>
                      <Badge className="bg-indigo-900 text-indigo-200">
                        Oct 2021 – Feb 2022
                      </Badge>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Cognizant Technology Solutions | Hyderabad, India
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      <li>
                        Integrated multiple APIs to connect disparate systems
                        for data exchange and automation.
                      </li>
                      <li>
                        Developed and tested RESTful APIs using Postman, IBM
                        ACE, and IBM BAW.
                      </li>
                      <li>
                        Optimized data pipelines, improving system efficiency by
                        20%.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent inline-block">
              Projects
            </h2>
            <div className="h-1 w-20 bg-indigo-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Card className="bg-gray-800 border-gray-700 h-full hover:border-indigo-600 transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-indigo-400">
                    Open AI Tutor
                  </h3>
                  <p className="text-gray-300 mb-4">
                    An AI-powered tutoring system for classroom assistance using
                    advanced NLP techniques.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-6">
                    <li>
                      Designed a Open AI tutor using student notes, analyzed,
                      pre-processed and parsed it using schematic chunking.
                    </li>
                    <li>
                      Used RAG for search engine query and trained using Llama
                      index.
                    </li>
                    <li>
                      Stored all the nodes in Chroma db for efficient retrieval.
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-indigo-900/50">LLM</Badge>
                    <Badge className="bg-indigo-900/50">RAG</Badge>
                    <Badge className="bg-indigo-900/50">Llama Index</Badge>
                    <Badge className="bg-indigo-900/50">Chroma DB</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Card className="bg-gray-800 border-gray-700 h-full hover:border-indigo-600 transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-indigo-400">
                    Healthcare Analytics Dashboard
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Interactive visualization tool for hospital patient data
                    analysis and resource optimization.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-6">
                    <li>
                      Designed and developed interactive Tableau dashboard to
                      analyze hospital patient data.
                    </li>
                    <li>
                      Integrated predictive analytics models to forecast patient
                      admissions with 85% accuracy.
                    </li>
                    <li>
                      Conducted data-driven insights on patient demographics,
                      treatment effectiveness, and readmission rates.
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-indigo-900/50">Tableau</Badge>
                    <Badge className="bg-indigo-900/50">
                      Predictive Analytics
                    </Badge>
                    <Badge className="bg-indigo-900/50">Healthcare Data</Badge>
                    <Badge className="bg-indigo-900/50">
                      Data Visualization
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent inline-block">
              Get In Touch
            </h2>
            <div className="h-1 w-20 bg-indigo-600 mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              I'm currently available for freelance work or full-time positions. Don't hesitate to reach out using your preferred contact method.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-indigo-400">Contact Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2 text-gray-200">Email</h4>
                    <a href="mailto:kusalsai1234@gmail.com" className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center">
                      <Mail className="mr-2 h-5 w-5" />
                      kusalsai1234@gmail.com
                    </a>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2 text-gray-200">Location</h4>
                    <p className="text-gray-400 flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      Denton, Texas
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2 text-gray-200">Phone</h4>
                    <a href="tel:+19403318321" className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center">
                      <Phone className="mr-2 h-5 w-5" />
                      +1 9403318321
                    </a>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2 text-gray-200">Social Profiles</h4>
                    <div className="flex space-x-4">
                      <a href="https://linkedin.com/in/kusal-sai-ayinala-0895b2181" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors">
                        <Linkedin className="h-6 w-6" />
                      </a>
                      <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors">
                        <Github className="h-6 w-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-indigo-400">Send Message</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-500 text-gray-200"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-500 text-gray-200"
                      placeholder="Your Email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                    <textarea
                      className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-500 text-gray-200 h-32"
                      placeholder="Your Message"
                    ></textarea>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 w-full py-6">
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">
              &copy; 2024 Kusal Sai Ayinala. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="https://github.com/"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/kusal-sai-ayinala-0895b2181"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:kusalsai1234@gmail.com"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;