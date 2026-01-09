import React, { useState } from 'react';
import ServicePageLayout from './ServicePageLayout';

const AcServicePage = () => {
  // Categories specific to AC Service
  const categories = [
    { id: 'all', label: 'All Services', icon: '' },
    { id: 'split', label: 'Split AC', icon: 'https://images.unsplash.com/photo-1614634282776-80f4f910606f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' },
    { id: 'window', label: 'Window AC', icon: 'https://images.unsplash.com/photo-1595429035839-c99c298ffdde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' },
    { id: 'installation', label: 'Installation', icon: 'https://images.unsplash.com/photo-1621905476017-7ca015d55375?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }
  ];

  return (
    <ServicePageLayout
      title="AC Service & Repair"
      breadcrumb="AC Services"
      initialServiceType="Split AC"
      categories={categories}
      reviewServiceId="AC_SERVICE_ID"
    />
  );
};

export default AcServicePage;