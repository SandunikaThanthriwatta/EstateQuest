import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  Box, Container, Typography, Chip, Button, Grid,
  Paper, Divider, CircularProgress, Snackbar, Alert,
} from '@mui/material';
import { Icon } from '@iconify/react';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) { setError(true); setLoading(false); return; }
        setListing(data);
        setLoading(false);
      } catch { setError(true); setLoading(false); }
    };
    fetchListing();
  }, [params.listingId]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Alert severity="error">Something went wrong loading this listing.</Alert>
    </Box>
  );

  if (!listing) return null;

  const price = listing.offer ? listing.discountPrice : listing.regularPrice;
  const savings = listing.offer ? listing.regularPrice - listing.discountPrice : 0;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '92vh' }}>
      {/* Image slider */}
      <Box sx={{ position: 'relative' }}>
        <Swiper navigation>
          {listing.imageUrls.map((url) => (
            <SwiperSlide key={url}>
              <Box sx={{ height: { xs: 280, sm: 420, md: 520 },
                background: `url(${url}) center/cover no-repeat` }} />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Share button */}
        <Button
          onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          variant="contained" size="small"
          sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, minWidth: 0, p: 1.5,
            bgcolor: 'rgba(255,255,255,0.9)', color: 'text.primary', '&:hover': { bgcolor: '#fff' } }}
        >
          <Icon icon="mdi:share-variant" width={20} />
        </Button>
      </Box>

      <Snackbar open={copied} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" icon={<Icon icon="mdi:check" />}>Link copied!</Alert>
      </Snackbar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* Title & price */}
            <Typography variant="h4" fontWeight={700} color="text.primary">{listing.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Icon icon="mdi:map-marker" color="#C9982A" width={20} />
              <Typography variant="body1" color="text.secondary">{listing.address}</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
              <Chip label={listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                color={listing.type === 'rent' ? 'primary' : 'secondary'} />
              {listing.offer && (
                <Chip icon={<Icon icon="mdi:tag-outline" />}
                  label={`$${savings.toLocaleString('en-US')} OFF`} color="success" />
              )}
            </Box>

            <Typography variant="h4" fontWeight={700} color="primary" mt={2}>
              ${price.toLocaleString('en-US')}
              {listing.type === 'rent' && (
                <Typography component="span" variant="h6" color="text.secondary"> / month</Typography>
              )}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Description */}
            <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
              <strong style={{ color: '#1A1A2E' }}>Description — </strong>{listing.description}
            </Typography>

            {/* Features */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              {[
                { icon: 'mdi:bed-outline', label: `${listing.bedrooms} Bed${listing.bedrooms > 1 ? 's' : ''}` },
                { icon: 'mdi:shower', label: `${listing.bathrooms} Bath${listing.bathrooms > 1 ? 's' : ''}` },
                { icon: 'mdi:car-outline', label: listing.parking ? 'Parking' : 'No Parking' },
                { icon: 'mdi:sofa-outline', label: listing.furnished ? 'Furnished' : 'Unfurnished' },
              ].map((f) => (
                <Paper key={f.label} sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1, borderRadius: 2 }}>
                  <Icon icon={f.icon} color="#1B3A5C" width={20} />
                  <Typography variant="body2" fontWeight={600}>{f.label}</Typography>
                </Paper>
              ))}
            </Box>

            {/* Contact */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <Button variant="contained" color="primary" size="large" fullWidth sx={{ mt: 3 }}
                onClick={() => setContact(true)} startIcon={<Icon icon="mdi:phone-outline" />}>
                Contact Landlord
              </Button>
            )}
            {contact && <Box mt={3}><Contact listing={listing} /></Box>}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
