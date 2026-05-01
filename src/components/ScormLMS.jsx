import {useState, useEffect} from 'react';
import useScormApi from '../hooks/useScormApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/scorm-lms';

const ScormLMS = () => {
  const [courses, setCourses] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useScormApi();

  // Function to refresh the list manually (used after upload)
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
    <div className='min-h-screen bg-slate-950 p-8 text-white font-sans'>
      <div className='max-w-6xl mx-auto'>
        <header className='mb-12'>
          <h1 className='text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent'>
            SIKSA
          </h1>
          <p className='text-slate-400 mt-2'>
            Professional SCORM Learning Management
          </p>
        </header>

        <section className='mb-12 bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)]'>
          <h2 className='text-xl mb-6 font-bold flex items-center gap-2'>
            <span className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
            Upload New Content
          </h2>
          <form
            onSubmit={handleUpload}
            className='flex flex-col md:flex-row gap-6 items-center'
          >
            <div className='relative group w-full'>
              <input
                type='file'
                onChange={e => setFile(e.target.files[0])}
                className='w-full text-sm text-slate-400 file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:bg-gradient-to-br file:from-blue-600 file:to-indigo-600 file:text-white file:font-bold hover:file:opacity-90 cursor-pointer'
                required
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full md:w-auto px-12 py-3 bg-white text-slate-950 rounded-full font-black hover:bg-blue-400 hover:scale-105 transition-all duration-300 disabled:opacity-50'
            >
              {loading ? 'PROCESSING...' : 'ADD TO LIBRARY'}
            </button>
          </form>
        </section>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
          {courses.map(course => (
            <div
              key={course.courseId}
              className='group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500'
            >
              <div className='relative h-56'>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className='w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent' />
              </div>

              <div className='p-6'>
                <h3 className='font-black text-xl mb-2 text-slate-100 group-hover:text-blue-400 transition-colors'>
                  {course.title}
                </h3>
                <p className='text-slate-500 text-sm font-medium mb-6 uppercase tracking-widest'>
                  {course.publisher}
                </p>

                <button
                  onClick={() =>
                    window.open(
                      `https://scrom-lms-osq5.vercel.app${course.launchUrl}`,
                      '_blank'
                    )
                  }
                  className='w-full py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-2xl font-bold hover:bg-blue-500 hover:text-white transition-all duration-300'
                >
                  LAUNCH MODULE
                </button>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && !loading && (
          <div className='text-center py-32'>
            <p className='text-slate-600 font-medium italic'>
              Your repository is currently empty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScormLMS;
