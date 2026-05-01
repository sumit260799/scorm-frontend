import React, {useState, useEffect, useCallback} from 'react';
import useScormApi from '../hooks/useScormApi';

// The production backend URL provided
const BACKEND_URL = 'https://scrom-lms-osq5.vercel.app';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${BACKEND_URL}/scorm-lms`;

const ScormLMS = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Initialize SCORM API
  useScormApi();

  // Fetch logic with mount-check to avoid React 19 setState warnings
  const fetchCourses = useCallback(async isMounted => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (isMounted) setCourses(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCourses(isMounted).finally(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [fetchCourses]);

  const onUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        // Refresh the list to show the new course immediately
        fetchCourses(true);
      } else {
        const errorData = await res.json();
        alert(`Upload Failed: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Upload Error:', err);
    } finally {
      setUploading(false);
      // Clear the input
      e.target.value = null;
    }
  };

  return (
    <div className='min-h-screen bg-[#0a0c10] text-slate-200 font-sans selection:bg-blue-500/30'>
      {/* Navigation */}
      <nav className='sticky top-0 z-50 border-b border-white/5 bg-[#0a0c10]/80 backdrop-blur-md'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-600/20'>
              S
            </div>
            <span className='font-bold tracking-tight text-xl text-white'>
              SIKSA
            </span>
          </div>

          <label className='relative inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold text-white transition-all cursor-pointer shadow-xl shadow-blue-600/10 active:scale-95'>
            {uploading ? 'UPLOADING...' : 'UPLOAD SCORM'}
            <input
              type='file'
              className='hidden'
              onChange={onUpload}
              disabled={uploading}
              accept='.zip'
            />
          </label>
        </div>
      </nav>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-6 py-12'>
        <header className='mb-12'>
          <h2 className='text-3xl font-semibold text-white'>
            Course Repository
          </h2>
          <p className='text-slate-500 mt-1'>
            Manage and launch your professional SCORM training modules.
          </p>
        </header>

        {loading ? (
          <div className='flex flex-col items-center justify-center py-32 gap-4'>
            <div className='w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
            <p className='text-slate-500 text-sm font-medium'>
              Synchronizing repository...
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {courses.map(course => (
              <div
                key={course.id}
                className='group flex flex-col bg-[#11141a] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300'
              >
                {/* Thumbnail */}
                <div className='aspect-video relative overflow-hidden bg-slate-800'>
                  <img
                    src={
                      course.thumb ||
                      'https://via.placeholder.com/400x225?text=No+Thumbnail'
                    }
                    alt={course.title}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors' />
                </div>

                {/* Info */}
                <div className='p-6 flex flex-col flex-1'>
                  <span className='text-[10px] font-black tracking-[0.2em] text-blue-500 uppercase mb-3'>
                    {course.pub || 'General Content'}
                  </span>
                  <h3
                    className='font-bold text-white mb-8 line-clamp-2 leading-snug h-12'
                    title={course.title}
                  >
                    {course.title}
                  </h3>

                  <button
                    onClick={() =>
                      window.open(`${BACKEND_URL}${course.launch}`, '_blank')
                    }
                    className='mt-auto py-3 bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 text-white rounded-xl text-xs font-black tracking-widest transition-all active:scale-[0.98] uppercase'
                  >
                    Launch Module
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className='text-center py-32 border-2 border-dashed border-white/5 rounded-[2.5rem]'>
            <div className='w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-slate-600'>📁</span>
            </div>
            <p className='text-slate-500 text-sm font-medium'>
              No courses found in the current environment.
            </p>
            <p className='text-slate-700 text-xs mt-1'>
              Upload a ZIP to get started.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScormLMS;
