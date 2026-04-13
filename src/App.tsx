/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import React, { useRef, useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Grid, 
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: 'Visão Estratégica', href: '#vision' },
    { name: 'Localização', href: '#location' },
    { name: 'Infraestrutura', href: '#infrastructure' },
    { name: 'Masterplan', href: '#masterplan' },
    { name: 'Investimento', href: '#investment' },
    { name: 'Cronograma', href: '#roadmap' },
    { name: 'Desenvolvedor', href: '#closing' },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-700 px-8 py-6 no-print",
        isScrolled ? "bg-paper/95 backdrop-blur-md py-4 shadow-sm" : "bg-transparent",
        isVisible ? "translate-y-0" : "-translate-y-full",
        isScrolled ? "text-ink" : "text-white"
      )}>
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <a href="#" className="flex items-center gap-6 group">
            <span className="text-xl font-serif-display tracking-tight transition-colors duration-700">QUINTA DO CANDAL</span>
            <div className={cn("h-6 w-[1px] hidden md:block transition-colors duration-700", isScrolled ? "bg-ink/20" : "bg-white/20")}></div>
            <div className="flex items-center gap-3">
              <span className={cn("text-[8px] font-bold uppercase tracking-widest transition-colors duration-700", isScrolled ? "text-ink/40" : "text-white/40")}>desenvolvido por</span>
              <img 
                src="/REF/09_OUTROS/FACE sem fundo.png" 
                alt="Logo da UNUM" 
                className={cn("h-10 w-auto object-contain transition-all duration-700", !isScrolled && "brightness-0 invert")}
                referrerPolicy="no-referrer"
              />
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-700 hover:text-gold",
                  isScrolled ? "text-ink/60" : "text-white/60"
                )}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 transition-colors duration-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-paper flex flex-col p-12"
          >
            <div className="flex justify-end mb-12">
              <button onClick={() => setIsMenuOpen(false)} className="text-ink p-2">
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col space-y-8">
              {navLinks.map((link, i) => (
                <motion.a 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name} 
                  href={link.href} 
                  className="text-4xl font-serif-display text-ink"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
            <div className="mt-auto pt-12 border-t border-ink/10">
              <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-4">Vila Nova de Gaia</p>
              <p className="text-sm font-serif italic">Uma nova centralidade urbana.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const ref = useRef(null);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/hero-images');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setHeroImages(data);
        }
      } catch (error) {
        console.error("Error fetching hero images:", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-ink">
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <AnimatePresence mode="wait">
          {heroImages.length > 0 ? (
            <motion.img 
              key={currentHeroIndex}
              src={heroImages[currentHeroIndex]} 
              alt="Quinta do Candal Architecture" 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.8, scale: 1.05 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <img 
              src="/REF/01_CAPA/CAPA_Artboard 1.png" 
              alt="Quinta do Candal Architecture" 
              className="w-full h-full object-cover opacity-80 scale-105"
              referrerPolicy="no-referrer"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {heroImages.length > 1 && (
        <>
          <div className="absolute bottom-12 right-8 md:right-24 z-30 flex gap-3">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroIndex(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-500",
                  currentHeroIndex === idx ? "bg-gold w-8" : "bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
          
          <div className="absolute inset-y-0 left-8 md:left-24 flex items-center z-30 pointer-events-none">
            <button
              onClick={() => setCurrentHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
              className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all duration-300 pointer-events-auto"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          </div>
          
          <div className="absolute inset-y-0 right-8 md:right-24 flex items-center z-30 pointer-events-none">
            <button
              onClick={() => setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)}
              className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all duration-300 pointer-events-auto"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </>
      )}

      <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-24 max-w-[1800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <h1 className="text-6xl md:text-[120px] leading-[0.9] font-serif-display text-white mb-8 text-balance">
            QUINTA DO <br />
            <span className="italic-serif text-gold">CANDAL</span>
          </h1>
          <div className="flex items-center gap-6 mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">desenvolvido por</span>
            <img 
              src="/REF/09_OUTROS/FACE sem fundo.png" 
              alt="Logo UNUM" 
              className="h-20 w-auto object-contain brightness-0 invert opacity-90"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-lg md:text-2xl font-light text-white/70 max-w-2xl leading-relaxed mb-12">
            Uma oportunidade de investimento imobiliário em Vila Nova de Gaia, com PIP aprovado, escala urbana e integração direta com a futura Linha Rubi do Metro.
          </p>
          
          <div className="flex flex-wrap gap-8 items-center">
            <a href="#vision" className="group flex items-center gap-4 text-white text-[10px] font-bold uppercase tracking-[0.3em]">
              Visão Estratégica
              <span className="w-12 h-[1px] bg-gold group-hover:w-20 transition-all duration-500"></span>
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 left-8 md:left-24 z-20 flex items-center gap-6"
      >
        <div className="flex flex-col gap-2">
          <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
            <motion.div 
              animate={{ y: [-48, 48] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-full bg-gold"
            />
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 vertical-text">Scroll</span>
      </motion.div>
    </section>
  );
};

const StrategicVision = () => {
  return (
    <section id="vision" className="py-32 md:py-56 px-8 bg-paper relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-sand/30 -z-0"></div>
      
      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-7">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-8 block"
            >
              Visão Estratégica
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-7xl font-serif-display text-ink mb-12 leading-tight"
            >
              Onde localização e <br />
              <span className="italic-serif text-gold">investimento</span> se encontram.
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-8 text-lg md:text-xl font-light text-ink/70 leading-relaxed max-w-2xl"
            >
              <p>
                A Quinta do Candal representa uma oportunidade rara de desenvolvimento na Área Metropolitana do Porto, combinando escala, acessibilidade e capacidade de valorização num único ativo.
              </p>
              <p>
                Com mais de 38.000 m² de área bruta de construção, o projeto oferece dimensão para uma operação estruturada, apoiada por um enquadramento urbanístico já definido e por uma envolvente em forte transformação.
              </p>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="aspect-[3/2] overflow-hidden shadow-2xl"
            >
              <img 
                src="/REF/02_VISÃO/01_VISÃO_Artboard 1.png" 
                alt="Arquitetura 2 Torres" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-ink border border-gold/20 p-8 hidden md:flex flex-col justify-center shadow-2xl">
              <span className="text-4xl font-serif-display text-gold mb-2">38 000 m²</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">ABC TOTAL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LocationSplit = () => {
  return (
    <section id="location" className="bg-ink text-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <div className="relative h-[50vh] lg:h-auto overflow-hidden grayscale contrast-125">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3005.004149957754!2d-8.63022592341235!3d41.1354179116345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA4JzA3LjUiTiA4wrAzNyc0MC4zIlc!5e0!3m2!1spt!2spt!4v1711394800000!5m2!1spt!2spt"
            width="100%" 
            height="100%" 
            style={{ border: 0, minHeight: '500px' }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale"
          ></iframe>
          <div className="absolute inset-0 bg-ink/10 pointer-events-none"></div>
        </div>
        
        <div className="flex flex-col justify-center p-8 md:p-24 lg:p-32">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-8 block"
          >
            Localização
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif-display mb-12"
          >
            O Novo Eixo <br />
            Estruturante de <span className="italic-serif text-gold">Gaia</span>.
          </motion.h2>
          
          <div className="space-y-12">
            {[
              { title: 'Conectividade Total', desc: 'Acesso imediato à Ponte da Arrábida e aos principais eixos rodoviários.' },
              { title: 'Centralidade Urbana', desc: 'Inserido na VL8, o novo eixo que reforça a ligação entre o centro de Gaia e a Arrábida.' },
              { title: 'Proximidade', desc: 'A poucos minutos dos principais polos culturais, comerciais e de lazer do Porto e de Gaia.' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="group"
              >
                <h3 className="text-xl font-serif-display mb-4 flex items-center gap-4">
                  <span className="text-gold">0{i+1}</span>
                  {item.title}
                </h3>
                <p className="text-white/50 font-light leading-relaxed max-w-md group-hover:text-white/80 transition-colors">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 pt-12 border-t border-white/10 flex items-center gap-8">
            <div className="text-[10px] font-mono tracking-widest text-gold">
              41° 8'7.49"N <br /> 8°37'40.31"W
            </div>
            <a href="https://maps.app.goo.gl/5boStcaV3HBn2c3z8" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:text-gold transition-colors">
              Ver no Mapa <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const MobilityFeature = () => {
  return (
    <section id="mobility" className="py-32 md:py-56 px-8 bg-paper">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-8 block"
            >
              Mobilidade e Conectividade
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-serif-display text-ink mb-12 leading-tight"
            >
              Uma Estação <br />
              no <span className="italic-serif">Coração</span>.
            </motion.h2>
            <p className="text-lg md:text-xl font-light text-ink/70 leading-relaxed mb-12 max-w-xl">
              Uma das características mais distintivas da Quinta do Candal é a integração da futura Linha Rubi do Metro, com uma estação localizada no interior da área de desenvolvimento. Esta condição reforça de forma decisiva a acessibilidade do projeto e consolida a sua centralidade à escala metropolitana.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { title: 'Linha Rubi', desc: 'Ligação direta e rápida ao Porto e à restante rede metropolitana.' },
                { title: 'Sustentabilidade', desc: 'Reforço da mobilidade pedonal, redução da dependência do automóvel e promoção de um modelo urbano mais sustentável.' }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-sand/50 border-l-2 border-gold flex flex-col h-full">
                  <h4 className="text-lg font-serif-display mb-2">{item.title}</h4>
                  <p className="text-sm text-ink/50 font-light mb-4">{item.desc}</p>
                  {item.title === 'Linha Rubi' && (
                    <a 
                      href="https://linharubi.metrodoporto.pt/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-auto text-[10px] font-bold uppercase tracking-widest text-gold hover:text-ink transition-colors flex items-center gap-2"
                    >
                      MAIS INFO <ArrowRight size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5 }}
              className="aspect-square overflow-hidden shadow-2xl rounded-full"
            >
              <img 
                src="/REF/03_METRO/LINHA RUBI 1.1.png" 
                alt="Linha Rubi Metro" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gold/10 rounded-full -z-10 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InfrastructureInvestor = () => {
  return (
    <section id="infrastructure" className="py-32 md:py-56 px-8 bg-ink text-white relative overflow-hidden">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-4">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-8 block"
            >
              Infraestrutura e De-risking
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif-display mb-12 leading-tight"
            >
              Infraestrutura: <br />
              <span className="italic-serif text-gold">CAPEX Reduzido</span>.
            </motion.h2>
            
            <div className="space-y-10">
              {[
                { 
                  title: 'Execução Pública', 
                  desc: 'Conclusão da Linha Rubi do Metro do Porto prevista para 2026.' 
                },
                { 
                  title: 'Financiamento', 
                  desc: 'Investimento público já assegurado e em execução, com financiamento PRR superior a 400 milhões de euros.' 
                },
                { 
                  title: 'Vantagem', 
                  desc: 'Necessidade reduzida de investimento em infraestruturas privadas, permitindo concentrar recursos na valorização do ativo.' 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-l border-gold/30 pl-6"
                >
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gold/60 mb-2">{item.title}</h4>
                  <p className="text-lg font-light text-white/80 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative aspect-video bg-white/5 border border-white/10 flex items-center justify-center group cursor-pointer overflow-hidden shadow-2xl"
            >
              <video 
                src="/REF/04_INFRA/video infraestruturas 2.1.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-ink to-transparent z-10">
                <p className="text-sm font-light text-white/60 italic">
                  "Transformação metropolitana estratégica atualmente em curso."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BusinessPlan = () => {
  const metrics = [
    { label: 'ABC Total', value: '38.766 m²', icon: <Grid size={20} /> },
    { label: 'Estado do Planeamento', value: 'Aprovado (PIP)', icon: <ShieldCheck size={20} /> },
    { label: 'Valor de Saída Est.', value: '180M€+', icon: <TrendingUp size={20} /> },
    { label: 'TIR Alvo', value: '18-22%', icon: <BarChart3 size={20} /> },
  ];

  return (
    <section id="investment" className="py-32 md:py-56 px-8 bg-ink text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-24">
          <div>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-8 block"
            >
              Estrutura de Investimento
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-serif-display mb-12 leading-tight"
            >
              Modelo de Investimento <br />
              e Estratégia de <span className="italic-serif text-gold">Saída</span>.
            </motion.h2>
            
            <div className="space-y-12 max-w-xl">
              <div className="group">
                <h3 className="text-xl font-serif-display mb-4 text-gold">01. Desenvolvimento</h3>
                <p className="text-white/50 font-light leading-relaxed">
                  Implementação de um masterplan de uso misto, com predominância residencial e integração de serviços, suportado pela capacidade urbanística já definida no PIP aprovado.
                </p>
              </div>
              <div className="group">
                <h3 className="text-xl font-serif-display mb-4 text-gold">02. Capital</h3>
                <p className="text-white/50 font-light leading-relaxed">
                  Estrutura de investimento flexível, aberta à entrada de parceiros de equity tanto ao nível da totalidade da operação como de lotes individuais.
                </p>
              </div>
              <div className="group">
                <h3 className="text-xl font-serif-display mb-4 text-gold">03. Saída</h3>
                <p className="text-white/50 font-light leading-relaxed">
                  Flexibilidade para diferentes estratégias de monetização, incluindo venda em planta, alienação parcial do desenvolvimento ou retenção de ativos para rendimento.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
              {metrics.map((metric, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-12 bg-ink/50 backdrop-blur-sm"
                >
                  <div className="text-gold mb-6">{metric.icon}</div>
                  <div className="text-3xl font-serif-display mb-2">{metric.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{metric.label}</div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 p-12 border border-gold/20 bg-gold/5">
              <div className="flex items-center gap-4 mb-6">
                <PieChart className="text-gold" size={24} />
                <h4 className="text-lg font-serif-display">Alocação de Investimento</h4>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-white/40">Construção</span>
                  <span className="text-sm font-mono">65%</span>
                </div>
                <div className="w-full h-1 bg-white/10">
                  <div className="h-full bg-gold w-[65%]"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-white/40">Infraestrutura e Soft Costs</span>
                  <span className="text-sm font-mono">25%</span>
                </div>
                <div className="w-full h-1 bg-white/10">
                  <div className="h-full bg-gold w-[25%]"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-white/40">Marketing e Vendas</span>
                  <span className="text-sm font-mono">10%</span>
                </div>
                <div className="w-full h-1 bg-white/10">
                  <div className="h-full bg-gold w-[10%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Timeline = () => {
  const steps = [
    { year: '2023', title: 'Aprovação do Planeamento', desc: 'PIP aprovado pela Câmara Municipal de Vila Nova de Gaia.' },
    { year: '2024', title: 'Infraestrutura do Metro', desc: 'Início das obras da Linha Rubi e da Estação do Candal.' },
    { year: '2026', title: 'Licenciamento Final', desc: 'Submissão e aprovação dos projetos de arquitetura detalhados.' },
    { year: '2027', title: 'Início da Construção', desc: 'Início da construção dos primeiros lotes residenciais.' },
    { year: '2028', title: 'Conclusão da Fase I', desc: 'Entrega das unidades iniciais e ativação comercial.' },
  ];

  return (
    <section id="roadmap" className="py-32 md:py-56 px-8 bg-white relative overflow-hidden">
      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-8 block"
          >
            Cronograma
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif-display text-ink"
          >
            Cronograma de <span className="italic-serif">Execução</span>.
          </motion.h2>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-ink/10 hidden lg:block"></div>
          <div className="grid lg:grid-cols-5 gap-12">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10"
              >
                <div className="w-4 h-4 bg-gold rounded-full mb-8 mx-auto lg:mx-0 border-4 border-paper outline outline-1 outline-gold/20"></div>
                <div className="text-4xl font-serif-display text-gold mb-4">{step.year}</div>
                <h4 className="text-lg font-serif-display mb-4">{step.title}</h4>
                <p className="text-sm text-ink/50 font-light leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const LotesGrid = () => {
  const [selectedLote, setSelectedLote] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [masterplanImageIndex, setMasterplanImageIndex] = useState(0);
  const [currentLoteImageIndex, setCurrentLoteImageIndex] = useState(0);
  const [masterplanImages, setMasterplanImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/masterplan-images');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setMasterplanImages(data);
        }
      } catch (error) {
        console.error("Error fetching masterplan images:", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (masterplanImages.length <= 1) return;
    const timer = setInterval(() => {
      setMasterplanImageIndex((prev) => (prev + 1) % masterplanImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [masterplanImages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLoteImageIndex((prev) => (prev + 1) % 100);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const lotes = [
    { 
      id: 1, 
      area: '604,80 m²', 
      constr: '1.698,10 m²', 
      floors: '6 Pisos',
      images: ['/REF/07_LOTES/LOTE 1/LOTE1.1.png', '/REF/07_LOTES/LOTE 1/LOTE1.2.png']
    },
    { 
      id: 2, 
      area: '860,60 m²', 
      constr: '2.576,40 m²', 
      floors: '4 Pisos',
      images: ['/REF/07_LOTES/LOTE 2/LOTE 2.png']
    },
    { 
      id: 3, 
      area: '332,50 m²', 
      constr: '839,40 m²', 
      floors: '4 Pisos',
      images: ['/REF/07_LOTES/LOTE 3/LOTE3.png', '/REF/07_LOTES/LOTE 3/Night.png']
    },
    { 
      id: 4, 
      area: '1.215,90 m²', 
      constr: '5.218,40 m²', 
      floors: '6 Pisos',
      images: ['/REF/07_LOTES/LOTE 4/LOTE 4.1.png', '/REF/07_LOTES/LOTE 4/LOTE 4.2.png']
    },
    { 
      id: 5, 
      area: '2.837,00 m²', 
      constr: '13.850,00 m²', 
      floors: '18 Pisos',
      images: ['/REF/07_LOTES/LOTE 5/LOTE5.png', '/REF/07_LOTES/LOTE 5/sunset 5.png']
    },
    { 
      id: 6, 
      area: '4.257,75 m²', 
      constr: '14.584,00 m²', 
      floors: '18 Pisos',
      images: ['/REF/07_LOTES/LOTE 6/LOTE 6.png', '/REF/07_LOTES/LOTE 6/sunset 3.png']
    },
  ];

  useEffect(() => {
    if (!selectedLote || selectedLote.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % selectedLote.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [selectedLote]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % selectedLote.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + selectedLote.images.length) % selectedLote.images.length);
  };

  return (
    <section id="masterplan" className="py-32 md:py-56 px-8 bg-ink text-white">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
          <div>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-8 block"
            >
              Masterplan e Loteamento
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-serif-display leading-tight mb-12"
            >
              Plano de <br />
              <span className="italic-serif text-gold">Loteamento</span> Aprovado.
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8 text-lg font-light text-white/60 leading-relaxed"
            >
              <p>
                O loteamento da Quinta do Candal desenvolve-se sobre uma área de aproximadamente 10.100 m² de terreno, estruturada de forma a assegurar coerência urbana, eficiência construtiva e flexibilidade de desenvolvimento.
              </p>
              <p>
                Composto por 6 lotes distintos, o conjunto totaliza uma Área Bruta de Construção de 38.766 m², permitindo uma operação de escala relevante, com diversidade tipológica e capacidade de adaptação a diferentes estratégias de investimento.
              </p>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="aspect-video overflow-hidden shadow-2xl relative"
          >
            <AnimatePresence mode="wait">
              {masterplanImages.length > 0 && (
                <motion.img 
                  key={masterplanImageIndex}
                  src={masterplanImages[masterplanImageIndex]} 
                  alt="Masterplan Overview" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="w-full h-full object-cover transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              )}
            </AnimatePresence>

            {masterplanImages.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMasterplanImageIndex((prev) => (prev - 1 + masterplanImages.length) % masterplanImages.length);
                    }}
                    className="p-2 bg-ink/50 text-white rounded-full hover:bg-gold hover:text-ink transition-all pointer-events-auto"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMasterplanImageIndex((prev) => (prev + 1) % masterplanImages.length);
                    }}
                    className="p-2 bg-ink/50 text-white rounded-full hover:bg-gold hover:text-ink transition-all pointer-events-auto"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {masterplanImages.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-500",
                        masterplanImageIndex === i ? "bg-gold w-4" : "bg-white/20"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <h3 className="text-3xl md:text-5xl font-serif-display">
            Desenvolvimento <span className="italic-serif text-gold">Lote a Lote</span>
          </h3>
          <div className="text-right hidden md:block">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-4">PIP Aprovado</p>
            <div className="w-32 h-[1px] bg-gold ml-auto"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {lotes.map((lote, i) => {
            const imgIndex = currentLoteImageIndex % lote.images.length;
            return (
              <motion.div 
                key={lote.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  setSelectedLote(lote);
                  setCurrentImageIndex(0);
                }}
                className="group p-12 bg-ink hover:bg-gold transition-all duration-700 cursor-pointer relative overflow-hidden min-h-[400px]"
              >
                {/* Background Slideshow */}
                <div className="absolute inset-0 z-0">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={imgIndex}
                      src={lote.images[imgIndex]}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 0.3, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2 }}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-ink/60 group-hover:bg-gold/80 transition-colors duration-700" />
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] font-mono text-gold group-hover:text-ink mb-8 block">0{lote.id}</span>
                  <h3 className="text-3xl font-serif-display mb-6 group-hover:text-ink transition-colors">Lote {lote.id}</h3>
                  <div className="space-y-2 text-white/40 group-hover:text-ink/60 transition-colors">
                    <p className="text-sm">Terreno: <span className="text-white group-hover:text-ink font-medium">{lote.area}</span></p>
                    {lote.constr && <p className="text-sm">Construção: <span className="text-white group-hover:text-ink font-medium">{lote.constr}</span></p>}
                    {lote.floors && <p className="text-sm">Altura: <span className="text-white group-hover:text-ink font-medium">{lote.floors}</span></p>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedLote && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-ink/95 backdrop-blur-sm"
            onClick={() => setSelectedLote(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-6xl w-full bg-paper overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedLote(null)}
                className="absolute top-6 right-6 z-20 p-2 bg-ink text-white rounded-full hover:bg-gold hover:text-ink transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col md:flex-row flex-1 overflow-y-auto no-scrollbar">
                <div className="w-full md:w-2/3 relative aspect-[4/3] md:aspect-auto bg-ink min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentImageIndex}
                      src={selectedLote.images[currentImageIndex]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                  
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <button 
                      onClick={prevImage}
                      className="p-3 bg-ink/50 text-white rounded-full hover:bg-gold hover:text-ink transition-all backdrop-blur-sm"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="p-3 bg-ink/50 text-white rounded-full hover:bg-gold hover:text-ink transition-all backdrop-blur-sm"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedLote.images.map((_: any, i: number) => (
                      <div 
                        key={i}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          i === currentImageIndex ? "bg-gold w-6" : "bg-white/30"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-1/3 p-12 flex flex-col justify-center bg-paper text-ink">
                  <h3 className="text-5xl font-serif-display mb-12 uppercase tracking-tight">Lote 0{selectedLote.id}</h3>
                  
                  <div className="space-y-6">
                    <div className="border-b border-ink/10 pb-4">
                      <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">Área do Terreno</p>
                      <p className="text-xl font-serif-display">{selectedLote.area}</p>
                    </div>
                    <div className="border-b border-ink/10 pb-4">
                      <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">Área de Construção</p>
                      <p className="text-xl font-serif-display">{selectedLote.constr}</p>
                    </div>
                    <div className="border-b border-ink/10 pb-4">
                      <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">Altura / Pisos</p>
                      <p className="text-xl font-serif-display">{selectedLote.floors}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Bar */}
              <div className="bg-ink p-4 flex justify-center gap-2 md:gap-4 border-t border-white/10 overflow-x-auto no-scrollbar shrink-0">
                {lotes.map((lote) => (
                  <button
                    key={lote.id}
                    onClick={() => {
                      setSelectedLote(lote);
                      setCurrentImageIndex(0);
                    }}
                    className={cn(
                      "px-4 md:px-8 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap border border-transparent",
                      selectedLote.id === lote.id 
                        ? "bg-gold text-ink border-gold" 
                        : "text-white/40 hover:text-white hover:bg-white/5 border-white/5"
                    )}
                  >
                    Lote 0{lote.id}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Infrastructure = () => {
  return (
    <section id="infrastructure-detail" className="py-32 md:py-56 px-8 bg-paper">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5 }}
              className="aspect-[4/5] overflow-hidden shadow-2xl"
            >
              <img 
                src="/REF/05_EXECUÇÃO/ESTRUTURA OPERACIONAL.png" 
                alt="Detalhe de Construção" 
                className="w-full h-full object-cover transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute top-12 -right-12 vertical-text text-[10px] font-bold uppercase tracking-[0.5em] text-gold/40 hidden md:block">
              Transformation in Progress
            </div>
          </div>
          
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-8 block"
            >
              Estrutura da Operação
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-serif-display text-ink mb-12 leading-tight"
            >
              Um ativo com enquadramento <br />
              urbanístico já <span className="italic-serif text-gold">definido</span>.
            </motion.h2>
            <div className="space-y-8 text-lg md:text-xl font-light text-ink/70 leading-relaxed max-w-2xl">
              <p>
                A operação beneficia de um Pedido de Informação Prévia (PIP) aprovado, que estabelece o desenvolvimento do conjunto através de 6 lotes independentes.
              </p>
              <p>
                O terreno encontra-se em processo de alienação pela Santa Casa da Misericórdia do Porto, estando previsto que o loteamento seja formalizado antes da escritura, permitindo que a transação ocorra com um enquadramento urbanístico já estabilizado.
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-2 gap-12">
              <div>
                <span className="text-4xl font-serif-display text-gold block mb-2">PIP</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Aprovado</span>
              </div>
              <div>
                <span className="text-4xl font-serif-display text-gold block mb-2">LOTEAMENTO</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Em Processo Camarário</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const UpsideScenario = () => {
  const [upsideImages, setUpsideImages] = useState<string[]>([]);
  const [currentUpsideIndex, setCurrentUpsideIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/proposta-b-images');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setUpsideImages(data);
        }
      } catch (error) {
        console.error("Error fetching upside images:", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (upsideImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentUpsideIndex((prev) => (prev + 1) % upsideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [upsideImages]);

  return (
    <section id="upside" className="py-32 md:py-56 px-8 bg-ink text-white relative overflow-hidden">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-8 block"
            >
              Visão Alternativa / Cenário Upside
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-serif-display leading-tight mb-12"
            >
              Cenário de <br />
              <span className="italic-serif text-gold">Reposicionamento</span> Estratégico.
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8 text-lg font-light text-white/60 leading-relaxed"
            >
              <p>
                Para além do loteamento aprovado, identifica-se um cenário alternativo de redesenvolvimento com capacidade para reposicionar o conjunto numa escala urbana mais ambiciosa e com maior força identitária.
              </p>
              <p>
                A consolidação dos lotes 2, 3 e 4 com os lotes 5 e 6 permitiria concentrar a capacidade construtiva num novo conjunto de três torres residenciais, até 18 pisos cada, criando uma solução de maior presença urbana, maior exposição visual e mais forte diferenciação arquitetónica.
              </p>
              <div className="pt-8 border-t border-white/10">
                <div className="grid sm:grid-cols-2 gap-8">
                  {[
                    { title: 'Impacto Arquitetónico', desc: 'Uma proposta com maior unidade formal e presença no território.' },
                    { title: 'Presença Metropolitana', desc: 'Um conjunto com potencial para se afirmar como nova referência urbana em Gaia.' },
                    { title: 'Densidade Otimizada', desc: 'Concentração da capacidade construtiva numa solução mais eficiente e marcante.' },
                    { title: 'Posicionamento Premium', desc: 'Potencial para reforçar a atratividade comercial e o valor percebido do empreendimento.' }
                  ].map((item, i) => (
                    <div key={i}>
                      <h4 className="text-gold font-serif-display text-lg mb-2 italic">{item.title}</h4>
                      <p className="text-xs uppercase tracking-widest text-white/40 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative aspect-[3/4] bg-white/5 border border-white/10 overflow-hidden shadow-2xl group"
          >
            <AnimatePresence mode="wait">
              {upsideImages.length > 0 ? (
                <motion.img 
                  key={currentUpsideIndex}
                  src={upsideImages[currentUpsideIndex]} 
                  alt="Visão Upside" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="w-full h-full object-cover transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img 
                  src="/REF/08_PROPOSTA B/XXX_3T_1,0.png" 
                  alt="Visão Upside" 
                  className="w-full h-full object-cover transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-12 left-12 right-12">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold mb-2">Visão Concetual</p>
              <p className="text-2xl font-serif-display leading-tight">Torres Residenciais Consolidadas</p>
            </div>
            
            {upsideImages.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentUpsideIndex((prev) => (prev - 1 + upsideImages.length) % upsideImages.length);
                    }}
                    className="p-2 bg-ink/50 text-white rounded-full hover:bg-gold hover:text-ink transition-all pointer-events-auto"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentUpsideIndex((prev) => (prev + 1) % upsideImages.length);
                    }}
                    className="p-2 bg-ink/50 text-white rounded-full hover:bg-gold hover:text-ink transition-all pointer-events-auto"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="absolute top-12 right-12 flex gap-2">
                  {upsideImages.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-500",
                        currentUpsideIndex === i ? "bg-gold w-4" : "bg-white/20"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const UnumSection = () => {
  return (
    <section id="closing" className="pt-32 pb-16 md:pt-56 md:pb-24 px-8 bg-ink border-t border-white/5">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-8 block"
            >
              Desenvolvedor
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-serif-display text-white mb-12 leading-tight"
            >
              UNUM: <br />
              <span className="italic-serif text-gold">Arquitetura</span>, Estratégia e Desenvolvimento Imobiliário.
            </motion.h2>
            <div className="space-y-8 text-lg md:text-xl font-light text-white/70 leading-relaxed max-w-2xl">
              <p>
                A UNUM é um gabinete de arquitetura que atua também na estruturação e acompanhamento de empreendimentos e investimentos imobiliários, conciliando visão de projeto, enquadramento urbanístico e lógica de valorização.
              </p>
              <p>
                Através de uma abordagem integrada, acompanha diferentes fases do processo, desde a definição estratégica e desenvolvimento do projeto até à concretização da operação, procurando sempre responder com rigor, coerência e foco no valor do ativo.
              </p>
            </div>
            
            <div className="mt-16">
              <a 
                href="https://unum.pt/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-6 text-white text-[10px] font-bold uppercase tracking-[0.4em]"
              >
                Visitar Website Oficial
                <span className="w-12 h-[1px] bg-gold group-hover:w-24 transition-all duration-500"></span>
              </a>
            </div>
          </div>
          
          <div className="relative flex flex-col items-center lg:items-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="aspect-video bg-ink flex items-center justify-center p-20 w-full"
            >
              <a 
                href="https://unum.pt/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center cursor-pointer group/logo"
              >
                <img 
                  src="/REF/09_OUTROS/FACE sem fundo.png" 
                  alt="Logo da UNUM" 
                  className="w-full h-auto object-contain brightness-0 invert opacity-90 group-hover/logo:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="mt-4 w-full flex justify-center px-12"
            >
              <img 
                src="/REF/09_OUTROS/PREMIOS PNG2.png" 
                alt="Prémios UNUM" 
                className="h-16 md:h-24 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <div className="mt-12 flex gap-8 justify-center lg:justify-end w-full">
              <a href="https://www.instagram.com/unum.arch/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-gold transition-colors">
                Instagram
              </a>
              <a href="https://www.linkedin.com/company/unumarchitecture/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-gold transition-colors">
                LinkedIn
              </a>
              <a href="https://www.facebook.com/unum.pt/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-gold transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onOpenTerms, onOpenPrivacy }: { onOpenTerms: () => void; onOpenPrivacy: () => void }) => {
  return (
    <footer className="py-12 px-8 bg-ink text-white no-print">
      <div className="max-w-[1800px] mx-auto">
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] uppercase tracking-widest text-white/20">
            © 2026 Quinta do Candal — Vila Nova de Gaia. Todos os direitos reservados.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-white/20">
            <button onClick={onOpenPrivacy} className="hover:text-white transition-colors uppercase">Política de Privacidade</button>
            <button onClick={onOpenTerms} className="hover:text-white transition-colors uppercase">Termos</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const TermsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-ink/95 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative max-w-4xl w-full max-h-[90vh] bg-paper overflow-hidden shadow-2xl flex flex-col rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-2 bg-ink text-white rounded-full hover:bg-gold hover:text-ink transition-all"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12 overflow-y-auto text-ink">
              <h2 className="text-3xl font-serif-display mb-8 text-gold">Avisos Legais e Termos de Utilização</h2>
              
              <div className="space-y-6 text-sm leading-relaxed font-light">
                <p>
                  O presente website foi concebido para apresentar o conceito arquitetónico e o projeto do empreendimento Quinta do Candal, localizado em Vila Nova de Gaia. Ao navegar neste website, o utilizador concorda com os presentes Avisos Legais e Termos de Utilização.
                </p>

                <section>
                  <h3 className="font-bold text-lg mb-2">1. Propriedade do Website</h3>
                  <p>Este website é operado e mantido por:</p>
                  <ul className="list-none mt-2 space-y-1">
                    <li><strong>Nome da Empresa:</strong> Oficina de Projetos de Arquitetura UNUM Lda.</li>
                    <li><strong>NIPC:</strong> 513 448 900</li>
                    <li><strong>Sede:</strong> Av. da República, 1363, Sala R5.6, Vila Nova de Gaia</li>
                    <li><strong>E-mail de contacto para efeitos de privacidade:</strong> <a href="mailto:geral@unum.pt" className="text-gold hover:underline">geral@unum.pt</a></li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">2. Natureza das Imagens e Isenção de Responsabilidade (Disclaimer)</h3>
                  <p>A informação, os elementos gráficos e visuais constantes neste website destinam-se a fins estritamente informativos e de apresentação conceptual do projeto de arquitetura.</p>
                  <div className="mt-4 space-y-4">
                    <p><strong>Imagens 3D e Renders:</strong> Todas as imagens virtuais, maquetes 3D, simulações visuais e perspetivas apresentadas são meramente ilustrativas e não vinculativas. Têm como objetivo demonstrar a visão arquitetónica do projeto.</p>
                    <p><strong>Alterações ao Projeto:</strong> O projeto encontra-se sujeito a eventuais alterações de ordem técnica, comercial, estrutural ou legal, decorrentes do processo de licenciamento junto da Câmara Municipal de Vila Nova de Gaia ou de constrangimentos em fase de obra e construção.</p>
                    <p><strong>Acabamentos e Decoração:</strong> Os materiais, cores, texturas, equipamentos, mobiliário e arranjos paisagísticos (jardins, vegetação) visíveis nas imagens são sugestões de decoração e propostas conceptuais, não constituindo qualquer obrigação contratual por parte do gabinete de arquitetura ou do promotor imobiliário.</p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">3. Áreas e Plantas</h3>
                  <p>As plantas apresentadas e as respetivas áreas (brutas, úteis, de varandas ou terraços) são aproximadas e indicativas. As áreas definitivas e finais serão as resultantes da construção em obra e da emissão das respetivas telas finais e certidões prediais. Nenhuma informação constante neste website constitui uma oferta contratual de venda ou um documento legal vinculativo.</p>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">4. Direitos de Autor e Propriedade Intelectual</h3>
                  <p>Todo o conteúdo deste website — incluindo, mas não se limitando a, renders, plantas, desenhos técnicos, textos, logótipos, gráficos e design do website — é propriedade intelectual exclusiva da Oficina de Projetos de Arquitetura UNUM Lda. (e/ou dos respetivos promotores parceiros, quando aplicável).</p>
                  <p className="mt-2">Estes conteúdos estão protegidos pela legislação portuguesa e internacional sobre Direitos de Autor. É estritamente proibida a cópia, reprodução, modificação, distribuição ou utilização comercial de qualquer conteúdo deste website por terceiros (incluindo agências de mediação imobiliária) sem a autorização prévia, expressa e por escrito dos respetivos autores.</p>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">5. Resolução Alternativa de Litígios (RAL)</h3>
                  <p>Em cumprimento da Lei n.º 144/2015, de 8 de setembro, informamos que, em caso de litígio de consumo, o consumidor pode recorrer a uma Entidade de Resolução Alternativa de Litígios de Consumo. Sendo o projeto em Vila Nova de Gaia, a entidade competente é:</p>
                  <p className="mt-2"><strong>CICAP – Centro de Informação de Consumo e Arbitragem do Porto</strong></p>
                  <p>Site: <a href="https://www.cicap.pt" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">www.cicap.pt</a> | Morada: Rua Damião de Góis, 31, Loja 6, 4050-225 Porto</p>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">6. Livro de Reclamações Eletrónico</h3>
                  <p>Nos termos da legislação em vigor (DL n.º 74/2017), dispomos de Livro de Reclamações Eletrónico. Caso deseje apresentar uma reclamação, poderá fazê-lo através da plataforma oficial: <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">www.livroreclamacoes.pt</a></p>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">7. Lei Aplicável e Foro</h3>
                  <p>Os presentes Termos regem-se pela Lei Portuguesa. Para a resolução de qualquer litígio emergente da utilização deste website, é competente o foro da Comarca de Vila Nova de Gaia, com expressa renúncia a qualquer outro.</p>
                </section>

                <div className="pt-8 border-t border-ink/10 text-[10px] uppercase tracking-widest text-ink/40">
                  Última atualização: março de 2026
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PrivacyModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-ink/95 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative max-w-4xl w-full max-h-[90vh] bg-paper overflow-hidden shadow-2xl flex flex-col rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-2 bg-ink text-white rounded-full hover:bg-gold hover:text-ink transition-all"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12 overflow-y-auto text-ink">
              <h2 className="text-3xl font-serif-display mb-8 text-gold">Política de Privacidade</h2>
              
              <div className="space-y-6 text-sm leading-relaxed font-light">
                <p>
                  A presente Política de Privacidade descreve a forma como a UNUM (doravante, "Nós" ou "Responsável pelo Tratamento") recolhe, utiliza, protege e partilha os dados pessoais dos utilizadores (doravante, "Utilizador") através do website do empreendimento Quinta do Candal (doravante, "Website").
                </p>
                <p>
                  O nosso compromisso é garantir a privacidade e a proteção dos dados pessoais de todos os que interagem com o nosso Website, em rigoroso cumprimento com o Regulamento Geral sobre a Proteção de Dados (RGPD) e demais legislação aplicável em Portugal.
                </p>

                <section>
                  <h3 className="font-bold text-lg mb-2">1. Responsável pelo Tratamento dos Dados</h3>
                  <p>A entidade responsável pela recolha e tratamento dos dados pessoais é:</p>
                  <ul className="list-none mt-2 space-y-1">
                    <li><strong>Nome da Empresa:</strong> Oficina de Projetos de Arquitetura UNUM Lda.</li>
                    <li><strong>NIPC:</strong> 513 448 900</li>
                    <li><strong>Sede:</strong> Av. da República, 1363, Sala R5.6, Vila Nova de Gaia</li>
                    <li><strong>E-mail de contacto para efeitos de privacidade:</strong> <a href="mailto:geral@unum.pt" className="text-gold hover:underline">geral@unum.pt</a></li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">2. Que dados pessoais recolhemos?</h3>
                  <p>No contexto da apresentação do empreendimento Quinta do Candal, podemos recolher as seguintes categorias de dados pessoais:</p>
                  <div className="mt-4 space-y-4">
                    <p><strong>Dados de Identificação e Contacto:</strong> Nome, endereço de e-mail e número de telefone (recolhidos apenas se o Utilizador preencher voluntariamente o formulário de contacto ou de manifestação de interesse).</p>
                    <p><strong>Dados de Navegação:</strong> Endereço IP, tipo de dispositivo, navegador (browser) utilizado, tempo de permanência no Website e páginas visitadas. Estes dados são recolhidos através de cookies (veja o ponto 8) e destinam-se a fins estatísticos e de melhoria da experiência de navegação.</p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">3. Para que fins utilizamos os seus dados e qual a base legal?</h3>
                  <p>Os dados recolhidos são tratados para as seguintes finalidades:</p>
                  <div className="mt-4 space-y-4">
                    <p><strong>Resposta a Pedidos de Informação:</strong> Para responder a dúvidas, agendar reuniões ou enviar brochuras e informações detalhadas sobre o projeto de arquitetura e o empreendimento. (Base legal: Diligências pré-contratuais a pedido do titular dos dados e/ou Consentimento).</p>
                    <p><strong>Comunicação Comercial/Marketing (se aplicável):</strong> Envio de newsletters ou atualizações sobre o estado do projeto, apenas se o Utilizador tiver dado o seu consentimento expresso para esse fim. (Base legal: Consentimento).</p>
                    <p><strong>Análise e Otimização do Website:</strong> Para compreender como os utilizadores navegam no Website e melhorar o seu desempenho e design. (Base legal: Interesse Legítimo e/ou Consentimento através da Política de Cookies).</p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">4. Partilha de Dados com Terceiros</h3>
                  <p>Os seus dados pessoais não serão vendidos ou alugados a terceiros. No entanto, para podermos dar seguimento ao seu interesse no projeto, os seus dados poderão ser partilhados com:</p>
                  <div className="mt-4 space-y-4">
                    <p><strong>O Promotor Imobiliário / Equipa Comercial:</strong> Sendo este um website de apresentação conceptual de arquitetura, os dados submetidos por quem tem interesse na aquisição de frações poderão ser reencaminhados para a entidade promotora ou mediadora responsável pela comercialização do empreendimento UNUM.</p>
                    <p><strong>Prestadores de Serviços (Subcontratantes):</strong> Empresas de alojamento web, agências de marketing digital ou plataformas de envio de e-mails que tratam os dados em nosso nome e sob as nossas instruções estritas, garantindo o cumprimento do RGPD.</p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">5. Durante quanto tempo conservamos os seus dados?</h3>
                  <p>Os dados pessoais serão conservados apenas durante o período estritamente necessário para as finalidades para as quais foram recolhidos:</p>
                  <div className="mt-4 space-y-4">
                    <p><strong>Pedidos de contacto/informação:</strong> Até 1 ano após a última comunicação, ou até que o projeto esteja totalmente comercializado.</p>
                    <p><strong>Dados de navegação/Cookies:</strong> Conforme estipulado na nossa Política de Cookies (geralmente até um máximo de 1 a 2 anos). Findo o prazo de conservação, os dados serão eliminados de forma segura ou anonimizados.</p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">6. Como protegemos os seus dados?</h3>
                  <p>Implementámos medidas técnicas e organizativas de segurança adequadas para proteger os seus dados pessoais contra a destruição, perda, alteração, divulgação ou acesso não autorizado. O Website utiliza um certificado de segurança SSL (Secure Socket Layer) para garantir que a transmissão de dados entre o seu navegador e o nosso servidor é encriptada.</p>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">7. Quais são os seus Direitos?</h3>
                  <p>Nos termos do RGPD, o Utilizador tem o direito de:</p>
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li><strong>Acesso:</strong> Solicitar a confirmação sobre se os seus dados estão a ser tratados e aceder aos mesmos.</li>
                    <li><strong>Retificação:</strong> Pedir a correção de dados inexatos ou incompletos.</li>
                    <li><strong>Apagamento ("Direito ao esquecimento"):</strong> Solicitar a eliminação dos seus dados, quando estes já não sejam necessários ou quando retirar o seu consentimento.</li>
                    <li><strong>Limitação do Tratamento:</strong> Pedir a suspensão do tratamento em determinadas circunstâncias.</li>
                    <li><strong>Portabilidade:</strong> Receber os seus dados num formato estruturado e de leitura automática.</li>
                    <li><strong>Oposição:</strong> Opor-se ao tratamento de dados para fins de marketing direto.</li>
                  </ul>
                  <p className="mt-4">Para exercer qualquer um destes direitos, basta enviar um e-mail para <a href="mailto:geral@unum.pt" className="text-gold hover:underline">geral@unum.pt</a>. Tem também o direito de apresentar uma reclamação à autoridade de controlo em Portugal: a Comissão Nacional de Proteção de Dados (CNPD) - <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">www.cnpd.pt</a>.</p>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">8. Cookies</h3>
                  <p>O nosso Website não utiliza cookies para melhorar a sua experiência de navegação.</p>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">9. Alterações a esta Política</h3>
                  <p>Reservamo-nos o direito de atualizar ou modificar a presente Política de Privacidade a qualquer momento, pelo que aconselhamos a sua consulta regular. As alterações entrarão em vigor a partir da data da sua publicação neste Website.</p>
                </section>

                <div className="pt-8 border-t border-ink/10 text-[10px] uppercase tracking-widest text-ink/40">
                  Última atualização: março de 2026
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <div className="relative min-h-screen selection:bg-gold selection:text-ink">
      <Navbar />
      <Hero />
      <StrategicVision />
      <LocationSplit />
      <MobilityFeature />
      <InfrastructureInvestor />
      <Infrastructure />
      <LotesGrid />
      <UpsideScenario />
      <BusinessPlan />
      <Timeline />
      <UnumSection />
      <Footer onOpenTerms={() => setIsTermsOpen(true)} onOpenPrivacy={() => setIsPrivacyOpen(true)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
}
