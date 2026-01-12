import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { getRequests, initializeMockData } from '../../utils/mockData';
import { FiFileText, FiClock, FiCheckCircle, FiHome } from 'react-icons/fi';

const Dashboard = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    initializeMockData();
    const allRequests = getRequests();
    setRequests(allRequests.filter(r => r.customer_id === user?.user_id).slice(0, 5));
  }, [user]);

  const getStatusInfo = (statusId) => {
    const statuses = {
      1: { label: 'Pending', icon: FiClock, color: 'text-yellow-600' },
      2: { label: 'In Progress', icon: FiClock, color: 'text-blue-600' },
      3: { label: 'Completed', icon: FiCheckCircle, color: 'text-green-600' },
      4: { label: 'Cancelled', icon: FiFileText, color: 'text-red-600' }
    };
    return statuses[statusId] || statuses[1];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">{t('dashboard.customer.title') || 'Customer Dashboard'}</h1>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
        >
          <FiHome className="h-5 w-5" />
          <span>{t('common.home') || 'Home'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Requests</p>
              <p className="text-3xl font-bold dark:text-white">{requests.length}</p>
            </div>
            <FiFileText className="h-8 w-8 text-[#0BA5EC]" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">In Progress</p>
              <p className="text-3xl font-bold dark:text-white">
                {requests.filter(r => r.status_id === 2).length}
              </p>
            </div>
            <FiClock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold dark:text-white">
                {requests.filter(r => r.status_id === 3).length}
              </p>
            </div>
            <FiCheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold dark:text-white">Recent Requests</h2>
          <Link
            to="/customer/requests"
            className="text-[#0BA5EC] hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map((request) => {
              const status = getStatusInfo(request.status_id);
              const StatusIcon = status.icon;
              return (
                <div key={request.request_id} className="border-b dark:border-gray-700 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium dark:text-white">Request #{request.request_id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{request.details}</p>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusIcon className={`h-5 w-5 ${status.color}`} />
                        <span className={`${status.color} font-medium`}>{status.label}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatPrice(request.price)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No requests found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
