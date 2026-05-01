import {useState, useEffect} from 'react';
import useScormApi from '../hooks/useScormApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/scorm-lms';

const ScormLMS = () => {
  const [courses, setCourses] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useScormApi();

  // Logic remains identical to your original code
  const refreshList = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchInitialCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/courses`);
        const data = await res.json();
        if (active) setCourses(data);
      } catch (err) {
        if (active) console.error(err);
      }
    };
    fetchInitialCourses();
    return () => {
      active = false;
    };
  }, []);

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setFile(null);
        refreshList();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-blue-500/30'>
      {/* Professional Top Navigation */}
      <nav className='sticky top-0 z-50 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-500/20'>
              S
            </div>
            <span className='font-bold tracking-tight text-xl'>SIKSA</span>
          </div>

          <div className='hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400'>
            <a href='#' className='hover:text-white transition-colors'>
              Dashboard
            </a>
            <a href='#' className='hover:text-white transition-colors'>
              Course Library
            </a>
            <a href='#' className='hover:text-white transition-colors'>
              Settings
            </a>
          </div>
        </div>
      </nav>

      <div className='max-w-7xl mx-auto px-6 py-10'>
        {/* Header Section */}
        <header className='mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6'>
          <div>
            <h1 className='text-3xl font-semibold tracking-tight text-white'>
              Repository
            </h1>
            <p className='text-zinc-500 mt-1 max-w-md'>
              Access and manage your professional SCORM-compliant training
              modules.
            </p>
          </div>
        </header>

        {/* Professional Upload Section */}
        <section className='mb-12 bg-zinc-900/50 border border-zinc-800 p-1 rounded-2xl shadow-sm'>
          <form
            onSubmit={handleUpload}
            className='flex flex-col md:flex-row gap-2 items-center'
          >
            <div className='relative flex-1 w-full'>
              <input
                id='file-upload'
                type='file'
                onChange={e => setFile(e.target.files[0])}
                className='hidden'
                required
              />
              <label
                htmlFor='file-upload'
                className='flex items-center gap-3 w-full px-5 py-3 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-colors border border-transparent active:border-zinc-700'
              >
                <span className='p-2 bg-zinc-800 rounded-lg text-zinc-400'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                    <polyline points='17 8 12 3 7 8' />
                    <line x1='12' x2='12' y1='3' y2='15' />
                  </svg>
                </span>
                <span className='text-sm font-medium text-zinc-300'>
                  {file ? file.name : 'Select SCORM package (ZIP)'}
                </span>
              </label>
            </div>

            <button
              type='submit'
              disabled={loading || !file}
              className='w-full md:w-auto px-8 py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <div className='w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin' />
                  PROCESSING...
                </>
              ) : (
                'ADD TO LIBRARY'
              )}
            </button>
          </form>
        </section>

        {/* Course Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {courses.map(course => (
            <div
              key={course.courseId}
              className='group bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300 flex flex-col'
            >
              <div className='relative aspect-video overflow-hidden'>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent' />
                <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <span className='px-2 py-1 bg-zinc-900/80 backdrop-blur text-[10px] font-bold rounded border border-zinc-700'>
                    SCORM 1.2
                  </span>
                </div>
              </div>

              <div className='p-5 flex flex-col flex-1'>
                <div className='flex-1'>
                  <p className='text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2'>
                    {course.publisher || 'General Content'}
                  </p>
                  <h3 className='font-semibold text-lg leading-tight text-zinc-100 group-hover:text-white transition-colors line-clamp-2 mb-4'>
                    {course.title}
                  </h3>
                </div>

                <button
                  onClick={() =>
                    window.open(
                      `https://scrom-lms-osq5.vercel.app${course.launchUrl}`,
                      '_blank'
                    )
                  }
                  className='w-full py-2.5 bg-zinc-800 hover:bg-blue-600 text-zinc-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='14'
                    height='14'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polygon points='5 3 19 12 5 21 5 3' />
                  </svg>
                  LAUNCH MODULE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {courses.length === 0 && !loading && (
          <div className='text-center py-24 bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-3xl'>
            <div className='w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect x='2' y='7' width='20' height='14' rx='2' ry='2' />
                <path d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' />
              </svg>
            </div>
            <p className='text-zinc-400 font-medium'>No modules available.</p>
            <p className='text-zinc-600 text-sm mt-1'>
              Your uploaded courses will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScormLMS;
