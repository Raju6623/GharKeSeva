import React, { useState } from 'react';
import ServicePageLayout from './ServicePageLayout';

const CarpenterServicePage = () => {
  const categories = [
    { id: 'all', label: 'All Services', icon: '' },
    { id: 'general-repair', label: 'General Repair', icon: 'https://cdn-icons-png.flaticon.com/512/2950/2950666.png' },
    { id: 'new-assembly', label: 'New Assembly', icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png' }
  ];

  return (
    <ServicePageLayout
      title="Professional Carpentry"
      breadcrumb="Carpentry"
      initialServiceType="General Repair"
      categories={categories}
      reviewServiceId="CARPENTER_SERVICE_ID"
    />
  );
};

export default CarpenterServicePage;