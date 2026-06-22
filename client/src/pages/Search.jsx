import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button, Checkbox,
  FormControlLabel, FormGroup, Select, MenuItem, FormControl,
  InputLabel, Divider, Paper, CircularProgress,
} from '@mui/material';
import { Icon } from '@iconify/react';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '', type: 'all', parking: false,
    furnished: false, offer: false, sort: 'created_at', order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setSidebardata({
      searchTerm: urlParams.get('searchTerm') || '',
      type: urlParams.get('type') || 'all',
      parking: urlParams.get('parking') === 'true',
      furnished: urlParams.get('furnished') === 'true',
      offer: urlParams.get('offer') === 'true',
      sort: urlParams.get('sort') || 'created_at',
      order: urlParams.get('order') || 'desc',
    });
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      if (!urlParams.has('limit')) urlParams.set('limit', '20');
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();
      setShowMore(data.length >= 20);
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    if (id === 'all' || id === 'rent' || id === 'sale') {
      setSidebardata({ ...sidebardata, type: id });
    } else if (id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: value });
    } else if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setSidebardata({ ...sidebardata, [id]: checked });
    } else if (id === 'sort_order') {
      setSidebardata({ ...sidebardata, sort: value.split('_')[0], order: value.split('_')[1] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    p.set('searchTerm', sidebardata.searchTerm);
    p.set('type', sidebardata.type);
    p.set('parking', sidebardata.parking);
    p.set('furnished', sidebardata.furnished);
    p.set('offer', sidebardata.offer);
    p.set('sort', sidebardata.sort);
    p.set('order', sidebardata.order);
    navigate(`/search?${p.toString()}`);
  };

  const onShowMoreClick = async () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', listings.length);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    if (data.length < 9) setShowMore(false);
    setListings([...listings, ...data]);
  };

  const sortValue = `${sidebardata.sort}_${sidebardata.order}`;

  return (
    <Box sx={{ display: 'flex', minHeight: '92vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Paper elevation={0} sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0, p: 3,
        borderRight: '1px solid', borderColor: 'divider', display: { xs: 'none', md: 'block' } }}>
        <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
          <Icon icon="mdi:filter-outline" /> Filters
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField fullWidth label="Search Term" id="searchTerm" size="small"
            value={sidebardata.searchTerm} onChange={handleChange}
            InputProps={{ startAdornment: <Icon icon="mdi:magnify" style={{ marginRight: 6 }} /> }} />

          <Box>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>Type</Typography>
            <FormGroup>
              {[{ id: 'all', label: 'Rent & Sale' }, { id: 'rent', label: 'Rent' }, { id: 'sale', label: 'Sale' }].map((t) => (
                <FormControlLabel key={t.id} control={
                  <Checkbox id={t.id} size="small" checked={sidebardata.type === t.id} onChange={handleChange} />
                } label={t.label} />
              ))}
              <FormControlLabel control={
                <Checkbox id="offer" size="small" checked={sidebardata.offer} onChange={handleChange} />
              } label="Offers Only" />
            </FormGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>Amenities</Typography>
            <FormGroup>
              <FormControlLabel control={
                <Checkbox id="parking" size="small" checked={sidebardata.parking} onChange={handleChange} />
              } label="Parking" />
              <FormControlLabel control={
                <Checkbox id="furnished" size="small" checked={sidebardata.furnished} onChange={handleChange} />
              } label="Furnished" />
            </FormGroup>
          </Box>

          <FormControl size="small" fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select id="sort_order" value={sortValue} label="Sort By"
              onChange={(e) => handleChange({ target: { id: 'sort_order', value: e.target.value } })}>
              <MenuItem value="regularPrice_desc">Price: High to Low</MenuItem>
              <MenuItem value="regularPrice_asc">Price: Low to High</MenuItem>
              <MenuItem value="createdAt_desc">Latest</MenuItem>
              <MenuItem value="createdAt_asc">Oldest</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth
            startIcon={<Icon icon="mdi:magnify" />}>Search</Button>
        </Box>
      </Paper>

      {/* Results */}
      <Box sx={{ flex: 1, minWidth: 0, p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="primary" mb={3}>
          Search Results
        </Typography>
        {loading && (
          <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>
        )}
        {!loading && listings.length === 0 && (
          <Box textAlign="center" mt={8}>
            <Icon icon="mdi:home-search-outline" width={64} color="#C9982A" />
            <Typography variant="h6" color="text.secondary" mt={2}>No listings found</Typography>
          </Box>
        )}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
          alignItems: 'stretch',
        }}>
          {!loading && listings.map((listing) => (
            <Box key={listing._id} sx={{ display: 'flex', minWidth: 0 }}>
              <ListingItem listing={listing} />
            </Box>
          ))}
        </Box>
        {showMore && (
          <Box textAlign="center" mt={4}>
            <Button variant="outlined" color="primary" onClick={onShowMoreClick}
              startIcon={<Icon icon="mdi:chevron-down" />}>
              Show More
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
