import { Radio, MonitorPlay, Users, Briefcase, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const INDIVIDUAL_SERVICES = [
  {
    title: 'Wedding Shoot',
    icon: ImageIcon,
    desc: 'Candid documentary storytelling and editorial couple portraits across Mehndi, Barat, and Walima.',
  },
  {
    title: 'Bridal & Model Shoot',
    icon: Users,
    desc: 'Studio-lit editorial bridal wear, designer lookbooks, and dedicated female photographer sessions.',
  },
  {
    title: 'Commercial & Re-Branding',
    icon: Briefcase,
    desc: 'Retail launch films, aerial venue coverage, and short-form social campaigns for Punjab businesses.',
  },
  {
    title: '4K Cinema & Grading',
    icon: MonitorPlay,
    desc: 'Gimbal-stabilized 4K capture, master color grading, and synchronized audio teasers.',
  },
  {
    title: 'Multi-Cam Live Coverage',
    icon: Radio,
    desc: 'Multi-camera live coverage and wide-angle ceremony documentation for grand venues.',
  },
];

export function Services() {
  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[#f2a900] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Studio Capabilities
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4">
            Core Creative <span className="italic text-[#f2a900]">Services</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            From intimate bridal portrait sessions to full multi-camera wedding and commercial productions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {INDIVIDUAL_SERVICES.map((srv) => (
            <div
              key={srv.title}
              className="p-6 sm:p-7 rounded-2xl bg-[#101010] border border-white/10 hover:border-[#f2a900]/45 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f2a900]/15 border border-[#f2a900]/30 flex items-center justify-center mb-5 text-[#f2a900]">
                  <srv.icon className="w-6 h-6" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-white mb-2">
                  {srv.title}
                </h2>
                <p className="text-sm text-white/70 leading-relaxed">{srv.desc}</p>
              </div>
              <div className="pt-5 mt-5 border-t border-white/10">
                <Link
                  to="/packages"
                  className="text-xs font-semibold text-[#f2a900] hover:underline inline-flex items-center gap-1.5"
                >
                  <span>View Pricing & Packages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#101010] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
              Need a custom combination of services?
            </h2>
            <p className="text-sm text-white/70 mt-1">
              Use our day-rate estimator or speak directly with our Hasilpur production desk.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/packages#custom-calculator" className="btn-secondary">
              Open Estimator
            </Link>
            <Link to="/contact" className="btn-primary">
              <span>Enquire Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
