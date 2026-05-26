import { Link } from 'react-router-dom'
import bossBD2 from '../../assets/boss_bd2.jpg'
import ernieBallStrap from '../../assets/ernie_ball_strap.jpg'
import fenderPBass from '../../assets/fender_p_bass.jpg'
import fenderStrat from '../../assets/fender_strat.jpg'
import guitarAmpBg from '../../assets/guitar-amp-bg.jpg'
import marshallAmp from '../../assets/marshall_amp.jpg'
import pearlDrumKit from '../../assets/pearl_drum_kit.jpg'
import studioSpeakers from '../../assets/studio_speakers.jpg'
import './Home.css'

const categories = [
  {
    name: 'Guitarras',
    image: fenderStrat,
  },
  {
    name: 'Bajos',
    image: fenderPBass,
  },
  {
    name: 'Baterías',
    image: pearlDrumKit,
  },
  {
    name: 'Audio',
    image: studioSpeakers,
  },
  {
    name: 'Amplificadores',
    image: marshallAmp,
  },
  {
    name: 'Pedales',
    image: bossBD2,
  },
]

const featured = [
  {
    tag: 'Guitarras',
    title: 'Stratocaster Series',
    description: 'Sonido clásico, versátil y preparado para el escenario.',
    image: fenderStrat,
    link: '/catalogo?cat=Guitarras',
  },
  {
    tag: 'Pedales',
    title: 'Boss Blues Driver',
    description: 'Overdrive cálido para blues, rock y tonos vintage.',
    image: bossBD2,
    link: '/catalogo?cat=Pedales',
  },
  {
    tag: 'Amplificadores',
    title: 'Marshall Collection',
    description: 'Potencia, presencia y carácter para tocar en vivo.',
    image: marshallAmp,
    link: '/catalogo?cat=Amplificadores',
  },
  {
    tag: 'Accesorios',
    title: 'Correas y más',
    description: 'Detalles útiles para completar tu setup musical.',
    image: ernieBallStrap,
    link: '/catalogo?cat=Accesorios',
  },
]

const recommended = [
  {
    number: '01',
    title: 'The Guitar Setup',
    text: 'Guitarra, pedal y amplificador para un sonido completo desde el primer acorde.',
    link: '/catalogo?cat=Guitarras',
  },
  {
    number: '02',
    title: 'Studio Master Set',
    text: 'Audio, monitores y herramientas ideales para producción musical.',
    link: '/catalogo?cat=Audio',
  },
  {
    number: '03',
    title: 'Live Performance',
    text: 'Equipo pensado para tocar en vivo con potencia, claridad y presencia.',
    link: '/catalogo?cat=Amplificadores',
  },
]

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-bg">
          <img src={guitarAmpBg} alt="" />
          <div className="home-hero-overlay" />
        </div>

        <div className="home-hero-content">
          <span className="home-eyebrow">Equipamiento de élite</span>

          <h1>La precisión del sonido puro.</h1>

          <p>
            Explorá instrumentos, accesorios y herramientas de audio pensadas
            para músicos, productores y amantes del sonido profesional.
          </p>

          <div className="home-actions">
            <Link to="/catalogo" className="home-primary-btn">
              Explorar catálogo
            </Link>

            <Link to="/catalogo?cat=Guitarras" className="home-secondary-btn">
              Ver guitarras
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <div>
            <span className="home-section-kicker">Categorías principales</span>
            <h2>Encontrá tu próximo sonido</h2>
          </div>

          <Link to="/catalogo" className="home-see-all">
            Ver todo
          </Link>
        </div>

        <div className="home-category-grid">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/catalogo?cat=${encodeURIComponent(category.name)}`}
              className="home-category-card"
            >
              <img src={category.image} alt={category.name} />

              <div className="home-category-overlay" />

              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section home-featured-section">
        <div className="home-section-header">
          <div>
            <span className="home-section-kicker">Novedades</span>
            <h2>Selección destacada</h2>
          </div>

          <Link to="/catalogo" className="home-see-all">
            Ver catálogo
          </Link>
        </div>

        <div className="home-featured-grid">
          {featured.map((item) => (
            <Link key={item.title} to={item.link} className="home-featured-card">
              <div className="home-featured-image">
                <img src={item.image} alt={item.title} />
              </div>

              <span>{item.tag}</span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-recommended">
        <div className="home-recommended-header">
          <span>Equipamiento recomendado</span>
        </div>

        <div className="home-recommended-grid">
          {recommended.map((item) => (
            <article key={item.number} className="home-recommended-card">
              <div className="home-recommended-number">{item.number}</div>

              <h3>{item.title}</h3>

              <p>{item.text}</p>

              <Link to={item.link}>Configurar →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <span className="home-section-kicker">MusicStore</span>

          <h2>Todo tu setup musical en un solo lugar.</h2>

          <p>
            Buscá, filtrá, agregá al carrito y finalizá tu compra desde una
            experiencia simple, rápida y pensada para músicos.
          </p>
        </div>

        <Link to="/catalogo" className="home-primary-btn">
          Ir a comprar
        </Link>
      </section>
    </main>
  )
}