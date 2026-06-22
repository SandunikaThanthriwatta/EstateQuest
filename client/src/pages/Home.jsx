import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectFade } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import ListingItem from '../components/ListingItem';

SwiperCore.use([Navigation, Autoplay, Pagination, EffectFade]);

const heroSlides = [
  { img: '/assets/ma_frank-mansion-5394660_1920.jpg',     title: 'Find Your Dream Home',    sub: 'Luxury properties in the most desirable locations' },
  { img: '/assets/652234-villa-4581027_1920.jpg',          title: 'Exclusive Villas',        sub: 'Premium villas with world-class amenities' },
  { img: '/assets/randyjost-architecture-5339245_1920.jpg', title: 'Modern Architecture',   sub: 'Cutting-edge designs that define tomorrow' },
  { img: '/assets/justdiyteam-futuristic-8193171_1920.jpg',      title: 'Smart Modern Living', sub: 'Futuristic spaces designed for the way you live today' },
  { img: '/assets/kul2r-house-3150500_1920.jpg',                 title: 'Elegant Living',     sub: 'Beautifully designed homes for modern lifestyles' },
];

const interiorSlides = [
  '/assets/23555986-living-room-8368673_1920.jpg',
  '/assets/jessebridgewater-kitchen-2400367_1920.jpg',
  '/assets/23555986-living-room-8368640_1920.jpg',
  '/assets/piro4d-kitchen-1687121_1920.jpg',
  '/assets/justdiyteam-futuristic-8193171_1920.jpg',
];

const stats = [
  { icon: 'mdi:home-outline',            value: '10,000+', label: 'Listings'      },
  { icon: 'mdi:account-group-outline',   value: '5,000+',  label: 'Happy Clients' },
  { icon: 'mdi:map-marker-multiple-outline', value: '50+', label: 'Cities'        },
  { icon: 'mdi:handshake-outline',       value: '98%',     label: 'Satisfaction'  },
];

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings,  setSaleListings]  = useState([]);
  const [rentListings,  setRentListings]  = useState([]);

  useEffect(() => {
    const fetchOffer = async () => {
      try { const d = await (await fetch('/api/listing/get?offer=true&limit=4')).json(); setOfferListings(d); fetchRent(); } catch {}
    };
    const fetchRent = async () => {
      try { const d = await (await fetch('/api/listing/get?type=rent&limit=4')).json(); setRentListings(d); fetchSale(); } catch {}
    };
    const fetchSale = async () => {
      try { const d = await (await fetch('/api/listing/get?type=sale&limit=4')).json(); setSaleListings(d); } catch {}
    };
    fetchOffer();
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', overflow: 'hidden' }}>

      {/* ── HERO FULLSCREEN SLIDER ── */}
      <Box sx={{ position: 'relative', height: '100vh' }}>
        <Swiper effect="fade" autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }} loop style={{ height: '100%' }}>
          {heroSlides.map((s, i) => (
            <SwiperSlide key={i}>
              <Box sx={{ position: 'relative', height: '100%',
                backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {/* gradient overlay */}
                <Box sx={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(to right, rgba(11,27,46,0.85) 0%, rgba(11,27,46,0.4) 60%, transparent 100%)' }} />
                {/* text */}
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', pl: { xs: 3, md: 10 } }}>
                  <motion.div key={i} initial="hidden" animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
                    <motion.div variants={fadeUp} transition={{ duration: 0.7 }}>
                      <Typography variant="overline" sx={{ color: '#C9982A', fontWeight: 700, letterSpacing: 3, fontSize: '0.85rem' }}>
                        EstateQuest
                      </Typography>
                    </motion.div>
                    <motion.div variants={fadeUp} transition={{ duration: 0.7, delay: 0.1 }}>
                      <Typography variant="h2" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.15, mt: 1,
                        fontSize: { xs: '2rem', sm: '2.8rem', md: '3.6rem' }, maxWidth: 580 }}>
                        {s.title}
                      </Typography>
                    </motion.div>
                    <motion.div variants={fadeUp} transition={{ duration: 0.7, delay: 0.2 }}>
                      <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.75)', mt: 2, maxWidth: 420, fontWeight: 400 }}>
                        {s.sub}
                      </Typography>
                    </motion.div>
                    <motion.div variants={fadeUp} transition={{ duration: 0.7, delay: 0.3 }}
                      style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
                      <Button component={Link} to="/search" variant="contained" color="secondary" size="large"
                        startIcon={<Icon icon="mdi:home-search-outline" />}
                        sx={{ px: 4, py: 1.5, fontSize: '1rem', boxShadow: '0 4px 20px rgba(201,152,42,0.5)' }}>
                        Explore Properties
                      </Button>
                      <Button component={Link} to="/sign-up" variant="outlined" size="large"
                        sx={{ px: 4, py: 1.5, fontSize: '1rem', color: '#fff', borderColor: 'rgba(255,255,255,0.5)',
                          backdropFilter: 'blur(8px)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                        Get Started
                      </Button>
                    </motion.div>
                  </motion.div>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Scroll indicator */}
        <Box sx={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <Icon icon="mdi:chevron-double-down" width={32} color="rgba(255,255,255,0.6)" />
          </motion.div>
        </Box>
      </Box>

      {/* ── STATS BAND ── */}
      <Box sx={{ background: 'linear-gradient(90deg, #1B3A5C 0%, #2E5F8A 100%)', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container justifyContent="center" spacing={2}>
            {stats.map((s, i) => (
              <Grid item xs={6} sm={3} key={s.label}>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                  <Box sx={{ textAlign: 'center', color: '#fff', py: 1 }}>
                    <Icon icon={s.icon} width={28} color="#C9982A" />
                    <Typography variant="h5" fontWeight={800} lineHeight={1.2}>{s.value}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>{s.label}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── INTERIOR SHOWCASE ── */}
      <Box sx={{ position: 'relative', height: { xs: 260, md: 400 }, overflow: 'hidden' }}>
        <Swiper autoplay={{ delay: 3200, disableOnInteraction: false }} loop speed={1200}
          style={{ height: '100%' }}>
          {interiorSlides.map((src, i) => (
            <SwiperSlide key={i}>
              <Box sx={{ height: '100%', backgroundImage: `url(${src})`,
                backgroundSize: 'cover', backgroundPosition: 'center' }} />
            </SwiperSlide>
          ))}
        </Swiper>
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="#fff"
              sx={{ fontSize: { xs: '1.4rem', sm: '2rem' },
                '& span': {
                  background: 'rgba(255, 255, 255, 0.41)',
                  px: '6px', py: '2px', borderRadius: '3px',
                  boxDecorationBreak: 'clone',
                  WebkitBoxDecorationBreak: 'clone',
                },
              }}>
              <span>Beautifully Crafted Interiors</span>
            </Typography>
            <Typography variant="subtitle1" mt={1} sx={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              Every detail thoughtfully designed for modern living
            </Typography>
          </motion.div>
        </Box>
      </Box>

      {/* ── LISTING SECTIONS ── */}
      <Container maxWidth="lg" sx={{ py: 7 }}>
        {[
          { title: 'Recent Offers',   link: '/search?offer=true', data: offerListings, icon: 'mdi:tag-outline' },
          { title: 'Places for Rent', link: '/search?type=rent',  data: rentListings,  icon: 'mdi:key-outline' },
          { title: 'Places for Sale', link: '/search?type=sale',  data: saleListings,  icon: 'mdi:home-outline' },
        ].map(({ title, link, data, icon }) => data.length > 0 && (
          <Box key={title} mb={7}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 4, height: 32, borderRadius: 2, bgcolor: 'secondary.main' }} />
                  <Icon icon={icon} width={24} color="#1B3A5C" />
                  <Typography variant="h5" fontWeight={700} color="primary">{title}</Typography>
                </Box>
                <Button component={Link} to={link} color="secondary" endIcon={<Icon icon="mdi:arrow-right" />}
                  sx={{ fontWeight: 600 }}>Show more</Button>
              </Box>
            </motion.div>
            <Grid container spacing={3} alignItems="stretch">
              {data.map((listing, i) => (
                <Grid item key={listing._id} xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                    style={{ width: '100%', height: '100%', display: 'flex' }}>
                    <ListingItem listing={listing} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>

      {/* ── BOTTOM CTA ── */}
      <Box sx={{ position: 'relative', overflow: 'hidden',
        backgroundImage: `url(/assets/23555986-real-estate-9053405_1920.jpg)`,
        backgroundSize: 'cover', backgroundPosition: 'center', py: { xs: 8, md: 12 } }}>
        <Box sx={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(27,58,92,0.88) 0%, rgba(46,95,138,0.75) 100%)' }} />
        <Container maxWidth="sm" sx={{ position: 'relative', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Icon icon="mdi:home-city-outline" width={56} color="#C9982A" />
            <Typography variant="h3" fontWeight={800} color="#fff" mt={2} sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
              Ready to Find Your Home?
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.75)', mt: 1.5, fontWeight: 400 }}>
              Join thousands of happy homeowners who found their perfect property on EstateQuest.
            </Typography>
            <Button component={Link} to="/sign-up" variant="contained" color="secondary" size="large"
              sx={{ mt: 4, px: 5, py: 1.6, fontSize: '1.05rem', boxShadow: '0 4px 24px rgba(201,152,42,0.5)' }}
              startIcon={<Icon icon="mdi:account-plus-outline" />}>
              Create Free Account
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
