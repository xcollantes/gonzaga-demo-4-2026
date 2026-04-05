# Prompt: Gonzaga MIS Department Landing Page

Build a full working Next.js web app that serves as a recruitment landing page
for the **Gonzaga University School of Business Administration - Management
Information Systems (MIS) department**. The goal is to attract and excite
students about joining the MIS major/minor.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment-ready**: Vercel

## Design Requirements

### Branding

- Use Gonzaga's official colors:
  - Primary: Navy Blue (`#002967`)
  - Secondary: White (`#FFFFFF`)
  - Accent: Red (`#C41230`)
  - Light gray for backgrounds (`#F5F5F5`)
- Use clean, modern typography (Inter or similar sans-serif font)
- Include the Gonzaga Bulldogs spirit — professional but energetic
- Responsive design: mobile-first, looks great on all screen sizes

### Layout & Sections

Build a single-page scrolling site with the following sections:

#### 1. Hero Section

- Bold headline: "Shape the Future with Technology & Business"
- Subheadline: "Gonzaga's MIS program bridges the gap between business strategy
  and cutting-edge technology"
- Call-to-action button: "Explore MIS" (scrolls down) and "Apply Now" (links to
  Gonzaga admissions)
- Background: subtle animated gradient or a hero image of campus/students
  collaborating

#### 2. What is MIS?

- Clear, jargon-free explanation of what Management Information Systems is
- Use an icon grid or card layout highlighting key themes:
  - Data Analytics
  - Cybersecurity
  - Business Intelligence
  - Software Development
  - Project Management
  - Cloud Computing
- Each card should have an icon, title, and one-sentence description

#### 3. Why Choose Gonzaga MIS?

- Highlight differentiators in a visually appealing layout:
  - Small class sizes and personalized mentorship
  - Jesuit values: ethics-driven technology leaders
  - Hands-on projects with real companies
  - State-of-the-art labs and tools
  - Strong alumni network in the Pacific Northwest tech scene
  - High job placement rate after graduation

#### 4. Career Outcomes

- Showcase career paths MIS graduates pursue:
  - Business Analyst
  - Data Analyst
  - IT Consultant
  - Systems Administrator
  - Product Manager
  - Software Developer
  - Cybersecurity Analyst
- Include average starting salary range (use realistic data, ~$60K-$85K)
- Display logos or names of companies where graduates work (e.g., Microsoft,
  Amazon, Deloitte, Accenture, Boeing, local PNW companies)

#### 5. Student Testimonials

- 3-4 testimonial cards with:
  - Student name (use placeholder names)
  - Class year
  - Quote about their MIS experience
  - Photo placeholder (use avatar/initials)
- Carousel or grid layout

#### 6. Curriculum Highlights

- Show a simplified course progression or sample courses:
  - Intro to MIS
  - Database Management
  - Systems Analysis & Design
  - Business Data Analytics
  - Cybersecurity Fundamentals
  - Capstone Project
- Use a timeline or stepped layout to show progression from freshman to senior
  year

#### 7. Get Involved

- Cards or sections for:
  - MIS Student Club
  - Hackathons & Competitions
  - Internship Program
  - Guest Speaker Series
- Each with a brief description and a CTA

#### 8. FAQ Section

- Collapsible accordion with common questions:
  - "Do I need coding experience to join MIS?"
  - "What's the difference between MIS and Computer Science?"
  - "Can I double major or minor in MIS?"
  - "What kind of internships do MIS students get?"
  - "Is MIS right for me if I'm more business-oriented than technical?"

#### 9. Call to Action / Contact

- Final CTA section with:
  - "Ready to Join?" headline
  - Buttons: "Schedule a Visit", "Talk to an Advisor", "Apply Now"
  - Contact email for the MIS department
  - Links to Gonzaga social media

#### 10. Footer

- Gonzaga University branding
- Links to School of Business, MIS department page, admissions
- Copyright notice
- Social media icons

## Functional Requirements

- Smooth scroll navigation with a sticky header/navbar
- Mobile hamburger menu
- All sections animate into view on scroll (fade in, slide up)
- FAQ accordion is interactive (expand/collapse)
- Testimonial section can be a carousel or grid
- All buttons have hover effects
- Accessible: proper semantic HTML, alt text, keyboard navigation, sufficient
  color contrast
- Fast: optimize images, use Next.js Image component, lazy load below-the-fold
  content

## File Structure

```
gonzaga-mis/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── favicon.ico
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── WhatIsMIS.tsx
│   ├── WhyGonzaga.tsx
│   ├── CareerOutcomes.tsx
│   ├── Testimonials.tsx
│   ├── Curriculum.tsx
│   ├── GetInvolved.tsx
│   ├── FAQ.tsx
│   ├── CallToAction.tsx
│   └── Footer.tsx
├── lib/
│   └── utils.ts
├── public/
│   └── images/
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Content Tone

- Welcoming and enthusiastic, not overly corporate
- Speak directly to students ("You'll learn...", "Your career...")
- Emphasize the blend of business and technology
- Highlight community, mentorship, and real-world impact
- Align with Gonzaga's Jesuit mission of educating the whole person

## Stretch Goals (if time allows)

- Dark mode toggle
- Animated statistics counter (e.g., "95% job placement", "200+ alumni in tech")
- Interactive curriculum roadmap
- Embedded video section with a department overview video
- Live chat or chatbot for prospective students
