import React, { useState } from 'react';
import ServicePageLayout from './ServicePageLayout';

const SmartLockServicePage = () => {
  const categories = [
    { id: 'all', label: 'All Services', icon: '' },
    { id: 'installation', label: 'Installation', icon: 'https://cdn-icons-png.flaticon.com/512/2916/2916315.png' },
    { id: 'repair-support', label: 'Repair & Support', icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png' }
  ];

  return (
    <ServicePageLayout
      title="Smart Lock Installation"
      breadcrumb="Smart Lock"
      initialServiceType="Installation"
      categories={categories}
      reviewServiceId="SMART_LOCK_SERVICE_ID"
    />
  );
};

export default SmartLockServicePage;