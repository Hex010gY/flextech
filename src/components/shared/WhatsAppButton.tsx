'use client';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/utils';

export default function WhatsAppButton() {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 shadow-lg hover:shadow-xl text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
    >
      <MessageCircle className="w-6 h-6" fill="white" />
      {/* Ping animation */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30 pointer-events-none" />
    </a>
  );
}
