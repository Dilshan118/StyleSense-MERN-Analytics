import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';

const ProductForm = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('Men');
    const [subCategory, setSubCategory] = useState('T-Shirts');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState(0);
    const [sizes, setSizes] = useState('');
    const [colors, setColors] = useState('');
    const [isTrending, setIsTrending] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const { data } = await axios.get(`http://localhost:5001/api/products/${id}`);
                    setName(data.name);
                    setPrice(data.price);
                    setCategory(data.category);
                    setSubCategory(data.subCategory);
                    setDescription(data.description || '');
                    setStock(data.stock);
                    setSizes(data.sizes.join(','));
                    setColors(data.colors.join(','));
                    setIsTrending(data.isTrending);
                    if (data.image) {
                        setPreview(`http://localhost:5001${data.image}`);
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('description', description);
        formData.append('stock', stock);
        formData.append('sizes', sizes);
        formData.append('colors', colors);
        formData.append('isTrending', isTrending);
        if (image) {
            formData.append('image', image);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            if (isEditMode) {
                await axios.put(`http://localhost:5001/api/products/${id}`, formData, config);
            } else {
                await axios.post('http://localhost:5001/api/products', formData, config);
            }
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            alert('Error saving product');
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/products" className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200">
                    <ArrowLeft size={20} className="text-gray-500" />
                </Link>
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                        <div className="flex items-center gap-6">
                            <div className="h-32 w-32 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <Upload size={24} className="text-gray-400" />
                                )}
                            </div>
                            <div>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="image"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                                >
                                    Choose Image
                                </label>
                                <p className="mt-2 text-xs text-gray-500">JPG, PNG, WebP up to 5MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border"
                                required
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border"
                                required
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border"
                            >
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>

                        {/* Sub Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                            <select
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border"
                            >
                                <option value="T-Shirts">T-Shirts</option>
                                <option value="Jeans">Jeans</option>
                                <option value="Jackets">Jackets</option>
                                <option value="Dresses">Dresses</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border"
                                required
                            />
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
                            <input
                                type="text"
                                value={sizes}
                                onChange={(e) => setSizes(e.target.value)}
                                placeholder="S,M,L,XL"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border"
                            />
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
                            <input
                                type="text"
                                value={colors}
                                onChange={(e) => setColors(e.target.value)}
                                placeholder="Red,Blue,Green"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border"
                            />
                        </div>

                        {/* Trending */}
                        <div className="col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isTrending}
                                    onChange={(e) => setIsTrending(e.target.checked)}
                                    className="rounded border-gray-300 text-black focus:ring-black"
                                />
                                <span className="text-sm text-gray-700">Mark as Trending Product</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <Link
                        to="/admin/products"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-lg hover:bg-gray-800 disabled:opacity-50"
                    >
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isEditMode ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
