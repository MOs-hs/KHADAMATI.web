import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRequests, getUsers, updateRequest, initializeMockData } from '../../utils/mockData';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const ServiceRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    initializeMockData();
    const allRequests = getRequests();
    setRequests(allRequests.filter(r => r.provider_id === (user?.user_id || 1)));
    setUsers(getUsers());
  }, [user]);

  const getCustomerName = (customerId) => {
    const customer = users.find(u => u.user_id === customerId);
    return customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown Customer';
  };

  const handleStatusChange = (requestId, newStatusId) => {
    updateRequest(requestId, { status_id: newStatusId });
    setRequests(getRequests().filter(r => r.provider_id === (user?.user_id || 1)));
    alert('Request status updated');
  };

  const getStatusLabel = (statusId) => {
    const statuses = {
      1: { label: 'Pending', icon: FiClock, color: 'bg-yellow-100 text-yellow-800' },
      2: { label: 'In Progress', icon: FiClock, color: 'bg-blue-100 text-blue-800' },
      3: { label: 'Completed', icon: FiCheckCircle, color: 'bg-green-100 text-green-800' },
      4: { label: 'Cancelled', icon: FiXCircle, color: 'bg-red-100 text-red-800' }
    };
    return statuses[statusId] || statuses[1];
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Service Requests</h1>

      <div className="space-y-4">
        {requests.map((request) => {
          const status = getStatusLabel(request.status_id);
          const StatusIcon = status.icon;
          return (
            <div key={request.request_id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold dark:text-white mb-2">Request #{request.request_id}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Customer: {getCustomerName(request.customer_id)}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">{request.details}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${status.color}`}>
                  <StatusIcon className="h-4 w-4" />
                  {status.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                  <p className="text-xl font-bold dark:text-white">${request.price}</p>
                </div>
                <div className="flex gap-2">
                  {request.status_id === 1 && (
                    <>
                      <button
                        onClick={() => handleStatusChange(request.request_id, 2)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(request.request_id, 4)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {request.status_id === 2 && (
                    <button
                      onClick={() => handleStatusChange(request.request_id, 3)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">No requests found</p>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
