// src/app/api/submissions/route.js (VERCEL-READY VERSION)
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Add this function INSIDE the file but OUTSIDE the POST function
async function sendAdminNotification(formData) {
  try {
    console.log('📧 Sending admin notification...');
    
    // FIX: Use dynamic URL for Vercel compatibility
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
    
    // Get the content type
    const contentType = request.headers.get('content-type') || '';
    console.log('📨 Content-Type:', contentType);

    let name, address, phone, email, condition, reason, desiredAmount, images;

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (from your form with images)
      const formData = await request.formData();
      
      name = formData.get('name');
      address = formData.get('address');
      phone = formData.get('phone');
      email = formData.get('email');
      condition = formData.get('condition');
      reason = formData.get('reason');
      desiredAmount = formData.get('desiredAmount');
      images = formData.getAll('images');
      
      console.log('📝 FormData received - Images:', images);
    } else {
      // Handle JSON (fallback)
      const jsonData = await request.json();
      name = jsonData.name;
      address = jsonData.address;
      phone = jsonData.phone;
      email = jsonData.email;
      condition = jsonData.condition;
      reason = jsonData.reason;
      desiredAmount = jsonData.desiredAmount;
      images = jsonData.images || [];
      
      console.log('📝 JSON received');
    }

    // Validate required fields
    if (!name || !address || !phone || !email || !condition || !reason) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    let imageUrls = [];
    
    // Upload images to Cloudinary if available
    if (images && images.length > 0 && process.env.CLOUDINARY_CLOUD_NAME) {
      console.log('☁️ Uploading images to Cloudinary...');
      for (const imageFile of images) {
        if (imageFile instanceof File && imageFile.size > 0) {
          try {
            const imageUrl = await uploadToCloudinary(imageFile);
            imageUrls.push(imageUrl);
            console.log('✅ Image uploaded:', imageUrl);
          } catch (error) {
            console.error('❌ Image upload failed:', error);
          }
        }
      }
    }

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