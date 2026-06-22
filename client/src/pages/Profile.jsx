import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
import {
  Box, Container, Paper, Typography, TextField, Button, Avatar,
  Divider, Alert, CircularProgress, Card, CardContent, CardMedia,
  IconButton, Tooltip, Grid,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const blobs = [
  { width: 520, height: 520, top: '-140px', left: '-160px', color: 'rgba(27,58,92,0.09)',   duration: 12, delay: 0 },
  { width: 440, height: 440, top: '-100px', right: '-130px', color: 'rgba(46,95,138,0.08)', duration: 14, delay: 2 },
  { width: 380, height: 380, bottom: '-100px', right: '-110px', color: 'rgba(201,152,42,0.07)', duration: 11, delay: 1 },
  { width: 320, height: 320, bottom: '-80px', left: '-90px', color: 'rgba(27,58,92,0.07)',  duration: 13, delay: 3 },
];

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => { if (file) handleFileUpload(file); }, [file]);

  const handleFileUpload = async (file) => {
    try {
      setFileUploadError(false);
      setFilePerc(50);
      const data = new FormData();
      data.append('image', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Upload failed');
      setFilePerc(100);
      setFormData((prev) => ({ ...prev, avatar: json.url }));
    } catch {
      setFileUploadError(true);
      setFilePerc(0);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) { dispatch(updateUserFailure(data.message)); return; }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentUser.token}` },
      });
      const data = await res.json();
      if (data.success === false) { dispatch(deleteUserFailure(data.message)); return; }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      await fetch('/api/auth/signout');
      dispatch(deleteUserSuccess());
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` },
      });
      const data = await res.json();
      if (data.success === false) { setShowListingsError(true); return; }
      setUserListings(data);
    } catch {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentUser.token}` },
      });
      const data = await res.json();
      if (data.success === false) { console.log(data.message); return; }
      setUserListings((prev) => prev.filter((l) => l._id !== listingId));
    } catch (err) {
      console.log(err.message);
    }
  };

  const avatarSrc = formData.avatar || currentUser.avatar;

  return (
    <Box sx={{ minHeight: '92vh', py: 4, position: 'relative', overflow: 'hidden' }}>

      {/* Soft background blobs */}
      {blobs.map((b, i) => (
        <motion.div key={i}
          animate={{ scale: [1, 1.08, 1], x: [0, 12, 0], y: [0, -10, 0] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', width: b.width, height: b.height,
            top: b.top, left: b.left, right: b.right, bottom: b.bottom,
            borderRadius: '50%', background: b.color,
            filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0,
          }} />
      ))}

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>

            {/* ── Left column ── */}
            <Box sx={{
                width: { xs: '100%', md: '300px' }, flexShrink: 0,
                background: 'linear-gradient(160deg, #1B3A5C 0%, #2E5F8A 100%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                py: 5, px: 3, gap: 1.5 }}>

              <input ref={fileRef} type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
              <Tooltip title="Click to change photo">
                <Avatar src={avatarSrc} alt={currentUser.username}
                  onClick={() => fileRef.current.click()}
                  sx={{ width: 100, height: 100, cursor: 'pointer',
                    border: '3px solid rgba(201,152,42,0.8)',
                    '&:hover': { opacity: 0.85 } }} />
              </Tooltip>

              <Typography variant="subtitle1" fontWeight={700} mt={1} textAlign="center"
                sx={{ color: '#fff' }}>
                {currentUser.username}
              </Typography>
              <Typography variant="caption" textAlign="center"
                sx={{ color: 'rgba(255,255,255,0.65)', wordBreak: 'break-all' }}>
                {currentUser.email}
              </Typography>

              <Typography variant="caption" textAlign="center" mt={0.5}
                sx={{ color: fileUploadError ? '#ff6b6b' : filePerc === 100 ? '#69db7c' : 'rgba(255,255,255,0.5)' }}>
                {fileUploadError ? 'Upload failed (max 2 MB)'
                  : filePerc > 0 && filePerc < 100 ? `Uploading ${filePerc}%…`
                  : filePerc === 100 ? 'Photo updated!'
                  : 'Click photo to change'}
              </Typography>

              <Divider sx={{ width: '100%', borderColor: 'rgba(255,255,255,0.15)', my: 2 }} />

              <Button fullWidth variant="outlined" size="small" onClick={handleShowListings}
                startIcon={<Icon icon="mdi:format-list-bulleted" width={16} />}
                sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)',
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}>
                My Listings
              </Button>

              <Box sx={{ mt: 'auto', pt: 3, width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button fullWidth size="small" color="error" variant="outlined"
                  startIcon={<Icon icon="mdi:delete-outline" width={16} />}
                  onClick={handleDeleteUser}
                  sx={{ borderColor: 'rgba(255,100,100,0.4)', color: '#ff8a80',
                    '&:hover': { borderColor: '#ff8a80', bgcolor: 'rgba(255,100,100,0.08)' } }}>
                  Delete Account
                </Button>
                <Button fullWidth size="small" variant="outlined"
                  startIcon={<Icon icon="mdi:logout" width={16} />}
                  onClick={handleSignOut}
                  sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.25)',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.6)', bgcolor: 'rgba(255,255,255,0.08)' } }}>
                  Sign Out
                </Button>
              </Box>
            </Box>

            {/* ── Right column ── */}
            <Box sx={{ flex: 1, minWidth: 0, p: { xs: 4, md: 5 }, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" fontWeight={700} color="primary" mb={4}>
                My Profile
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              {updateSuccess && <Alert severity="success" sx={{ mb: 3 }}>Profile updated successfully!</Alert>}
              {showListingsError && <Alert severity="error" sx={{ mb: 3 }}>Error loading listings</Alert>}

              <Box component="form" onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
                <TextField fullWidth label="Username" id="username" defaultValue={currentUser.username} onChange={handleChange}
                  InputProps={{ startAdornment: <Icon icon="mdi:account-outline" style={{ marginRight: 8, color: '#5C6070' }} /> }} />
                <TextField fullWidth label="Email" type="email" id="email" defaultValue={currentUser.email} onChange={handleChange}
                  InputProps={{ startAdornment: <Icon icon="mdi:email-outline" style={{ marginRight: 8, color: '#5C6070' }} /> }} />
                <TextField fullWidth label="New Password" type="password" id="password" onChange={handleChange}
                  InputProps={{ startAdornment: <Icon icon="mdi:lock-outline" style={{ marginRight: 8, color: '#5C6070' }} /> }} />
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <Button variant="contained" color="primary" type="submit" disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Icon icon="mdi:content-save-outline" />}
                    sx={{ flex: 1 }}>
                    {loading ? 'Saving…' : 'Update Profile'}
                  </Button>
                  <Button variant="outlined" color="primary" component={Link} to="/create-listing"
                    startIcon={<Icon icon="mdi:plus-circle-outline" />}
                    sx={{ flex: 1 }}>
                    Create Listing
                  </Button>
                </Box>
              </Box>

              {/* Listings */}
              {userListings.length > 0 && (
                <Box mt={4}>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
                    My Listings
                  </Typography>
                  <Grid container spacing={2}>
                    {userListings.map((listing) => (
                      <Grid item xs={12} sm={6} key={listing._id}>
                        <Card sx={{ display: 'flex', alignItems: 'center', p: 1,
                          border: '1px solid', borderColor: 'divider',
                          '&:hover': { boxShadow: 3 }, transition: 'box-shadow 0.2s' }}>
                          <CardMedia component={Link} to={`/listing/${listing._id}`}>
                            <Box component="img" src={listing.imageUrls[0]} alt={listing.name}
                              sx={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 1.5 }} />
                          </CardMedia>
                          <CardContent sx={{ flex: 1, py: '6px !important', px: 1.5 }}>
                            <Typography component={Link} to={`/listing/${listing._id}`} variant="caption"
                              fontWeight={700} color="text.primary"
                              sx={{ textDecoration: 'none', display: 'block',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                '&:hover': { textDecoration: 'underline' } }}>
                              {listing.name}
                            </Typography>
                          </CardContent>
                          <Box sx={{ display: 'flex', pr: 0.5 }}>
                            <Tooltip title="Edit">
                              <IconButton component={Link} to={`/update-listing/${listing._id}`} color="primary" size="small">
                                <Icon icon="mdi:pencil-outline" width={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton color="error" size="small" onClick={() => handleListingDelete(listing._id)}>
                                <Icon icon="mdi:delete-outline" width={16} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
