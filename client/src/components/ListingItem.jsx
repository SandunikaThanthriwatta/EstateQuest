import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export default function ListingItem({ listing }) {
  const isRent  = listing.type === 'rent';
  const price   = listing.offer ? listing.discountPrice : listing.regularPrice;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{ width: '100%', height: '100%', display: 'flex' }}>
      <Paper
        component={Link}
        to={`/listing/${listing._id}`}
        elevation={0}
        sx={{
          display: 'flex', flexDirection: 'column',
          width: '100%', height: '100%', textDecoration: 'none',
          borderRadius: 3,
          border: '1.5px solid rgba(27,58,92,0.1)',
          overflow: 'hidden',
          bgcolor: '#fff',
          transition: 'box-shadow 0.25s, border-color 0.25s',
          '&:hover': {
            boxShadow: '0 8px 28px rgba(27,58,92,0.13)',
            borderColor: 'rgba(27,58,92,0.22)',
          },
        }}
      >
        {/* Fixed-height image */}
        <Box sx={{ position: 'relative', width: '100%', height: 200, flexShrink: 0, overflow: 'hidden' }}>
          <Box
            component="img"
            src={listing.imageUrls[0]}
            alt={listing.name}
            sx={{
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block',
              transition: 'transform 0.45s ease',
              '.MuiPaper-root:hover &': { transform: 'scale(1.04)' },
            }}
          />
          {/* Offer badge on image */}
          {listing.offer && (
            <Box sx={{
              position: 'absolute', top: 10, right: 10,
              bgcolor: 'rgba(46,125,50,0.88)', color: '#fff',
              fontSize: '0.7rem', fontWeight: 700,
              px: 1, py: 0.3, borderRadius: '6px',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', gap: 0.4,
            }}>
              <Icon icon="mdi:tag" width={12} />
              Offer
            </Box>
          )}
        </Box>

        {/* Card body */}
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>

          {/* Type label */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.5,
            px: 1.2, py: 0.3, borderRadius: '6px', mb: 1.2,
            bgcolor: isRent ? 'rgba(27,58,92,0.07)' : 'rgba(201,152,42,0.1)',
            border: '1px solid',
            borderColor: isRent ? 'rgba(27,58,92,0.14)' : 'rgba(201,152,42,0.22)',
          }}>
            <Icon
              icon={isRent ? 'mdi:key-outline' : 'mdi:home-outline'}
              width={13}
              color={isRent ? '#1B3A5C' : '#8B6B1E'}
            />
            <Typography variant="caption" fontWeight={700}
              sx={{ color: isRent ? '#1B3A5C' : '#8B6B1E', fontSize: '0.72rem', letterSpacing: 0.3 }}>
              {isRent ? 'For Rent' : 'For Sale'}
            </Typography>
          </Box>

          {/* Name */}
          <Typography variant="subtitle1" fontWeight={700} noWrap
            sx={{ color: '#1B3A5C', lineHeight: 1.3, mb: 0.5 }}>
            {listing.name}
          </Typography>

          {/* Address */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.8 }}>
            <Icon icon="mdi:map-marker-outline" width={14} color="#C9982A" />
            <Typography variant="caption" noWrap sx={{ color: '#5C6070' }}>
              {listing.address}
            </Typography>
          </Box>

          {/* Description */}
          <Typography variant="body2" sx={{
            color: '#5C6070', fontSize: '0.8rem', lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1.5,
          }}>
            {listing.description}
          </Typography>

          {/* Amenities */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
            {[
              { icon: 'mdi:bed-outline',   label: `${listing.bedrooms} bed${listing.bedrooms !== 1 ? 's' : ''}` },
              { icon: 'mdi:shower',        label: `${listing.bathrooms} bath${listing.bathrooms !== 1 ? 's' : ''}` },
              ...(listing.parking ? [{ icon: 'mdi:car-outline', label: 'Parking' }] : []),
              ...(listing.furnished ? [{ icon: 'mdi:sofa-outline', label: 'Furnished' }] : []),
            ].map((a) => (
              <Box key={a.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                <Icon icon={a.icon} width={14} color="#2E5F8A" />
                <Typography variant="caption" sx={{ color: '#5C6070', fontSize: '0.75rem' }}>{a.label}</Typography>
              </Box>
            ))}
          </Box>

          {/* Divider + Price — pushed to bottom */}
          <Box sx={{ mt: 'auto', borderTop: '1px solid rgba(27,58,92,0.08)', pt: 1.2, display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: '#1B3A5C', lineHeight: 1 }}>
              ${price.toLocaleString('en-US')}
            </Typography>
            {isRent && (
              <Typography variant="caption" sx={{ color: '#5C6070' }}>/month</Typography>
            )}
            {listing.offer && (
              <Typography variant="caption"
                sx={{ ml: 0.5, color: '#5C6070', textDecoration: 'line-through' }}>
                ${listing.regularPrice.toLocaleString('en-US')}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}

ListingItem.propTypes = {
  listing: PropTypes.shape({
    _id:           PropTypes.string.isRequired,
    name:          PropTypes.string.isRequired,
    address:       PropTypes.string.isRequired,
    description:   PropTypes.string.isRequired,
    imageUrls:     PropTypes.arrayOf(PropTypes.string).isRequired,
    type:          PropTypes.string.isRequired,
    offer:         PropTypes.bool.isRequired,
    regularPrice:  PropTypes.number.isRequired,
    discountPrice: PropTypes.number.isRequired,
    bedrooms:      PropTypes.number.isRequired,
    bathrooms:     PropTypes.number.isRequired,
    parking:       PropTypes.bool.isRequired,
    furnished:     PropTypes.bool,
  }).isRequired,
};
