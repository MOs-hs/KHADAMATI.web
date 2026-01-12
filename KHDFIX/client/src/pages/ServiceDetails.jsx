import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useAuth } from '../context/AuthContext';
import { getServices, getCategories, getProviders, getUsers, createRequest, initializeMockData } from '../utils/mockData';
import { FiStar, FiMapPin, FiUser, FiCalendar } from 'react-icons/fi';
import api from '../services/api';
import { format } from 'date-fns';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCustomer } = useAuth();
  const [service, setService] = useState(null);
  const [category, setCategory] = useState(null);
  const [provider, setProvider] = useState(null);
  const [providerUser, setProviderUser] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    details: '',
    scheduled_date: '',
    price: ''
  });
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    initializeMockData();
    const services = getServices();
    const foundService = services.find(s => s.service_id === parseInt(id));

    if (foundService) {
      setService(foundService);
      const categories = getCategories();
      setCategory(categories.find(c => c.category_id === foundService.category_id));

      const providers = getProviders();
      const foundProvider = providers.find(p => p.provider_id === foundService.provider_id);
      if (foundProvider) {
        setProvider(foundProvider);
        const users = getUsers();
        setProviderUser(users.find(u => u.user_id === foundProvider.user_id));
      }

      // Fetch reviews
      const fetchReviews = async () => {
        try {
          const response = await api.get(`/reviews/service/${id}`);
          setReviews(response.data.reviews || []);
        } catch (error) {
          console.error("Error fetching reviews", error);
        } finally {
          setReviewsLoading(false);
        }
      };

      fetchReviews();
    } else {
      setReviewsLoading(false);
    }
  }, [id]);

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!isCustomer) {
      alert('You must be logged in as a customer to request a service');
      navigate('/login');
      return;
    }

    const newRequest = createRequest({
      customer_id: user.user_id,
      provider_id: provider.provider_id,
      service_id: service.service_id,
      details: requestData.details,
      scheduled_date: requestData.scheduled_date,
      price: parseFloat(requestData.price)
    });

    alert('Request sent successfully!');
    navigate('/customer/requests');
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-xl text-gray-600 dark:text-gray-400">Service not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 bg-gray-200 dark:bg-gray-700">
            <img
              src="/placeholder.jpg"
              alt={service.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold dark:text-white mb-4">{service.title}</h1>
            {category && (
              <span className="inline-block px-3 py-1 bg-[#0BA5EC] text-white rounded-full text-sm mb-4">
                {category.name}
              </span>
            )}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {service.description}
            </p>

            {provider && providerUser && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold dark:text-white mb-4">Service Provider</h3>
                <div className="flex items-center gap-4">
                  <img
                    src="/placeholder-user.jpg"
                    alt={providerUser.first_name}
                    className="h-16 w-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold dark:text-white">
                      {providerUser.first_name} {providerUser.last_name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{provider.specialization}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <FiStar className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                if (!isCustomer) {
                  alert('Only customers can request services');
                  return;
                }
                setShowRequestForm(!showRequestForm);
              }}
              className="w-full bg-[#0BA5EC] text-white py-3 rounded-lg font-medium hover:bg-[#0BA5EC]/90 transition-colors mb-4"
            >
              Request Service
            </button>

            {showRequestForm && (
              <form onSubmit={handleRequestSubmit} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Request Details
                  </label>
                  <textarea
                    value={requestData.details}
                    onChange={(e) => setRequestData({ ...requestData, details: e.target.value })}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scheduled Date
                  </label>
                  <input
                    type="datetime-local"
                    value={requestData.scheduled_date}
                    onChange={(e) => setRequestData({ ...requestData, scheduled_date: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expected Price (LBP)
                  </label>
                  <input
                    type="number"
                    value={requestData.price}
                    onChange={(e) => setRequestData({ ...requestData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0BA5EC] text-white py-3 rounded-lg font-medium hover:bg-[#0BA5EC]/90 transition-colors"
                >
                  Send Request
                </button>
              </form>
            )}
          </div>

          {/* Reviews Section */}
          <div className="p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold dark:text-white">Reviews</h3>
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  if (isCustomer) {
                    navigate('/customer/requests');
                  } else {
                    alert('Only customers can write reviews for services they have used.');
                  }
                }}
                className="px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 transition-colors text-sm font-medium"
              >
                Write a Review
              </button>
            </div>
            {reviewsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet for this service.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.ReviewID} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold dark:text-white">{review.CustomerName || 'Customer'}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${i < review.Rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(review.CreatedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.Comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetails;
