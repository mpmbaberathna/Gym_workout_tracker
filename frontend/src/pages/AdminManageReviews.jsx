import { useEffect, useState } from 'react';
import api from '../api/axios';

function AdminManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterRating, setFilterRating] = useState('any');
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('any');
  

  const backendBase = (() => {
    try {
      let b = api.defaults.baseURL || '';
      if (b.endsWith('/api')) b = b.slice(0, -4);
      return b.replace(/\/$/, '');
    } catch (e) { return ''; }
  })();
  const makeImageUrl = (imgPath) => {
    if (!imgPath) return imgPath;
    if (/^https?:\/\//.test(imgPath)) return imgPath;
    return `${backendBase}${imgPath}`;
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews');
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get('/users/members');
      setMembers(res.data || []);
    } catch (err) {
      console.error('fetchMembers error', err?.response?.data || err.message || err);
    }
  };

  useEffect(() => { fetchReviews(); fetchMembers(); }, []);

  const filteredReviews = (() => {
    const memberId = selectedMember;
    return reviews
      .filter(r => {
        if (memberId && memberId !== 'any') {
          const authorId = r.author && (r.author._id || r.author) ? String(r.author._id || r.author) : '';
          if (authorId !== String(memberId)) return false;
        }
        if (filterRating && filterRating !== 'any') {
          const n = Number(filterRating);
          return (r.rating || 0) === n;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  })();

  const handleDelete = async (id) => {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    try {
      await api.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to delete review');
    }
  };

  
  // render content separately to avoid nested ternary JSX complexity
  // render content separately to avoid nested ternary JSX complexity
  const content = loading ? (
    <div className="flex justify-center items-center py-12">
      <div className="text-sm font-bold text-brand-gray animate-pulse">Loading reviews…</div>
    </div>
  ) : reviews.length === 0 ? (
    <div className="rounded-3xl border border-dashed border-brand-border bg-brand-card/50 px-8 py-12 text-center text-sm font-bold text-brand-dark">
      No reviews found.
    </div>
  ) : (
    <div className="grid gap-6">
      {filteredReviews.map((r) => (
        <article key={r._id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm transition hover:shadow-md hover:border-brand-dark/20">
          <div className="mb-4 flex items-center justify-between border-b border-brand-border pb-4">
            <div className="text-lg font-bold text-brand-dark">{r.author?.name || 'Member'}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-gray">{new Date(r.createdAt).toLocaleString()}</div>
          </div>

          {Array.isArray(r.images) && r.images.length > 0 && (
            <div className="mb-6 grid auto-cols-max grid-flow-col gap-4 overflow-x-auto pb-2">
              {r.images.map((img, idx) => (
                <img key={idx} src={makeImageUrl(img)} alt={`review-${idx}`} className="h-32 w-auto rounded-2xl object-cover border border-brand-border shadow-sm" />
              ))}
            </div>
          )}

          <div className="text-base text-brand-dark leading-relaxed font-medium mb-4">{r.text}</div>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border">
            {r.rating ? (
              <div className="text-brand-accent text-lg tracking-widest">
                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
              </div>
            ) : <div />}
            <button onClick={() => handleDelete(r._id)} className="rounded-full bg-red-50 border border-red-200 px-5 py-2 text-xs font-bold text-red-600 shadow-sm hover:bg-red-100 transition">
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-3">Admin</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">Manage Reviews</h1>
          <p className="mt-4 text-base text-brand-gray leading-relaxed">Edit or delete user reviews.</p>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} className="flex-1 sm:flex-none min-w-[200px] rounded-2xl border border-brand-border bg-brand-light px-4 py-2 text-sm font-bold text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark shadow-sm">
                <option value="any">All members</option>
                {members.map(m => (
                  <option key={m._id} value={m._id}>{m.name || m.email}</option>
                ))}
              </select>
              <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="flex-1 sm:flex-none min-w-[150px] rounded-2xl border border-brand-border bg-brand-light px-4 py-2 text-sm font-bold text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark shadow-sm">
                <option value="any">Any rating</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </div>
            <button onClick={() => { setSelectedMember('any'); setFilterRating('any'); }} className="rounded-full border border-brand-border bg-brand-light px-6 py-2.5 text-sm font-bold text-brand-dark shadow-sm hover:bg-brand-light transition w-full sm:w-auto">
              Clear Filters
            </button>
          </div>

          {content}
        </div>
      </div>
    </div>
  );
}

export default AdminManageReviews;
