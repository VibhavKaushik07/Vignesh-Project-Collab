import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  Leaf,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { FarmingActivity } from '../types';

export const ActivityTrackerPage: React.FC = () => {
  const [activities, setActivities] = useState<FarmingActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Filter states
  const [cropFilter, setCropFilter] = useState<string>('');
  const [organicFilter, setOrganicFilter] = useState<string>('');

  // Form states
  const [formData, setFormData] = useState({
    crop_name: 'Tomato',
    activity_date: new Date().toISOString().split('T')[0],
    activity_type: 'Spraying',
    pest_disease: '',
    product_used: '',
    quantity: '',
    is_organic: false,
    cost: 0,
    notes: '',
    follow_up_date: '',
    status: 'Completed'
  });

  useEffect(() => {
    loadActivities();
  }, [cropFilter, organicFilter]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const isOrg = organicFilter === 'true' ? true : organicFilter === 'false' ? false : undefined;
      const data = await api.getActivities(cropFilter || undefined, isOrg);
      setActivities(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.logActivity(formData);
      setShowModal(false);
      // Reset form
      setFormData({
        crop_name: 'Tomato',
        activity_date: new Date().toISOString().split('T')[0],
        activity_type: 'Spraying',
        pest_disease: '',
        product_used: '',
        quantity: '',
        is_organic: false,
        cost: 0,
        notes: '',
        follow_up_date: '',
        status: 'Completed'
      });
      loadActivities();
    } catch (err: any) {
      alert(err.message || 'Failed to save activity');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this activity log?')) {
      try {
        await api.deleteActivity(id);
        loadActivities();
      } catch (err: any) {
        alert(err.message || 'Failed to delete activity');
      }
    }
  };

  // Summary statistics
  const totalCost = activities.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const organicCount = activities.filter((a) => a.is_organic).length;
  const chemicalCount = activities.length - organicCount;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <CalendarCheck className="w-4 h-4 text-purple-700" />
            <span>Feature 10: Farming Activity Tracker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-emerald-950">
            Field Treatment Logbook & Timeline
          </h1>
          <p className="text-xs text-gray-500">
            Record chemical sprays, bio-pesticide applications, soil amendments, and track upcoming follow-up dates.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Activity</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-[11px] text-gray-500 font-medium mb-1">Total Activities Logged</div>
          <div className="text-2xl font-extrabold text-gray-900">{activities.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-[11px] text-gray-500 font-medium mb-1">Total Input Expenditure</div>
          <div className="text-2xl font-extrabold text-emerald-800">₹{totalCost.toLocaleString('en-IN')}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-[11px] text-gray-500 font-medium mb-1">Organic Applications</div>
          <div className="text-2xl font-extrabold text-green-600 flex items-center gap-1.5">
            <Leaf className="w-5 h-5 text-green-500" />
            <span>{organicCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-[11px] text-gray-500 font-medium mb-1">Chemical Applications</div>
          <div className="text-2xl font-extrabold text-blue-600">{chemicalCount}</div>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filter Activities:</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Filter by crop (e.g. Tomato)..."
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="w-full sm:w-56 text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <select
            value={organicFilter}
            onChange={(e) => setOrganicFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">All Treatments</option>
            <option value="true">Organic Only</option>
            <option value="false">Chemical Only</option>
          </select>
        </div>
      </div>

      {/* Activities Timeline / Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Loading farming timeline...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
          <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-700 mb-1">No activities logged yet</h3>
          <p className="text-xs text-gray-500 mb-4">Keep a detailed record of your sprays, inputs, and costs.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            Add First Activity
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-300 transition"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    act.is_organic
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {act.is_organic ? <Leaf className="w-5 h-5" /> : <CalendarCheck className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-900">{act.crop_name}</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      {act.activity_type}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        act.is_organic
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {act.is_organic ? 'Organic' : 'Chemical'}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Date: {act.activity_date}
                    </span>
                  </div>

                  <div className="text-xs text-gray-700 space-y-0.5">
                    {act.product_used && (
                      <div>
                        <strong>Product:</strong> {act.product_used} {act.quantity && `(${act.quantity})`}
                      </div>
                    )}
                    {act.pest_disease && (
                      <div className="text-gray-500">
                        <strong>Target:</strong> {act.pest_disease}
                      </div>
                    )}
                    {act.notes && (
                      <div className="text-gray-600 italic">"{act.notes}"</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                {act.follow_up_date && (
                  <div className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Follow-Up: {act.follow_up_date}</span>
                  </div>
                )}

                <div className="text-right">
                  <div className="text-xs font-bold text-gray-900">₹{act.cost}</div>
                  <div className="text-[10px] text-gray-400">{act.status}</div>
                </div>

                <button
                  onClick={() => handleDelete(act.id)}
                  title="Remove log entry"
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Activity Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg font-bold p-1 rounded-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Log Farming Activity / Spray Record
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Crop Name:</label>
                  <input
                    type="text"
                    required
                    value={formData.crop_name}
                    onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date:</label>
                  <input
                    type="date"
                    required
                    value={formData.activity_date}
                    onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Activity Type:</label>
                  <select
                    value={formData.activity_type}
                    onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Spraying">Foliar Spraying</option>
                    <option value="Organic Treatment">Organic / Bio-Inoculation</option>
                    <option value="Fertilizing">Soil Fertilizing / Top Dressing</option>
                    <option value="Weeding">Manual / Mechanical Weeding</option>
                    <option value="Sowing">Sowing / Transplanting</option>
                    <option value="Harvesting">Harvesting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Cost (₹):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Used:</label>
                <input
                  type="text"
                  placeholder="e.g. Neem Oil 10,000 ppm or Mancozeb 75% WP"
                  value={formData.product_used}
                  onChange={(e) => setFormData({ ...formData, product_used: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Quantity / Volume:</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 ml in 150 L water"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Follow-Up Date (Optional):</label>
                  <input
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_organic"
                  checked={formData.is_organic}
                  onChange={(e) => setFormData({ ...formData, is_organic: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="is_organic" className="font-semibold text-gray-800 cursor-pointer">
                  This is an Organic / Bio-treatment (Zero toxic residues)
                </label>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Observation Notes:</label>
                <textarea
                  rows={2}
                  placeholder="Field observations, pest density, morning weather..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Save to Logbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
