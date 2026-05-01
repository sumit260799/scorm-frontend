import React, {useState, useEffect, useCallback} from 'react';
import useScormApi from './useScormApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/scorm-lms';

const ScormLMS = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useScormApi();

  const fetchCourses = useCallback(async isMounted => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses`);
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
      if (res.ok) fetchCourses(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#0a0c10] text-slate-200 font-sans selection:bg-blue-500/30'>
      {/* Top Navigation */}
      <nav className='sticky top-0 z-50 border-b border-white/5 bg-[#0a0c10]/80 backdrop-blur-md'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic'>
              S
            </div>
            <span className='font-bold tracking-tight text-xl text-white'>
              SIKSA
            </span>
          </div>

          <label className='relative inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold text-white transition-all cursor-pointer shadow-lg shadow-blue-900/20'>
            {uploading ? 'Uploading...' : 'Upload ZIP'}
            <input
              type='file'
              className='hidden'
              onChange={onUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto px-6 py-12'>
        <header className='mb-12'>
          <h2 className='text-3xl font-semibold text-white'>
            Course Repository
          </h2>
          <p className='text-slate-500 mt-1'>
            Manage and launch your SCORM 1.2 modules.
          </p>
        </header>

        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {courses.map(c => (
              <div
                key={c.id}
                className='group flex flex-col bg-[#11141a] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-300'
              >
                <div className='aspect-video relative overflow-hidden bg-slate-800'>
                  <img
                    src={
                      c.thumb ||
                      'https://via.placeholder.com/400x225?text=No+Thumbnail'
                    }
                    alt={c.title}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors' />
                </div>

                <div className='p-5 flex flex-col flex-1'>
                  <span className='text-[10px] font-bold tracking-widest text-blue-500 uppercase mb-2'>
                    {c.pub || 'General'}
                  </span>
                  <h3
                    className='font-medium text-white mb-6 line-clamp-2 leading-snug h-12'
                    title={c.title}
                  >
                    {c.title}
                  </h3>

                  <button
                    onClick={() =>
                      window.open(
                        `https://scrom-lms-osq5.vercel.app${c.launch}`,
                        '_blank'
                      )
                    }
                    className='mt-auto py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-bold tracking-wide transition-all active:scale-[0.98]'
                  >
                    LAUNCH MODULE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && courses.length === 0 && (
          <div className='text-center py-24 border-2 border-dashed border-white/5 rounded-3xl'>
            <p className='text-slate-500 text-sm'>
              No courses found. Start by uploading a SCORM ZIP.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScormLMS;
