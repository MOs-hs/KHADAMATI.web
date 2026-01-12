import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getServices, getCategories, deleteService, initializeMockData } from '../../utils/mockData';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const MyServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    initializeMockData();
    const allServices = getServices();
    setServices(allServices.filter(s => s.provider_id === (user?.user_id || 1)));
    setCategories(getCategories());
  }, [user]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.category_id === categoryId);
    return category?.name || '-';
  };

  const handleDelete = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(serviceId);
      setServices(getServices().filter(s => s.provider_id === (user?.user_id || 1)));
      alert('Service deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">My Services</h1>
        <Link
          to="/provider/services/add"
          className="flex items-center gap-2 px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90"
        >
          <FiPlus className="h-5 w-5" />
          Add Service
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.service_id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="h-48 bg-gray-200 dark:bg-gray-700">
              <img
                src="/placeholder.jpg"
                alt={service.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold dark:text-white mb-2">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{service.description}</p>
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm mb-4">
                {getCategoryName(service.category_id)}
              </span>
              <div className="flex gap-2">
                <Link
                  to={`/provider/services/edit/${service.service_id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <FiEdit className="h-5 w-5" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(service.service_id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <FiTrash2 className="h-5 w-5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">No services found</p>
          <Link
            to="/provider/services/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90"
          >
            <FiPlus className="h-5 w-5" />
            Add New Service
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyServices;
