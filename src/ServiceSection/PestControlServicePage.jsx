import React, { useState } from 'react';
import ServicePageLayout from './ServicePageLayout';

const PestControlServicePage = () => {
  const categories = [
    { id: 'all', label: 'All Services', icon: '' },
    { id: 'general-pest', label: 'General Pest', icon: 'https://cdn-icons-png.flaticon.com/512/2823/2823521.png' },
    { id: 'specialized', label: 'Specialized', icon: 'https://cdn-icons-png.flaticon.com/512/2823/2823521.png' }
  ];

  return (
    <ServicePageLayout
      title="Pest Control"
      breadcrumb="Pest Control"
      initialServiceType="General Pest"
      categories={categories}
      reviewServiceId="PEST_CONTROL_SERVICE_ID"
    />
  );
};

export default PestControlServicePage;