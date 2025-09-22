import React, { useState } from "react";
import api from "../../../utils/api";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    branch: 'Kalamboli',
    experience: 'Beginner',
    preferredProgram: '',
    message: '',
    newsletter: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const enrollmentData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        branch: formData.branch,
        age: formData.age ? parseInt(formData.age) : undefined,
        experience: formData.experience,
        message: `Goals & Experience: ${formData.message}\nPreferred Program: ${formData.preferredProgram}\nNewsletter: ${formData.newsletter ? 'Yes' : 'No'}`
      };

      await api.post('/api/enrollments', enrollmentData);
      
      toast.success('Enrollment application submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        branch: 'Kalamboli',
        experience: 'Beginner',
        preferredProgram: '',
        message: '',
        newsletter: false
      });
      
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit enrollment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const contactInfo = [
    {
      icon: "📞",
      title: "Call Us",
      details: [
        "+91 70391 84939",
        "Mon-Fri: 9AM-8PM IST",
      ],
    },
    {
      icon: "✉️",
      title: "Email Us",
      details: [
        "info@aspirechessacademy.com",
        "admissions@aspirechessacademy.com",
        "support@aspirechessacademy.com",
      ],
    },
  ];

  const branches = [
    {
      name: "Kalamboli (Main Branch)",
      address: [
        "Shop No 7, Sai Nagar Society",
        "K Town Facilities, Plot No 26",
        "Sai Nagar, Sector 4, Kalamboli",
        "Panvel, Navi Mumbai, Maharashtra 410218"
      ],
      mapUrl: "https://www.google.com/maps/place/Aspire+Chess+Academy/data=!4m2!3m1!1s0x0:0xdb045be656f3194a?sa=X&ved=1t:2428&ictx=111",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.234567890123!2d73.1234567!3d19.0234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xdb045be656f3194a!2sAspire%20Chess%20Academy!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
    },
    {
      name: "Kamothe (Associated with Vibe House Studio)",
      address: [
        "BLOCK-A, TODAY SHIVAM, Shop No: 01",
        "Plot no: 13, Today Shivam Building Sector-21",
        "opp. TJSB Bank Khandeshwar, Greater Khanda Link Rd",
        "Kamothe, Navi Mumbai, Maharashtra 410209"
      ],
      mapUrl: "https://www.google.com/maps/place/Vibe+House+-+Dance+%26+Fitness/@19.0131662,73.091058,16.15z/data=!4m14!1m7!3m6!1s0x3be7e9ee74ea4fdd:0xdf98271e64461406!2sVibe+House+-+Dance+%26+Fitness!8m2!3d19.0126039!4d73.0968785!16s%2Fg%2F11q_89dpcl!3m5!1s0x3be7e9ee74ea4fdd:0xdf98271e64461406!8m2!3d19.0126039!4d73.0968785!16s%2Fg%2F11q_89dpcl?entry=ttu&g_ep=EgoyMDI1MDcyMy4wIKXMDSoASAFQAw%3D%3D",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.123456789012!2d73.0968785!3d19.0126039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e9ee74ea4fdd%3A0xdf98271e64461406!2sVibe%20House%20-%20Dance%20%26%20Fitness!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
    },
    {
      name: "Roadpali (Associated with Rhythm Revolution Studio)",
      address: [
        "Shop No. 3, Prestone Building",
        "Plot No. 25 Sector 20",
        "Roadpali, Maharashtra 410218"
      ],
      mapUrl: "https://www.google.com/maps/place/Rhythm+Revolution+Studio/@19.0370174,73.0921351,17.54z/data=!4m6!3m5!1s0x3be7e975f1bcacc1:0x7c98234efcc8a2b3!8m2!3d19.036373!4d73.0915522!16s%2Fg%2F11vwt17xyq?entry=ttu&g_ep=EgoyMDI1MDcyMy4wIKXMDSoASAFQAw%3D%3D",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.987654321098!2d73.0915522!3d19.036373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e975f1bcacc1%3A0x7c98234efcc8a2b3!2sRhythm%20Revolution%20Studio!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="font-orbitron mb-8 text-5xl font-bold text-white md:text-6xl">
            START YOUR <span className="text-cyan-400">JOURNEY</span>
          </h1>
          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-300">
            Ready to elevate your chess game? Get in touch with our team to
            discuss your goals and find the perfect program for your chess
            journey.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="hover-glow rounded-2xl border border-cyan-500/30 bg-black/50 p-8 backdrop-blur-sm">
              <h2 className="font-orbitron mb-8 text-3xl font-bold text-white">
                ENROLLMENT <span className="text-purple-400">FORM</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-gray-300">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-500/30 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-cyan-400 focus:outline-none"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-gray-300">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-500/30 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-cyan-400 focus:outline-none"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-gray-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-500/30 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-cyan-400 focus:outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-gray-300">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-500/30 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-cyan-400 focus:outline-none"
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-gray-300">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="4"
                      max="100"
                      className="w-full rounded-lg border border-gray-500/30 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-cyan-400 focus:outline-none"
                      placeholder="Enter age"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-gray-300">
                      Preferred Branch *
                    </label>
                    <select 
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-500/30 bg-gray-900/50 px-4 py-3 text-white transition-colors focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Kalamboli">Kalamboli (Main Branch)</option>
                      <option value="Kamothe">Kamothe</option>
                      <option value="Roadpali">Roadpali</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-gray-300">
                      Current Chess Experience
                    </label>
                    <select 
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-500/30 bg-gray-900/50 px-4 py-3 text-white transition-colors focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-gray-300">
                    Preferred Program
                  </label>
                  <select 
                    name="preferredProgram"
                    value={formData.preferredProgram}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-500/30 bg-gray-900/50 px-4 py-3 text-white transition-colors focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="">Select a program</option>
                    <option value="foundation">Foundation Program</option>
                    <option value="tactical">Tactical Mastery</option>
                    <option value="elite">Elite Training</option>
                    <option value="professional">Professional Track</option>
                    <option value="private">Private Coaching</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-gray-300">
                    Chess Goals & Experience
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full resize-none rounded-lg border border-gray-500/30 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-cyan-400 focus:outline-none"
                    placeholder="Tell us about your chess background, goals, and what you hope to achieve..."
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="newsletter"
                    id="newsletter"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 rounded border-gray-500 bg-gray-900 text-cyan-400 focus:ring-cyan-400"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-300">
                    I would like to receive chess tips, tournament updates, and
                    academy news via email.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="hover-glow animate-pulse-glow w-full transform rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Enrollment Application'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="hover-glow rounded-2xl border border-purple-500/30 bg-black/50 p-8 backdrop-blur-sm">
                <h3 className="font-orbitron mb-6 text-2xl font-bold text-white">
                  GET IN <span className="text-cyan-400">TOUCH</span>
                </h3>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="text-3xl">{info.icon}</div>
                      <div>
                        <h4 className="mb-2 font-semibold text-white">
                          {info.title}
                        </h4>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-300">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branch Locations */}
              <div className="hover-glow rounded-2xl border border-cyan-500/30 bg-black/50 p-8 backdrop-blur-sm">
                <h3 className="font-orbitron mb-6 text-2xl font-bold text-white">
                  OUR <span className="text-purple-400">BRANCHES</span>
                </h3>
                <p className="mb-6 text-sm text-gray-300">
                  Total Branches: 3 + 1 (Exclusive)
                </p>

                <div className="space-y-6">
                  {branches.map((branch, index) => (
                    <div key={index} className="rounded-lg border border-gray-600/30 bg-gray-800/30 p-4">
                      <h4 className="mb-3 font-semibold text-cyan-400">
                        {branch.name}
                      </h4>
                      <div className="mb-3">
                        {branch.address.map((line, idx) => (
                          <p key={idx} className="text-sm text-gray-300">
                            {line}
                          </p>
                        ))}
                      </div>
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        📍 View on Google Maps
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Maps Section */}
      <section className="px-4 py-16 bg-gray-900/20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-orbitron mb-12 text-center text-4xl font-bold text-white">
            LOCATE OUR <span className="text-cyan-400">BRANCHES</span>
          </h2>

          <div className="grid gap-8 lg:grid-cols-1 xl:grid-cols-2">
            {branches.map((branch, index) => (
              <div key={index} className="hover-glow rounded-2xl border border-cyan-500/30 bg-black/50 p-6 backdrop-blur-sm">
                <h3 className="font-orbitron mb-4 text-xl font-bold text-white">
                  {branch.name}
                </h3>
                
                <div className="mb-4">
                  {branch.address.map((line, idx) => (
                    <p key={idx} className="text-sm text-gray-300">
                      {line}
                    </p>
                  ))}
                </div>

                {/* Interactive Map */}
                <div className="relative overflow-hidden rounded-lg border border-gray-600/30">
                  <iframe
                    src={branch.embedUrl}
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                    title={`Map of ${branch.name}`}
                  ></iframe>
                </div>

                <div className="mt-4 flex gap-3">
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 py-2 px-4 text-center text-sm text-cyan-400 hover:from-cyan-500/30 hover:to-purple-600/30 transition-all duration-300"
                  >
                    🗺️ Open in Google Maps
                  </a>
                  <button 
                    onClick={() => navigator.share && navigator.share({
                      title: branch.name,
                      text: `Visit ${branch.name}`,
                      url: branch.mapUrl
                    })}
                    className="rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-600/20 border border-purple-500/30 py-2 px-4 text-sm text-purple-400 hover:from-purple-500/30 hover:to-cyan-600/30 transition-all duration-300"
                  >
                    📤 Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-900/30 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-orbitron mb-12 text-center text-4xl font-bold text-white">
            FREQUENTLY ASKED <span className="text-purple-400">QUESTIONS</span>
          </h2>

          <div className="space-y-6">
            {[
              {
                question: "What skill level do I need to join?",
                answer:
                  "We welcome students of all levels, from complete beginners to advanced players. Our assessment process helps us place you in the most appropriate program.",
              },
              {
                question: "Are classes available online?",
                answer:
                  "Yes! We offer both in-person and online training options. Our online platform provides the same high-quality instruction with interactive tools and personalized feedback.",
              },
              {
                question: "What is the student-to-coach ratio?",
                answer:
                  "We maintain small class sizes with a maximum 6:1 student-to-coach ratio for group sessions, ensuring personalized attention for every student.",
              },
              {
                question: "Do you offer trial lessons?",
                answer:
                  "Absolutely! We provide a free 30-minute consultation and trial lesson so you can experience our teaching methodology before enrolling.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="hover-glow rounded-xl border border-gray-500/30 bg-black/50 p-6"
              >
                <h3 className="font-orbitron mb-3 text-lg font-bold text-white">
                  {faq.question}
                </h3>
                <p className="leading-relaxed text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
