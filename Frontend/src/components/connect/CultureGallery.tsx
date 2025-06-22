
const CultureGallery = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop&crop=center",
      alt: "Team collaboration session",
      className: "md:row-span-2",
      title: "Collaborative Environment",
      description: "We believe in the power of teamwork and open communication to drive innovation."
    },
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=300&fit=crop&crop=center", 
      alt: "Remote work setup",
      className: "",
      title: "Remote-First Culture",
      description: "Work from anywhere with our flexible remote-first approach to modern work."
    },
    {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop&crop=center",
      alt: "Office teamwork",
      className: "",
      title: "Diverse Teams",
      description: "Our inclusive environment brings together talent from all backgrounds and perspectives."
    },
    {
      src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop&crop=center",
      alt: "Creative brainstorming",
      className: "md:row-span-2",
      title: "Innovation Hub",
      description: "Dedicated spaces and time for creative thinking and breakthrough solutions."
    }
  ];

  return (
     <section className="py-20" style={{ backgroundColor: '#E2F4ED' }}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
         <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#2A311B' }}>            Life at Our Company
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#3A4325' }}>
            Discover what makes our workplace special through the experiences that define our culture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${image.className}`}
            >
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(42, 49, 27, 0.9) 0%, rgba(58, 67, 37, 0.6) 50%, transparent 100%)' }}
              ></div>              
              {/* Hover content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <h3 className="text-white text-xl font-bold mb-2">{image.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#E2F4ED' }}>{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CultureGallery;