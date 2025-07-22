import { useEffect, useState } from 'react';
import API from '../api/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    points: '',
    price: ''
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const res = await API.get('/services');
    setServices(res.data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await API.put(`/services/${editingId}`, formData);
    } else {
      await API.post('/services', formData);
    }
    setFormData({ image: '', title: '', description: '', points: '', price: '' });
    setEditingId(null);
    fetchServices();
  };

  const handleEdit = (service) => {
    setFormData(service);
    setEditingId(service.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await API.delete(`/services/${id}`);
      fetchServices();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Manage Services</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="border p-2"
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2"
            required
          />
          <input
            type="text"
            name="points"
            placeholder="Points (comma-separated)"
            value={formData.points}
            onChange={handleChange}
            className="border p-2"
            required
          />
          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            className="border p-2"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingId ? 'Update Service' : 'Add Service'}
          </button>
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Image</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Points</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((srv) => (
                <tr key={srv.id}>
                  <td className="border p-2">{srv.image}</td>
                  <td className="border p-2">{srv.title}</td>
                  <td className="border p-2">{srv.description}</td>
                  <td className="border p-2">{srv.points}</td>
                  <td className="border p-2">₹{srv.price}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(srv)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id)}
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

export default Services;
