import { useEffect, useState } from 'react';
import axios from 'axios'; // ✅ Import axios
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Define API inline
  const API = axios.create({
    baseURL: 'http://localhost:5000', // 🔁 Change this if your backend is hosted elsewhere
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await API.get('/api/testimonials');
      setTestimonials(res.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Testimonials</h2>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Message</th>
                <th className="border p-2">Rating</th>
                <th className="border p-2">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id}>
                  <td className="border p-2">{testimonial.name}</td>
                  <td className="border p-2">
                    <a href={`mailto:${testimonial.email}`} className="text-blue-600 underline">
                      {testimonial.email}
                    </a>
                  </td>
                  <td className="border p-2 italic">"{testimonial.message}"</td>
                  <td className="border p-2 text-yellow-500">
                    {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                  </td>
                  <td className="border p-2 text-gray-500">
                    {new Date(testimonial.created_at).toLocaleString()}
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

export default Testimonial;
