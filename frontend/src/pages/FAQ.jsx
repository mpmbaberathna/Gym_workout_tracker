import { useEffect, useState } from "react";

function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/data/faq.json');
        const data = await res.json();
        setFaqs(data || []);
      } catch (err) {
        console.error('Failed to load FAQ', err);
      }
    };
    load();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      
      <div className="relative z-10 mx-auto w-full max-w-4xl space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-brand-gray">
            Answers to common questions about memberships, training, and using the app.
          </p>
        </div>

        <div className="rounded-3xl border border-brand-border bg-brand-card p-8 shadow-sm">
          <div className="space-y-4">
            {faqs.length === 0 ? (
              <p className="text-brand-gray text-center py-4">No FAQs available.</p>
            ) : (
              faqs.map((f, i) => (
                <div key={i} className="border-b border-brand-border last:border-b-0 pb-4 last:pb-0">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full text-left py-3 flex items-center justify-between gap-4 group"
                    aria-expanded={openIndex === i}
                  >
                    <span className="font-bold text-brand-dark group-hover:text-brand-accent transition-colors">{f.question}</span>
                    <span className="text-brand-gray bg-brand-light w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-brand-accent group-hover:text-brand-dark transition-colors">
                      {openIndex === i ? '−' : '+'}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-sm text-brand-gray leading-relaxed">{f.answer}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-center text-sm text-brand-gray">
          <p>
            Don't see your question? <a href="/contact" className="font-semibold text-brand-dark underline hover:text-brand-accent transition-colors">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
