import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { AppRoutes } from '../../constant/constant'
import NavbarComp from '../navbar/NavbarComp'

const ImagesComp = () => {
    const [images, setImages] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [label, setLabel] = useState('')
    const [file, setFile] = useState(null)

    const headers = { Authorization: `Bearer ${Cookies.get('token')}` }

    const fetchImages = (p = 1) => {
        setLoading(true)
        setError('')
        axios.get(`${AppRoutes.getImages}?page=${p}&limit=8`, { headers })
            .then((res) => {
                setImages(res.data.data.images)
                setTotalPages(res.data.data.pagination.totalPages)
            })
            .catch(() => setError('Images load nahi hui!'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchImages(page) }, [page])

    const handleUpload = (e) => {
        e.preventDefault()
        if (!file) return
        setUploading(true)
        const formData = new FormData()
        formData.append('image', file)
        formData.append('label', label || 'uncategorized')

        axios.post(AppRoutes.uploadImage, formData, { headers })
            .then(() => {
                toast.success("Image upload ho gayi!")
                setFile(null)
                setLabel('')
                e.target.reset()
                fetchImages(1)
            })
            .catch(() => toast.error("Uploading Eror"))
            .finally(() => setUploading(false))
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <NavbarComp />
            <div className="max-w-6xl mx-auto p-6">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h3 className="font-semibold text-slate-700 mb-4">Image Upload </h3>
                    <form onSubmit={handleUpload} className="flex flex-wrap gap-3 items-end">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Select Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="border border-slate-200 p-2 rounded-lg text-sm bg-slate-50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Label (Optional)</label>
                            <input
                                type="text"
                                placeholder="nature, cars, food..."
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm disabled:opacity-50 transition-all"
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-center text-blue-600 font-medium animate-pulse py-10">Loading...</p>
                ) : images.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <p className="text-xl">Image Not Found!</p>
                        <p className="text-sm mt-2">Upload Image</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img) => (
                                <div key={img._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all">
                                    <img src={img.url} alt={img.originalName} className="w-full h-40 object-cover" />
                                    <div className="p-3">
                                        <p className="text-xs text-slate-500 truncate mb-1">{img.originalName}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                                {img.label}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {(img.size / 1024).toFixed(1)} KB
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center gap-2 mt-8">
                            <button
                                onClick={() => setPage(p => p - 1)}
                                disabled={page === 1}
                                className="px-5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-slate-50 transition-all"
                            >
                                ← previous
                            </button>
                            <span className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                                {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page === totalPages}
                                className="px-5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-slate-50 transition-all"
                            >
                                Next →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ImagesComp