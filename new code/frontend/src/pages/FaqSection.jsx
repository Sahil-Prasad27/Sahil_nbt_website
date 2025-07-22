import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:5000/faqs';

function FaqManager() {
  const [faqs, setFaqs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(API_URL);
      setFaqs(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleEdit = (faq) => {
    setEditingId(faq.id);
    setForm({ question: faq.question, answer: faq.answer });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/${editingId}`, form);
      setEditingId(null);
      setForm({ question: '', answer: '' });
      fetchFaqs();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchFaqs();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post(API_URL, newFaq);
      setNewFaq({ question: '', answer: '' });
      fetchFaqs();
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Manage FAQs</h2>

        {/* Add new FAQ */}
        <div className="mb-6 border p-4 rounded bg-white shadow">
          <h3 className="font-semibold mb-2">Add New FAQ</h3>
          <input
            type="text"
            placeholder="Question"
            value={newFaq.question}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            className="w-full mb-2 p-2 border"
          />
          <textarea
            placeholder="Answer"
            value={newFaq.answer}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            className="w-full mb-2 p-2 border"
          />
          <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
            Add
          </button>
        </div>

        {/* List FAQs */}
        {faqs.map((faq) => (
          <div key={faq.id} className="mb-4 border p-4 bg-white rounded shadow">
            {editingId === faq.id ? (
              <>
                <input
                  type="text"
                  name="question"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full mb-2 p-2 border"
                />
                <textarea
                  name="answer"
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  className="w-full mb-2 p-2 border"
                />
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <p className="font-semibold">{faq.question}</p>
                <p className="text-gray-700">{faq.answer}</p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaqManager;
