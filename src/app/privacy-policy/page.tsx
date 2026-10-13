import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "TechToolSnap Privacy Policy. Learn how we handle your data, cookies, Google AdSense, and your privacy rights.",
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: "Privacy Policy | TechToolSnap",
    description: "TechToolSnap Privacy Policy. Learn how we handle your data, cookies, Google AdSense, and your privacy rights.",
    url: 'https://techtoolsnap.com/privacy-policy',
  }
};

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <Breadcrumbs items={[{ name: 'Privacy Policy', url: '/privacy-policy' }]} />
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Last updated: October 10, 2026</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>At TechToolSnap, your privacy is our top priority. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.</p>

          <h2>1. Local Processing — Your Files Stay on Your Device</h2>
          <p>All file conversions, image compressions, PDF operations, and calculations on TechToolSnap are performed entirely within your web browser using client-side JavaScript. We do not upload, transmit, store, or have access to any files or data you process through our tools. Your data remains strictly on your device at all times.</p>

          <h2>2. Cookies</h2>
          <p>TechToolSnap itself does not set any first-party cookies for tracking purposes. However, our third-party advertising partner (Google AdSense) and analytics services may place cookies on your device. These cookies are used to:</p>
          <ul>
            <li>Serve ads relevant to your interests</li>
            <li>Limit the number of times you see a particular ad</li>
            <li>Measure the effectiveness of advertising campaigns</li>
          </ul>

          <h2>3. Google AdSense and the DoubleClick Cookie</h2>
          <p>We use Google AdSense to display advertisements on our website. Google AdSense uses cookies, including the <strong>DoubleClick DART cookie</strong>, to serve ads based on your prior visits to our website and other websites on the internet.</p>
          <p>The DoubleClick cookie is used by Google to serve targeted advertisements that are relevant to you across the web. It does not personally identify you and is used solely for ad personalization.</p>
          <p>You may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting:</p>
          <ul>
            <li><a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></li>
            <li><a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">AboutAds.info</a></li>
          </ul>

          <h2>4. Third-Party Advertising</h2>
          <p>Third-party ad networks, including Google, use technology such as cookies and web beacons when they display ads on our site. These companies may use aggregated, non-personally-identifiable information about your visits to this and other websites to provide advertisements about goods and services of interest to you.</p>

          <h2>5. GDPR Compliance (European Users)</h2>
          <p>If you are located in the European Economic Area (EEA), you have the following rights under the General Data Protection Regulation (GDPR):</p>
          <ul>
            <li><strong>Consent:</strong> We display a cookie consent banner when you first visit our website. Personalized ads are only shown after you provide consent.</li>
            <li><strong>Right to withdraw consent:</strong> You may withdraw your cookie consent at any time by clearing your browser cookies or using the cookie settings on our site.</li>
            <li><strong>Right to access:</strong> Since we do not store any personal data on our servers, there is no personal data to access.</li>
            <li><strong>Right to erasure:</strong> You can clear all cookies set by third-party advertisers through your browser settings at any time.</li>
          </ul>

          <h2>6. Children&apos;s Privacy</h2>
          <p>Our website is not directed to children under the age of 13. We do not knowingly collect personally identifiable information from children. If you believe your child has provided personal data, please contact us so we can take appropriate action.</p>

          <h2>7. Changes to This Policy</h2>
          <p>We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this page periodically.</p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:support@techtoolsnap.com">support@techtoolsnap.com</a></p>
        </div>
      </div>
    </main>
  );
}
