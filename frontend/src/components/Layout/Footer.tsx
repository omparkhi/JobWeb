import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">CMO India</span>
            </div>
            <p className="text-gray-300 text-sm">
              India's premier hiring platform connecting talented professionals with top companies. 
              Find your dream job or hire the best talent.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link to="/candidate/profile" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Build Resume
                </Link>
              </li>
              <li>
                <Link to="/career-advice" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Career Advice
                </Link>
              </li>
              <li>
                <Link to="/interview-tips" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Interview Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/company/post-job" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/employer-solutions" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Employer Solutions
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/hiring-guide" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Hiring Guide
                </Link>
              </li>
              <li>
                <Link to="/company/profile" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Company Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact & Support</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">support@cmoindia.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">+91 12345 67890</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">Mumbai, Maharashtra, India</span>
              </div>
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} CMO India. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;