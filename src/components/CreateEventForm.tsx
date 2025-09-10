import React, { useState, useEffect } from 'react';
import { usePublishEvent } from '../hooks/usePublishEvent';
import { NDKEvent } from '@nostr-dev-kit/ndk';

const toLocalISOString = (date: Date) => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, -1);
  return localISOTime.substring(0, 16);
};

interface CreateEventFormProps {
  lat: number;
  lon: number;
  onClose: () => void;
  communities: NDKEvent[];
}

export default function CreateEventForm({ lat, lon, onClose, communities }: CreateEventFormProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [startDate, setStartDate] = useState(toLocalISOString(new Date()));
  const [endDate, setEndDate] = useState(toLocalISOString(new Date(Date.now() + 2 * 60 * 60 * 1000)));
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const publishEvent = usePublishEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) {
      alert('Please fill in all fields.');
      return;
    }

    let eventDetails: any = { title, summary, lat, lon };
    if (selectedCommunity) {
      eventDetails.community = selectedCommunity;
    }

    if (!isLive) {
      if (!startDate || !endDate) {
        alert('Please select a start and end date for the event.');
        return;
      }
      const starts = Math.floor(new Date(startDate).getTime() / 1000);
      const ends = Math.floor(new Date(endDate).getTime() / 1000);

      if (starts >= ends) {
        alert('The event start time must be before the end time.');
        return;
      }

      const maxDuration = 6 * 60 * 60;
      if (ends - starts > maxDuration) {
        alert('Events cannot be longer than 6 hours.');
        return;
      }

      eventDetails.starts = starts;
      eventDetails.ends = ends;
    }

    const success = await publishEvent(eventDetails);
    if (success) {
      onClose();
    } else {
      alert('Failed to create event. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 w-64">
      <h3 className="font-bold text-lg mb-2">Create a New Gathering</h3>
      <div className="mb-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      <div className="mb-2">
        <label htmlFor="community" className="block text-sm font-medium text-gray-700">Community (Optional)</label>
        <select
          id="community"
          value={selectedCommunity}
          onChange={(e) => setSelectedCommunity(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Public Event</option>
          {communities.map(c => {
            const dTag = c.tags.find(t => t[0] === 'd' && t[1] !== 'gather-community');
            if (!dTag) return null;
            return (
              <option key={c.id} value={`30023:${c.pubkey}:${dTag[1]}`}>
                {c.tagValue('title')}
              </option>
            )
          })}
        </select>
      </div>

      <div className="flex items-center mb-2">
        <input
          id="isLive"
          type="checkbox"
          checked={isLive}
          onChange={() => setIsLive(!isLive)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isLive" className="ml-2 block text-sm text-gray-900">
          Live Now (lasts 2 hours)
        </label>
      </div>

      {!isLive && (
        <>
          <div className="mb-2">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Starts</label>
            <input
              type="datetime-local"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Ends</label>
            <input
              type="datetime-local"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </>
      )}

      <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
        Publish Gathering
      </button>
    </form>
  );
}