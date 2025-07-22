import { useEffect, useState } from 'react';
import API from '../api/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

function Overview() {
  const [overviewData, setOverviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    course_available_count: '',
    student_enrolled: '',
    avg_rating: ''
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    const res = await API.get('/overview');
    setOverviewData(res.data);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await API.put(`/overview/${editingId}`, formData);
    } else {
      await API.post('/overview', formData);
    }
    setFormData({
      description: '',
      course_available_count: '',
      student_enrolled: '',
      avg_rating: ''
    });
    setEditingId(null);
    fetchOverview();
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this overview entry?')) {
      await API.delete(`/overview/${id}`);
      fetchOverview();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Courses Overview</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Overview Description"
            className="border p-2"
            required
          />
          <input
            name="course_available_count"
            type="number"
            value={formData.course_available_count}
            onChange={handleChange}
            placeholder="Available Courses"
            className="border p-2"
            required
          />
          <input
            name="student_enrolled"
            type="number"
            value={formData.student_enrolled}
            onChange={handleChange}
            placeholder="Students Enrolled"
            className="border p-2"
            required
          />
          <input
            name="avg_rating"
            type="number"
            step="0.01"
            value={formData.avg_rating}
            onChange={handleChange}
            placeholder="Average Rating"
            className="border p-2"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingId ? 'Update' : 'Add Overview'}
          </button>
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : overviewData.length === 0 ? (
          <p>No overview data yet.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Description</th>
                <th className="border p-2">Courses</th>
                <th className="border p-2">Students</th>
                <th className="border p-2">Avg Rating</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {overviewData.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2">{item.course_available_count}</td>
                  <td className="border p-2">{item.student_enrolled}</td>
                  <td className="border p-2">{item.avg_rating}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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

export default Overview;
