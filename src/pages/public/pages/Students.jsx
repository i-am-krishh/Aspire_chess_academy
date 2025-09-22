import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Star,
  Trophy,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Target,
} from "lucide-react";
import api from "../../../utils/api";
import { isValidImageUrl } from "../../../utils/imageUtils";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students from backend API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/api/students");

        // Filter only active students for public display
        const activeStudents = response.data.data.filter(
          (student) => student.isActive,
        );
        setStudents(activeStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError(
          "Failed to load student testimonials. Please try again later.",
        );
        // Fallback to empty array if API fails
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400"></div>
          <p className="ml-4 text-cyan-400">Loading student testimonials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-xl text-red-400">⚠️</div>
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-white transition-colors hover:bg-cyan-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            className="font-orbitron mb-8 text-5xl font-bold text-white md:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            OUR <span className="text-cyan-400">STUDENTS</span>
          </motion.h1>
          <motion.p
            className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-gray-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Meet the incredible students who have transformed their chess
            journey through our comprehensive training programs and achieved
            remarkable success.
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="hover-glow rounded-lg border border-cyan-500/30 bg-black/50 p-4">
              <div className="font-orbitron flex items-center justify-center text-2xl font-bold text-cyan-400">
                <Users className="mr-2 h-6 w-6" />
                500+
              </div>
              <div className="text-gray-400">Active Students</div>
            </div>
            <div className="hover-glow rounded-lg border border-purple-500/30 bg-black/50 p-4">
              <div className="font-orbitron flex items-center justify-center text-2xl font-bold text-purple-400">
                <Trophy className="mr-2 h-6 w-6" />
                50+
              </div>
              <div className="text-gray-400">Titled Players</div>
            </div>
            <div className="hover-glow rounded-lg border border-cyan-500/30 bg-black/50 p-4">
              <div className="font-orbitron flex items-center justify-center text-2xl font-bold text-cyan-400">
                <TrendingUp className="mr-2 h-6 w-6" />
                95%
              </div>
              <div className="text-gray-400">Improvement Rate</div>
            </div>
            <div className="hover-glow rounded-lg border border-purple-500/30 bg-black/50 p-4">
              <div className="font-orbitron flex items-center justify-center text-2xl font-bold text-purple-400">
                <Award className="mr-2 h-6 w-6" />
                200+
              </div>
              <div className="text-gray-400">Tournament Wins</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Students Grid */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {students.length > 0 ? (
              students.map((student, index) => (
                <motion.div
                  key={index}
                  className={`border bg-black/50 backdrop-blur-sm ${getTitleBorder(student.title)} hover-glow group rounded-xl p-6`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
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
                  <div className="mb-4 grid grid-cols-2 gap-3">
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
                  <div className="mb-4">
                    <p className="line-clamp-3 text-sm leading-relaxed text-gray-300 italic">
                      "{student.testimonial}"
                    </p>
                  </div>

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
                        {student.achievements[0]}
                      </motion.div>
                    </div>
                  </div>

                  {/* Join Date */}
                  <div className="text-center">
                    <div className="mb-1 flex items-center justify-center text-xs text-gray-400">
                      <Calendar className="mr-1 h-3 w-3" />
                      Joined
                    </div>
                    <div className="text-xs font-semibold text-white">
                      {student.joinDate}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <div className="mb-4 text-6xl">🎓</div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  No Student Testimonials Yet
                </h3>
                <p className="text-gray-300">
                  We're working on adding inspiring student success stories.
                  Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Success Philosophy */}
      <section className="bg-gray-900/30 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            className="font-orbitron mb-12 text-center text-4xl font-bold text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            STUDENT <span className="text-purple-400">SUCCESS FACTORS</span>
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              className="hover-glow rounded-xl border border-cyan-500/30 bg-black/50 p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Target className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
              <h3 className="font-orbitron mb-3 text-xl font-bold text-white">
                Personalized Goals
              </h3>
              <p className="text-gray-300">
                Each student receives customized training plans aligned with
                their specific chess goals and learning style.
              </p>
            </motion.div>
            <motion.div
              className="hover-glow rounded-xl border border-purple-500/30 bg-black/50 p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <TrendingUp className="mx-auto mb-4 h-12 w-12 text-purple-400" />
              <h3 className="font-orbitron mb-3 text-xl font-bold text-white">
                Consistent Progress
              </h3>
              <p className="text-gray-300">
                Regular assessments and feedback ensure steady improvement and
                help overcome rating plateaus effectively.
              </p>
            </motion.div>
            <motion.div
              className="hover-glow rounded-xl border border-cyan-500/30 bg-black/50 p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Users className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
              <h3 className="font-orbitron mb-3 text-xl font-bold text-white">
                Community Support
              </h3>
              <p className="text-gray-300">
                Strong peer network and mentorship create a supportive
                environment for learning and competitive growth.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          ></motion.div>
        </div>
      </section>
    </div>
  );
};

export default Students;
