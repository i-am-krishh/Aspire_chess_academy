import React from "react";

const About = () => {
  const milestones = [
    {
      year: "FEB 2023",
      event: "Academy Founded",
      description:
        "Established by ACM Sagar Ghule with a vision to revolutionize chess education. Conducting online sessions with just a few passionate students",
    },
    {
      year: "Nov 2023",
      event: "First Physical Branch - Kalamboli",
      description:
        "The love and trust we received inspired us to step into the offline world, opening our first branch.",
    },
    {
      year: "May 2024",
      event: "Second Branch - Kamothe",
      description:
        "Fueled by growing interest and strong results, we expanded further with a new branch.",
    },
    {
      year: "Jul 2024",
      event: "Third Branch - Roadpali",
      description:
        "Another milestone achieved with the opening of the Roadpali branch.",
    },
    {
      year: "2023–2024",
      event: "Student Achievements",
      description:
        "Mentored 5 internationally rated players, with numerous victories and podium finishes across inter-school, zonal, and state-level tournaments.",
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="font-orbitron mb-8 text-5xl font-bold text-white md:text-6xl">
            ABOUT <span className="text-cyan-400">Aspire Chess Academy</span>
          </h1>
          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-300">
            The Aspire Chess Academy represents the pinnacle of chess education,
            where traditional mastery meets cutting-edge technology to create
            the ultimate learning environment for aspiring champions.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-gray-900/30 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-orbitron mb-6 text-3xl font-bold text-white">
                OUR <span className="text-purple-400">PHILOSOPHY</span>
              </h2>
              <p className="mb-6 leading-relaxed text-gray-300">
                We believe that chess mastery is not just about memorizing moves
                or calculating variations. True excellence comes from
                understanding the deeper patterns, developing intuition, and
                cultivating the mental discipline required to perform under
                pressure.
              </p>
              <p className="mb-6 leading-relaxed text-gray-300">
                Our methodology combines classical chess principles with modern
                psychological training, AI-powered analysis, and personalized
                coaching to accelerate learning and maximize potential.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 h-3 w-3 rounded-full bg-cyan-400"></div>
                  <span className="text-gray-300">
                    Personalized learning paths for every student
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 h-3 w-3 rounded-full bg-purple-400"></div>
                  <span className="text-gray-300">
                    Integration of technology and traditional methods
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 h-3 w-3 rounded-full bg-cyan-400"></div>
                  <span className="text-gray-300">
                    Focus on mental resilience and competitive psychology
                  </span>
                </div>
              </div>
            </div>
            <div className="hover-glow rounded-xl border border-cyan-500/30 bg-black/50 p-8">
              <div className="text-center">
                <div className="mb-6 text-6xl">🏆</div>
                <h3 className="font-orbitron mb-4 text-2xl font-bold text-white">
                  Excellence Standard
                </h3>
                <p className="mb-6 text-gray-300">
                  Every program is designed to not just improve your chess, but
                  to develop the mindset and discipline of a true champion.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">98%</div>
                    <div className="text-sm text-gray-400">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">15</div>
                    <div className="text-sm text-gray-400">Expert Coaches</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-orbitron mb-16 text-center text-4xl font-bold text-white">
            OUR <span className="text-cyan-400">JOURNEY</span>
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 h-full w-1 -translate-x-1/2 transform bg-gradient-to-b from-cyan-400 to-purple-600"></div>

            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`mb-12 flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div
                  className={`w-5/12 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}
                >
                  <div className="hover-glow rounded-xl border border-cyan-500/30 bg-black/50 p-6">
                    <div className="font-orbitron mb-2 text-2xl font-bold text-cyan-400">
                      {milestone.year}
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white">
                      {milestone.event}
                    </h3>
                    <p className="text-gray-300">{milestone.description}</p>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="flex w-2/12 justify-center">
                  <div className="glow-blue h-6 w-6 rounded-full border-4 border-black bg-gradient-to-r from-cyan-400 to-purple-600"></div>
                </div>

                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Section */}
      <section className="bg-gray-900/30 px-4 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-orbitron mb-8 text-4xl font-bold text-white">
            STATE-OF-THE-ART <span className="text-purple-400">FACILITY</span>
          </h2>
          <p className="mx-auto mb-12 max-w-4xl text-xl text-gray-300">
            Our headquarters features cutting-edge training rooms, advanced
            analysis stations, and a tournament-grade playing hall designed to
            optimize learning and performance.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="hover-glow rounded-xl border border-purple-500/30 bg-black/50 p-6">
              <div className="mb-4 text-4xl">🖥️</div>
              <h3 className="font-orbitron mb-3 text-xl font-bold text-white">
                Analysis Lab
              </h3>
              <p className="text-gray-300">
                High-performance computers running the latest chess engines for
                deep position analysis
              </p>
            </div>
            <div className="hover-glow rounded-xl border border-cyan-500/30 bg-black/50 p-6">
              <div className="mb-4 text-4xl">🏛️</div>
              <h3 className="font-orbitron mb-3 text-xl font-bold text-white">
                Tournament Hall
              </h3>
              <p className="text-gray-300">
                Professional tournament conditions with DGT boards and live
                streaming capabilities
              </p>
            </div>
            <div className="hover-glow rounded-xl border border-purple-500/30 bg-black/50 p-6">
              <div className="mb-4 text-4xl">📚</div>
              <h3 className="font-orbitron mb-3 text-xl font-bold text-white">
                Chess Library
              </h3>
              <p className="text-gray-300">
                Extensive collection of chess literature and digital resources
                for research
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
