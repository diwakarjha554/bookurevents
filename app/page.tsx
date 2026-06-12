import Hero from '@/components/home/hero';
import About from '@/components/home/about';
import Navbar from '@/components/navbar/navbar';
import Services from '@/components/home/services';
import Stats from '@/components/home/stats';
import Trust from '@/components/home/trust';
import Footer from '@/components/footer';
import Portfolio from '@/components/home/portfolio';
import Process from '@/components/home/process';
import Team from '@/components/home/team';
import Contact from '@/components/home/contact';
import Testimonials from '@/components/home/testimonials';

const page = () => {
  return (
    <Navbar isNavbarMargin={false}>
      <Hero />
      <Stats />
      <Trust />
      <About />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
      <Team />
      <Contact />
      <Footer />
    </Navbar>
  )
}

export default page;  