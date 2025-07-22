import Navbar from '../components/Navbar';

function Dashboard() {
  return (
    <div>
  <Navbar />
  <div className="p-6 bg-gray-50 min-h-screen">
    <h1 className="text-3xl font-bold">Admin Dashboard – Next Bigg Tech</h1>
    <p className="mt-2 text-gray-700">
      Welcome Admin! Manage content, courses, FAQs, coupons, clients, and more here.
    </p>

    <section className="mt-8 grid md:grid-cols-2 gap-6">
      <div className="p-6 bg-white shadow rounded">
        <h2 className="font-semibold text-xl mb-2">🏢 Company Overview</h2>
        <ul className="text-gray-600 space-y-1">
          <li><strong>Founded:</strong> 2009, Jaipur</li>
          <li><strong>Team Size:</strong> 50–200</li>
          <li><strong>Headquarters:</strong> GA‑18, Bhawani Nagar, Jaipur</li>
          <li><strong>Rating:</strong> 4.9/5 on Clutch · 3.8/5 on AmbitionBox</li>
        </ul>
      </div>

      <div className="p-6 bg-white shadow rounded">
        <h2 className="font-semibold text-xl mb-2">💼 Our Services</h2>
        <ul className="text-gray-600 space-y-1">
          <li>• Web & Mobile App Development (React, Laravel, Flutter)</li>
          <li>• AI & Machine Learning</li>
          <li>• eCommerce & CMS Platforms</li>
          <li>• AR/VR, IoT, Blockchain</li>
          <li>• Digital Marketing & SEO</li>
        </ul>
      </div>
    </section>

    <section className="mt-8 bg-white p-6 shadow rounded">
      <h2 className="font-semibold text-xl mb-2">🏅 Why We’re Trusted</h2>
      <ul className="text-gray-600 space-y-1">
        <li>• ISO-certified, 4.9★ Clutch rating</li>
        <li>• Global clients in finance, healthcare, e-commerce</li>
        <li>• Strong internship and training programs</li>
      </ul>
    </section>
  </div>
</div>

  );
}

export default Dashboard;
