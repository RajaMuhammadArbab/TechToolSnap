import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="group border-b border-slate-200 dark:border-slate-700 pb-4">
            <summary className="flex justify-between items-center font-semibold text-slate-800 dark:text-slate-200 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown className="w-5 h-5 text-slate-500 transition-transform duration-300 group-open:-rotate-180" />
            </summary>
            <p className="mt-4 text-slate-600 dark:text-slate-400 pl-1 leading-relaxed">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
