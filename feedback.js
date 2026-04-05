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

  // Close on Outside Click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  // Handle Tab / Escape
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
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires no-cors for simple POST
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // With no-cors, we can't check response.ok, but we assume success if no error thrown
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
        className="relative w-full max-w-md bg-bg-card border border-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
      >
        {/* Glow Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-primary blur-lg opacity-50"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 sm:p-10">
          {isSuccess ? (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/50 shadow-2xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-heading font-extrabold mb-2 text-glow">Thank You!</h2>
              <p className="text-white/50 font-medium">Your feedback drives our excellence.</p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center sm:text-left">
                <h2 className="text-3xl font-heading font-extrabold mb-2 tracking-tight italic">Share <span className="text-white not-italic">Feedback</span></h2>
                <p className="text-white/40 text-sm font-medium">We value your perspective on our journey.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-black text-white/30 ml-2">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name (Optional)"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                {/* Feedback */}
                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-black text-white/30 ml-2">Share Your Feedback</label>
                  <textarea 
                    required
                    placeholder="Tell us what you think..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all h-32 resize-none text-sm leading-relaxed"
                    value={formData.feedback}
                    onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                  />
                </div>

                {/* Submit Button */}
                <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-[0.8rem] py-4 rounded-2xl transition-all duration-500 shadow-[0_15px_30px_rgba(232,0,29,0.2)] disabled:opacity-50 disabled:cursor-wait mt-4 group overflow-hidden relative"
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
      {/* Floating Trigger */}
      <div className="fixed bottom-8 right-[5.5rem] z-[9000] flex flex-col items-end group">
        {/* Tooltip */}
        <div className="mb-4 px-4 py-2 bg-bg-card border border-white/10 backdrop-blur-xl rounded-xl text-xs font-black uppercase tracking-widest text-white/80 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 pointer-events-none shadow-2xl">
          Share Feedback
        </div>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(232,0,29,0.4)] hover:scale-110 active:scale-95 transition-all duration-500 overflow-hidden"
        >
          {/* Subtle Pulse Rings */}
          <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping opacity-20"></div>
          
          <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </button>
      </div>

      {/* Modal */}
      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

// Global Injector Style
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-ring {
    0% { transform: scale(0.95); opacity: 0.5; }
    50% { transform: scale(1.05); opacity: 0.2; }
    100% { transform: scale(0.95); opacity: 0.5; }
  }
`;
document.head.append(style);

// Mount Application if not already present
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

// Wait for React/ReactDOM to be available
if (window.React && window.ReactDOM) {
  initFeedback();
} else {
  window.addEventListener('load', () => {
    if (window.React && window.ReactDOM) initFeedback();
  });
}
