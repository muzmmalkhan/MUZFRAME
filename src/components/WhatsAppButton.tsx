import React from 'react';
import { useLocation } from 'react-router-dom';
import { STUDIO_CONTACT, buildWhatsAppUrl } from '../config/studioContact';

export function WhatsAppButton() {
  const { pathname } = useLocation();

  // Hide on form-heavy pages and portals so it never obscures form controls, submit buttons, or dashboard navigation
  const hiddenRoutes = ['/contact', '/login', '/admin'];
  if (hiddenRoutes.includes(pathname) || pathname.startsWith('/client/')) {
    return null;
  }

  const defaultMessage =
    'Assalam-o-Alaikum MuzFrame Studio! I would like to inquire about event dates and photography packages.';
  const whatsappUrl = buildWhatsAppUrl(defaultMessage);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center group">
      {/* Desktop hover label */}
      <span className="hidden md:inline-block mr-3 px-3 py-1.5 rounded-xl bg-[#111111]/95 backdrop-blur-md text-white text-xs font-medium border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        WhatsApp Booking Desk ({STUDIO_CONTACT.officialPhoneDisplay})
      </span>

      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with MuzFrame Studio on WhatsApp at ${STUDIO_CONTACT.officialPhoneDisplay}`}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-black flex items-center justify-center border border-white/20 shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200"
      >
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.03C9.36 7.03 9.08 7.09 8.84 7.35C8.6 7.61 7.92 8.25 7.92 9.55C7.92 10.85 8.86 12.11 9 12.29C9.13 12.46 10.72 14.92 13.16 15.97C13.74 16.22 14.19 16.37 14.55 16.48C15.13 16.67 15.66 16.64 16.08 16.58C16.55 16.51 17.52 15.99 17.73 15.41C17.93 14.83 17.93 14.34 17.87 14.23C17.81 14.12 17.65 14.06 17.41 13.94C17.18 13.82 16.01 13.25 15.79 13.17C15.57 13.09 15.41 13.05 15.25 13.29C15.09 13.53 14.62 14.06 14.48 14.23C14.34 14.4 14.2 14.42 13.96 14.3C13.73 14.18 12.98 13.93 12.1 13.14C11.41 12.53 10.94 11.77 10.81 11.54C10.68 11.3 10.8 11.18 10.92 11.06C11.03 10.95 11.16 10.77 11.28 10.63C11.4 10.49 11.44 10.39 11.52 10.23C11.6 10.07 11.56 9.93 11.5 9.81C11.44 9.69 10.98 8.56 10.79 8.11C10.6 7.66 10.41 7.72 10.26 7.71C10.13 7.71 9.97 7.71 9.81 7.71C9.65 7.71 9.53 7.03 9.53 7.03Z" />
        </svg>
      </a>
    </div>
  );
}
