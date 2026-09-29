export type Project = {
  id: string
  name: string
  description: string
  tech: string
  url: string
  category: string[]
  placeholder: string
  emoji: string
  label: string
  image: string
  github?: string
}

export const projects: Project[] = [
  {
    id: 'turfn',
    name: 'Turfn — Sports Venue Booking',
    description:
      'Customer-facing platform to discover and book sports venues with a fast, modern booking experience.',
    tech: 'Next.js · React · TypeScript · Tailwind',
    url: 'https://web-kappa-ten-24.vercel.app/',
    category: ['web', 'react'],
    placeholder: 'p1',
    emoji: '🏟️',
    label: 'Sports Booking',
    image: '/projects/turfn.png',
  },
  {
    id: 'geo',
    name: 'Global Geosciences AI Assistant',
    description:
      'Domain chatbot that answers questions about Global Geosciences using content grounded in the company website.',
    tech: 'AI Chat · RAG-style UX · Next.js · Vercel',
    url: 'https://global-geosciences-chatbot.vercel.app/',
    category: ['ai'],
    placeholder: 'p2',
    emoji: '🌍',
    label: 'AI Assistant',
    image: '/projects/geo.png',
  },
  {
    id: 'vip',
    name: 'UpgradeVIP Assistant',
    description:
      'Conversational AI assistant for UpgradeVIP — helping users get guided answers with a polished chat interface.',
    tech: 'AI Chatbot · React · Prompt UX · Vercel',
    url: 'https://upgrade-vip-chatbot.vercel.app/',
    category: ['ai'],
    placeholder: 'p4',
    emoji: '✨',
    label: 'VIP Assistant',
    image: '/projects/vip.png',
  },
  {
    id: 'microrage',
    name: 'Microrage Solutions',
    description:
      'Marketing site for a software agency showcasing web, mobile, AI/ML, and BPO capabilities with a clean React frontend.',
    tech: 'React · JavaScript · CSS · Responsive',
    url: 'https://microrage-frontend-react.vercel.app/',
    category: ['react'],
    placeholder: 'p6',
    emoji: '⚡',
    label: 'Software Agency',
    image: '/projects/microrage.png',
  },
  {
    id: 'cineflix',
    name: 'CineFlix',
    description:
      'Movie discovery experience — browse trending titles, watch trailers, and manage a personal watchlist via external APIs.',
    tech: 'HTML · CSS · JavaScript · REST API',
    url: 'https://cine-flix-movie-website.vercel.app/',
    category: ['web'],
    placeholder: 'p2',
    emoji: '🎬',
    label: 'Movie Platform',
    image: '/projects/cineflix.png',
  },
  {
    id: 'weipa',
    name: 'Weipa Tint',
    description:
      'Premium window-tinting business site for Far North Queensland — services showcase and quote-ready customer journey.',
    tech: 'React · CSS · Responsive Design',
    url: 'https://weipa-client-project.vercel.app/',
    category: ['web'],
    placeholder: 'p3',
    emoji: '🚗',
    label: 'Client Project',
    image: '/projects/weipa.png',
  },
]

export const phrases = [
  'Frontend Engineer.',
  'Full-Stack Engineer.',
  'Next.js Specialist.',
  'React & TypeScript Developer.',
  'API & Backend Developer.',
  'Software Engineer.',
]

export const techPills = [
  'Next.js 14/15',
  'React.js',
  'TypeScript',
  'JavaScript (ES6+)',
  'Tailwind CSS',
  'Redux Toolkit',
  'Zustand',
  'Node.js / Express',
  'FastAPI',
  'PHP / Laravel',
  'PostgreSQL',
  'MySQL',
  'Flutter / Dart',
  'Git / CI/CD',
  'AI-assisted Dev',
]

export const skills = [
  { label: 'Frontend (Next.js, React, TypeScript, Tailwind)', width: 94 },
  { label: 'Backend & APIs (Node.js, FastAPI, Laravel)', width: 86 },
  { label: 'Databases (PostgreSQL, MySQL, Query Optimization)', width: 82 },
  { label: 'State, UI Systems & Responsive Design', width: 90 },
]

export const CONTACT_EMAIL = 'freshfind.shop1@gmail.com'
export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`
