import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight, Phone, Instagram, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';

export function Contact() {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClasses = (name: string) => `
    w-full bg-dark-bg/50 border border-white/10 rounded-lg px-6 py-4 
    text-white placeholder-gray-500 font-medium 
    transition-all duration-300 outline-none
    ${focusedInput === name ? 'border-cyan glow-cyan' : 'hover:border-white/30'}
  `;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to transmit message');
      }
      
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      toast.success("Message Transmitted Successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative z-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          <div className="lg:w-5/12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-black italic uppercase display-text mb-6">
                Join The <span className="neon-cyan-text">Paddock</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
                <strong className="text-white font-bold block mb-2">Interested in sponsorship opportunities?</strong>
                Partnerships, sponsorships, or media inquiries. Get in touch to align with India's fastest rising motocross talent.
              </p>

              <div className="space-y-8">
                <a href="mailto:Mansur.Shaikhs@icloud.com" className="flex items-center gap-4 group cursor-pointer w-fit">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-cyan group-hover:glow-cyan transition-all duration-300 bg-black/20">
                    <Mail className="w-5 h-5 text-gray-300 group-hover:text-cyan transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Email</div>
                    <div className="text-lg font-medium hover:text-cyan transition-colors">Mansur.Shaikhs@icloud.com</div>
                  </div>
                </a>

                <a href="tel:+919916786786" className="flex items-center gap-4 group cursor-pointer w-fit">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-neon-orange group-hover:glow-neon-orange transition-all duration-300 bg-black/20">
                    <Phone className="w-5 h-5 text-gray-300 group-hover:text-neon-orange transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Direct Line</div>
                    <div className="text-lg font-medium hover:text-neon-orange transition-colors">+91 9916786786</div>
                  </div>
                </a>

                <a href="https://www.youtube.com/@aleenamansur9030" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer w-fit">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-red-500 transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0)] group-hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] bg-black/20">
                    <Youtube className="w-5 h-5 text-gray-300 group-hover:text-red-500 transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">YouTube</div>
                    <div className="text-lg font-medium hover:text-red-500 transition-colors">@aleenamansur9030</div>
                  </div>
                </a>

                <a href="https://www.instagram.com/aleena.mansur/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer w-fit">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-pink-500 transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0)] group-hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] bg-black/20">
                    <Instagram className="w-5 h-5 text-gray-300 group-hover:text-pink-500 transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Instagram</div>
                    <div className="text-lg font-medium hover:text-pink-500 transition-colors">@aleena.mansur</div>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-7/12">
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card p-8 md:p-12 rounded-3xl"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="First Name" 
                    className={inputClasses('firstName')}
                    onFocus={() => setFocusedInput('firstName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Last Name" 
                    className={inputClasses('lastName')}
                    onFocus={() => setFocusedInput('lastName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email Address" 
                  className={inputClasses('email')}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>

              <div className="mb-8">
                <textarea 
                  placeholder="Message or Inquiry Details" 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={5}
                  className={`${inputClasses('message')} resize-none`}
                  onFocus={() => setFocusedInput('message')}
                  onBlur={() => setFocusedInput(null)}
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary group disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting...' : 'Transmit Message'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.form>
          </div>
          
        </div>
      </div>
    </section>
  );
}
