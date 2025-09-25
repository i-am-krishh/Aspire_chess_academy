import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronRight,
  Trophy,
  Users,
  Calendar,
  BookOpen,
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Tournaments", href: "/tournaments" },
    { name: "Students", href: "/students" },
    { name: "Contact", href: "/contact" },
    { name: "Login", href: "/dashboard" }
  ];

  // const programs = [
  //   { name: "Beginner Level", href: "/programs#beginner" },
  //   { name: "Intermediate", href: "/programs#intermediate" },
  //   { name: "Advanced", href: "/programs#advanced" },
  //   { name: "Private Coaching", href: "/programs#private" },
  //   { name: "Online Classes", href: "/programs#online" },
  // ];

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-blue-400" },
    { icon: Instagram, href: "https://www.instagram.com/aspirechess?igsh=MTdmNnpld29pZmVtcQ==", color: "hover:text-pink-400" },
    { icon: Youtube, href: "#", color: "hover:text-red-400" },
  ];

  return (
    <footer className="border-t border-cyan-500/30 bg-black/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Main Footer Content */}
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h3 className="font-orbitron mb-4 text-2xl font-bold text-white">
                <span className="text-cyan-400">ASPIRE</span> CHESS ACADEMY
              </h3>
              <p className="leading-relaxed text-gray-300">
                Forging tomorrow's grandmasters through cutting-edge training
                and timeless strategy. Join the elite ranks of chess excellence.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="mr-3 h-4 w-4 text-cyan-400" />
                <span className="text-sm">info@aspirechess.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="mr-3 h-4 w-4 text-cyan-400" />
                <span className="text-sm">+917039184939</span>
              </div>
              <div className="flex items-start text-gray-300">
                <MapPin className="mt-1 mr-3 h-4 w-4 text-cyan-400" />
                <span className="text-sm">
                  Shop No 7, Sai Nagar Society
                  <br />
                  K Town Facilities, Plot No 26
                  <br />
                  Sai Nagar, Sector 4, Kalamboli
                  <br />
                  Panvel, Navi Mumbai, Maharashtra 410218
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-orbitron mb-6 flex items-center text-lg font-bold text-white">
              <BookOpen className="mr-2 h-5 w-5 text-cyan-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={link.href}
                    className="group flex items-center text-gray-300 transition-colors duration-300 hover:text-cyan-400"
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Programs */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-orbitron mb-6 flex items-center text-lg font-bold text-white">
              <Trophy className="mr-2 h-5 w-5 text-purple-400" />
              Programs
            </h4>
            <ul className="space-y-3">
              {programs.map((program, index) => (
                <li key={index}>
                  <motion.a
                    href={program.href}
                    className="group flex items-center text-gray-300 transition-colors duration-300 hover:text-purple-400"
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    {program.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div> */}

          {/* Newsletter & Social */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-orbitron mb-6 flex items-center text-lg font-bold text-white">
              <Users className="mr-2 h-5 w-5 text-cyan-400" />
              Stay Connected
            </h4>

            {/* Newsletter Signup */}
            

            {/* Social Links */}
            <div>
              <p className="mb-4 text-sm text-gray-300">
                Follow us on social media:
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      className={`text-gray-400 ${social.color} transition-colors duration-300`}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          className="mb-8 border-t border-b border-cyan-500/30 py-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="font-orbitron mb-1 text-2xl font-bold text-cyan-400">
                100+
              </div>
              <div className="text-sm text-gray-400">Students Trained</div>
            </div>
            <div>
              <div className="font-orbitron mb-1 text-2xl font-bold text-purple-400">
                5+
              </div>
              <div className="text-sm text-gray-400">Rated Players</div>
            </div>
            <div>
              <div className="font-orbitron mb-1 text-2xl font-bold text-cyan-400">
                98%
              </div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div>
              <div className="font-orbitron mb-1 text-2xl font-bold text-purple-400">
                3+
              </div>
              <div className="text-sm text-gray-400">Years Excellence</div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="flex flex-col items-center justify-between text-sm text-gray-400 md:flex-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} Aspire Chess Academy. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <motion.a
              href="#"
              className="transition-colors duration-300 hover:text-cyan-400"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              className="transition-colors duration-300 hover:text-cyan-400"
              whileHover={{ y: -2 }}
            >
              Terms of Service
            </motion.a>
            <motion.a
              href="#"
              className="transition-colors duration-300 hover:text-cyan-400"
              whileHover={{ y: -2 }}
            >
              Cookie Policy
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-10 left-10 text-4xl"
          animate={{
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ♔
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 text-3xl"
          animate={{
            y: [10, -10, 10],
            rotate: [5, -5, 5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          ♕
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-20 text-5xl"
          animate={{
            y: [-15, 15, -15],
            rotate: [-3, 3, -3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        >
          ♖
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
