import React, { useState } from 'react';
import ServicePageLayout from './ServicePageLayout';

const RoServicePage = () => {
  const categories = [
    { id: 'all', label: 'All Services', icon: '' },
    { id: 'routine-service', label: 'Routine Service', icon: 'https://cdn-icons-png.flaticon.com/512/3256/3256783.png' },
    { id: 'repair-parts', label: 'Repair & Parts', icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png' }
  ];

  return (
    <ServicePageLayout
      title="RO Service & Repair"
      breadcrumb="RO Service"
      initialServiceType="Routine Service"
      categories={categories}
      reviewServiceId="RO_SERVICE_ID"
    />
  );
};

export default RoServicePage;