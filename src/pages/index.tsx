/**
 * Landing Page Component
 *
 * This is the main marketing landing page for the AI consulting business.
 * It showcases our value proposition, services, and converts visitors to clients.
 * Designed to be the first impression potential clients have of our business.
 */

import { ChatGPTStyleInput } from '@/components/ChatGPTStyleInput';
import { ContactModal } from '@/components/ContactModal';
import { DarkModeToggleSwitch } from '@/components/DarkModeToggleSwitch';
import Logo from '@/components/icons/Logo';
import { SEOHead } from '@/components/SEOHead';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, BarChart3, CheckCircle, Lock, Shield, Sparkles, Target, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const BookingButton = ({ setIsContactModalOpen }: { setIsContactModalOpen: (isOpen: boolean) => void }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Button
        size="lg"
        className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        onClick={() => setIsContactModalOpen(true)}
      >
        Book Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};

/** Make sure the next element is set to a higher z-index. */
const BackgroundVideo = ({ videoSrc }: { videoSrc: string }) => {
  return (
    <div className="absolute inset-0 z-0">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Video Overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
    </div>
  );
};

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="landing-page min-h-screen bg-[var(--color-background)]">
      <SEOHead
        title="Quantplex.AI"
        description="Quantplex AI builds custom internal LLMs tailored to your business needs. Boost productivity and unlock new capabilities with our AI solutions."
        canonical="/"
        ogImage="/quantplex-logo-white-bg.svg"
        keywords="LLM, internal, AI, business, internal AI, automation, artificial intelligence, machine learning, custom AI models, enterprise AI, consulting"
      />

      {/* Navigation */}
      <nav className="border-b border-[var(--color-border)] bg-[var(--color-background)] sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="#solutions" className="text-[var(--color-foreground)]/80 hover:text-[var(--color-primary)] transition-all duration-300 font-medium">Solutions</Link>
              <Link href="#contact" className="text-[var(--color-foreground)]/80 hover:text-[var(--color-primary)] transition-all duration-300 font-medium">Contact </Link>
            </div>
            <div className="flex items-center space-x-4">
              <DarkModeToggleSwitch />
              <Link href="/account">
                <Button variant="outline" size="sm" className="transition-all duration-300">Client Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">

        <BackgroundVideo videoSrc="/videos/chatgpt.mp4" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 view-first-fade-in">
          <div className="text-center max-w-5xl mx-auto">

            <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-lg`}>
              Internal LLMs for your business
            </h1>

            <p className={`text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto drop-shadow-md`}>
              We work with you to build internal LLMs for your business.
            </p>

            <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16`}>
              <BookingButton setIsContactModalOpen={setIsContactModalOpen} />
            </div>
            <div className={`flex flex-wrap justify-center items-center gap-8 text-sm text-white/80`}>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-400 mr-2" />
                Your data never leaves your control
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                No expensive vendor lock-in
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-green-400 mr-2" />
                Ready in weeks, not months
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 business-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 view-first-fade-in">
          <div className={`text-center mb-16`}>
            <div className="inline-flex items-center bg-[var(--color-card)] rounded-full px-6 py-2 mb-8 border border-[var(--color-border)]">
              <Target className="h-4 w-4 text-[var(--color-destructive)] mr-2" />
              <span className="text-sm font-medium text-[var(--color-foreground)]">The Challenge</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#f8fafc] mb-8">
              Why do you need a private LLM?
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* ChatGPT-Style Input on Left */}
            <div className={`lg:sticky lg:top-24`}>
              <ChatGPTStyleInput
                message="11% of employee prompts contain sensitive information violating HIPAA, GDPR, CCPA, or other regulations"
                citation={{
                  text: "Harmonic Security, 2025",
                  url: "https://www.harmonic.security/blog-posts/new-research-the-data-leaking-into-genai-tools"
                }}
              />
            </div>

            {/* Accordion Issues on Right */}
            <div className={`space-y-4 min-h-[500px]`}>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="security" className={`border-0 bg-[var(--color-card)] rounded-lg shadow-sm hover:shadow-md group`}>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shadow-sm">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-[var(--color-foreground)]">Data Breach Risk</h3>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-[var(--color-foreground)]/70 leading-relaxed mb-4">
                      Can&apos;t input sensitive data into public ChatGPT or Gemini due to privacy regulations
                    </p>
                    <p className="text-xs text-[var(--color-foreground)]/60 italic">

                      <Link href="https://www.harmonic.security/blog-posts/new-research-the-data-leaking-into-genai-tools" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline ml-1">
                        Harmonic Security, 2025
                      </Link>
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="expertise" className={`border-0 bg-[var(--color-card)] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group`}>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline rounded-lg transition-all duration-300">
                    <div className="flex items-center">
                      <div className="bg-[var(--color-muted)] w-12 h-12 rounded-lg flex items-center justify-center mr-4 shadow-sm">
                        <Users className="h-6 w-6 text-[var(--color-foreground)]" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-[var(--color-foreground)]">Lack of resources</h3>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-[var(--color-foreground)]/70 leading-relaxed mb-4">
                      Businesses lack AI/ML engineering teams and technical knowledge to implement effectively
                    </p>
                    <p className="text-xs text-[var(--color-foreground)]/60 italic">
                      &ldquo;Businesses don&apos;t have AI/ML or engineering teams and lack technical knowledge&rdquo;
                      <Link href="https://aibusiness.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline ml-1">
                        AIBusiness, 2024
                      </Link>
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="value" className="border-0 bg-[var(--color-card)] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline rounded-lg transition-all duration-300">
                    <div className="flex items-center">
                      <div className="bg-[var(--color-destructive)] w-12 h-12 rounded-lg flex items-center justify-center mr-4 shadow-sm">
                        <BarChart3 className="h-6 w-6 text-[var(--color-destructive-foreground)]" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-[var(--color-foreground)]">Generic tools don&apos;t use internal data</h3>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-[var(--color-foreground)]/70 leading-relaxed mb-4">
                      Generic AI tools don&apos;t leverage your internal data, limiting effectiveness and ROI
                    </p>
                    <p className="text-xs text-[var(--color-foreground)]/60 italic">
                      &ldquo;FP&amp;A teams report only 25% of their time spent on forward‑thinking analysis; 75% is tied up with gathering data&rdquo;
                      <Link href="https://venasolutions.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline ml-1">
                        - Vena Solutions, 2023
                      </Link>
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Companies That Banned ChatGPT Section */}
      <section className="py-16 bg-[#cbd5e1]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 view-first-fade-in">
          <div className={`text-center mb-12`}>
            <div className="inline-flex items-center bg-[var(--color-card)] rounded-full px-6 py-2 mb-6 border border-[var(--color-border)]">
              <Shield className="h-4 w-4 text-[var(--color-destructive)] mr-2" />
              <span className="text-sm font-medium text-[var(--color-foreground)]">Solving Real-World Problems</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-foreground)] mb-4">
              Companies that banned ChatGPT
            </h2>
            <p className="text-lg text-[var(--color-foreground)]/70 mb-8 max-w-3xl mx-auto">
              These industry leaders have prohibited internal use of public AI tools due to security and privacy concerns
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            {[
              {
                name: 'Amazon',
                link: 'https://www.businessinsider.com/amazon-chatgpt-openai-warns-employees-not-share-confidential-information-microsoft-2023-1',
                logo: '/icons/company/amazon.svg',
              },
              {
                name: 'Apple',
                link: 'https://www.theverge.com/2023/5/19/23729619/apple-bans-chatgpt-openai-fears-data-leak',
                logo: '/icons/company/apple.svg',
              },
              {
                name: 'Bank of America',
                link: 'https://www.bloomberg.com/news/articles/2023-02-24/citigroup-goldman-sachs-join-chatgpt-crackdown-fn-reports',
                logo: '/icons/company/boa.svg',
              },
              {
                name: 'Calix',
                link: 'https://www.linkedin.com/feed/update/urn:li:activity:7052600334350778368/',
                logo: '/icons/company/calix.svg',
              },
              {
                name: 'CitiGroup',
                link: 'https://fortune.com/2023/05/19/chatgpt-banned-workplace-apple-goldman-risk-privacy/',
                logo: '/icons/company/citigroup.svg'
              },
              {
                name: 'Deutsche Bank',
                link: 'https://www.bloomberg.com/news/articles/2023-02-24/citigroup-goldman-sachs-join-chatgpt-crackdown-fn-reports',
                logo: '/icons/company/db.svg'
              },
              {
                name: 'Goldman Sachs',
                link: 'https://fortune.com/2023/05/19/chatgpt-banned-workplace-apple-goldman-risk-privacy',
                logo: '/icons/company/gs.svg',
              },
              {
                name: 'JPMorgan Chase',
                link: 'https://www.cnn.com/2023/02/22/tech/jpmorgan-chatgpt-employees/index.html',
                logo: '/icons/company/chase.svg'
              },
              {
                name: 'Northrup Grumman',
                link: 'https://www.hr-brew.com/stories/2023/05/11/these-companies-have-banned-chatgpt-in-the-office',
                logo: '/icons/company/northrop.svg',
              },
              {
                name: 'Samsung',
                link: 'https://www.engadget.com/three-samsung-employees-reportedly-leaked-sensitive-data-to-chatgpt-190221114.html',
                logo: '/icons/company/samsung.svg',
              },
              {
                name: 'Spotify',
                link: 'https://www.businessinsider.com/chatgpt-companies-issued-bans-restrictions-openai-ai-amazon-apple-2023-7#spotify-has-reportedly-restricted-its-workers-from-using-chatgpt-2', logo: '/icons/company/spotify.svg'
              },
              {
                name: 'Wells Fargo',
                link: 'https://www.semafor.com/article/05/19/2023/chatgpt-companies-banning-workers',
                logo: '/icons/company/wells-fargo.svg'
              },
            ].map((company) => (
              <Card
                key={company.name}
                className={`bg-[var(--color-card)] rounded-lg p-4 shadow-sm text-center group`}
                hoverEffect="lift"
              >
                {company.name && company.logo ? (
                  <Link
                    href={company.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >

                    <div className="flex flex-col items-center justify-center h-16 sm:h-20">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        width={100}
                        height={100}
                        className="mx-auto w-auto h-full object-contain"
                      />
                    </div>

                    <div className="text-sm text-[var(--color-muted-foreground)] mt-2">
                      {new URL(company.link).hostname.replace('www.', '')}
                    </div>

                  </Link>
                ) : (
                  <div className="flex items-center justify-center h-12 mb-2">
                    <span className="text-sm font-semibold text-[var(--color-foreground)] leading-tight">
                      {company.name}
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solutions" className="py-24 relative z-10">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 view-first-fade-in">

          <div className={`text-center mb-16`}>

            <div className="inline-flex items-center bg-[var(--color-card)] rounded-full px-6 py-2 mb-8 border border-[var(--color-border)]">
              <Sparkles className="h-4 w-4 text-[var(--color-primary)] mr-2" />
              <span className="text-sm font-medium text-[var(--color-foreground)]">The Solution</span>
            </div>

            <div className="space-y-8">
              <h2 className={`text-4xl lg:text-5xl font-bold text-[var(--color-foreground)] mb-8`}>
                LLM
                <span className="hero-gradient block mt-2">
                  Tailored to your business
                </span>
              </h2>
              <p className={`text-xl text-[var(--color-foreground)]/70 leading-relaxed mb-8`}>
                We deploy private, open-source LLMs with your internal data to create powerful automation workflows
              </p>
            </div>

          </div>


          <div className="grid lg:grid-cols-1 gap-16 items-start">
            <div className="flex justify-center items-center w-full h-full animate-fadeIn">
              <Image src="/arch.svg" alt="Diagram" width={1000} height={1000} className='w-full h-auto' />
            </div>
          </div>

          {/* <div className="grid lg:grid-cols-2 gap-16 items-start"> */}

          {/* Left Column - Header and Features */}
          {/* <div className="space-y-6">
              <div className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)] shadow-sm card-glow hover:shadow-md transition-all duration-300">
                <div className="flex items-start">
                  <div className="bg-[var(--color-primary)] w-12 h-12 rounded-lg flex items-center justify-center mr-4 shadow-sm flex-shrink-0">
                    <Shield className="h-6 w-6 text-[var(--color-primary-foreground)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[var(--color-foreground)] mb-3">
                      Private, Secure LLMs
                    </h3>
                    <p className="text-[var(--color-foreground)]/70 leading-relaxed">
                      Your data stays within your control using open-source models like Mistral and Llama,
                      running on secure infrastructure with GDPR and HIPAA compliance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)] shadow-sm card-glow hover:shadow-md transition-all duration-300">
                <div className="flex items-start">
                  <div className="bg-[var(--color-primary)] w-12 h-12 rounded-lg flex items-center justify-center mr-4 shadow-sm flex-shrink-0">
                    <Brain className="h-6 w-6 text-[var(--color-primary-foreground)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[var(--color-foreground)] mb-3">
                      Only give access to specific documents
                    </h3>
                    <p className="text-[var(--color-foreground)]/70 leading-relaxed">
                      Our system uses your internal documents to provide
                      contextually relevant, accurate results specific to your business.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)] shadow-sm card-glow hover:shadow-md transition-all duration-300">
                <div className="flex items-start">
                  <div className="bg-[var(--color-primary)] w-12 h-12 rounded-lg flex items-center justify-center mr-4 shadow-sm flex-shrink-0">
                    <Zap className="h-6 w-6 text-[var(--color-primary-foreground)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[var(--color-foreground)] mb-3">
                      End-to-End Automation
                    </h3>
                    <p className="text-[var(--color-foreground)]/70 leading-relaxed">
                      Beyond just chatbots - we create complete workflows that generate reports, slide decks,
                      social media content, and integrate with your existing systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>  */}

          {/* Right Column */}

          {/* <div className='flex justify-center items-center w-full h-full'>
              <Image src="/arch.svg" alt="Diagram" width={1000} height={1000} className='w-full h-auto' />
            </div> */}


          {/* Video */}
          {/* <div className="lg:sticky lg:top-24">
              <div className="relative bg-[var(--color-card)] rounded-2xl p-8 border border-[var(--color-border)] shadow-sm card-glow w-full h-96 lg:h-[500px] overflow-hidden">
                <BackgroundVideo videoSrc="/videos/vertical_woman.mp4" />
              </div>
            </div> */}
          {/* </div> */}

        </div>
      </section >

      {/* Founder Section */}
      < section className="relative py-20 bg-[#181144]" >

        <BackgroundVideo videoSrc="/videos/bouncing.mp4" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 view-first-fade-in">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-[var(--color-card)] rounded-full px-6 py-2 mb-8 border border-[var(--color-border)]">
              <Users className="h-4 w-4 text-[var(--color-muted-foreground)] mr-2" />
              <span className="text-sm font-medium text-[var(--color-foreground)]">Meet the Founder</span>
            </div>

            <div className={`bg-[var(--color-card)] rounded-2xl p-8 lg:p-12 border border-[var(--color-border)] shadow-sm card-glow`}>
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-[var(--color-border)] shadow-lg">
                      <Image
                        src="/index/profilepic.jpg"
                        alt="Xavier Collantes, Founder"
                        className="w-full h-full object-cover"
                        width={160}
                        height={160}
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="h-4 w-4 text-[var(--color-primary-foreground)]" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-foreground)] mb-4">
                    Xavier Collantes
                  </h2>
                  <p className={`text-xl text-[var(--color-primary)] mb-6 font-semibold`}>
                    Ex-Google, Ex-JPMorgan, AI Automation Engineer
                  </p>
                  <p className={`text-lg text-[var(--color-foreground)]/80 leading-relaxed mb-6`}>
                    8+ years of industry experience in AI, Business Intelligence, and Software Engineering.
                  </p>
                  <p className={`text-lg text-[var(--color-foreground)]/80 leading-relaxed mb-6`}>
                    5 years at Google working to fine-tune Google Search algorithms by making critical coding and infrastructure decisions.
                  </p>
                  <p className={`text-lg text-[var(--color-foreground)]/80 leading-relaxed mb-6`}>
                    Work experience in designing, building, and securing LLM API infrastructure from the ground up.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="https://xaviercollantes.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 font-medium transition-colors duration-300"
                    >
                      <Button variant="outline" size="sm" className="transition-all duration-300">
                        Previous work <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* CTA Section */}
      < section id="contact" className="py-20 relative z-10" >

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 view-first-fade-in">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className={`text-3xl lg:text-4xl font-bold text-[var(--color-foreground)] mb-6`}>
              Get your own internal private LLM
            </h2>
            <p className={`text-lg text-[var(--color-foreground)]/80 mb-8`}>
              Let&apos;s discuss how AI automation can transform your business operations.
              Book a free consultation to explore what&apos;s possible.
            </p>
            <div>
              <BookingButton setIsContactModalOpen={setIsContactModalOpen} />
            </div>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="border-t border-[var(--color-border)] bg-[var(--color-background)] py-12" >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Logo className="mr-2" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--color-foreground)] mb-3">Company</h4>
              <ul className="text-sm text-[var(--color-foreground)]/70 space-y-2">
                {/* <li><Link href="/about" className="hover:text-[var(--color-primary)] transition-colors">About Us</Link></li> */}
                {/* <li><Link href="/case-studies" className="hover:text-[var(--color-primary)] transition-colors">Case Studies</Link></li> */}
                {/* <li><Link href="/blog" className="hover:text-[var(--color-primary)] transition-colors">Blog</Link></li> */}
                <li><Link href="/contact" className="hover:text-[var(--color-primary)] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--color-foreground)] mb-3">Legal</h4>
              <ul className="text-sm text-[var(--color-foreground)]/70 space-y-2">
                <li><Link href="/privacy" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</Link></li>
                {/* <li><Link href="/security" className="hover:text-[var(--color-primary)] transition-colors">Security</Link></li> */}
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--color-border)] mt-8 pt-8 text-center">
            <p className="text-sm text-[var(--color-foreground)]/70">
              © {new Date().getFullYear()} Quantplex.AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer >

      {/* Contact Modal */}
      < ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)
        }
      />
    </div >
  );
}
