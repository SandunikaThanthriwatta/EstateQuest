import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Icon } from '@iconify/react';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  if (!landlord) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="body1">
        Contact <strong>{landlord.username}</strong> for{' '}
        <strong>{listing.name.toLowerCase()}</strong>
      </Typography>
      <TextField
        multiline
        rows={3}
        fullWidth
        placeholder="Enter your message here…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<Icon icon="mdi:email-outline" />}
        href={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
      >
        Send Message
      </Button>
    </Box>
  );
}
