import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Mail, Phone, Clock, MessageSquare, Bug, Star, Lightbulb, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';

const SendFeedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    feedbackType: 'general'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Feedback submitted:', formData);
    alert('Thank you for your feedback! We will get back to you soon.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      feedbackType: 'general'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-indigo-100 p-3 sm:p-4 rounded-full">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Send Feedback
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 max-w-3xl mx-auto px-2">
              We value your feedback and suggestions. Share your thoughts, report issues, 
              or suggest improvements to help us enhance our platform.
            </p>
            <div className="flex items-center justify-center text-xs sm:text-sm text-gray-500">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Last Updated: June, 2025
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Share Your Feedback
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Help us improve by sharing your thoughts, suggestions, or reporting issues
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Type *
              </label>
              <select
                id="feedbackType"
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="improvement">Improvement Suggestion</option>
                <option value="complaint">Complaint</option>
                <option value="praise">Praise/Appreciation</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Brief summary of your feedback"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-vertical"
                placeholder="Please provide detailed information about your feedback, suggestions, or the issue you're experiencing..."
              />
            </div>
            
            <div className="flex items-center justify-center pt-4">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 hover:shadow-lg flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
          
          {/* Overview */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">1. Overview</h2>
            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 sm:p-6 rounded-r-lg mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">
                Your feedback is essential to our continuous improvement. We welcome suggestions, 
                bug reports, feature requests, and general comments about your experience with our platform. 
                Your input helps us create a better experience for all users.
              </p>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
              We review all feedback carefully and use it to prioritize improvements, fix issues, 
              and develop new features. While we may not be able to implement every suggestion, 
              we appreciate and consider all feedback we receive.
            </p>
          </section>

          {/* Types of Feedback */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">2. Types of Feedback We Welcome</h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 mb-4 sm:mb-6">
              We encourage feedback in the following categories:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2 sm:mb-3">Feature Requests</h3>
                <ul className="text-xs sm:text-sm lg:text-base text-gray-700 space-y-1 sm:space-y-2">
                  <li>• New functionality ideas</li>
                  <li>• Platform improvements</li>
                  <li>• User experience enhancements</li>
                  <li>• Integration suggestions</li>
                  <li>• Content recommendations</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2 sm:mb-3">Bug Reports</h3>
                <ul className="text-xs sm:text-sm lg:text-base text-gray-700 space-y-1 sm:space-y-2">
                  <li>• Technical issues</li>
                  <li>• Error messages</li>
                  <li>• Performance problems</li>
                  <li>• Compatibility issues</li>
                  <li>• Broken functionality</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-800 mb-2 sm:mb-3">User Experience</h3>
                <ul className="text-xs sm:text-sm lg:text-base text-gray-700 space-y-1 sm:space-y-2">
                  <li>• Interface improvements</li>
                  <li>• Navigation suggestions</li>
                  <li>• Accessibility concerns</li>
                  <li>• Mobile experience</li>
                  <li>• Design feedback</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-orange-800 mb-2 sm:mb-3">Content & Services</h3>
                <ul className="text-xs sm:text-sm lg:text-base text-gray-700 space-y-1 sm:space-y-2">
                  <li>• Course content quality</li>
                  <li>• Service delivery</li>
                  <li>• Support experience</li>
                  <li>• Pricing feedback</li>
                  <li>• General suggestions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Submit Feedback */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. How to Submit Feedback</h2>
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-800 mb-3">Online Feedback Form</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Use our comprehensive feedback form for detailed submissions:
                </p>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Structured feedback categories</li>
                  <li>• File attachment support</li>
                  <li>• Priority level selection</li>
                  <li>• Follow-up tracking</li>
                  <li>• Anonymous submission option</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Email Feedback</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Send detailed feedback directly to our feedback team:
                </p>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• feedback@amoghedu.com</li>
                  <li>• Include relevant screenshots</li>
                  <li>• Describe steps to reproduce issues</li>
                  <li>• Provide your contact information</li>
                  <li>• Specify feedback category</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">In-App Feedback</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Use the feedback button within our platform:
                </p>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Quick feedback submission</li>
                  <li>• Context-aware reporting</li>
                  <li>• Automatic issue categorization</li>
                  <li>• User session information</li>
                  <li>• Immediate acknowledgment</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Feedback Guidelines */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Feedback Guidelines</h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                To help us process your feedback effectively, please follow these guidelines:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">What to Include</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Clear description of the issue or suggestion</li>
                    <li>• Steps to reproduce (for bugs)</li>
                    <li>• Screenshots or screen recordings</li>
                    <li>• Browser and device information</li>
                    <li>• Expected vs actual behavior</li>
                    <li>• Impact on your experience</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">What to Avoid</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Vague or unclear descriptions</li>
                    <li>• Personal attacks or inappropriate language</li>
                    <li>• Duplicate submissions</li>
                    <li>• Spam or promotional content</li>
                    <li>• Requests for immediate responses</li>
                    <li>• Demands for specific timelines</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Response Timeline */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Response Timeline</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We strive to respond to all feedback within the following timeframes:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Critical Issues</h4>
                  <p className="text-2xl font-bold text-orange-600">24-48 hours</p>
                  <p className="text-gray-600 text-sm">Security, data loss, major bugs</p>
                </div>
                <div className="bg-white border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">General Feedback</h4>
                  <p className="text-2xl font-bold text-orange-600">3-5 days</p>
                  <p className="text-gray-600 text-sm">Feature requests, suggestions</p>
                </div>
                <div className="bg-white border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Minor Issues</h4>
                  <p className="text-2xl font-bold text-orange-600">1-2 weeks</p>
                  <p className="text-gray-600 text-sm">UI improvements, minor bugs</p>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Processing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. How We Process Feedback</h2>
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-indigo-800 mb-3">Step 1: Review & Categorize</h3>
                <p className="text-gray-700 leading-relaxed">
                  All feedback is reviewed by our team and categorized by type, priority, and impact. 
                  We analyze patterns and trends to identify common issues and opportunities.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Step 2: Prioritize & Plan</h3>
                <p className="text-gray-700 leading-relaxed">
                  Feedback is prioritized based on user impact, technical feasibility, and business value. 
                  High-priority items are scheduled for immediate attention.
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-800 mb-3">Step 3: Implement & Test</h3>
                <p className="text-gray-700 leading-relaxed">
                  Approved changes are implemented and thoroughly tested before being released to ensure 
                  they meet quality standards and user expectations.
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">Step 4: Communicate & Follow Up</h3>
                <p className="text-gray-700 leading-relaxed">
                  We communicate updates on feedback status and notify users when their suggestions 
                  have been implemented or when additional information is needed.
                </p>
              </div>
            </div>
          </section>

          {/* Feedback Recognition */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Feedback Recognition</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We appreciate and recognize valuable feedback contributions:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Recognition Programs</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Feedback contributor badges</li>
                    <li>• Monthly feedback highlights</li>
                    <li>• Community recognition</li>
                    <li>• Early access to new features</li>
                    <li>• Special acknowledgments</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Impact Tracking</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Feedback implementation updates</li>
                    <li>• User impact metrics</li>
                    <li>• Community voting on suggestions</li>
                    <li>• Progress reports</li>
                    <li>• Success story sharing</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Confidentiality */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Privacy & Confidentiality</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We respect your privacy when handling feedback:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Data Protection</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Personal information is protected</li>
                    <li>• Anonymous feedback options</li>
                    <li>• Secure data transmission</li>
                    <li>• Limited access to feedback data</li>
                    <li>• Compliance with privacy laws</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Usage Guidelines</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Feedback used for improvement only</li>
                    <li>• No personal information shared</li>
                    <li>• Aggregate data may be published</li>
                    <li>• Opt-out options available</li>
                    <li>• Data retention policies apply</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">9. Contact Us</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 mb-4 sm:mb-6">
                For feedback or questions about our feedback process, please contact us:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-6">
                <div className="flex items-start">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Email</h4>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-700">amogheveruseful@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SendFeedback;