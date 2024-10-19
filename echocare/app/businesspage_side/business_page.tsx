"use client"

import React, { useState, useEffect } from 'react';
import { Button as MovingBorderButton } from '../components/ui/moving-border';
import FoodDonationForm from '../components/form';
import { Modal, Card, Row, Col, Image, message } from 'antd';
import { addDonation, getDonations } from '../actions';

interface DonationItem {
  id: number;
  restaurant_name: string;
  food_name: string;
  food_category: string;
  quantity: number;
  description: string;
  photo_url?: string;
}

const BusinessPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [donations, setDonations] = useState<DonationItem[]>([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const result = await getDonations();
    if (result.success && Array.isArray(result.donations)) {
      setDonations(result.donations as DonationItem[]);
    } else {
      message.error(`Failed to fetch donations: ${result.error || 'Unknown error'}`);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      console.log('Submitting form with values:', values);
      const result = await addDonation(values);
      console.log('Received result from addDonation:', result);
      if (result.success) {
        message.success('Donation added successfully!');
        setIsModalVisible(false);
        fetchDonations(); // Refresh the donations list
      } else {
        console.error('Server returned error:', result.error);
        message.error(`Failed to add donation: ${result.error}`);
      }
    } catch (error) {
      console.error('Client-side error:', error);
      message.error(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className='flex flex-col items-center mt-10 mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold text-center mb-8'>
            Welcome, Sajj Mediterranean
          </h1>
          <p className="text-xl text-center mb-10 text-gray-300">
            Ready to donate some food? Click the button below to get started!
          </p>
          <MovingBorderButton
            borderRadius="1.75rem"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 px-6"
            onClick={showModal}
          >
            Add Product
          </MovingBorderButton>
        </div>

        <Modal
          title="Donate Food"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <FoodDonationForm onSubmit={handleFormSubmit} />
        </Modal>

        <Row gutter={[16, 16]}>
          {donations.map((donation) => (
            <Col xs={24} sm={12} md={8} lg={6} key={donation.id}>
              <Card
                hoverable
                cover={donation.photo_url && (
                  <div style={{ height: 200, overflow: 'hidden' }}>
                    <Image
                      alt={donation.food_name}
                      src={donation.photo_url}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                className="bg-slate-800 text-white border-slate-700"
              >
                <Card.Meta
                  title={<span className="text-white">{donation.food_name}</span>}
                  description={
                    <div className="text-gray-300">
                      <p>Category: {donation.food_category}</p>
                      <p>Quantity: {donation.quantity}</p>
                      <p>Description: {donation.description}</p>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default BusinessPage;
