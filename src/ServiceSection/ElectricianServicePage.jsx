import React, { useState } from 'react';
import ServicePageLayout from './ServicePageLayout';

const ElectricianServicePage = () => {
  const categories = [
    { id: 'all', label: 'All Services', icon: '' },
    { id: 'repair', label: 'Repair', icon: 'https://cdn-icons-png.flaticon.com/512/3256/3256783.png' },
    { id: 'installation', label: 'Installation', icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png' }
  ];

  return (
    <ServicePageLayout
      title="Electrical Services"
      breadcrumb="Electrician"
      initialServiceType="Repair"
      categories={categories}
      reviewServiceId="ELECTRICIAN_SERVICE_ID"
    />
  );
};

export default ElectricianServicePage;