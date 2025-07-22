import { useEffect, useState } from 'react';
import API from '../api/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

function Contact() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const res = await API.get('/contact');
    setMessages(res.data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await API.delete(`/contact/${id}`);
      fetchMessages();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Contact Messages</h2>

        {loading ? (
          <LoadingSpinner />
        ) : messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Message</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td className="border p-2">{msg.full_name}</td>
                  <td className="border p-2">{msg.email_address}</td>
                  <td className="border p-2">{msg.subject}</td>
                  <td className="border p-2">{msg.message}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Contact;
