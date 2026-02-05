import React from 'react';
import {
    Snowflake, Tag, Fan, Wrench, Droplet, Database, AlertCircle,
    Hammer, Zap, Scissors, Lock, HeartPulse, User,
    Wind, SprayCan, PaintRoller, Sparkles,
    Bath, Waves, Brush, Pipette, Thermometer, Radio, Tv,
    Laptop, Tablet, Smartphone, Microwave, Refrigerator,
    WashingMachine, Trash2, Power, Lightbulb, Plug, Drill,
    Warehouse, DoorOpen, Layout, Palette
} from 'lucide-react';

export const SERVICE_CONFIG = {
    'acservice': {
        title: "ac_service_title",
        breadcrumb: "ac_breadcrumb",
        category: "AC",
        reviewServiceId: "AC_SERVICE_ID",
        categories: [
            { id: 'all_ac', label: 'all_ac_services', icon: <Snowflake size={32} color="#0c8182" /> },
            { id: 'packages', label: 'super_saver_packages', icon: <Tag size={32} color="#0c8182" /> },
            { id: 'split', label: 'split_ac', icon: <Snowflake size={32} color="#0c8182" /> },
            { id: 'installation', label: 'install_uninstall', icon: <Drill size={32} color="#0c8182" /> },
            { id: 'repair', label: 'repair_gas_refill', icon: <Thermometer size={32} color="#0c8182" /> },
            { id: 'other_ac', label: 'other_ac_services', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    },
    'plumbing-service': {
        title: "plumbing_title",
        breadcrumb: "plumbing_breadcrumb",
        category: "Plumbing",
        reviewServiceId: "PLUMBING_SERVICE_ID",
        categories: [
            { id: 'all_plumbing', label: 'all_plumbing_services', icon: <Droplet size={32} color="#0c8182" /> },
            { id: 'tap', label: 'tap_mixer', icon: <Pipette size={32} color="#0c8182" /> },
            { id: 'basin', label: 'basin_sink', icon: <Bath size={32} color="#0c8182" /> },
            { id: 'toilet', label: 'toilet', icon: <Droplet size={32} color="#0c8182" /> },
            { id: 'tank', label: 'water_tank', icon: <Database size={32} color="#0c8182" /> },
            { id: 'blockage', label: 'blockage', icon: <Waves size={32} color="#0c8182" /> },
            { id: 'other_plumbing', label: 'other_plumbing_services', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    },
    'carpenter-service': {
        title: "carpenter_title",
        breadcrumb: "carpenter_breadcrumb",
        category: "Carpenter",
        reviewServiceId: "CARPENTER_SERVICE_ID",
        categories: [
            { id: 'all_carpenter', label: 'all_carpenter_services', icon: <Hammer size={32} color="#0c8182" /> },
            { id: 'drill', label: 'drill_hang', icon: <Drill size={32} color="#0c8182" /> },
            { id: 'furniture', label: 'furniture_repair', icon: <Warehouse size={32} color="#0c8182" /> },
            { id: 'cupboard', label: 'cupboard_drawer', icon: <Layout size={32} color="#0c8182" /> },
            { id: 'door', label: 'door', icon: <DoorOpen size={32} color="#0c8182" /> },
            { id: 'other_carpenter', label: 'other_carpenter_services', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    },
    'electrician-service': {
        title: "electrician_title",
        breadcrumb: "electrician_breadcrumb",
        category: "Electrician",
        reviewServiceId: "ELECTRICIAN_SERVICE_ID",
        categories: [
            { id: 'all_electrician', label: 'all_electrician_services', icon: <Zap size={32} color="#0c8182" /> },
            { id: 'switch', label: 'switch_socket', icon: <Plug size={32} color="#0c8182" /> },
            { id: 'fan', label: 'fan', icon: <Fan size={32} color="#0c8182" /> },
            { id: 'light', label: 'light', icon: <Lightbulb size={32} color="#0c8182" /> },
            { id: 'mcb', label: 'mcb_fuse', icon: <Power size={32} color="#0c8182" /> },
            { id: 'other_electrician', label: 'other_electrician_services', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    },
    'house-maid-service': {
        title: "cleaning_title",
        breadcrumb: "cleaning_breadcrumb",
        category: "Cleaning",
        reviewServiceId: "CLEANING_SERVICE_ID",
        categories: [
            { id: 'all_cleaning', label: 'all_cleaning_services', icon: <SprayCan size={32} color="#0c8182" /> },
            { id: 'bathroom', label: 'bathroom_cleaning', icon: <Bath size={32} color="#0c8182" /> },
            { id: 'kitchen', label: 'kitchen_cleaning', icon: <SprayCan size={32} color="#0c8182" /> },
            { id: 'fullhome', label: 'full_home_cleaning', icon: <Sparkles size={32} color="#0c8182" /> },
            { id: 'sofa', label: 'sofa_carpet', icon: <SprayCan size={32} color="#0c8182" /> },
            { id: 'other_cleaning', label: 'other_cleaning_services', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    },
    'salon-service': {
        title: "salon_at_home_title",
        breadcrumb: "salon_breadcrumb",
        category: "Salon",
        reviewServiceId: "SALON_SERVICE_ID",
        categories: [
            { id: 'all_salon', label: 'all_salon_services', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'haircut', label: 'haircut', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'facial', label: 'facial_cleanup', icon: <Sparkles size={32} color="#0c8182" /> },
            { id: 'manicure', label: 'manicure_pedicure', icon: <User size={32} color="#0c8182" /> },
            { id: 'waxing', label: 'waxing', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'massage', label: 'massage', icon: <User size={32} color="#0c8182" /> },
            { id: 'other_salon', label: 'other_salon_services', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    },
    'salon-for-women': {
        title: "womens_salon_title",
        breadcrumb: "womens_salon_breadcrumb",
        category: "salon",
        genderType: "women",
        reviewServiceId: "SALON_FOR_WOMEN_ID",
        categories: [
            { id: 'all_salon', label: 'all_salon_services', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'haircut', label: 'haircut', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'facial', label: 'facial_cleanup', icon: <Sparkles size={32} color="#0c8182" /> },
            { id: 'manicure', label: 'manicure_pedicure', icon: <User size={32} color="#0c8182" /> },
            { id: 'waxing', label: 'waxing', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'massage', label: 'massage', icon: <User size={32} color="#0c8182" /> },
            { id: 'other_salon', label: 'other_salon_services', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    },
    'women\'s-salon': {
        title: "womens_salon_title",
        breadcrumb: "womens_salon_breadcrumb",
        category: "salon",
        genderType: "women",
        reviewServiceId: "SALON_FOR_WOMEN_ID",
        categories: [
            { id: 'all_salon', label: 'all_salon_services', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'haircut', label: 'haircut', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'facial', label: 'facial_cleanup', icon: <Sparkles size={32} color="#0c8182" /> },
            { id: 'manicure', label: 'manicure_pedicure', icon: <User size={32} color="#0c8182" /> },
            { id: 'waxing', label: 'waxing', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'massage', label: 'massage', icon: <User size={32} color="#0c8182" /> },
            { id: 'other_salon', label: 'other_salon_services', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    },
    'salon-for-men': {
        title: "mens_salon_title",
        breadcrumb: "mens_salon_breadcrumb",
        category: "salon",
        genderType: "men",
        reviewServiceId: "SALON_FOR_MEN_ID",
        categories: [
            { id: 'all_salon', label: 'all_salon_services', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'haircut', label: 'haircut', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'facial', label: 'facial_cleanup', icon: <Sparkles size={32} color="#0c8182" /> },
            { id: 'manicure', label: 'manicure_pedicure', icon: <User size={32} color="#0c8182" /> },
            { id: 'beard', label: 'beard_grooming', icon: <SprayCan size={32} color="#0c8182" /> },
            { id: 'waxing', label: 'waxing', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'massage', label: 'massage', icon: <User size={32} color="#0c8182" /> },
            { id: 'other_salon_men', label: 'other_salon_services', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    },
    'men\'s-salon': {
        title: "mens_salon_title",
        breadcrumb: "mens_salon_breadcrumb",
        category: "salon",
        genderType: "men",
        reviewServiceId: "SALON_FOR_MEN_ID",
        categories: [
            { id: 'all_salon', label: 'all_salon_services', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'haircut', label: 'haircut', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'facial', label: 'facial_cleanup', icon: <Sparkles size={32} color="#0c8182" /> },
            { id: 'manicure', label: 'manicure_pedicure', icon: <User size={32} color="#0c8182" /> },
            { id: 'beard', label: 'beard_grooming', icon: <SprayCan size={32} color="#0c8182" /> },
            { id: 'waxing', label: 'waxing', icon: <Scissors size={32} color="#0c8182" /> },
            { id: 'massage', label: 'massage', icon: <User size={32} color="#0c8182" /> },
            { id: 'other_salon_men', label: 'other_salon_services', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    },
    'painting-service': {
        title: "painting_title",
        breadcrumb: "painting_breadcrumb",
        category: "Painting",
        reviewServiceId: "PAINTING_SERVICE_ID",
        categories: [
            { id: 'all_painting', label: 'all_painting_services', icon: <Palette size={32} color="#0c8182" /> },
            { id: 'fullhome_paint', label: 'full_home_painting', icon: <PaintRoller size={32} color="#0c8182" /> },
            { id: 'texture', label: 'texture_painting', icon: <Layout size={32} color="#0c8182" /> },
            { id: 'waterproofing', label: 'waterproofing', icon: <Waves size={32} color="#0c8182" /> },
            { id: 'other_painting', label: 'other_painting_services', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    },
    'ro-service': {
        title: "ro_title",
        breadcrumb: "ro_breadcrumb",
        category: "RO",
        reviewServiceId: "RO_SERVICE_ID",
        categories: [
            { id: 'all_ro', label: 'all_ro_services', icon: <HeartPulse size={32} color="#0c8182" /> },
            { id: 'repair_ro', label: 'base_repair_service', icon: <Wrench size={32} color="#0c8182" /> },
            { id: 'install_ro', label: 'installation', icon: <Drill size={32} color="#0c8182" /> },
            { id: 'other_ro', label: 'other_ro_services', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    },
    'appliances-service': {
        title: "appliance_title",
        breadcrumb: "appliance_breadcrumb",
        category: "Appliance",
        reviewServiceId: "APPLIANCE_SERVICE_ID",
        categories: [
            { id: 'all_appliances', label: 'all_appliance', icon: <WashingMachine size={32} color="#0c8182" /> },
            { id: 'tv', label: 'label_tv', icon: <Tv size={32} color="#0c8182" /> },
            { id: 'laptop', label: 'label_laptop', icon: <Laptop size={32} color="#0c8182" /> },
            { id: 'fridge', label: 'refrigerator', icon: <Refrigerator size={32} color="#0c8182" /> },
            { id: 'microwave', label: 'microwave', icon: <Microwave size={32} color="#0c8182" /> },
            { id: 'other_appliances', label: 'other_appliance', icon: <AlertCircle size={32} color="#94a3b8" /> }
        ]
    }
};


export const DEFAULT_CATEGORIES = [
    { id: 'all', label: 'all_services', icon: <Wind size={20} color="#64748b" /> },
    { id: 'ac', label: 'ac_service', icon: <Snowflake size={20} color="#0c8182" /> },
    { id: 'cleaning', label: 'cleaning', icon: <SprayCan size={20} color="#0c8182" /> },
    { id: 'painting', label: 'painting', icon: <Palette size={20} color="#0c8182" /> },
    { id: 'electrician', label: 'electrician', icon: <Zap size={20} color="#0c8182" /> },
    { id: 'plumbing', label: 'plumbing', icon: <Droplet size={20} color="#0c8182" /> },
    { id: 'carpenter', label: 'carpenter', icon: <Hammer size={20} color="#0c8182" /> },
    { id: 'appliances', label: 'appliance', icon: <WashingMachine size={20} color="#0c8182" /> },
    { id: 'salon', label: 'salon', icon: <Scissors size={20} color="#0c8182" /> },
    { id: 'smartlock', label: 'smart_lock', icon: <Lock size={20} color="#0c8182" /> },
    { id: 'ro', label: 'ro_service', icon: <HeartPulse size={20} color="#0c8182" /> },
];
