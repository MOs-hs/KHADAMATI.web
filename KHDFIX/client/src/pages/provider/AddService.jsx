import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCategories, createService, initializeMockData } from '../../utils/mockData';
import { FiX, FiImage } from 'react-icons/fi';

const AddService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    price: ''
  });

  useEffect(() => {
    initializeMockData();
    setCategories(getCategories());
  }, []);

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white';

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + files.length;

    if (totalImages > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) invalidFiles.push(`${file.name}: File too large`);
      else if (!file.type.startsWith('image/')) invalidFiles.push(`${file.name}: Invalid file type`);
      else validFiles.push(file);
    });

    if (invalidFiles.length > 0) alert(invalidFiles.join('\n'));

    const newPreviews = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages([...images, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const imagePromises = images.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    }));

    Promise.all(imagePromises).then(imageUrls => {
      createService({
        ...formData,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price) || 0,
        provider_id: user?.user_id || 1,
        images: imageUrls,
        image_filenames: images.map(img => img.name)
      });

      alert('Service added successfully');
      navigate('/provider/services');
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold dark:text-white mb-6">
        Add New Service
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              required
              className={inputClass}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Category
            </label>

            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
              className={inputClass}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Price
            </label>

            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              className={inputClass}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Description
            </label>

            <textarea
              rows="6"
              required
              className={inputClass}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Image Upload (optional now) */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-2">
              Images (Optional)
              <span className="text-xs text-gray-500 ml-2">
                ({images.length}/10)
              </span>
            </label>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-32 object-cover rounded-lg border dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {images.length < 10 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiImage className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload images</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90"
            >
              Add Service
            </button>

            <button
              type="button"
              onClick={() => navigate('/provider/services')}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddService;
