import React, { useState } from 'react';
import ServicePageLayout from './ServicePageLayout';

const PlumbingServicePage = () => {
  const categories = [
    { id: 'all', label: 'All Services', icon: '' },
    { id: 'repair', label: 'Repair', icon: 'https://cdn-icons-png.flaticon.com/512/3079/3079140.png' },
    { id: 'installation', label: 'Installation', icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png' },
    { id: 'blockage', label: 'Blockage', icon: 'https://cdn-icons-png.flaticon.com/512/2422/2422204.png' }
  ];

  return (
    <ServicePageLayout
      title="Professional Plumbing"
      breadcrumb="Plumbing"
      initialServiceType="Repair"
      categories={categories}
      reviewServiceId="PLUMBING_SERVICE_ID"
    />
  );
};

export default PlumbingServicePage;