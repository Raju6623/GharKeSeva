import React, { useState } from 'react';
import ServicePageLayout from './ServicePageLayout';

const PaintingServicePage = () => {
  const categories = [
    { id: 'all', label: 'All Services', icon: '' },
    { id: 'full-home', label: 'Full Home', icon: 'https://cdn-icons-png.flaticon.com/512/3132/3132649.png' },
    { id: 'room-wall', label: 'Room/Wall', icon: 'https://cdn-icons-png.flaticon.com/512/3132/3132649.png' },
    { id: 'texture', label: 'Texture', icon: 'https://cdn-icons-png.flaticon.com/512/10057/10057597.png' }
  ];

  return (
    <ServicePageLayout
      title="Painting Services"
      breadcrumb="Painting"
      initialServiceType="Full Home"
      categories={categories}
      reviewServiceId="PAINT_SERVICE_ID"
    />
  );
};

export default PaintingServicePage;