/**
 * E-Cell MIET Floating Feedback Component
 * Premium React + Tailwind CSS
 */

const { useState, useEffect, useRef } = React;

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyed7dK1l3uGtd1tP1fzr2Yc0to5XnldKmhYKUYIhWy6U1TTgg8z48uBEQfPFOczXY/exec';

function FeedbackModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    feedback: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({ name: '', feedback: '' });
      }, 2000);
      
    } catch (err) {
      console.error('Feedback Error:', err);
      setIsSubmitting(false);
      setError('Connection failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full max-w-md bg-bg-card border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-primary blur-lg opacity-50"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary text-white transition-all duration-300 group"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 sm:p-10">
          {isSuccess ? (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-2xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-heading font-extrabold mb-2 text-white">Thank You!</h2>
              <p className="text-white/60 font-medium">Your feedback drives our excellence.</p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center sm:text-left">
                <h2 className="text-3xl font-heading font-extrabold mb-2 tracking-tight italic text-white">Share <span className="text-primary not-italic">Feedback</span></h2>
                <p className="text-white/40 text-sm font-medium">We value your perspective on our journey.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2rem] font-black text-white/40 ml-1">Identity</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all text-sm text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2rem] font-black text-white/40 ml-1">Perspective</label>
                  <textarea 
                    required
                    placeholder="Tell us what you think..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all h-32 resize-none text-sm leading-relaxed text-white"
                    value={formData.feedback}
                    onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-bold text-center px-4 py-2 bg-red-500/5 rounded-lg mb-4">
                    {error}
                  </p>
                )}

                <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2rem] text-[0.8rem] py-4 rounded-2xl transition-all duration-500 shadow-[0_15px_30px_rgba(232,0,29,0.2)] disabled:opacity-50 disabled:cursor-wait mt-4 group overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      "Send Feedback"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FeedbackSystem() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-24 md:bottom-8 right-6 md:right-[5.5rem] z-[9000] flex flex-col items-end group">
        <div className="mb-4 px-4 py-2 bg-bg-card border border-white/10 backdrop-blur-xl rounded-xl text-xs font-black uppercase tracking-widest text-white/80 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500 pointer-events-none shadow-2xl">
          Share Feedback
        </div>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_20px_50px_rgba(232,0,29,0.3)] hover:scale-110 hover:rotate-12 active:scale-95 transition-all duration-500 border-2 border-white/20"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
          <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </button>
      </div>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

function initFeedback() {
  const rootId = 'feedback-system-root';
  let root = document.getElementById(rootId);
  if (!root) {
    root = document.createElement('div');
    root.id = rootId;
    document.body.appendChild(root);
  }
  const reactRoot = ReactDOM.createRoot(root);
  reactRoot.render(<FeedbackSystem />);
}

if (window.React && window.ReactDOM) {
  initFeedback();
} else {
  window.addEventListener('load', () => {
    if (window.React && window.ReactDOM) initFeedback();
  });
}
