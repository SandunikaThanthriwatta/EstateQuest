import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Paper, Typography, TextField, Button,
  Checkbox, FormControlLabel, Grid, Alert, CircularProgress,
  Divider, IconButton, ToggleButton, ToggleButtonGroup, Chip,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const SectionCard = ({ icon, title, children, delay = 0 }) => (
  <motion.div {...fadeUp(delay)}>
    <Paper elevation={0} sx={{
      p: 3, borderRadius: 3,
      border: '1px solid', borderColor: 'rgba(27,58,92,0.1)',
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fc 100%)',
      boxShadow: '0 2px 16px rgba(27,58,92,0.07)',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: 'linear-gradient(135deg, #1B3A5C, #2E5F8A)' }}>
          <Icon icon={icon} width={20} color="#fff" />
        </Box>
        <Typography variant="h6" fontWeight={700} color="primary">{title}</Typography>
      </Box>
      {children}
    </Paper>
  </motion.div>
);

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [], name: '', description: '', address: '',
    type: 'rent', bedrooms: 1, bathrooms: 1,
    regularPrice: 50, discountPrice: 0,
    offer: false, parking: false, furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]   = useState(false);
  const [loading, setLoading] = useState(false);

  const storeImage = async (file) => {
    const data = new FormData();
    data.append('image', file);
    const res  = await fetch('/api/upload', { method: 'POST', body: data });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Upload failed');
    return json.url;
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true); setImageUploadError(false);
      Promise.all(Array.from(files).map(storeImage))
        .then((urls) => { setFormData({ ...formData, imageUrls: [...formData.imageUrls, ...urls] }); setUploading(false); })
        .catch(() => { setImageUploadError('Image upload failed (2 MB max per image)'); setUploading(false); });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
    }
  };

  const handleRemoveImage = (index) =>
    setFormData({ ...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index) });

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    if (id === 'sale' || id === 'rent') { setFormData({ ...formData, type: id }); return; }
    if (id === 'parking' || id === 'furnished' || id === 'offer') { setFormData({ ...formData, [id]: checked }); return; }
    if (type === 'number' || type === 'text' || type === 'textarea') setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
    if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');
    setLoading(true); setError(false);
    try {
      const res  = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentUser.token}` },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) return setError(data.message);
      navigate(`/listing/${data._id}`);
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '92vh' }}>

      {/* Page header banner */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1B3A5C 0%, #2E5F8A 100%)',
        py: { xs: 4, md: 5 }, px: 2, textAlign: 'center',
      }}>
        <motion.div {...fadeUp(0)}>
          <Icon icon="mdi:home-plus-outline" width={44} color="#C9982A" />
          <Typography variant="h4" fontWeight={800} color="#fff" mt={1}>
            Create a Listing
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
            Fill in the details below to publish your property
          </Typography>
        </motion.div>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            {/* ── LEFT COLUMN ── */}
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Basic info */}
                <SectionCard icon="mdi:file-document-outline" title="Basic Information" delay={0.05}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField fullWidth label="Property Name" id="name" required
                      onChange={handleChange} value={formData.name}
                      inputProps={{ minLength: 10, maxLength: 62 }}
                      placeholder="e.g. Modern 3-bedroom apartment downtown"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }} />
                    <TextField fullWidth label="Description" id="description" multiline rows={4}
                      required onChange={handleChange} value={formData.description}
                      placeholder="Describe the property — highlights, nearby amenities, etc."
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }} />
                    <TextField fullWidth label="Address" id="address" required
                      onChange={handleChange} value={formData.address}
                      placeholder="Full address including city"
                      InputProps={{ startAdornment: <Icon icon="mdi:map-marker-outline" width={20} style={{ marginRight: 8, color: '#C9982A' }} /> }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }} />
                  </Box>
                </SectionCard>

                {/* Listing type */}
                <SectionCard icon="mdi:tag-outline" title="Listing Type" delay={0.1}>
                  <ToggleButtonGroup exclusive value={formData.type}
                    onChange={(_, v) => v && setFormData({ ...formData, type: v })}
                    sx={{ width: '100%', gap: 2 }}>
                    {[
                      { value: 'rent', label: 'For Rent', icon: 'mdi:key-outline' },
                      { value: 'sale', label: 'For Sale', icon: 'mdi:home-outline' },
                    ].map((t) => (
                      <ToggleButton key={t.value} value={t.value} sx={{
                        flex: 1, py: 1.5, borderRadius: '10px !important', border: '1.5px solid !important',
                        borderColor: formData.type === t.value ? 'primary.main !important' : 'rgba(0,0,0,0.12) !important',
                        bgcolor: formData.type === t.value ? 'rgba(27,58,92,0.08) !important' : '#fff !important',
                        gap: 1, fontWeight: 700, color: formData.type === t.value ? 'primary.main' : 'text.secondary',
                        transition: 'all .2s',
                      }}>
                        <Icon icon={t.icon} width={20} />
                        {t.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                    {[
                      { id: 'parking',   label: 'Parking',      icon: 'mdi:car-outline' },
                      { id: 'furnished', label: 'Furnished',     icon: 'mdi:sofa-outline' },
                      { id: 'offer',     label: 'Special Offer', icon: 'mdi:tag-heart-outline' },
                    ].map((item) => (
                      <Chip
                        key={item.id}
                        icon={<Icon icon={item.icon} width={16} />}
                        label={item.label}
                        clickable
                        onClick={() => setFormData({ ...formData, [item.id]: !formData[item.id] })}
                        variant={formData[item.id] ? 'filled' : 'outlined'}
                        color={formData[item.id] ? 'primary' : 'default'}
                        sx={{ px: 1, fontWeight: 600, borderRadius: 2,
                          bgcolor: formData[item.id] ? undefined : '#fff' }}
                      />
                    ))}
                  </Box>
                </SectionCard>

                {/* Pricing & rooms */}
                <SectionCard icon="mdi:currency-usd" title="Pricing & Rooms" delay={0.15}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <TextField fullWidth label="Beds" type="number" id="bedrooms" required
                        inputProps={{ min: 1, max: 10 }} onChange={handleChange} value={formData.bedrooms}
                        InputProps={{ startAdornment: <Icon icon="mdi:bed-outline" width={18} style={{ marginRight: 4 }} /> }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField fullWidth label="Baths" type="number" id="bathrooms" required
                        inputProps={{ min: 1, max: 10 }} onChange={handleChange} value={formData.bathrooms}
                        InputProps={{ startAdornment: <Icon icon="mdi:shower" width={18} style={{ marginRight: 4 }} /> }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth
                        label={`Regular Price${formData.type === 'rent' ? ' ($ / mo)' : ' ($)'}`}
                        type="number" id="regularPrice" required inputProps={{ min: 50 }}
                        onChange={handleChange} value={formData.regularPrice}
                        InputProps={{ startAdornment: <Icon icon="mdi:currency-usd" width={18} style={{ marginRight: 4, color: '#C9982A' }} /> }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }} />
                    </Grid>
                    {formData.offer && (
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Discount Price ($)" type="number" id="discountPrice"
                          required inputProps={{ min: 0 }} onChange={handleChange} value={formData.discountPrice}
                          InputProps={{ startAdornment: <Icon icon="mdi:tag-outline" width={18} style={{ marginRight: 4, color: '#2E7D32' }} /> }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }} />
                      </Grid>
                    )}
                  </Grid>
                </SectionCard>
              </Box>
            </Grid>

            {/* ── RIGHT COLUMN — images ── */}
            <Grid item xs={12} md={5}>
              <motion.div {...fadeUp(0.2)} style={{ position: 'sticky', top: 80 }}>
                <Paper elevation={0} sx={{
                  p: 3, borderRadius: 3,
                  border: '1px solid', borderColor: 'rgba(27,58,92,0.1)',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fc 100%)',
                  boxShadow: '0 2px 16px rgba(27,58,92,0.07)',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', background: 'linear-gradient(135deg, #C9982A, #E8BF6A)' }}>
                      <Icon icon="mdi:image-multiple-outline" width={20} color="#fff" />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color="primary">Photos</Typography>
                      <Typography variant="caption" color="text.secondary">
                        First photo = cover · max 6
                      </Typography>
                    </Box>
                  </Box>

                  {/* Upload controls */}
                  <Box sx={{ border: '2px dashed', borderColor: 'rgba(27,58,92,0.2)', borderRadius: 3,
                    p: 3, textAlign: 'center', mb: 2,
                    background: 'rgba(27,58,92,0.02)',
                    transition: 'border-color .2s',
                    '&:hover': { borderColor: 'primary.main' } }}>
                    <Icon icon="mdi:cloud-upload-outline" width={40} color="#1B3A5C" />
                    <Typography variant="body2" color="text.secondary" mt={1} mb={2}>
                      Drag & drop or click to select
                    </Typography>
                    <Button variant="outlined" component="label" size="small"
                      startIcon={<Icon icon="mdi:image-plus-outline" />}
                      sx={{ borderRadius: 2, mr: 1 }}>
                      Select Photos
                      <input type="file" hidden accept="image/*" multiple
                        onChange={(e) => setFiles(e.target.files)} />
                    </Button>
                    {files.length > 0 && (
                      <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                        {files.length} file{files.length > 1 ? 's' : ''} selected
                      </Typography>
                    )}
                  </Box>

                  <Button fullWidth variant="contained" color="primary" onClick={handleImageSubmit}
                    disabled={uploading || files.length === 0}
                    startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <Icon icon="mdi:upload" />}
                    sx={{ borderRadius: 2, mb: 2,
                      background: 'linear-gradient(90deg, #1B3A5C, #2E5F8A)',
                      '&:disabled': { opacity: 0.5 } }}>
                    {uploading ? 'Uploading…' : 'Upload Photos'}
                  </Button>

                  {imageUploadError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{imageUploadError}</Alert>}

                  {/* Preview grid */}
                  {formData.imageUrls.length > 0 && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                      {formData.imageUrls.map((url, idx) => (
                        <Box key={url} sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden',
                          aspectRatio: '4/3' }}>
                          <Box component="img" src={url} alt="listing"
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {idx === 0 && (
                            <Chip label="Cover" size="small"
                              sx={{ position: 'absolute', top: 6, left: 6,
                                bgcolor: 'rgba(201,152,42,0.9)', color: '#fff', fontWeight: 700, fontSize: '0.65rem' }} />
                          )}
                          <IconButton size="small" onClick={() => handleRemoveImage(idx)}
                            sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.55)',
                              color: '#fff', p: 0.4, '&:hover': { bgcolor: 'rgba(198,40,40,0.85)' } }}>
                            <Icon icon="mdi:close" width={14} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {formData.imageUrls.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 2, opacity: 0.4 }}>
                      <Icon icon="mdi:image-off-outline" width={40} color="#1B3A5C" />
                      <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                        No photos yet
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

          {/* Error & submit */}
          <motion.div {...fadeUp(0.25)}>
            {error && <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>{error}</Alert>}
            <Button fullWidth variant="contained" color="primary" size="large" type="submit"
              disabled={loading || uploading}
              sx={{
                mt: 3, py: 1.8, borderRadius: 2, fontSize: '1.05rem', fontWeight: 700,
                background: 'linear-gradient(90deg, #1B3A5C 0%, #2E5F8A 100%)',
                boxShadow: '0 4px 20px rgba(27,58,92,0.35)',
                '&:hover': { background: 'linear-gradient(90deg, #0F2240 0%, #1B3A5C 100%)' },
              }}
              startIcon={loading
                ? <CircularProgress size={22} color="inherit" />
                : <Icon icon="mdi:plus-circle-outline" width={22} />}>
              {loading ? 'Publishing Listing…' : 'Publish Listing'}
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
