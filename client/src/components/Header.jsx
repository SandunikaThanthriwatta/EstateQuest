import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  AppBar, Toolbar, Typography, InputBase, Box,
  Avatar, Button, IconButton, Tooltip,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { alpha } from '@mui/material/styles';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/search?searchTerm=${searchTerm}`);
  };

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar sx={{ gap: 2, px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{ fontWeight: 800, color: '#fff', textDecoration: 'none', flexShrink: 0,
            '& span': { color: 'secondary.light' } }}
        >
          Estate<span>Quest</span>
        </Typography>

        {/* Search bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex', alignItems: 'center', flexGrow: 1, maxWidth: 480,
            bgcolor: alpha('#fff', 0.12), borderRadius: 2, px: 1.5, py: 0.5,
            '&:hover': { bgcolor: alpha('#fff', 0.18) },
            mx: 'auto',
          }}
        >
          <InputBase
            placeholder="Search listings…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ color: '#fff', flex: 1, '& ::placeholder': { color: alpha('#fff', 0.6) } }}
          />
          <IconButton type="submit" size="small" sx={{ color: alpha('#fff', 0.8) }}>
            <Icon icon="mdi:magnify" width={20} />
          </IconButton>
        </Box>

        {/* Nav links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button component={Link} to="/" color="inherit" sx={{ display: { xs: 'none', sm: 'flex' } }}
            startIcon={<Icon icon="mdi:home-outline" />}>Home</Button>
          <Button component={Link} to="/about" color="inherit" sx={{ display: { xs: 'none', sm: 'flex' } }}
            startIcon={<Icon icon="mdi:information-outline" />}>About</Button>

          {currentUser ? (
            <Tooltip title="Profile">
              <IconButton component={Link} to="/profile" sx={{ p: 0.5 }}>
                <Avatar
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  sx={{ width: 36, height: 36, border: '2px solid', borderColor: 'secondary.light' }}
                />
              </IconButton>
            </Tooltip>
          ) : (
            <Button component={Link} to="/sign-in" variant="outlined"
              sx={{ color: '#fff', borderColor: alpha('#fff', 0.5), '&:hover': { borderColor: '#fff' } }}
              startIcon={<Icon icon="mdi:login" />}>Sign In</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
