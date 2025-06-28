import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { Header } from '@/components/Header';

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
    <>
    <Header />
    <div className="h-full w-full bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="bg-white rounded-lg shadow-sm p-8">
                  <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                  </Link>

                  <div className="flex items-center mb-8">
                      <Send className="w-8 h-8 text-blue-600 mr-3" />
                      <h1 className="text-3xl font-bold text-gray-900">Send Feedback</h1>
                  </div>

                  <p className="text-gray-600 mb-8">
                      We value your feedback and suggestions. Please fill out the form below to share your thoughts,
                      report issues, or suggest improvements.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                  Name *
                              </label>
                              <input
                                  type="text"
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                          </div>

                          <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                  Email *
                              </label>
                              <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                          </div>
                      </div>

                      <div>
                          <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-2">
                              Feedback Type
                          </label>
                          <select
                              id="feedbackType"
                              name="feedbackType"
                              value={formData.feedbackType}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                              <option value="general">General Feedback</option>
                              <option value="bug">Bug Report</option>
                              <option value="feature">Feature Request</option>
                              <option value="complaint">Complaint</option>
                              <option value="compliment">Compliment</option>
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>

                      <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                              Message *
                          </label>
                          <textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              required
                              rows={6}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Please provide detailed feedback..." />
                      </div>

                      <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                              * Required fields
                          </p>
                          <button
                              type="submit"
                              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                              <Send className="w-4 h-4 mr-2" />
                              Send Feedback
                          </button>
                      </div>
                  </form>

                  <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Contact Us</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <p className="text-gray-600">
                                  <strong>Email:</strong> support@yourcompany.com
                              </p>
                              <p className="text-gray-600">
                                  <strong>Phone:</strong> (555) 123-4567
                              </p>
                          </div>
                          <div>
                              <p className="text-gray-600">
                                  <strong>Business Hours:</strong><br />
                                  Monday - Friday: 9:00 AM - 5:00 PM EST<br />
                                  Saturday: 10:00 AM - 2:00 PM EST
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div></>
  );
};

export default SendFeedback;