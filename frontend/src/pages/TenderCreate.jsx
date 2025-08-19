import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateTenderMutation } from '../features/api/tender.api';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';

const categories = ['construction', 'it infrastructure', 'agriculture', 'healthcare', 'education'];

export default function TenderCreate() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [createTender, { isLoading, error }] = useCreateTenderMutation();
  const navigate = useNavigate();
  const [fileCount, setFileCount] = useState(0);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('budget', data.budget);
    formData.append('deadline', data.deadline);
    formData.append('city', data.city);

    Array.from(data.attachments).forEach(file => {
      formData.append('attachments', file);
    });

    try {
      await createTender(formData).unwrap();
      navigate('/tenders');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen  from-blue-50 to-purple-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-blue-500 mb-8">
          📄Post a New Tender
        </h1>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            Error posting tender. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter tender title"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Category *</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            {/* Budget */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Budget (₹) *</label>
              <input
                type="number"
                {...register('budget', { required: 'Budget is required', min: { value: 0, message: 'Budget cannot be negative' } })}
                placeholder="e.g., 50000"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
            </div>

            {/* Deadline */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Deadline *</label>
              <input
                type="date"
                {...register('deadline', { required: 'Deadline is required' })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>}
            </div>

            {/* City */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">City *</label>
              <input
                type="text"
                {...register('city', { required: 'City is required' })}
                placeholder="Enter city"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Brief description of the tender..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Attachments */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">Attachments *</label>
              <input
                type="file"
                multiple
                {...register('attachments', { required: 'At least one file is required' })}
                onChange={e => setFileCount(e.target.files.length)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <p className="text-sm text-gray-600 mt-1">{fileCount} file(s) selected</p>
              {errors.attachments && <p className="text-red-500 text-sm mt-1">{errors.attachments.message}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              {isLoading ? 'Posting Tender...' : 'Post Tender'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
