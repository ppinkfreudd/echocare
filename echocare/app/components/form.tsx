import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

const { TextArea } = Input;

interface FoodDonationFormProps {
  onSubmit: (values: any) => void;
}

const FoodDonationForm: React.FC<FoodDonationFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    const formData = { ...values, photo: imageUrl };
    console.log('Form values:', formData);
    await onSubmit(formData);
    form.resetFields();
    setImageUrl(null);
  };

  const foodCategories = [
    'Fruits and Vegetables',
    'Baked Goods',
    'Prepared Meals',
    'Dairy Products',
    'Canned Goods',
    'Other',
  ];

  const handleImageUpload: UploadProps['onChange'] = (info) => {
    console.log('Upload info:', info);
    const file = info.file.originFileObj;
    console.log('File object:', file);

    if (!file) {
      console.error('File object is undefined');
      message.error('Failed to process the uploaded image. Please try again.');
      return;
    }

    if (!(file instanceof File)) {
      console.error('Invalid file object:', file);
      message.error('Invalid file type. Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setImageUrl(e.target.result);
      } else {
        console.error('FileReader result is not a string:', e.target?.result);
        message.error('Failed to read the image file. Please try again.');
      }
    };
    reader.onerror = (e) => {
      console.error('FileReader error:', e);
      message.error('An error occurred while reading the file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <Form
      form={form}
      name="foodDonationForm"
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="restaurantName"
        label="Restaurant Name"
        rules={[{ required: true, message: 'Please enter the restaurant name' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: 'Please enter the address' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="foodName"
        label="Food Name"
        rules={[{ required: true, message: 'Please enter the food name' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="foodCategory"
        label="Food Category"
        rules={[{ required: true, message: 'Please select a food category' }]}
      >
        <Select>
          {foodCategories.map((category) => (
            <Select.Option key={category} value={category}>
              {category}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="quantity"
        label="Quantity"
        rules={[{ required: true, message: 'Please enter the quantity' }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please provide a description' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="photo"
        label="Upload Photo"
        valuePropName="file"
      >
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false}
          onChange={handleImageUpload}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="uploaded" style={{ width: '100%' }} />
          ) : (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Donation
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FoodDonationForm;
