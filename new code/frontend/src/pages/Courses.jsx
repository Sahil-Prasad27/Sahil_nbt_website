import { useEffect, useState } from 'react';
import API from '../api/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    image: '',
    type: '',
    description_1: '',
    title: '',
    description_2: '',
    educator: '',
    timeline: '',
    people: '',
    rating: '',
    link: '' // ✅ New field
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const res = await API.get('/courses');
    setCourses(res.data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await API.put(`/courses/${editingId}`, formData);
    } else {
      await API.post('/courses', formData);
    }
    setFormData({
      image: '',
      type: '',
      description_1: '',
      title: '',
      description_2: '',
      educator: '',
      timeline: '',
      people: '',
      rating: '',
      link: '' // ✅ Reset
    });
    setEditingId(null);
    fetchCourses();
  };

  const handleEdit = (course) => {
    setFormData(course);
    setEditingId(course.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this course?')) {
      await API.delete(`/courses/${id}`);
      fetchCourses();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Manage Courses</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            'image',
            'type',
            'description_1',
            'title',
            'description_2',
            'educator',
            'timeline',
            'people',
            'rating',
            'link' // ✅ New field
          ].map((field) => (
            <input
              key={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              className="border p-2"
              type={field === 'people' || field === 'rating' ? 'number' : 'text'}
              step={field === 'rating' ? '0.01' : undefined}
              required
            />
          ))}

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingId ? 'Update Course' : 'Add Course'}
          </button>
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Educator</th>
                <th className="border p-2">People</th>
                <th className="border p-2">Rating</th>
                <th className="border p-2">Link</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="border p-2">{course.title}</td>
                  <td className="border p-2">{course.educator}</td>
                  <td className="border p-2">{course.people}</td>
                  <td className="border p-2">{course.rating}</td>
                  <td className="border p-2">
                    <a href={course.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      View
                    </a>
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
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

export default Courses;
