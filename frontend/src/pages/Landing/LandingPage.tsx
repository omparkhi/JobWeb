import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Users, 
  Building, 
  Briefcase, 
  ArrowRight, 
  CheckCircle, 
  Star,
  TrendingUp,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const stats = [
    { label: 'Active Jobs', value: '10,000+', icon: Briefcase },
    { label: 'Companies', value: '2,500+', icon: Building },
    { label: 'Job Seekers', value: '50,000+', icon: Users },
    { label: 'Success Stories', value: '15,000+', icon: Star },
  ];

  const features = [
    {
      icon: Search,
      title: 'Smart Job Matching',
      description: 'Our AI-powered algorithm matches you with the perfect job opportunities based on your skills and preferences.'
    },
    {
      icon: Shield,
      title: 'Verified Companies',
      description: 'All companies on our platform are verified and trusted, ensuring safe and legitimate job opportunities.'
    },
    {
      icon: Zap,
      title: 'Quick Applications',
      description: 'Apply to multiple jobs with just one click using your saved profile and resume.'
    },
    {
      icon: Globe,
      title: 'Pan-India Reach',
      description: 'Find opportunities across all major cities and emerging markets in India.'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer at TechCorp',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      content: 'CMO India helped me land my dream job in just 2 weeks. The platform is incredibly user-friendly and the job recommendations were spot-on!'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Marketing Manager at InnovateLabs',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      content: 'As a recruiter, I love how easy it is to find qualified candidates. The quality of profiles on CMO India is exceptional.'
    },
    {
      name: 'Anita Patel',
      role: 'Data Scientist at AI Solutions',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      content: 'The career guidance and interview tips provided by CMO India were invaluable in my job search journey.'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Create Your Profile',
      description: 'Sign up and build a comprehensive profile showcasing your skills and experience.'
    },
    {
      step: '2',
      title: 'Discover Opportunities',
      description: 'Browse through thousands of job listings or let our AI recommend the best matches.'
    },
    {
      step: '3',
      title: 'Apply & Connect',
      description: 'Apply to jobs with one click and connect directly with hiring managers.'
    },
    {
      step: '4',
      title: 'Land Your Dream Job',
      description: 'Get hired by top companies and take the next step in your career journey.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900/20"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Dream Job with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                CMO India
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              India's most trusted hiring platform connecting talented professionals with top companies. 
              Discover opportunities, build your career, and achieve your professional goals.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-xl hover:shadow-2xl"
              >
                Get Started Free
              </Link>
              <Link
                to="/jobs"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg border border-white/20 backdrop-blur-md"
              >
                Browse Jobs
              </Link>
            </div>

            {/* Quick Search */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Job title or keyword"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Categories</option>
                    <option value="technology">Technology</option>
                    <option value="marketing">Marketing</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                  </select>
                  <Link
                    to="/jobs"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose CMO India?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We provide the tools and opportunities you need to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started with your job search in just four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Hear from professionals who found their dream jobs through CMO India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-12 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found their perfect job match. 
              Your dream career is just one click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-xl"
              >
                Join as Job Seeker
              </Link>
              <Link
                to="/register"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg border border-white/20"
              >
                Post Jobs as Employer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">Trusted by Leading Companies</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 opacity-60">
            {['TechCorp', 'InnovateLabs', 'DataSoft', 'CloudTech', 'AI Solutions', 'WebDev Pro'].map((company, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md rounded-lg p-4 text-center border border-white/10">
                <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-2 flex items-center justify-center">
                  <Building className="h-4 w-4 text-white" />
                </div>
                <span className="text-white text-sm font-medium">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;