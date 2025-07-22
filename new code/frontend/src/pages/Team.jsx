import { useEffect, useState } from 'react';
import API from '../api/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    image: '',
    name: '',
    description: '',
    position: '',
    number: '',
    image_sequence: '',
    linkedin: '',
    email: '', // ✅ New field
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    const res = await API.get('/meet-our-team');
    setTeam(res.data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await API.put(`/meet-our-team/${editingId}`, formData);
    } else {
      await API.post('/meet-our-team', formData);
    }
    setFormData({
      image: '',
      name: '',
      description: '',
      position: '',
      number: '',
      image_sequence: '',
      linkedin: '',
      email: '', // ✅ Reset email
    });
    setEditingId(null);
    fetchTeam();
  };

  const handleEdit = (member) => {
    setFormData(member);
    setEditingId(member.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this member?')) {
      await API.delete(`/meet-our-team/${id}`);
      fetchTeam();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Manage Team Members</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="border p-2" required />
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="border p-2" required />
          <input name="description" value={formData.description} onChange={handleChange} placeholder="Short Description" className="border p-2" required />
          <input name="position" value={formData.position} onChange={handleChange} placeholder="Position" className="border p-2" required />
          <input name="number" value={formData.number} onChange={handleChange} placeholder="Phone Number" className="border p-2" required />
          <input name="image_sequence" type="number" value={formData.image_sequence} onChange={handleChange} placeholder="Image Sequence" className="border p-2" required />
          <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="border p-2" required />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2" required /> {/* ✅ New input */}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingId ? 'Update Member' : 'Add Member'}
          </button>
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Position</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Email</th> {/* ✅ New column */}
                <th className="border p-2">LinkedIn</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr key={member.id}>
                  <td className="border p-2">{member.name}</td>
                  <td className="border p-2">{member.position}</td>
                  <td className="border p-2">{member.number}</td>
                  <td className="border p-2">
                    <img src={member.image} alt={member.name} className="w-16 h-16 object-cover" />
                  </td>
                  <td className="border p-2">
                    <a href={`mailto:${member.email}`} className="text-blue-600 underline">
                      {member.email}
                    </a>
                  </td>
                  <td className="border p-2">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      View
                    </a>
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
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

export default Team;
