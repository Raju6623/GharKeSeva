import React, { useState } from 'react';
import ServicePageLayout from './ServicePageLayout';

const HouseMaidServicePage = () => {
  const categories = [
    { id: 'all', label: 'All Services', icon: '' },
    { id: 'one-time', label: 'One-Time', icon: 'https://cdn-icons-png.flaticon.com/512/2916/2916315.png' },
    { id: 'subscription', label: 'Subscription', icon: 'https://cdn-icons-png.flaticon.com/512/2558/2558944.png' }
  ];

  return (
    <ServicePageLayout
      title="House Maid Services"
      breadcrumb="House Maid"
      initialServiceType="One-Time"
      categories={categories}
      reviewServiceId="MAID_SERVICE_ID"
    />
  );
};

export default HouseMaidServicePage;