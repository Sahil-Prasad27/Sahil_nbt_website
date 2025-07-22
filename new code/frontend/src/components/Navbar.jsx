import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:text-yellow-300">Dashboard</Link>
        <Link to="/services" className="hover:text-yellow-300">Services</Link>
        <Link to="/courses" className="hover:text-yellow-300">Courses</Link>
        {/* <Link to="/testimonials" className="hover:text-yellow-300">Testimonials</Link> */}
        <Link to="/team" className="hover:text-yellow-300">Team</Link>
        <Link to="/mission" className="hover:text-yellow-300">Mission</Link>
        <Link to="/contact" className="hover:text-yellow-300">Contact</Link>
        <Link to="/overview" className="hover:text-yellow-300">Overview</Link>
        <Link to="/clientlist" className="hover:text-yellow-300">Clientlist</Link>
        <Link to="/faqsection" className="hover:text-yellow-300">FAQ</Link>
        <Link to="/coupons" className="hover:text-yellow-300">Coupen</Link>
        <Link to="/testimonials" className="hover:text-yellow-300">Testimonials</Link>
        <Link to="/overview-images" className="hover:text-yellow-300">Manage Images</Link>
      </div>
      <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
