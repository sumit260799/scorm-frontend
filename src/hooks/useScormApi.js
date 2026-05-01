import {useEffect} from 'react';

/**
 * Hook to initialize the SCORM 1.2 API for the Siksa platform.
 * This ensures window.API is available for the course content.
 */
const useScormApi = () => {
  useEffect(() => {
    window.API = (() => {
      let initialized = false;
      let terminated = false;

      return {
        LMSInitialize: () => {
          if (initialized) return 'false';
          initialized = true;
          terminated = false;
          console.log('🚀 SIKSA: SCORM Initialized');
          return 'true';
        },

        LMSFinish: () => {
          if (!initialized || terminated) return 'false';
          terminated = true;
          console.log('🏁 SIKSA: SCORM Finished');
          return 'true';
        },

        LMSGetValue: key => {
          console.log('📥 SIKSA GET:', key);
          switch (key) {
            case 'cmi.core.student_id':
              return 'USER_001';
            case 'cmi.core.student_name':
              return 'Sumit Das';
            case 'cmi.core.lesson_status':
              return 'not attempted';
            case 'cmi.suspend_data':
              return localStorage.getItem('suspend_data') || '';
            default:
              return '';
          }
        },

        LMSSetValue: (key, value) => {
          console.log('📤 SIKSA SET:', key, value);
          if (key === 'cmi.suspend_data') {
            localStorage.setItem('suspend_data', value);
          }
          localStorage.setItem(key, value);
          return 'true';
        },

        LMSCommit: () => {
          if (!initialized) return 'false';
          console.log('💾 SIKSA: Progress Saved');
          return 'true';
        },

        LMSGetLastError: () => '0',
        LMSGetErrorString: () => 'No error',
        LMSGetDiagnostic: () => 'No diagnostic',
      };
    })();
  }, []);
};

export default useScormApi;
