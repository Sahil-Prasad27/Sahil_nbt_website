// src/components/ClientList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'http://localhost:5000/clients'; // Adjust if deployed

function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get(API_URL);
      setClients(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

    
    <div className="p-6">
      
      
      <h2 className="text-2xl font-bold mb-4 text-center">Client Records</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading clients...</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Client Name</th>
                <th className="p-2 border">Company</th>
                <th className="p-2 border">Task</th>
                <th className="p-2 border">Duration</th>
                <th className="p-2 border">Link</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Notes</th>
                <th className="p-2 border">Created</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={index} className="text-sm">
                  <td className="p-2 border">{client.client_name}</td>
                  <td className="p-2 border">{client.company_name}</td>
                  <td className="p-2 border">{client.task}</td>
                  <td className="p-2 border">{client.duration}</td>
                  <td className="p-2 border text-blue-600 underline">
                    <a href={client.link} target="_blank" rel="noopener noreferrer">
                      {client.link ? 'Visit' : '—'}
                    </a>
                  </td>
                  <td className="p-2 border">{client.status}</td>
                  <td className="p-2 border">{client.contact_email}</td>
                  <td className="p-2 border">{client.notes}</td>
                  <td className="p-2 border">
                    {new Date(client.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center text-gray-500 p-4">
                    No client records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
}

export default ClientList;
