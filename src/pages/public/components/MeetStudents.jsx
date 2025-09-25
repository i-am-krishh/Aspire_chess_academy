import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Star, Trophy, Eye, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { isValidImageUrl } from "../../../utils/imageUtils";
import api from "../../../utils/api";

const MeetStudents = ({ setCurrentPage }) => {
  const [featuredStudents, setFeaturedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch students from backend API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log("MeetStudents: Fetching students from API...");
        const response = await api.get("/api/students");
        console.log("MeetStudents: API response:", response.data);
        
        // Check if response has the expected structure
        if (!response.data || !response.data.success || !Array.isArray(response.data.data)) {
          throw new Error('Invalid API response structure');
        }
        
        const students = response.data.data;
        console.log("MeetStudents: Students data:", students);

        // Check if students array is valid
        if (!students || students.length === 0) {
          console.log("MeetStudents: No students found in database");
          setFeaturedStudents([]);
          return;
        }

        // Prioritize featured students, then take first 3
        const featuredStudents = students.filter((student) => student && student.featured);
        const regularStudents = students.filter((student) => student && !student.featured);
        const selectedStudents = [
          ...featuredStudents,
          ...regularStudents,
        ].slice(0, 3);
        console.log("MeetStudents: Selected students:", selectedStudents);

        const featured = selectedStudents.map((student, index) => ({
          name: student.name || 'Unknown Student',
          title: student.title || 'Student',
          program: student.program || 'Academy Student',
          rating: student.rating || '1200',
          peakRating: student.peakRating || student.rating || '1200',
          fideId: student.fideId || null,
          achievements: (student.achievements && student.achievements[0]) || "Academy Graduate",
          testimonial: student.testimonial || null,
          joinDate: student.joinDate || null,
          image: student.image || getDefaultImage(index),
          icon: getIconForIndex(index),
          color: getColorForIndex(index),
        }));

        console.log("MeetStudents: Final featured students:", featured);
        setFeaturedStudents(featured);
      } catch (error) {
        console.error("MeetStudents: Error fetching students:", error);
        console.error("MeetStudents: Error details:", error.response?.data);
        // Set empty array if API fails - only show database values
        console.log("MeetStudents: API failed, showing empty state");
        setFeaturedStudents([]);
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

  // Show empty state if no students from database
  if (!featuredStudents || featuredStudents.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gray-900/30 px-4 py-20">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="font-orbitron mb-6 text-4xl font-bold text-white md:text-5xl">
              MEET OUR <span className="text-purple-400">STUDENTS</span>
            </h2>
            <p className="mx-auto mb-4 max-w-3xl text-xl text-gray-300">
              We're currently updating our student showcase. Check back soon to see amazing student achievements!
            </p>
            <div className="flex items-center justify-center text-gray-400">
              <Users className="mr-2 h-8 w-8" />
              <span className="text-lg">No students to display at the moment</span>
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
          className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuredStudents.map((student, index) => {
            const getTitleColor = (title) => {
              if (title.includes("FIDE Master")) return "text-yellow-400";
              if (title.includes("National Champion")) return "text-cyan-400";
              if (title.includes("WIM")) return "text-purple-400";
              if (title.includes("Candidate Master")) return "text-green-400";
              return "text-gray-400";
            };

            const getTitleBorder = (title) => {
              if (title.includes("FIDE Master")) return "border-yellow-500/30";
              if (title.includes("National Champion")) return "border-cyan-500/30";
              if (title.includes("WIM")) return "border-purple-500/30";
              if (title.includes("Candidate Master")) return "border-green-500/30";
              return "border-gray-500/30";
            };

            return (
              <motion.div
                key={index}
                className={`border bg-black/50 backdrop-blur-sm ${getTitleBorder(student.title)} hover-glow group rounded-xl p-6`}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                {/* Student Header */}
                <div className="mb-4 flex flex-col items-center text-center">
                  <motion.div
                    className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-700"
                    whileHover={{ scale: 1.1 }}
                  >
                    {student.image && isValidImageUrl(student.image) ? (
                      <img
                        src={student.image}
                        alt={student.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-2xl text-gray-400">👤</div>
                    )}
                  </motion.div>
                  <h3 className="font-orbitron mb-1 text-lg font-bold text-white">
                    {student.name}
                  </h3>
                  <p
                    className={`${getTitleColor(student.title)} flex items-center justify-center text-sm font-semibold`}
                  >
                    <GraduationCap className="mr-1 h-3 w-3" />
                    {student.title}
                  </p>
                </div>

                {/* Ratings */}
                <div className={`mb-4 grid gap-3 ${student.fideId ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  <div className="text-center">
                    <div className="mb-1 text-xs text-gray-400">Current</div>
                    <div className="text-sm font-bold text-cyan-400">
                      {student.rating}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 text-xs text-gray-400">Peak</div>
                    <div className="text-sm font-bold text-purple-400">
                      {student.peakRating}
                    </div>
                  </div>
                  {student.fideId && (
                    <div className="text-center">
                      <div className="mb-1 text-xs text-gray-400">FIDE ID</div>
                      <div className="text-sm font-bold text-yellow-400">
                        {student.fideId}
                      </div>
                    </div>
                  )}
                </div>

                {/* Program */}
                <div className="mb-4">
                  <div className="rounded-lg border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 px-3 py-2 text-center">
                    <div className="text-xs font-semibold text-cyan-400">
                      {student.program}
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                {student.testimonial && (
                  <div className="mb-4">
                    <p className="line-clamp-3 text-sm leading-relaxed text-gray-300 italic text-center">
                      "{student.testimonial}"
                    </p>
                  </div>
                )}

                {/* Key Achievement */}
                <div className="mb-4">
                  <h4 className="font-orbitron mb-2 flex items-center justify-center text-sm font-bold text-white">
                    <Trophy className="mr-1 h-4 w-4 text-yellow-400" />
                    Top Achievement
                  </h4>
                  <div className="rounded-lg bg-gray-800/50 p-2">
                    <motion.div
                      className="flex items-start text-xs text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                    >
                      <Star className="mt-0.5 mr-2 h-3 w-3 flex-shrink-0 text-cyan-400" />
                      {student.achievements}
                    </motion.div>
                  </div>
                </div>

                {/* Join Date */}
                {student.joinDate && (
                  <div className="text-center">
                    <div className="mb-1 flex items-center justify-center text-xs text-gray-400">
                      <Calendar className="mr-1 h-3 w-3" />
                      Joined
                    </div>
                    <div className="text-xs font-semibold text-white">
                      {student.joinDate}
                    </div>
                  </div>
                )}
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
