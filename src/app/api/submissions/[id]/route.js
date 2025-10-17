// src/app/api/submissions/[id]/route.js
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status, notes } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('novacore');
    const collection = db.collection('submissions');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, notes } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}