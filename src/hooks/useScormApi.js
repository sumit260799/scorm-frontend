import {useEffect} from 'react';

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
          console.log('🚀 SCORM Initialized');
          return 'true';
        },

        LMSFinish: () => {
          if (!initialized || terminated) return 'false';
          terminated = true;
          console.log('🏁 SCORM Finished');
          return 'true';
        },

        LMSGetValue: key => {
          console.log('📥 GET:', key);
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
          console.log('📤 SET:', key, value);
          if (key === 'cmi.suspend_data') {
            localStorage.setItem('suspend_data', value);
          }
          localStorage.setItem(key, value);
          return 'true';
        },

        LMSCommit: () => {
          if (!initialized) return 'false';
          console.log('💾 Commit to LMS');
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
