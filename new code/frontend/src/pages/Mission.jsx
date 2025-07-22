import { useEffect, useState } from 'react';
import API from '../api/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

function Mission() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    students: '',
    courses: '',
    success_rate: ''
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    setLoading(true);
    const res = await API.get('/mission');
    setMissions(res.data);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await API.put(`/mission/${editingId}`, formData);
    } else {
      await API.post('/mission', formData);
    }
    setFormData({ title: '', description: '', students: '', courses: '', success_rate: '' });
    setEditingId(null);
    fetchMissions();
  };

  const handleEdit = (mission) => {
    setFormData(mission);
    setEditingId(mission.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this mission data?')) {
      await API.delete(`/mission/${id}`);
      fetchMissions();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Manage Our Mission</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Mission Title"
            className="border p-2"
            required
          />
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2"
            required
          />
          <input
            name="students"
            type="number"
            value={formData.students}
            onChange={handleChange}
            placeholder="Number of Students"
            className="border p-2"
            required
          />
          <input
            name="courses"
            type="number"
            value={formData.courses}
            onChange={handleChange}
            placeholder="Number of Courses"
            className="border p-2"
            required
          />
          <input
            name="success_rate"
            type="number"
            step="0.01"
            value={formData.success_rate}
            onChange={handleChange}
            placeholder="Success Rate (%)"
            className="border p-2"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingId ? 'Update Mission' : 'Add Mission'}
          </button>
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Students</th>
                <th className="border p-2">Courses</th>
                <th className="border p-2">Success Rate</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((m) => (
                <tr key={m.id}>
                  <td className="border p-2">{m.title}</td>
                  <td className="border p-2">{m.students}</td>
                  <td className="border p-2">{m.courses}</td>
                  <td className="border p-2">{m.success_rate}%</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(m)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
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

export default Mission;
