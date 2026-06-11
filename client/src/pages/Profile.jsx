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
  IconButton, Tooltip,
} from '@mui/material';
import { Icon } from '@iconify/react';

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
    <Box sx={{ bgcolor: 'background.default', minHeight: '92vh', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} color="primary" textAlign="center" mb={3}>
            My Profile
          </Typography>

          {/* Avatar upload */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <input ref={fileRef} type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
            <Tooltip title="Click to change photo">
              <Avatar
                src={avatarSrc}
                alt={currentUser.username}
                onClick={() => fileRef.current.click()}
                sx={{ width: 96, height: 96, cursor: 'pointer', border: '3px solid', borderColor: 'primary.light',
                  '&:hover': { opacity: 0.85 } }}
              />
            </Tooltip>
            <Typography variant="caption" color="text.secondary" mt={1}>
              {fileUploadError
                ? <span style={{ color: '#C62828' }}>Upload failed (max 2 MB)</span>
                : filePerc > 0 && filePerc < 100
                  ? `Uploading ${filePerc}%…`
                  : filePerc === 100
                    ? <span style={{ color: '#2E7D32' }}>Photo updated!</span>
                    : 'Click photo to change'}
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {updateSuccess && <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully!</Alert>}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Username" id="username" defaultValue={currentUser.username} onChange={handleChange}
              InputProps={{ startAdornment: <Icon icon="mdi:account-outline" style={{ marginRight: 8, color: '#5C6070' }} /> }} />
            <TextField fullWidth label="Email" type="email" id="email" defaultValue={currentUser.email} onChange={handleChange}
              InputProps={{ startAdornment: <Icon icon="mdi:email-outline" style={{ marginRight: 8, color: '#5C6070' }} /> }} />
            <TextField fullWidth label="New Password" type="password" id="password" onChange={handleChange}
              InputProps={{ startAdornment: <Icon icon="mdi:lock-outline" style={{ marginRight: 8, color: '#5C6070' }} /> }} />
            <Button fullWidth variant="contained" color="primary" size="large" type="submit"
              disabled={loading} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Icon icon="mdi:content-save-outline" />}>
              {loading ? 'Saving…' : 'Update Profile'}
            </Button>
            <Button fullWidth variant="outlined" color="primary" size="large" component={Link} to="/create-listing"
              startIcon={<Icon icon="mdi:plus-circle-outline" />}>
              Create Listing
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button color="error" startIcon={<Icon icon="mdi:delete-outline" />} onClick={handleDeleteUser}>
              Delete Account
            </Button>
            <Button color="warning" startIcon={<Icon icon="mdi:logout" />} onClick={handleSignOut}>
              Sign Out
            </Button>
          </Box>
        </Paper>

        {/* Listings */}
        <Box mt={3} textAlign="center">
          <Button variant="outlined" color="primary" onClick={handleShowListings}
            startIcon={<Icon icon="mdi:format-list-bulleted" />}>
            Show My Listings
          </Button>
          {showListingsError && <Alert severity="error" sx={{ mt: 2 }}>Error loading listings</Alert>}
        </Box>

        {userListings.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" fontWeight={700} color="primary" textAlign="center" mb={2}>
              My Listings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {userListings.map((listing) => (
                <Card key={listing._id} sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                  <CardMedia component={Link} to={`/listing/${listing._id}`}>
                    <Box component="img" src={listing.imageUrls[0]} alt={listing.name}
                      sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 1 }} />
                  </CardMedia>
                  <CardContent sx={{ flex: 1, py: '8px !important' }}>
                    <Typography component={Link} to={`/listing/${listing._id}`} variant="subtitle2"
                      fontWeight={700} color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      {listing.name}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', gap: 0.5, pr: 1 }}>
                    <Tooltip title="Edit">
                      <IconButton component={Link} to={`/update-listing/${listing._id}`} color="primary" size="small">
                        <Icon icon="mdi:pencil-outline" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" size="small" onClick={() => handleListingDelete(listing._id)}>
                        <Icon icon="mdi:delete-outline" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
