/**
 * Terms of Service Page Component
 *
 * This page displays the company's terms of service, outlining the legal
 * agreement between Quantplex.AI and its users. It covers service usage,
 * user obligations, and platform policies.
 */

import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - Quantplex.AI</title>
        <meta name="description" content="Terms of Service for Quantplex.AI - Legal agreement governing your use of our platform and services." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        {/* Header */}
        <div className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
          <div className="prose prose-lg mx-auto">
            <h1 className="text-4xl font-bold text-[var(--color-foreground)] mb-4">Terms of Service</h1>
            <p className="text-[var(--color-muted-foreground)] mb-8">Last updated: July 23, 2025</p>

            <div className="space-y-8 text-[var(--color-foreground)]">
              <p>
                Welcome to Quantplex.AI. These Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) govern your use of our website located at{' '}
                <a href="https://quantplex.ai" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline">
                  https://quantplex.ai
                </a>{' '}
                (the &quot;Service&quot;) operated by Quantplex.AI (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
              </p>
              <p>
                Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
              </p>
              <p>
                By accessing or using our Service you agree to be bound by these Terms. If you disagree with any part of these terms then you may not access the Service.
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Definitions</h2>
                <p>For the purposes of these Terms of Service:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;) refers to Quantplex.AI.</li>
                  <li><strong>Service</strong> refers to the website and all related services provided by Quantplex.AI.</li>
                  <li><strong>Terms</strong> refers to these Terms of Service as updated from time to time.</li>
                  <li><strong>User</strong> or &quot;you&quot; refers to the individual accessing or using the Service.</li>
                  <li><strong>Website</strong> refers to Quantplex.AI, accessible from{' '}
                    <a href="https://quantplex.ai" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline">
                      https://quantplex.ai
                    </a>
                  </li>
                  <li><strong>Content</strong> refers to all text, graphics, images, music, software, audio, video, information or other materials.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Acceptance of Terms</h2>
                <p>
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Use License</h2>
                <p>
                  Permission is granted to temporarily download one copy of the materials on Quantplex.AI&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>modify or copy the materials;</li>
                  <li>use the materials for any commercial purpose or for any public display;</li>
                  <li>attempt to reverse engineer any software contained on the website;</li>
                  <li>remove any copyright or other proprietary notations from the materials.</li>
                </ul>
                <p>
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated by Quantplex.AI at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">User Accounts</h2>
                <p>
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for all activities that occur under your account.
                </p>
                <p>
                  You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                </p>
                <p>
                  You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you without appropriate authorization, or a name that is otherwise offensive, vulgar or obscene.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Data Collection and Privacy</h2>
                <p>
                  We may collect and process personal information that you provide to us, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Your name and contact information (email address, phone number)</li>
                  <li>Account credentials and profile information</li>
                  <li>Any information you voluntarily provide through forms, communications, or use of our Service</li>
                  <li>Usage data and analytics information</li>
                  <li>Technical information about your device and browsing behavior</li>
                </ul>
                <p>
                  By using our Service, you consent to the collection and use of this information in accordance with our{' '}
                  <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">
                    Privacy Policy
                  </Link>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Prohibited Uses</h2>
                <p>You may not use our Service:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                  <li>To collect or track the personal information of others</li>
                  <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>For any obscene or immoral purpose</li>
                  <li>To interfere with or circumvent the security features of the Service</li>
                </ul>
                <p>
                  We reserve the right to terminate your use of the Service for violating any of the prohibited uses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Content</h2>
                <p>
                  Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material (&quot;Content&quot;). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                </p>
                <p>
                  By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.
                </p>
                <p>
                  You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.
                </p>
                <p>
                  You represent and warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>The Content is yours (you own it) or you have the right to use it</li>
                  <li>The Content does not infringe, violate or misappropriate the rights of any third party</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Intellectual Property Rights</h2>
                <p>
                  The Service and its original content, features and functionality are and will remain the exclusive property of Quantplex.AI and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Termination</h2>
                <p>
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p>
                  Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Disclaimer</h2>
                <p>
                  The information on this website is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, this Company:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>excludes all representations and warranties relating to this website and its contents</li>
                  <li>excludes all liability for damages arising out of or in connection with your use of this website</li>
                </ul>
                <p>
                  Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Limitation of Liability</h2>
                <p>
                  In no case shall Quantplex.AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, punitive, consequential or special damages, including without limitation loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of Washington, United States, without regard to its conflict of law provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Changes to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p>
                  By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Severability</h2>
                <p>
                  If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Waiver</h2>
                <p>
                  Except as provided herein, the failure to exercise a right or to require performance of an obligation under this Terms shall not effect a party&apos;s ability to exercise such right or require such performance at any time thereafter nor shall be the waiver of a breach constitute a waiver of any subsequent breach.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">Contact Information</h2>
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <ul className="list-disc pl-6">
                  <li>By email: collantes.xavier@gmail.com</li>
                  <li>On this page:{' '}
                    <a href="https://quantplex.ai" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline">
                      https://quantplex.ai
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}