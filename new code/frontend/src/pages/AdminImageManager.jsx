import { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../api/api';
import { Trash2, Edit, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';

const AdminImageManager = () => {
    const [images, setImages] = useState([]);
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Convert Google Drive sharing link to direct URL
    const convertGoogleDriveUrl = (inputUrl) => {
        const fileIdMatch = inputUrl.match(/\/file\/d\/(.+?)\/view/);
        if (fileIdMatch && fileIdMatch[1]) {
            return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
        }
        return inputUrl; // Return unchanged if not a Google Drive link
    };

    // Convert stored URL to view-friendly URL
    const getViewUrl = (storedUrl) => {
        const fileIdMatch = storedUrl.match(/id=([^&]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
            return `https://drive.google.com/uc?id=${fileIdMatch[1]}`;
        }
        return storedUrl; // Return unchanged if not a Google Drive link
    };


    // Fetch images on mount
    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await API.get('/overview_images');
            setImages(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch images');
            console.error(err);
        }
    };

    // Handle add or update image
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) {
            setMessage('');
            setError('Image URL is required');
            return;
        }
        const formattedUrl = convertGoogleDriveUrl(url);
        try {
            if (editId) {
                // Update existing image
                const response = await API.put(`/overview_images/${editId}`, {
                    name,
                    url: formattedUrl,
                });
                setImages(images.map((img) => (img.id === editId ? response.data.image : img)));
                setMessage('Image updated successfully');
            } else {
                // Add new image
                const response = await API.post('/overview_images', {
                    name,
                    url: formattedUrl,
                });
                setImages([response.data.image, ...images]);
                setMessage('Image added successfully');
            }
            setUrl('');
            setName('');
            setEditId(null);
            setError('');
        } catch (err) {
            setMessage('');
            setError(err.response?.data?.error || 'Failed to save image');
        }
    };

    // Handle edit button click
    const handleEdit = (image) => {
        setEditId(image.id);
        setName(image.name);
        setUrl(image.url);
        setMessage('');
        setError('');
    };

    // Handle delete
    const handleDelete = async (id) => {
        try {
            await API.delete(`/overview_images/${id}`);
            setImages(images.filter((img) => img.id !== id));
            setMessage('Image deleted successfully');
            setError('');
        } catch (err) {
            setMessage('');
            setError('Failed to delete image');
        }
    };

    // Handle view button click
  const handleView = (url) => {
    window.open(getViewUrl(url), '_blank');
  };

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-6 text-[#4b0081]">Manage Carousel Images</h2>

                {/* Form for adding/updating images */}
                <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-6 rounded-lg shadow-md">
                    <div>
                        <label className="block mb-1 text-[#4b0081] font-semibold">Image Name (optional)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#fdb727]"
                            placeholder="Enter image name"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-[#4b0081] font-semibold">Image URL</label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#fdb727]"
                            placeholder="Enter image URL (e.g., Google Drive sharing link)"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Paste a Google Drive sharing link or direct image URL (e.g., https://drive.google.com/file/d/.../view)
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="bg-[#fdb727] text-black px-4 py-2 rounded-full hover:bg-[#f59e0b] transition-all duration-300 font-semibold"
                    >
                        {editId ? 'Update Image' : 'Add Image'}
                    </button>
                </form>

                {/* Messages */}
                {message && <p className="text-green-600 text-center mb-4">{message}</p>}
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                {/* Image list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.length > 0 ? (
                        images.map((image) => (
                            <div key={image.id} className="relative bg-white p-4 rounded-lg shadow-md">
                                <img
                                    src={getViewUrl(image.url)}
                                    alt={image.name}
                                    className="w-full h-40 object-cover rounded-md mb-2"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop';
                                    }}
                                />
                                <p className="text-[#4b0081] font-semibold">{image.name || 'Untitled Image'}</p>
                                <p className="text-gray-600 text-sm truncate">{image.url}</p>
                                <div className="flex justify-between mt-2">
                                    <button
                                        onClick={() => handleView(image.url)}
                                        className="flex items-center text-[#4b0081] hover:text-[#fdb727] transition-colors duration-300"
                                    >
                                        <Eye className="h-4 w-4 mr-1" /> View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(image)}
                                        className="flex items-center text-[#4b0081] hover:text-[#fdb727] transition-colors duration-300"
                                    >
                                        <Edit className="h-4 w-4 mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-300"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">No images available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminImageManager;