import { useEffect, useState } from 'react';
import API from '../api/api';
import Navbar from '../components/Navbar';


function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({ code: '', discount: '', time_limit: '' });
  const [editingCode, setEditingCode] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await API.get('/coupons');
    setCoupons(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCode) {
      await API.put(`/coupons/${editingCode}`, {
        discount: formData.discount,
        time_limit: formData.time_limit
      });
    } else {
      await API.post('/coupons', formData);
    }
    setFormData({ code: '', discount: '', time_limit: '' });
    setEditingCode(null);
    fetchCoupons();
  };

  const handleEdit = (coupon) => {
    setFormData(coupon);
    setEditingCode(coupon.code);
  };

  const handleDelete = async (code) => {
    if (confirm('Delete this coupon?')) {
      await API.delete(`/coupons/${code}`);
      fetchCoupons();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Manage Coupons</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Coupon Code"
            className="border p-2"
            disabled={!!editingCode}
            required
          />
          <input
            name="discount"
            type="number"
            step="0.01"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Discount %"
            className="border p-2"
            required
          />
          <input
            name="time_limit"
            type="number"
            value={formData.time_limit}
            onChange={handleChange}
            placeholder="Time Limit (Days)"
            className="border p-2"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-full">
            {editingCode ? 'Update Coupon' : 'Add Coupon'}
          </button>
        </form>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Code</th>
              <th className="border p-2">Discount %</th>
              <th className="border p-2">Time Limit (days)</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.code}>
                <td className="border p-2">{coupon.code}</td>
                <td className="border p-2">{coupon.discount}</td>
                <td className="border p-2">{coupon.time_limit}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.code)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Coupons;
