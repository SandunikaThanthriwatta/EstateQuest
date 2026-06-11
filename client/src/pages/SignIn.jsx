import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import {
  Box, Typography, TextField, Button, Divider, Alert, CircularProgress,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import OAuth from '../components/OAuth';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
});

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res  = await fetch('/api/auth/signin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) { dispatch(signInFailure(data.message)); return; }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (err) { dispatch(signInFailure(err.message)); }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel — image */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0,
          backgroundImage: 'url(/assets/rebornminds-ai-generated-8536432_1920.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Box sx={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(11,27,46,0.75) 0%, rgba(27,58,92,0.55) 100%)' }} />
        <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', p: 6 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}>
            <Typography variant="h3" fontWeight={800} color="#fff" sx={{ lineHeight: 1.2 }}>
              Welcome<br />back to<br />
              <Box component="span" sx={{ color: '#C9982A' }}>EstateQuest</Box>
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, maxWidth: 340 }}>
              Sign in to access your saved listings, manage properties and connect with landlords.
            </Typography>
          </motion.div>
        </Box>
      </Box>

      {/* Right panel — form */}
      <Box sx={{ width: { xs: '100%', md: 480 }, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', px: { xs: 3, sm: 6 }, py: 6,
        background: 'linear-gradient(160deg, #f7f5f0 0%, #eef2f7 100%)' }}>

        <motion.div {...fadeUp(0)}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Icon icon="mdi:home-city" width={36} color="#1B3A5C" />
            <Typography variant="h5" fontWeight={800} color="primary">EstateQuest</Typography>
          </Box>
        </motion.div>

        <motion.div {...fadeUp(0.1)}>
          <Typography variant="h4" fontWeight={700} color="text.primary" mt={3}>Sign In</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Don't have an account?{' '}
            <Link to="/sign-up" style={{ color: '#C9982A', fontWeight: 600 }}>Sign Up</Link>
          </Typography>
        </motion.div>

        {error && (
          <motion.div {...fadeUp(0.15)}>
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          </motion.div>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <motion.div {...fadeUp(0.2)}>
            <TextField fullWidth label="Email" type="email" id="email" onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
              InputProps={{ startAdornment: <Icon icon="mdi:email-outline" width={20} style={{ marginRight: 8, color: '#5C6070' }} /> }} />
          </motion.div>
          <motion.div {...fadeUp(0.25)}>
            <TextField fullWidth label="Password" type="password" id="password" onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
              InputProps={{ startAdornment: <Icon icon="mdi:lock-outline" width={20} style={{ marginRight: 8, color: '#5C6070' }} /> }} />
          </motion.div>
          <motion.div {...fadeUp(0.3)}>
            <Button fullWidth variant="contained" color="primary" size="large" type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Icon icon="mdi:login" />}
              sx={{ py: 1.5, borderRadius: 2, boxShadow: '0 4px 16px rgba(27,58,92,0.35)',
                background: 'linear-gradient(90deg, #1B3A5C 0%, #2E5F8A 100%)' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </motion.div>
        </Box>

        <motion.div {...fadeUp(0.35)}>
          <Divider sx={{ my: 3 }}>or continue with</Divider>
          <OAuth />
        </motion.div>
      </Box>
    </Box>
  );
}
