import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box, Typography, InputBase, Avatar, Button, IconButton, Tooltip,
} from '@mui/material';
import { Icon } from '@iconify/react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onImage = location.pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/search?searchTerm=${searchTerm}`);
  };

  const textColor   = onImage ? '#fff' : 'primary.main';
  const subColor    = onImage ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.38)';
  const searchBg    = onImage ? 'rgba(255,255,255,0.15)' : 'rgba(27,58,92,0.07)';
  const searchBorder = onImage ? 'rgba(255,255,255,0.25)' : 'transparent';

  return (
    <Box sx={{
      position: 'fixed', top: 10, left: 16, right: 16, zIndex: 1100,
      borderRadius: '16px',
      background: onImage
        ? 'rgba(255,255,255,0.12)'
        : 'linear-gradient(120deg, rgba(27,58,92,0.22) 0%, rgba(46,95,138,0.1) 50%, rgba(255,255,255,0.82) 100%)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      transition: 'background 0.4s',
      px: { xs: 1.5, md: 2.5 }, py: 0.6,
      display: 'flex', alignItems: 'center', gap: 1.5,
      minHeight: 48,
    }}>

      {/* Logo */}
      <Typography component={Link} to="/" variant="subtitle1"
        sx={{ fontWeight: 800, textDecoration: 'none', flexShrink: 0,
          color: textColor, transition: 'color 0.4s',
          '& span': { color: onImage ? '#E8BF6A' : 'secondary.main' } }}>
        Estate<span>Quest</span>
      </Typography>

      {/* Search */}
      <Box component="form" onSubmit={handleSearch}
        sx={{
          display: 'flex', alignItems: 'center', flexGrow: 1, maxWidth: 400,
          bgcolor: searchBg, borderRadius: '10px', px: 1.2, py: 0.3,
          border: '1px solid', borderColor: searchBorder,
          transition: 'all 0.4s',
          '&:hover': { borderColor: onImage ? 'rgba(255,255,255,0.5)' : 'rgba(27,58,92,0.2)' },
          mx: 'auto',
        }}>
        <InputBase placeholder="Search listings…" value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, fontSize: '0.85rem',
            color: onImage ? '#fff' : 'text.primary',
            '& ::placeholder': { color: subColor, opacity: 1 } }} />
        <IconButton type="submit" size="small" sx={{ color: onImage ? 'rgba(255,255,255,0.8)' : 'text.secondary', p: 0.4 }}>
          <Icon icon="mdi:magnify" width={18} />
        </IconButton>
      </Box>

      {/* Nav */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
        <Button component={Link} to="/" size="small"
          sx={{ display: { xs: 'none', sm: 'flex' }, color: textColor, transition: 'color 0.4s', minWidth: 0, px: 1 }}
          startIcon={<Icon icon="mdi:home-outline" width={16} />}>Home</Button>
        <Button component={Link} to="/about" size="small"
          sx={{ display: { xs: 'none', sm: 'flex' }, color: textColor, transition: 'color 0.4s', minWidth: 0, px: 1 }}
          startIcon={<Icon icon="mdi:information-outline" width={16} />}>About</Button>

        {currentUser ? (
          <Tooltip title="Profile">
            <IconButton component={Link} to="/profile" sx={{ p: 0.4 }}>
              <Avatar src={currentUser.avatar} alt={currentUser.username}
                sx={{ width: 30, height: 30, border: '2px solid',
                  borderColor: onImage ? 'rgba(255,255,255,0.7)' : 'secondary.main',
                  transition: 'border-color 0.4s' }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Button component={Link} to="/sign-in" size="small" variant="outlined"
            startIcon={<Icon icon="mdi:login" width={16} />}
            sx={{
              color: textColor, transition: 'all 0.4s', px: 1.2,
              borderColor: onImage ? 'rgba(255,255,255,0.5)' : 'primary.main',
              '&:hover': { bgcolor: onImage ? 'rgba(255,255,255,0.1)' : undefined },
            }}>Sign In</Button>
        )}
      </Box>
    </Box>
  );
}
