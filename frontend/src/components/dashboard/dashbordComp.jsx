import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'
import { AppRoutes } from '../../constant/constant'
import NavbarComp from '../navbar/NavbarComp'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const DashboardComp = () => {
    const [total, setTotal] = useState(0)
    const [byDate, setByDate] = useState([])
    const [byLabel, setByLabel] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const headers = { Authorization: `Bearer ${Cookies.get('token')}` }
    const [filterDate, setFilterDate] = useState('')
    const [filteredImages, setFilteredImages] = useState([])
    const [filtering, setFiltering] = useState(false)

    const [hasFiltered, setHasFiltered] = useState(false)
    const [filterError, setFilterError] = useState('')

    const handleFilter = () => {
        if (!filterDate) return
        setFiltering(true)
        setHasFiltered(false)
        setFilteredImages([])

        axios.get(`${AppRoutes.analyticsFilter}?date=${filterDate}`, { headers })
            .then((res) => {
                setFilteredImages(res.data.data || [])
                setHasFiltered(true)
            })
            .catch(() => setFilterError("Filter nahi hua! Dobara try karo."))
            .finally(() => setFiltering(false))
    }

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [countRes, dateRes, labelRes] = await Promise.all([
                    axios.get(AppRoutes.analyticsCount, { headers }),
                    axios.get(AppRoutes.analyticsByDate, { headers }),
                    axios.get(AppRoutes.analyticsByLabel, { headers }),
                ])
                setTotal(countRes.data.data.total)
                setByDate(dateRes.data.data)
                setByLabel(labelRes.data.data)
            } catch {
                setError('Data load nahi hua! Dobara try karo.')
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    if (loading) return (
        <>
            <NavbarComp />
            <div className="flex items-center justify-center h-64">
                <p className="text-blue-600 text-lg font-medium animate-pulse">Loading...</p>
            </div>
        </>
    )

    return (
        <>
            <div className="min-h-screen bg-slate-50">
                <NavbarComp />
                <div className="max-w-6xl mx-auto p-6">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6 text-center">
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Total Images</p>
                        <p className="text-7xl font-bold text-blue-600">{total}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="text-slate-700 font-semibold mb-4">Per Day Images</h3>
                            {byDate.length === 0 ? (
                                <div className="flex items-center justify-center h-48 text-slate-400">
                                    This Day Image Not Found!
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={byDate}>
                                        <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="text-slate-700 font-semibold mb-4">Per Label Images</h3>
                            {byLabel.length === 0 ? (
                                <div className="flex items-center justify-center h-48 text-slate-400">
                                    Data Not Found!
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie data={byLabel} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={75} label>
                                            {byLabel.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">
                <h3 className="font-semibold text-slate-700 mb-4">Filter By Date</h3>
                <div className="flex gap-3 items-center mb-4">
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => {
                            setFilterDate(e.target.value)
                            setFilteredImages([]) 
                            setFilterError('') 
                        }}
                        className="border border-slate-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleFilter}
                        disabled={filtering || !filterDate}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-all"
                    >
                        {filtering ? 'Filtering...' : 'Filter'}
                    </button>

                    {filterDate && (
                        <button
                            onClick={() => {
                                setFilterDate('')
                                setFilteredImages([])
                                setFilterError('')
                            }}
                            className="text-slate-500 hover:text-red-500 text-sm underline"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {filtering && (
                    <p className="text-blue-500 text-sm animate-pulse">Filter ho raha hai...</p>
                )}

                {!filtering && filterDate && filteredImages.length === 0 && hasFiltered && (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-slate-500 font-medium">
                            {filterDate}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                            This Date Image Not Found
                        </p>
                    </div>
                )}

                {filteredImages.length > 0 && (
                    <>
                        <p className="text-sm text-slate-500 mb-3">
                            {filterDate} ko{' '}
                            <span className="font-semibold text-blue-600">
                                {filteredImages.length} image
                            </span>{' '}
                            upload hui thi
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {filteredImages.map((img) => (
                                <div key={img._id} className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all">
                                    <img src={img.url} className="w-full h-32 object-cover" />
                                    <div className="p-2">
                                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                            {img.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default DashboardComp