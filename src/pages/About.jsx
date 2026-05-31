import React from 'react';

export default function About() {
  return (
    <div className="pt-24 pb-xl space-y-xl max-w-container-max mx-auto px-gutter">
      {/* Editorial Introduction */}
      <section className="flex flex-col md:flex-row items-center gap-xl py-lg">
        <div className="flex-1 space-y-md">
          <span className="text-body-sm font-semibold tracking-widest text-secondary uppercase">Our Roots</span>
          <h1 className="font-serif text-display-lg text-primary">Our Heritage</h1>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            At TVISHA, we don't just create garments; we curate legacies. Born from a profound respect for ancient Indian textile arts, our minimalist approach allows the intricate details of traditional craftsmanship to speak volumes. Every thread tells a story of devotion, every motif a whisper of history.
          </p>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            We work closely with master weavers and embroiderers, ensuring fair wages, safe workspaces, and the continuation of specialized techniques that have been passed down for generations. By fusing these ancestral arts with structural, modern silhouettes, we make heritage wearable for today's global citizen.
          </p>
          <div className="h-px w-24 bg-tertiary-container mt-lg"></div>
        </div>
        <div className="flex-1 w-full">
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-md bg-surface-container-low border border-outline-variant/30">
            <img 
              alt="TVISHA Heritage Weaving" 
              className="object-cover w-full h-full" 
              src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800"
            />
          </div>
        </div>
      </section>

      {/* Craftsmanship Bento Grid */}
      <section className="bg-surface border-y border-outline-variant/20 py-xl rounded-xl px-md space-y-xl">
        <div className="text-center max-w-xl mx-auto space-y-xs">
          <span className="text-body-sm font-semibold tracking-widest text-secondary uppercase">The Atelier</span>
          <h2 className="font-serif text-headline-lg text-primary">The Art of Craftsmanship</h2>
          <p className="text-body-md text-on-surface-variant">Merging centuries-old techniques with modern, structural silhouettes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter max-w-4xl mx-auto">
          {/* Zardosi Feature */}
          <div className="col-span-1 md:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-lg flex flex-col md:flex-row gap-lg items-center shadow-sm luxe-shadow">
            <div className="flex-1 space-y-sm">
              <span className="text-tertiary font-bold font-label-md uppercase tracking-widest">Mastery</span>
              <h3 className="font-serif text-headline-md text-on-surface">Zardosi Perfection</h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Our artisans employ authentic metallic gold and silver threads (Zari), painstakingly hand-woven to create three-dimensional patterns that catch the light with quiet elegance.
              </p>
            </div>
            <div className="w-full md:w-48 aspect-square rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
              <img 
                alt="Zardosi Detail" 
                className="object-cover w-full h-full" 
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400"
              />
            </div>
          </div>

          {/* Gota Patti Feature */}
          <div className="col-span-1 md:col-span-4 bg-primary text-on-primary rounded-xl p-lg flex flex-col justify-between shadow-sm hover:scale-102 transition-all duration-300">
            <div className="space-y-sm">
              <span className="text-primary-fixed font-bold font-label-md uppercase tracking-widest text-primary-fixed-dim">Technique</span>
              <h3 className="font-serif text-headline-md">Gota Patti</h3>
              <p className="text-body-sm text-on-primary/80 leading-relaxed">
                An appliqué technique originating from Rajasthan, where small pieces of gold-woven ribbon are applied onto the fabric with the edges sewn down to create elaborate patterns.
              </p>
            </div>
            <div className="flex justify-end pt-md">
              <span className="material-symbols-outlined text-[32px] text-tertiary-fixed">auto_awesome</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline (SaaS Density) */}
      <section className="space-y-lg py-lg">
        <h2 className="font-serif text-headline-lg text-primary text-center">Our Journey</h2>
        <div className="max-w-4xl mx-auto border border-outline-variant/30 rounded-xl overflow-hidden bg-surface shadow-sm">
          {/* Header Row */}
          <div className="grid grid-cols-12 bg-surface-container-low border-b border-outline-variant/20 py-sm px-md text-on-surface-variant font-semibold text-body-sm">
            <div className="col-span-2">Year</div>
            <div className="col-span-3">Milestone</div>
            <div className="col-span-7">Detail</div>
          </div>
          {/* Data Rows */}
          <div className="grid grid-cols-12 border-b border-outline-variant/10 py-md px-md items-center hover:bg-surface-container-lowest transition-colors">
            <div className="col-span-2 font-bold text-primary">2012</div>
            <div className="col-span-3 font-semibold text-on-surface text-body-sm">The Inception</div>
            <div className="col-span-7 text-body-sm text-on-surface-variant">Founded as a bespoke couture studio focusing exclusively on handloom silks.</div>
          </div>
          <div className="grid grid-cols-12 border-b border-outline-variant/10 py-md px-md items-center hover:bg-surface-container-lowest transition-colors">
            <div className="col-span-2 font-bold text-primary">2017</div>
            <div className="col-span-3 font-semibold text-on-surface text-body-sm">First Atelier</div>
            <div className="col-span-7 text-body-sm text-on-surface-variant">Opened our flagship design studio, bringing 50 master artisans under one roof in Gujarat.</div>
          </div>
          <div className="grid grid-cols-12 border-b border-outline-variant/10 py-md px-md items-center hover:bg-surface-container-lowest transition-colors">
            <div className="col-span-2 font-bold text-primary">2022</div>
            <div className="col-span-3 font-semibold text-on-surface text-body-sm">Digital Flagship</div>
            <div className="col-span-7 text-body-sm text-on-surface-variant">Launched the TVISHA online portal, merging luxury commerce with custom sizing engines.</div>
          </div>
          <div className="grid grid-cols-12 py-md px-md items-center hover:bg-surface-container-lowest transition-colors">
            <div className="col-span-2 font-bold text-secondary">2026</div>
            <div className="col-span-3 font-semibold text-on-surface text-body-sm">Global Heritage</div>
            <div className="col-span-7 text-body-sm text-on-surface-variant">Expanding our bespoke services internationally, setting new standards in sustainable ethnic luxury.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
