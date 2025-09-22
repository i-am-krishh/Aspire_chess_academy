import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Star, Trophy, Eye, Users } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { isValidImageUrl } from "../../../utils/imageUtils.jsx";

const MeetStudents = ({ setCurrentPage }) => {
  const [featuredStudents, setFeaturedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch students from backend API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log("MeetStudents: Fetching students from API...");
        const response = await axios.get("/api/students");
        console.log("MeetStudents: API response:", response.data);
        const students = response.data.data;
        console.log("MeetStudents: Students data:", students);

        // Prioritize featured students, then take first 3
        const featuredStudents = students.filter((student) => student.featured);
        const regularStudents = students.filter((student) => !student.featured);
        const selectedStudents = [
          ...featuredStudents,
          ...regularStudents,
        ].slice(0, 3);
        console.log("MeetStudents: Selected students:", selectedStudents);

        const featured = selectedStudents.map((student, index) => ({
          name: student.name,
          title: student.title,
          program: student.program,
          rating: student.rating,
          achievements: student.achievements[0] || "Academy Graduate",
          image: student.image || getDefaultImage(index),
          icon: getIconForIndex(index),
          color: getColorForIndex(index),
        }));

        console.log("MeetStudents: Final featured students:", featured);
        setFeaturedStudents(featured);
      } catch (error) {
        console.error("MeetStudents: Error fetching students:", error);
        console.error("MeetStudents: Error details:", error.response?.data);
        // Fallback to static data if API fails
        console.log("MeetStudents: Using fallback data");
        setFeaturedStudents(getFallbackStudents());
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [refreshKey]);

  const getDefaultImage = (index) => {
    const images = ["👨‍🎓", "👩‍🎓", "👨‍💼", "👩‍💼"];
    return images[index % images.length];
  };

  const getIconForIndex = (index) => {
    const icons = [Trophy, Star, GraduationCap];
    return icons[index % icons.length];
  };

  const getColorForIndex = (index) => {
    const colors = [
      "from-yellow-500 to-orange-600",
      "from-cyan-500 to-blue-600",
      "from-purple-500 to-pink-600",
    ];
    return colors[index % colors.length];
  };

  const getFallbackStudents = () => [
    {
      name: "David Rodriguez",
      title: "FIDE Master",
      program: "Elite Training Graduate",
      rating: "2380",
      achievements: "Gained 400 rating points in 18 months",
      image: "👨‍🎓",
      icon: Trophy,
      color: "from-yellow-500 to-orange-600",
    },
    {
      name: "Emma Thompson",
      title: "National Champion",
      program: "Tactical Mastery Graduate",
      rating: "2150",
      achievements: "Won National Championship",
      image: "👩‍🎓",
      icon: Star,
      color: "from-cyan-500 to-blue-600",
    },
    {
      name: "Alex Kim",
      title: "Candidate Master",
      program: "Foundation to Elite Journey",
      rating: "2050",
      achievements: "0 to 2050 rating in 2 years",
      image: "👨‍💼",
      icon: GraduationCap,
      color: "from-purple-500 to-pink-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, rotateY: -15 },
    visible: {
      y: 0,
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gray-900/30 px-4 py-20">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="font-orbitron mb-6 text-4xl font-bold text-white md:text-5xl">
              MEET OUR <span className="text-purple-400">STUDENTS</span>
            </h2>
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-400"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gray-900/30 px-4 py-20">
      {/* Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "radial-gradient(circle, #00d4ff 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="font-orbitron mb-6 text-4xl font-bold text-white md:text-5xl"
            animate={{
              textShadow: [
                "0 0 10px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(139, 92, 246, 0.8)",
                "0 0 10px rgba(139, 92, 246, 0.5)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            MEET OUR <span className="text-purple-400">STUDENTS</span>
          </motion.h2>
          <p className="mx-auto mb-4 max-w-3xl text-xl text-gray-300">
            Discover the incredible journeys of our students who have
            transformed their chess skills and achieved remarkable success
            through our comprehensive training programs.
          </p>
          {/* <button
            onClick={() => {
              setLoading(true)
              setRefreshKey(prev => prev + 1)
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Refresh Students
          </button> */}
        </motion.div>

        {/* Students Grid */}
        <motion.div
          className="mb-12 grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuredStudents.map((student, index) => {
            const IconComponent = student.icon;
            return (
              <motion.div
                key={index}
                className="hover-glow group relative cursor-pointer overflow-hidden rounded-xl border border-purple-500/30 bg-black/50 p-6 backdrop-blur-sm"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background Gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${student.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                  initial={{ scale: 0, rotate: 45 }}
                  whileHover={{ scale: 1.5, rotate: 0 }}
                />

                {/* Student Avatar */}
                <div className="relative mb-6 text-center">
                  <motion.div
                    className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-700"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    {student.image && isValidImageUrl(student.image) ? (
                      <img
                        src={student.image}
                        alt={student.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl text-gray-400">👤</div>
                    )}
                    <motion.div
                      className="absolute -top-2 -right-2 text-purple-400"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="h-6 w-6" />
                    </motion.div>
                  </motion.div>

                  <h3 className="font-orbitron mb-1 text-xl font-bold text-white">
                    {student.name}
                  </h3>
                  <motion.p
                    className="mb-2 flex items-center justify-center font-semibold text-purple-400"
                    whileHover={{ scale: 1.05 }}
                  >
                    <GraduationCap className="mr-1 h-4 w-4" />
                    {student.title}
                  </motion.p>
                  <p className="text-sm text-gray-300">{student.program}</p>
                </div>

                {/* Stats */}
                <div className="mb-6 space-y-3">
                  <motion.div
                    className="flex items-center justify-between rounded-lg bg-gray-800/30 p-2"
                    whileHover={{ backgroundColor: "rgba(0, 212, 255, 0.1)" }}
                  >
                    <span className="flex items-center text-gray-400">
                      <Star className="mr-1 h-4 w-4" />
                      Rating:
                    </span>
                    <motion.span
                      className="font-bold text-cyan-400"
                      animate={{
                        textShadow: [
                          "0 0 5px #00d4ff",
                          "0 0 10px #00d4ff",
                          "0 0 5px #00d4ff",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    >
                      {student.rating}
                    </motion.span>
                  </motion.div>
                  <div className="rounded-lg bg-purple-500/10 p-2 text-center">
                    <div className="mb-1 flex items-center justify-center text-sm text-gray-400">
                      <Trophy className="mr-1 h-3 w-3" />
                      Achievement:
                    </div>
                    <div className="text-sm font-semibold text-purple-400">
                      {student.achievements}
                    </div>
                  </div>
                </div>

                {/* View Profile Button */}
                {/* <motion.button 
                  className="w-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400 text-purple-400 py-2 rounded-lg font-semibold hover:from-purple-500 hover:to-cyan-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Story
                </motion.button> */}
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Students CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/Students">
            <motion.button
              onClick={() => setCurrentPage("students")}
              className="hover-glow animate-pulse-glow mx-auto flex items-center rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 text-lg font-semibold text-white"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(139, 92, 246, 0.8)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="mr-2 h-5 w-5" />
              Meet All Our Students
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MeetStudents;
