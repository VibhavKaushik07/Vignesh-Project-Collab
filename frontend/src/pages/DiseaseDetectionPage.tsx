import React, { useState, useEffect } from 'react';
import {
  ScanLine,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  ShieldCheck,
  Leaf,
  History,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { DiseasePrediction } from '../types';

const POPULAR_CROPS = [
  'Tomato',
  'Rice',
  'Chilli',
  'Potato',
  'Cotton',
  'Wheat'
];

export const DiseaseDetectionPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [customCrop, setCustomCrop] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiseasePrediction | null>(null);
  const [history, setHistory] = useState<DiseasePrediction[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await api.getDiseaseHistory();
      setHistory(data);
    } catch {
      // ignore
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file exceeds maximum 10 MB limit.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCrop = customCrop.trim() ? customCrop.trim() : selectedCrop;

    if (!finalCrop) {
      setError('Please select or specify the crop name.');
      return;
    }
    if (!selectedFile) {
      setError('Please upload a clear photograph of the affected crop leaf or stem.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const diagnosis = await api.analyzeDisease(finalCrop, selectedFile);
      setResult(diagnosis);
      loadHistory();
    } catch (err: any) {
      setError(err.message || 'Diagnostic analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
          <ScanLine className="w-4 h-4 text-emerald-600" />
          <span>Feature 2: AI Crop Disease Detection</span>
        </div>
        <h1 className="text-3xl font-extrabold text-emerald-950 mb-2">
          Diagnostic Leaf & Pest Analysis
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Upload an image of your affected crop leaf, fruit, or stem. Our diagnostic engine evaluates disease patterns, provides verified chemical and organic treatments, and links directly to ICAR guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Diagnostic Form & Upload Panel */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>Step 1: Select Crop & Upload Image</span>
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Crop Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Select Crop:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {POPULAR_CROPS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => { setSelectedCrop(c); setCustomCrop(''); }}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition ${
                        selectedCrop === c && !customCrop
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or enter other crop name (e.g. Maize, Brinjal, Soybean)"
                  value={customCrop}
                  onChange={(e) => setCustomCrop(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Image Upload Box */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Upload Leaf Photo (PNG, JPG, WebP max 10MB):
                </label>

                {previewUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-gray-50 aspect-video flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Crop Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={resetForm}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs hover:bg-black/80 transition flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Change</span>
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 hover:bg-emerald-50/30 transition text-center group">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 mb-1">
                      Click to upload or drag & drop leaf image
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Clear close-up photograph of symptoms yields highest diagnostic accuracy
                    </span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !selectedFile}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Leaf Pathology...</span>
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4" />
                    <span>Diagnose Crop Symptoms</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Model Transparency Disclaimer */}
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Demonstration & Heuristic Transparency:</strong> All diagnostic findings are generated by KrishiRakshak's agronomic heuristic model and verified agricultural pathology standards. Never substitute algorithmic diagnoses for certified local agricultural officer field inspections.
            </div>
          </div>
        </div>

        {/* Diagnosis Results Display */}
        <div className="lg:col-span-5">
          {result ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-600 p-6 shadow-md space-y-5 animate-in fade-in duration-300">
              {/* Result Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Diagnosis Result
                  </span>
                  {result.is_demo_mode && (
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      Heuristic Mode
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-extrabold text-gray-900">
                  {result.disease_name}
                </h3>
                {result.scientific_name && (
                  <p className="text-xs italic text-gray-500 font-serif">
                    Pathogen: {result.scientific_name}
                  </p>
                )}
              </div>

              {/* Confidence & Severity Meters */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <div className="text-[11px] text-gray-500 font-medium mb-1">Confidence Score</div>
                  <div className="text-base font-bold text-emerald-700">
                    {Math.round(result.confidence * 100)}%
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full"
                      style={{ width: `${Math.round(result.confidence * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-gray-500 font-medium mb-1">Severity Level</div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    result.severity === 'Severe'
                      ? 'bg-rose-100 text-rose-800'
                      : result.severity === 'High'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {result.severity}
                  </span>
                </div>
              </div>

              {/* Symptoms */}
              {result.symptoms && (
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">Observed Symptoms:</h4>
                  <p className="text-xs text-gray-600 leading-relaxed bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                    {result.symptoms}
                  </p>
                </div>
              )}

              {/* Causes */}
              {result.causes && (
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">Environmental Drivers:</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {result.causes}
                  </p>
                </div>
              )}

              {/* Organic Treatment */}
              {result.organic_treatment && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Recommended Organic / Bio-Control:</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {result.organic_treatment}
                  </p>
                </div>
              )}

              {/* Chemical Treatment */}
              {result.chemical_treatment && (
                <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Approved Chemical Management:</span>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    {result.chemical_treatment}
                  </p>
                </div>
              )}

              {/* Advisory Link */}
              {result.advisory_link && (
                <div className="pt-2 text-right">
                  <a
                    href={result.advisory_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    <span>Read Official ICAR Research Advisory</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mb-3">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 mb-1">Awaiting Image Submission</h3>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                Choose a crop, upload an affected leaf image on the left, and click Diagnose to view the full pathological analysis.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Diagnoses History */}
      {history.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <span>Recent Diagnoses Log</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {history.slice(0, 3).map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-white border border-gray-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold text-emerald-800">{item.crop_name}</span>
                  <span>{Math.round(item.confidence * 100)}% match</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">{item.disease_name}</h4>
                <p className="text-[11px] text-gray-600 line-clamp-2 mb-2">{item.symptoms}</p>
                <div className="text-[10px] text-gray-400">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
