async function setupStorage() {
  const { data: buckets } = await supabase.storage.listBuckets()
  
  if (!buckets?.find(bucket => bucket.name === 'room-images')) {
    const { error } = await supabase.storage.createBucket('room-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    })
    
    if (error) {
      console.error('Error creating bucket:', error)
    }
  }
} 