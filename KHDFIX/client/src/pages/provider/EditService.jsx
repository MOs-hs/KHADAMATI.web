import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServices, getCategories, updateService, initializeMockData } from '../../utils/mockData';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: ''
  });

  useEffect(() => {
    initializeMockData();
    setCategories(getCategories());
    const services = getServices();
    const service = services.find(s => s.service_id === parseInt(id));
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        category_id: service.category_id.toString()
      });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateService(parseInt(id), {
      ...formData,
      category_id: parseInt(formData.category_id)
    });
    alert('Service updated successfully');
    navigate('/provider/services');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold dark:text-white mb-6">Edit Service</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 font-medium"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate('/provider/services')}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditService;
