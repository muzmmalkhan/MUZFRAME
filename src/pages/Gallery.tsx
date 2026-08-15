import { motion } from 'framer-motion';

const IMAGES = [
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2938&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2942&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2938&auto=format&fit=crop"
];

export function Gallery() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">Our <span className="luxury-gradient italic">Work</span></h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            A curated selection of our favorite moments. From grand weddings to intimate portraits, every frame tells a story.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {IMAGES.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer"
            >
              <img 
                src={src} 
                alt={`Portfolio ${i}`} 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 bg-[#1a1a1a]"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-serif italic text-lg shadow-sm">View project</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
