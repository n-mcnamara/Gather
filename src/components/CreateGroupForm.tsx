import React, { useState } from 'react';
import { usePublishGroup } from '../hooks/usePublishGroup';

export default function CreateGroupForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const publishGroup = usePublishGroup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      alert('Please fill in all fields.');
      return;
    }

    const success = await publishGroup({ name, description, isPrivate });
    if (success) {
      setName('');
      setDescription('');
      setIsPrivate(false);
      alert('Community created successfully!');
    } else {
      alert('Failed to create community. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
      <h3 className="font-bold text-lg mb-2">Create a New Community</h3>
      <div className="mb-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex items-center mb-4">
        <input
          id="isPrivate"
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
          Private (invite-only)
        </label>
      </div>
      <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
        Create Community
      </button>
    </form>
  );
}