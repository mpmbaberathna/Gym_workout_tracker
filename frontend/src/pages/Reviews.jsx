import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Star, MessageSquare, ImagePlus, Send, ChevronDown, MessageCircle } from 'lucide-react';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(null);
  const [sortRating, setSortRating] = useState('none');
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser && localStorage.getItem('token');
  const role = isBrowser && localStorage.getItem('role');
  
  // get backend url
  const backendBase = (() => {
    try {
      let b = api.defaults.baseURL || '';
      if (b.endsWith('/api')) b = b.slice(0, -4);
      return b.replace(/\/$/, '');
    } catch (e) {
      return '';
    }
  })();
  
  const makeImageUrl = (imgPath) => {
    if (!imgPath) return imgPath;
    if (/^https?:\/\//.test(imgPath)) return imgPath;
    return `${backendBase}${imgPath}`;
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const displayedReviews = (() => {
    if (sortRating === 'rating_desc') return [...reviews].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortRating === 'rating_asc') return [...reviews].sort((a, b) => (a.rating || 0) - (b.rating || 0));
    return reviews;
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || role !== 'member') return alert('You must be logged in as a member to post a review');
    if (!text.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text.trim());
      formData.append('rating', rating);
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }
      }

      await api.post('/reviews', formData);
      setText('');
      setRating(5);
      setFiles(null);
      const fileInput = document.querySelector('input[type=file]');
      if (fileInput) fileInput.value = null;
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to post review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-brand-light bg-gradient-to-br from-brand-light/50 to-blue-50/20 dark:from-brand-light dark:to-brand-light/90 text-brand-dark px-6 md:px-12 pt-28 pb-20 font-sans transition-colors duration-300 selection:bg-blue-500/30">
      
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/10 dark:bg-indigo-500/5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        
        
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-200 dark:border-blue-500/30">
            <MessageCircle size={14} /> Community
          </div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-gray sm:text-6xl">
            Reviews
          </h1>
          <p className="mt-4 text-base text-brand-gray leading-relaxed font-medium">
            Read feedback from members or share your own experience with the community.
          </p>
        </div>

        
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-10 -top-10 rounded-full bg-blue-500/10 p-16 pointer-events-none">
            <MessageSquare size={64} className="text-blue-500/20" />
          </div>

          {token && role === 'member' ? (
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray flex items-center gap-2">
                  <MessageSquare size={14} /> Your review
                </label>
                <textarea 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  rows={4} 
                  className="w-full resize-none rounded-2xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-5 py-4 text-sm font-medium text-brand-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20" 
                  placeholder="What's on your mind? Share your experience..."
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray flex items-center gap-2">
                    <ImagePlus size={14} /> Upload images
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={(e) => setFiles(e.target.files)} 
                    className="block w-full text-sm text-brand-gray file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-blue-100 dark:file:bg-blue-500/20 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-200 dark:hover:file:bg-blue-500/30 transition-colors file:transition-colors" 
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray flex items-center gap-2">
                    <Star size={14} /> Rating
                  </label>
                  <div className="relative">
                    <select 
                      value={rating} 
                      onChange={(e) => setRating(Number(e.target.value))} 
                      className="w-full appearance-none rounded-2xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-5 py-3 text-sm font-bold text-brand-dark outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all cursor-pointer"
                    >
                      {[5,4,3,2,1].map(n => (
                        <option key={n} value={n}>{n} star{n>1 ? 's' : ''}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border/50 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40 disabled:opacity-60 disabled:hover:scale-100"
                >
                  <Send size={16} className="transition-transform group-hover:translate-x-1" />
                  <span>{loading ? 'Posting...' : 'Publish Review'}</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0"></div>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                <MessageCircle size={32} />
              </div>
              <p className="text-lg font-bold text-brand-dark mb-1">Join the conversation</p>
              <p className="text-sm font-medium text-brand-gray">Log in as a member to post your own reviews. Reviews are visible to everyone.</p>
            </div>
          )}
        </div>

        
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-card/40 backdrop-blur-xl p-6 rounded-3xl border border-brand-border/60 shadow-sm">
            <div className="text-lg font-black text-brand-dark flex items-center gap-3">
              Community Feedback
              <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-400">
                {displayedReviews.length} Total
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-brand-gray">Sort by:</label>
              <div className="relative">
                <select
                  value={sortRating}
                  onChange={(e) => setSortRating(e.target.value)}
                  className="appearance-none rounded-xl border border-brand-border bg-white/80 dark:bg-slate-800/80 px-4 py-2 pr-10 text-sm font-bold text-brand-dark outline-none focus:border-blue-500 transition-all cursor-pointer shadow-sm"
                >
                  <option value="none">Default Order</option>
                  <option value="rating_desc">Highest Rated</option>
                  <option value="rating_asc">Lowest Rated</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none" />
              </div>
            </div>
          </div>

          {displayedReviews.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-brand-border/60 bg-brand-card/30 p-16 text-center">
              <Star size={48} className="mx-auto text-brand-gray/30 mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">No Reviews Yet</h3>
              <p className="text-sm text-brand-gray font-medium">Be the first to share your thoughts with the community!</p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedReviews.map((r) => (
              <article key={r._id} className="group flex flex-col rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
                
                <div className="mb-5 flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800">
                      {(r.author?.name || 'M')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-black text-brand-dark">{r.author?.name || 'Member'}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-brand-gray/80 mt-0.5">
                        {new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>

                {r.rating && (
                  <div className="mb-4 flex text-amber-400 gap-1 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < r.rating ? "fill-amber-400 text-amber-400 drop-shadow-sm" : "fill-transparent text-brand-border"} />
                    ))}
                  </div>
                )}

                <p className="text-sm font-medium text-brand-gray leading-relaxed mb-6 flex-grow relative z-10">
                  "{r.text}"
                </p>

                {Array.isArray(r.images) && r.images.length > 0 && (
                  <div className="mt-auto flex gap-3 overflow-x-auto pb-2 scrollbar-hide relative z-10">
                    {r.images.map((img, idx) => (
                      <div key={idx} className="relative group/img overflow-hidden rounded-xl border border-brand-border shadow-sm flex-shrink-0 h-20 w-24">
                        <img src={makeImageUrl(img)} alt={`review-${idx}`} className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-110" />
                        <div className="absolute inset-0 bg-black/0 transition-colors group-hover/img:bg-black/10"></div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reviews;
