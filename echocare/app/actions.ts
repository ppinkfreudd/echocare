"use server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:7OKSAkQbM3eW@ep-calm-thunder-a50akmtc.us-east-2.aws.neon.tech/neondb?sslmode=require');

interface DonationData { //Schema
  restaurantName: string;
  address: string;
  foodName: string;
  foodCategory: string;
  quantity: number;
  description: string;
  photo: string;
}

async function createTableIfNotExists() { //Creates table if not exists
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS food_donations (
        id SERIAL PRIMARY KEY,
        restaurant_name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        food_name VARCHAR(255) NOT NULL,
        food_category VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL,
        description TEXT,
        photo_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Table food_donations created or already exists');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

export async function addDonation(donationData: DonationData) { //POST request
  await createTableIfNotExists();
  
  const { restaurantName, address, foodName, foodCategory, quantity, description, photo } = donationData;
  
  try {
    console.log('Attempting to insert donation:', donationData);
    const result = await sql`
      INSERT INTO food_donations (restaurant_name, address, food_name, food_category, quantity, description, photo_url)
      VALUES (${restaurantName}, ${address}, ${foodName}, ${foodCategory}, ${quantity}, ${description}, ${photo})
      RETURNING id
    `;
    console.log('Insertion result:', result);
    
    if (result && result.length > 0 && 'id' in result[0]) {
      return { success: true, id: result[0].id };
    } else {
      throw new Error('Unexpected result structure');
    }
  } catch (error) {
    console.error('Failed to add donation:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getDonations() { //GET request
  await createTableIfNotExists();
  
  try {
    const donations = await sql`
      SELECT * FROM food_donations ORDER BY id DESC
    `;
    return { success: true, donations };
  } catch (error) {
    console.error('Failed to fetch donations:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
