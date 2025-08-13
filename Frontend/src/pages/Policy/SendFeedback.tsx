import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Mail, Phone, Clock, MessageSquare, Bug, Star, Lightbulb, AlertCircle, Upload, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';

const SendFeedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    feedbackType: 'general',
    priority: 'medium',
    anonymous: false,
    allowContact: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Feedback submitted:', formData);
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        feedbackType: 'general',
        priority: 'medium',
        anonymous: false,
        allowContact: true
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-indigo-100 p-3 sm:p-4 rounded-full">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Send Feedback
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-3xl mx-auto px-4">
              We value your feedback and suggestions. Share your thoughts, report issues, 
              or suggest improvements to help us enhance our platform.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              Last Updated: June, 2025
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {!isSubmitted ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Share Your Feedback
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Help us improve by sharing your experience, suggestions, or reporting any issues you've encountered.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type and Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Type *
                  </label>
                  <select
                    name="feedbackType"
                    value={formData.feedbackType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="general">General Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="improvement">Improvement Suggestion</option>
                    <option value="complaint">Complaint</option>
                    <option value="praise">Praise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Name and Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Brief summary of your feedback"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Please provide detailed feedback, including steps to reproduce if reporting a bug..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 20 characters. Be as specific as possible to help us better understand your feedback.
                </p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Submit anonymously (your email will not be shared)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowContact"
                    checked={formData.allowContact}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Allow us to contact you for follow-up questions
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Thank You!
            </h3>
            <p className="text-green-700 mb-4">
              Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
            </p>
            <p className="text-sm text-green-600">
              We'll review your feedback and get back to you within 3-5 business days.
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="prose prose-lg max-w-none">
          
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">1. Overview</h2>
            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 sm:p-6 rounded-r-lg mb-8">
              <p className="text-gray-700 leading-relaxed">
                Your feedback is essential to our continuous improvement. We welcome suggestions, 
                bug reports, feature requests, and general comments about your experience with our platform. 
                Your input helps us create a better experience for all users.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              We review all feedback carefully and use it to prioritize improvements, fix issues, 
              and develop new features. While we may not be able to implement every suggestion, 
              we appreciate and consider all feedback we receive.
            </p>
          </section>

          {/* Types of Feedback */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">2. Types of Feedback We Welcome</h2>
            <p className="text-gray-700 mb-6">
              We encourage feedback in the following categories:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3">Feature Requests</h3>
                <ul className="text-gray-700 space-y-2 text-sm sm:text-base">
                  <li>• New functionality ideas</li>
                  <li>• Platform improvements</li>
                  <li>• User experience enhancements</li>
                  <li>• Integration suggestions</li>
                  <li>• Content recommendations</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3">Bug Reports</h3>
                <ul className="text-gray-700 space-y-2 text-sm sm:text-base">
                  <li>• Technical issues</li>
                  <li>• Error messages</li>
                  <li>• Performance problems</li>
                  <li>• Compatibility issues</li>
                  <li>• Broken functionality</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-800 mb-3">User Experience</h3>
                <ul className="text-gray-700 space-y-2 text-sm sm:text-base">
                  <li>• Interface improvements</li>
                  <li>• Navigation suggestions</li>
                  <li>• Accessibility concerns</li>
                  <li>• Mobile experience</li>
                  <li>• Design feedback</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-orange-800 mb-3">Content & Services</h3>
                <ul className="text-gray-700 space-y-2 text-sm sm:text-base">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">3. How to Submit Feedback</h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-3">Online Feedback Form</h3>
                <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                  Use our comprehensive feedback form for detailed submissions:
                </p>
                <ul className="text-gray-700 text-xs sm:text-sm space-y-2">
                  <li>• Structured feedback categories</li>
                  <li>• File attachment support</li>
                  <li>• Priority level selection</li>
                  <li>• Follow-up tracking</li>
                  <li>• Anonymous submission option</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3">Email Feedback</h3>
                <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                  Send detailed feedback directly to our feedback team:
                </p>
                <ul className="text-gray-700 text-xs sm:text-sm space-y-2">
                  <li>• feedback@amoghedu.com</li>
                  <li>• Include relevant screenshots</li>
                  <li>• Describe steps to reproduce issues</li>
                  <li>• Provide your contact information</li>
                  <li>• Specify feedback category</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3">In-App Feedback</h3>
                <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                  Use the feedback button within our platform:
                </p>
                <ul className="text-gray-700 text-xs sm:text-sm space-y-2">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">4. Feedback Guidelines</h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
              <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                To help us process your feedback effectively, please follow these guidelines:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base">What to Include</h4>
                  <ul className="text-gray-700 text-xs sm:text-sm space-y-2">
                    <li>• Clear description of the issue or suggestion</li>
                    <li>• Steps to reproduce (for bugs)</li>
                    <li>• Screenshots or screen recordings</li>
                    <li>• Browser and device information</li>
                    <li>• Expected vs actual behavior</li>
                    <li>• Impact on your experience</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base">What to Avoid</h4>
                  <ul className="text-gray-700 text-xs sm:text-sm space-y-2">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">5. Response Timeline</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
              <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                We strive to respond to all feedback within the following timeframes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">Critical Issues</h4>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">24-48 hours</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Security, data loss, major bugs</p>
                </div>
                <div className="bg-white border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">General Feedback</h4>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">3-5 days</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Feature requests, suggestions</p>
                </div>
                <div className="bg-white border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">Minor Issues</h4>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">1-2 weeks</p>
                  <p className="text-gray-600 text-xs sm:text-sm">UI improvements, minor bugs</p>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Processing */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">6. How We Process Feedback</h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-indigo-800 mb-3">Step 1: Review & Categorize</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  All feedback is reviewed by our team and categorized by type, priority, and impact. 
                  We analyze patterns and trends to identify common issues and opportunities.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3">Step 2: Prioritize & Plan</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Feedback is prioritized based on user impact, technical feasibility, and business value. 
                  High-priority items are scheduled for immediate attention.
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-3">Step 3: Implement & Test</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Approved changes are implemented and thoroughly tested before being released to ensure 
                  they meet quality standards and user expectations.
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-800 mb-3">Step 4: Communicate & Follow Up</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  We communicate updates on feedback status and notify users when their suggestions 
                  have been implemented or when additional information is needed.
                </p>
              </div>
            </div>
          </section>

          {/* Feedback Recognition */}
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">7. Feedback Recognition</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
              <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                We appreciate and recognize valuable feedback contributions:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Recognition Programs</h4>
                  <ul className="text-gray-700 text-xs sm:text-sm space-y-2">
                    <li>• Feedback contributor badges</li>
                    <li>• Monthly feedback highlights</li>
                    <li>• Community recognition</li>
                    <li>• Early access to new features</li>
                    <li>• Special acknowledgments</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Impact Tracking</h4>
                  <ul className="text-gray-700 text-xs sm:text-sm space-y-2">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">8. Privacy & Confidentiality</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
              <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                We respect your privacy when handling feedback:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">Data Protection</h4>
                  <ul className="text-gray-700 text-xs sm:text-sm space-y-2">
                    <li>• Personal information is protected</li>
                    <li>• Anonymous feedback options</li>
                    <li>• Secure data transmission</li>
                    <li>• Limited access to feedback data</li>
                    <li>• Compliance with privacy laws</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">Usage Guidelines</h4>
                  <ul className="text-gray-700 text-xs sm:text-sm space-y-2">
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
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">9. Contact Us</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <p className="text-gray-700 mb-6 text-sm sm:text-base">
                For feedback or questions about our feedback process, please contact us:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Email</h4>
                    <p className="text-gray-700 text-sm sm:text-base">amogheveruseful@gmail.com</p>
                  </div>
                </div>
{/*                 
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-gray-700">123 Business Street, City, State 12345</p>
                  </div>
                </div> */}
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