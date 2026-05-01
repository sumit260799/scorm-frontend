import {useState} from 'react';
import useScormApi from '../hooks/useScormApi';

const ScormLMS = () => {
  const [file, setFile] = useState(null);
  const [launchUrl, setLaunchUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize the SCORM 1.2 API
  useScormApi();

  // Get the base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Dynamically use the correct URL
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.launch) {
        // If the backend returns a relative path like "/scorm-lms/player.html..."
        // and your backend is on a different domain, you must prepend the domain.
        const fullLaunchUrl = data.launch.startsWith('http')
          ? data.launch
          : `https://scrom-lms-osq5.vercel.app${data.launch}`;

        setLaunchUrl(fullLaunchUrl);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };
  const openCourse = () => {
    if (!launchUrl) return;

    // SCORM content often requires a popup
    const win = window.open(launchUrl, '_blank');
    if (!win) {
      alert('Popup blocked! Please allow popups to view the course.');
    }
  };

  return (
    <div className='min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 font-sans text-white'>
      {/* Glassmorphism Card */}
      <div className='w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl'>
        <h2 className='text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent'>
          Siksa Course Manager
        </h2>

        <form onSubmit={handleUpload} className='space-y-6'>
          <div className='relative group'>
            <input
              type='file'
              onChange={e => setFile(e.target.files[0])}
              className='w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
              loading
                ? 'bg-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {loading ? 'Processing...' : 'Upload SCORM ZIP'}
          </button>
        </form>

        {launchUrl && (
          <div className='mt-8 pt-6 border-t border-white/10 text-center animate-fade-in'>
            <p className='text-emerald-400 text-sm mb-4'>Upload Successful!</p>
            <button
              onClick={openCourse}
              className='px-6 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors'
            >
              🚀 Launch Course
            </button>
          </div>
        )}
      </div>

      {/* Optional: Course Iframe View */}
      {launchUrl && (
        <div className='mt-10 w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 shadow-lg'>
          <iframe
            src={launchUrl}
            title='SCORM Player'
            className='w-full h-[600px] bg-white'
          />
        </div>
      )}
    </div>
  );
};

export default ScormLMS;
