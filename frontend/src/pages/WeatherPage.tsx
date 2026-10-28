import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Droplet,
  Wind,
  Thermometer,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Compass,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { WeatherData } from '../types';
import { SprayingStatusBadge } from '../components/SprayingStatusBadge';

const DISTRICT_LIST = [
  'Bengaluru Rural',
  'Bengaluru Urban',
  'Mysuru',
  'Belagavi',
  'Pune',
  'Nashik',
  'Nagpur',
  'Ludhiana',
  'Amritsar',
  'Varanasi',
  'Lucknow',
  'Guntur',
  'Jaipur',
  'Ahmedabad',
  'Bhopal',
  'Chennai',
  'Hyderabad',
  'Patna',
  'Kolkata'
];

export const WeatherPage: React.FC = () => {
  const [district, setDistrict] = useState<string>('Bengaluru Rural');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather(district);
  }, [district]);

  const fetchWeather = async (targetDistrict: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getWeather(targetDistrict);
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather forecast.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Title */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-3">
          <CloudSun className="w-4 h-4 text-sky-600" />
          <span>Feature 6: Weather & Spraying Window Advisory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-emerald-950 mb-2">
          Agrometeorological Spraying Forecast
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Real-time meteorological insights powered by Open-Meteo models. Protect your chemical and biological investments against rain wash-off, wind drift, and temperature-induced foliar phytotoxicity.
        </p>
      </div>

      {/* District Selector & Refresh Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Select District / Location:</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="flex-1 sm:w-64 text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            {DISTRICT_LIST.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchWeather(district)}
            title="Refresh forecast"
            className="p-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Retrieving atmospheric data for {district}...</p>
        </div>
      ) : error || !weather ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl text-center text-xs">
          {error || 'Unable to load weather forecast.'}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Current Conditions Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-emerald-800/80">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{weather.district}, {weather.state}</span>
                </div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white flex items-baseline gap-3">
                  <span>{weather.current.temperature}°C</span>
                  <span className="text-lg font-normal text-emerald-200">
                    {weather.current.condition}
                  </span>
                </div>
              </div>

              {/* Spraying Suitability Status Banner */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right">
                <div className="text-[11px] text-emerald-200 font-semibold uppercase tracking-wider mb-2">
                  Immediate Spraying Suitability:
                </div>
                <SprayingStatusBadge status={weather.spraying_advisory.status} size="lg" />
              </div>
            </div>

            {/* Current Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs text-emerald-100">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="text-emerald-300 flex items-center gap-1.5 mb-1">
                  <Thermometer className="w-4 h-4" />
                  <span>Temperature</span>
                </div>
                <div className="text-lg font-bold text-white">{weather.current.temperature}°C</div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="text-emerald-300 flex items-center gap-1.5 mb-1">
                  <Droplet className="w-4 h-4 text-sky-300" />
                  <span>Relative Humidity</span>
                </div>
                <div className="text-lg font-bold text-white">{weather.current.humidity}%</div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="text-emerald-300 flex items-center gap-1.5 mb-1">
                  <Wind className="w-4 h-4 text-teal-300" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-lg font-bold text-white">{weather.current.wind_speed} km/h</div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="text-emerald-300 flex items-center gap-1.5 mb-1">
                  <CloudRain className="w-4 h-4 text-blue-300" />
                  <span>Precipitation</span>
                </div>
                <div className="text-lg font-bold text-white">{weather.current.precipitation} mm</div>
              </div>
            </div>

            {/* Spraying Warnings / Conditions */}
            <div className="mt-6 p-4 rounded-2xl bg-black/20 border border-white/10 text-xs text-emerald-100 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>Field Application Guidance:</span>
              </div>
              {weather.spraying_advisory.alerts.map((alert, idx) => (
                <div key={idx} className="flex items-start gap-2 text-emerald-200/90 leading-relaxed">
                  <span className="text-emerald-400">•</span>
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Day Forecast Grid */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>5-Day Agricultural Weather Outlook</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {weather.forecast.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-emerald-800 mb-1">
                      {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </div>
                    <div className="text-xs text-gray-500 font-medium mb-3">
                      {day.condition}
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl font-extrabold text-gray-900">{Math.round(day.temp_max)}°</span>
                      <span className="text-xs text-gray-400">{Math.round(day.temp_min)}°</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-gray-100 text-[11px] text-gray-600">
                    <div className="flex justify-between">
                      <span>Rain:</span>
                      <strong className="text-gray-900">{day.precipitation_sum} mm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Wind Gusts:</span>
                      <strong className="text-gray-900">{Math.round(day.wind_max)} km/h</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attribution & Timestamp */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>Data Source:</strong> {weather.source}
            </div>
            <div>
              <strong>Last Synced:</strong> {weather.updated_at}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
