import React from "react";

const Programs = () => {
  const programs = [
    {
      branch: "Kalamboli Branch",
      location: "Main Branch",
      batches: [
        {
          type: "Weekday Batch",
          schedule: "Monday & Thursday",
          slots: [
            { time: "8-9 AM", level: "Beginner Level" },
            { time: "9-10 AM", level: "Advanced Level" },
          ],
        },
        {
          type: "Weekend Batch",
          schedule: "Saturday & Sunday",
          slots: [
            { time: "8-9 AM", level: "Beginner Level" },
            { time: "9-10 AM", level: "Advanced Level" },
          ],
        },
      ],
      features: [
        "Personal coach assignment",
        "Progress tracking",
        "Practice games",
        "Study materials",
      ],
    },
    {
      branch: "Kamothe Branch",
      location: "Associated with Vibe House Studio",
      batches: [
        {
          type: "Weekday Batch",
          schedule: "Monday & Thursday",
          slots: [
            { time: "8-9 AM", level: "Beginner Level" },
            { time: "9-10 AM", level: "Advanced Level" },
          ],
        },
        {
          type: "Weekend Batch",
          schedule: "Saturday & Sunday",
          slots: [
            { time: "8-9 AM", level: "Beginner Level" },
            { time: "9-10 AM", level: "Advanced Level" },
          ],
        },
      ],
      features: [
        "Group coaching",
        "Interactive sessions",
        "Game analysis",
        "Tournament prep",
      ],
    },
    {
      branch: "Roadpali Branch",
      location: "Associated with Rhythm Revolution Studio",
      batches: [
        {
          type: "Weekday Batch",
          schedule: "Monday & Thursday",
          slots: [
            { time: "8-9 AM", level: "Beginner Level" },
            { time: "9-10 AM", level: "Advanced Level" },
          ],
        },
        {
          type: "Weekend Batch",
          schedule: "Saturday & Sunday",
          slots: [
            { time: "8-9 AM", level: "Beginner Level" },
            { time: "9-10 AM", level: "Advanced Level" },
          ],
        },
      ],
      features: [
        "Professional coaching",
        "Tactical training",
        "Position analysis",
        "Opening theory",
      ],
    },
    {
      branch: "Online Mode",
      location: "Learn from Anywhere",
      batches: [
        {
          type: "Weekday Batch",
          schedule: "Monday & Thursday",
          slots: [
            { time: "8-9 AM", level: "Beginner Level" },
            { time: "9-10 AM", level: "Advanced Level" },
          ],
        },
        {
          type: "Weekend Batch",
          schedule: "Saturday & Sunday",
          slots: [
            { time: "8-9 AM", level: "Beginner Level" },
            { time: "9-10 AM", level: "Advanced Level" },
          ],
        },
      ],
      features: [
        "1-on-1 coaching",
        "Flexible timings",
        "Digital resources",
        "Online tournaments",
      ],
    },
  ];

  const getLevelColor = (branch) => {
    switch (branch) {
      case "Kalamboli Branch":
        return "from-green-500 to-emerald-600";
      case "Kamothe Branch":
        return "from-blue-500 to-cyan-600";
      case "Roadpali Branch":
        return "from-purple-500 to-violet-600";
      case "Online Mode":
        return "from-orange-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getLevelBorder = (branch) => {
    switch (branch) {
      case "Kalamboli Branch":
        return "border-green-500/30";
      case "Kamothe Branch":
        return "border-cyan-500/30";
      case "Roadpali Branch":
        return "border-purple-500/30";
      case "Online Mode":
        return "border-orange-500/30";
      default:
        return "border-gray-500/30";
    }
  };

  const handleEnrollClick = (branchName) => {
    const adminNumber = "+917039184939"; // Replace with actual admin number
    const message = `Hi! I am interested to join and learn chess at ${branchName}. Please provide me with more details about the programs and enrollment process.`;
    const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleScheduleClick = () => {
    const adminNumber = "+917039184939"; // Replace with actual admin number
    const message = `Hi! I am interested to join Free Consultation. Please provide me with more details about the programs and chess.`;
    const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="font-orbitron mb-8 text-5xl font-bold text-white md:text-6xl">
            TRAINING <span className="text-cyan-400">PROGRAMS</span>
          </h1>
          <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-gray-300">
            Choose your path to chess mastery with our scientifically designed
            curriculum. Each program is tailored to specific skill levels and
            learning objectives.
          </p>

          {/* Quick Level Guide */}
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-green-500/30 bg-black/50 p-4">
              <div className="font-bold text-green-400">Beginner</div>
              <div className="text-sm text-gray-400">0-1200 rating</div>
            </div>
            <div className="rounded-lg border border-cyan-500/30 bg-black/50 p-4">
              <div className="font-bold text-cyan-400">Intermediate</div>
              <div className="text-sm text-gray-400">1200-1800 rating</div>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-black/50 p-4">
              <div className="font-bold text-purple-400">Advanced</div>
              <div className="text-sm text-gray-400">1800-2200 rating</div>
            </div>
            <div className="rounded-lg border border-orange-500/30 bg-black/50 p-4">
              <div className="font-bold text-orange-400">Masterclass</div>
              <div className="text-sm text-gray-400">2200+ rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {programs.map((program, index) => (
              <div
                key={index}
                className={`border bg-black/50 backdrop-blur-sm ${getLevelBorder(program.branch)} hover-glow group flex h-full transform flex-col rounded-xl p-6 transition-all duration-300 hover:scale-105`}
              >
                {/* Card Content Container */}
                <div className="flex flex-grow flex-col">
                  {/* Program Header */}
                  <div className="mb-4">
                    <div
                      className={`inline-block bg-gradient-to-r ${getLevelColor(program.branch)} mb-3 rounded-full px-3 py-1 text-xs font-bold text-white`}
                    >
                      {program.branch}
                    </div>
                    <h3 className="font-orbitron mb-1 text-lg font-bold text-white">
                      {program.branch}
                    </h3>
                    <p className="text-sm text-gray-400">{program.location}</p>
                  </div>

                  {/* Batches & Schedule */}
                  <div className="mb-4 flex-grow">
                    {program.batches.map((batch, batchIndex) => (
                      <div key={batchIndex} className="mb-3">
                        <h4 className="mb-2 text-sm font-semibold text-cyan-400">
                          {batch.type}
                        </h4>
                        <div className="mb-2 text-sm text-white">
                          📅 {batch.schedule}
                        </div>
                        <div className="space-y-1">
                          {batch.slots.map((slot, slotIndex) => (
                            <div
                              key={slotIndex}
                              className="rounded-lg bg-gray-800/50 p-2"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-cyan-300">
                                  ⏰ {slot.time}
                                </span>
                                <span className="text-purple-300">
                                  {slot.level}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="font-orbitron mb-2 text-sm font-bold text-white">
                      What's Included
                    </h4>
                    <div className="space-y-1">
                      {program.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-xs text-gray-300"
                        >
                          <div className="mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA Button - Always at bottom */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleEnrollClick(program.branch)}
                    className={`w-full bg-gradient-to-r ${getLevelColor(program.branch)} hover-glow transform rounded-lg py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105`}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-gray-900/30 px-4 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-orbitron mb-8 text-3xl font-bold text-white">
            PROGRAM <span className="text-purple-400">BENEFITS</span>
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-cyan-500/30 bg-black/50 p-6">
              <div className="mb-4 text-4xl">🎯</div>
              <h3 className="font-orbitron mb-3 text-xl font-bold text-white">
                Personalized Learning
              </h3>
              <p className="text-gray-300">
                Every program is customized to your current skill level and
                learning pace
              </p>
            </div>
            <div className="rounded-xl border border-purple-500/30 bg-black/50 p-6">
              <div className="mb-4 text-4xl">🏆</div>
              <h3 className="font-orbitron mb-3 text-xl font-bold text-white">
                Proven Results
              </h3>
              <p className="text-gray-300">
                95% of our students achieve their target rating improvement
                within the program duration
              </p>
            </div>
            <div className="rounded-xl border border-cyan-500/30 bg-black/50 p-6">
              <div className="mb-4 text-4xl">🤝</div>
              <h3 className="font-orbitron mb-3 text-xl font-bold text-white">
                Lifetime Support
              </h3>
              <p className="text-gray-300">
                Access to our alumni network and continued guidance even after
                program completion
              </p>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={handleScheduleClick}
              className="hover-glow animate-pulse-glow rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white"
            >
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
