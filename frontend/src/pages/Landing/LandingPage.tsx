import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Users, 
  Building2, 
  TrendingUp, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Award,
  Globe,
  Shield
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const stats = [
    { label: 'Active Jobs', value: '10,000+', icon: Search },
    { label: 'Companies', value: '2,500+', icon: Building2 },
    { label: 'Job Seekers', value: '50,000+', icon: Users },
    { label: 'Success Rate', value: '95%', icon: TrendingUp },
  ];

  const features = [
    {
      icon: Search,
      title: 'Smart Job Matching',
      description: 'AI-powered job recommendations based on your skills and preferences.',
    },
    {
      icon: Shield,
      title: 'Verified Companies',
      description: 'All companies are verified to ensure legitimate job opportunities.',
    },
    {
      icon: Globe,
      title: 'Pan-India Reach',
      description: 'Find opportunities across all major cities and industries in India.',
    },
    {
      icon: Award,
      title: 'Career Growth',
      description: 'Access to career development resources and skill enhancement programs.',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      company: 'TechCorp',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Found my dream job within 2 weeks! The platform made the entire process seamless.',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Marketing Manager',
      company: 'InnovateCorp',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Excellent platform for both job seekers and employers. Highly recommended!',
    },
    {
      name: 'Anita Patel',
      role: 'HR Director',
      company: 'GrowthTech',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'We found amazing talent through CMO India. The quality of candidates is exceptional.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Find Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    Dream Career
                  </span>
                </h1>
                <p className="text-xl text-blue-100 max-w-lg">
                  Connect with top companies across India. Discover opportunities that match your skills and aspirations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register?role=candidate"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  Find Jobs
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register?role=company"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors"
                >
                  Post Jobs
                </Link>
              </div>

              {/* Quick Search */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-4">Quick Job Search</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Professional team"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-lg p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">500+ Jobs Posted Today</p>
                      <p className="text-sm text-gray-600">Across all industries</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-blue-600 rounded-lg p-3 shadow-lg">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CMO India?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide the tools and resources you need to succeed in your career journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and create a comprehensive profile showcasing your skills and experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Browse & Apply</h3>
              <p className="text-gray-600">
                Search through thousands of job opportunities and apply to positions that match your goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Hired</h3>
              <p className="text-gray-600">
                Connect with employers, attend interviews, and land your dream job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from professionals who found their dream careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect career match through CMO India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=candidate"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Job Search
            </Link>
            <Link
              to="/register?role=company"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Hire Talent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;