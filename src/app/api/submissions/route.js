// src/app/api/submissions/route.js (UPDATED FOR CLOUDINARY DIRECT UPLOAD)
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Keep this notification function
async function sendAdminNotification(formData) {
  try {
    console.log('📧 Sending admin notification...');
    
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const result = await response.json();
    console.log('📧 Notification result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Notification error:', error);
    return { success: false, error: error.message };
  }
}

export async function POST(request) {
  try {
    console.log('🔧 API Route: Processing submission...');
    
    // Now we ONLY receive JSON with image URLs (no more FormData)
    const jsonData = await request.json();
    console.log('📥 Raw data received:', jsonData);  // Debug log
    
    const {
      name,
      address,
      phone,
      email,
      condition,
      reason,
      desiredAmount,
      images, // ← Already Cloudinary URLs from frontend
    } = jsonData;

    console.log('📸 Images received:', images);  // Debug log
    console.log('📸 Images count:', images?.length || 0);  // Debug log

    // Validate required fields
    if (!name || !address || !phone || !email || !condition || !reason) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Images are already uploaded - just use the URLs!
    const imageUrls = images || [];
    console.log('💾 Image URLs to save:', imageUrls);  // Debug log

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db('novacore');
    const collection = db.collection('submissions');

    const submissionData = {
      name,
      address,
      phone,
      email,
      condition,
      reason,
      desiredAmount: desiredAmount || 'Not specified',
      images: imageUrls,
      status: 'pending',
      submitted_at: new Date()
    };

    console.log('💾 Full submission data to save:', submissionData);  // Debug log
    console.log('💾 Saving to MongoDB...');
    
    const result = await collection.insertOne(submissionData);

    console.log('🎉 Submission saved successfully! ID:', result.insertedId);

    // Send notification to admin
    await sendAdminNotification({
      name,
      address, 
      phone,
      email,
      desiredAmount: desiredAmount || 'Not specified',
      condition
    });

    console.log('✅ Notification process completed');
    
    return NextResponse.json({ 
      success: true, 
      message: `Submission received successfully${imageUrls.length > 0 ? ` with ${imageUrls.length} images` : ''}`,
      data: { id: result.insertedId }
    });

  } catch (error) {
    console.error('💥 API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// GET method (unchanged)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('novacore');
    const collection = db.collection('submissions');

    const submissions = await collection.find({}).sort({ submitted_at: -1 }).toArray();

    const serializedSubmissions = submissions.map(submission => ({
      ...submission,
      _id: submission._id.toString(),
      id: submission._id.toString()
    }));

    return NextResponse.json({ 
      success: true, 
      data: serializedSubmissions 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
