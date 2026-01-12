import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { getRequests, getServices, initializeMockData } from '../../utils/mockData';
import { FiFileText, FiDollarSign, FiStar, FiHome } from 'react-icons/fi';

const Dashboard = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    requests: 0,
    earnings: 0,
    rating: 4.8
  });

  useEffect(() => {
    initializeMockData();
    const requests = getRequests();
    const providerRequests = requests.filter(r => r.provider_id === user?.user_id || 1);
    const totalEarnings = providerRequests
      .filter(r => r.status_id === 3)
      .reduce((sum, r) => sum + (parseFloat(r.price) || 0), 0);

    setStats({
      requests: providerRequests.length,
      earnings: totalEarnings,
      rating: 4.8
    });
  }, [user]);

  const recentRequests = getRequests().slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">{t('dashboard.provider.title')}</h1>
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
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{t('dashboard.provider.requests')}</p>
              <p className="text-3xl font-bold dark:text-white">{stats.requests}</p>
            </div>
            <FiFileText className="h-8 w-8 text-[#0BA5EC]" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{t('dashboard.provider.earnings')}</p>
              <p className="text-3xl font-bold dark:text-white">{formatPrice(stats.earnings)}</p>
            </div>
            <FiDollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{t('dashboard.provider.rating')}</p>
              <p className="text-3xl font-bold dark:text-white">{stats.rating}</p>
            </div>
            <FiStar className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold dark:text-white mb-4">{t('dashboard.provider.recentRequests')}</h2>
        <div className="space-y-4">
          {recentRequests.length > 0 ? (
            recentRequests.map((request) => (
              <div key={request.request_id} className="border-b dark:border-gray-700 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">{t('request.requestNumber', { number: request.request_id })}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{request.details}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold dark:text-white">{formatPrice(request.price)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(request.request_date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">{t('request.noRequests')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

