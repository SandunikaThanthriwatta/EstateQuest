import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Box, Typography, Chip } from '@mui/material';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export default function ListingItem({ listing }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      <Box component={Link} to={`/listing/${listing._id}`}
        sx={{ textDecoration: 'none', display: 'block', borderRadius: 3, overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(27,58,92,0.1)', bgcolor: '#fff',
          transition: 'box-shadow .25s',
          '&:hover': { boxShadow: '0 12px 32px rgba(27,58,92,0.18)' } }}>

        {/* Image with gradient overlay */}
        <Box sx={{ position: 'relative', height: 210, overflow: 'hidden' }}>
          <Box component="img" src={listing.imageUrls[0]} alt={listing.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform .4s ease', '.MuiBox-root:hover &': { transform: 'scale(1.05)' } }} />
          <Box sx={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(11,27,46,0.55) 0%, transparent 55%)' }} />
          {/* Type badge */}
          <Chip label={listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            size="small"
            sx={{ position: 'absolute', top: 12, left: 12,
              bgcolor: listing.type === 'rent' ? 'rgba(27,58,92,0.85)' : 'rgba(201,152,42,0.9)',
              color: '#fff', fontWeight: 700, backdropFilter: 'blur(4px)' }} />
          {listing.offer && (
            <Chip icon={<Icon icon="mdi:tag" width={12} />} label="Offer"
              size="small"
              sx={{ position: 'absolute', top: 12, right: 12,
                bgcolor: 'rgba(46,125,50,0.88)', color: '#fff', fontWeight: 700, backdropFilter: 'blur(4px)' }} />
          )}
          {/* Price on image */}
          <Box sx={{ position: 'absolute', bottom: 12, left: 12 }}>
            <Typography variant="h6" fontWeight={800} color="#fff"
              sx={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              ${(listing.offer ? listing.discountPrice : listing.regularPrice).toLocaleString('en-US')}
              {listing.type === 'rent' &&
                <Typography component="span" variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}> /mo</Typography>}
            </Typography>
          </Box>
        </Box>

        {/* Card body */}
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} noWrap color="text.primary">{listing.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.4 }}>
            <Icon icon="mdi:map-marker" color="#C9982A" width={15} />
            <Typography variant="body2" color="text.secondary" noWrap>{listing.address}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary"
            sx={{ mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {listing.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Icon icon="mdi:bed-outline" color="#1B3A5C" width={16} />
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Icon icon="mdi:shower" color="#1B3A5C" width={16} />
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}
              </Typography>
            </Box>
            {listing.parking && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Icon icon="mdi:car-outline" color="#1B3A5C" width={16} />
                <Typography variant="caption" fontWeight={600} color="text.secondary">Parking</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
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
  }).isRequired,
};
