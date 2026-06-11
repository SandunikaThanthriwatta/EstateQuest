import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { Icon } from '@iconify/react';

const features = [
  { icon: 'mdi:home-search-outline', title: 'Wide Selection', desc: 'Browse thousands of properties across all neighborhoods to find your perfect match.' },
  { icon: 'mdi:account-tie-outline', title: 'Expert Agents', desc: 'Our experienced team guides you every step of the way with personalized service.' },
  { icon: 'mdi:shield-check-outline', title: 'Trusted Platform', desc: 'Verified listings and secure transactions you can rely on.' },
];

export default function About() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '92vh' }}>
      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #2E5F8A 100%)', py: 8, textAlign: 'center' }}>
        <Icon icon="mdi:home-city-outline" width={64} color="#C9982A" />
        <Typography variant="h3" fontWeight={700} color="#fff" mt={2}>About EstateQuest</Typography>
        <Typography variant="h6" color="rgba(255,255,255,0.75)" mt={1} maxWidth={600} mx="auto">
          Your trusted partner in finding the perfect home
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="body1" color="text.secondary" fontSize={17} lineHeight={1.8} mb={4}>
          EstateQuest is a leading real estate platform that specializes in helping clients buy, sell, and rent
          properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing
          exceptional service and making the buying and selling process as smooth as possible.
        </Typography>
        <Typography variant="body1" color="text.secondary" fontSize={17} lineHeight={1.8} mb={6}>
          Our mission is to help our clients achieve their real estate goals by providing expert advice,
          personalized service, and a deep understanding of the local market. Whether you are looking to buy,
          sell, or rent a property, we are here to help you every step of the way.
        </Typography>

        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid item xs={12} sm={4} key={f.title}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 3, height: '100%',
                transition: 'transform .2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                <Icon icon={f.icon} width={40} color="#1B3A5C" />
                <Typography variant="h6" fontWeight={700} color="primary" mt={1} mb={0.5}>{f.title}</Typography>
                <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
