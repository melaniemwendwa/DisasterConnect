"""
Cloudinary configuration and utilities for image upload
"""
import cloudinary
import cloudinary.uploader
import os

# Configure Cloudinary - strip whitespace to avoid invisible characters
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME', '').strip(),
    api_key=os.environ.get('CLOUDINARY_API_KEY', '').strip(),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET', '').strip(),
    secure=True
)

def upload_image_to_cloudinary(image_file, folder="disaster_reports"):
    """
    Upload an image to Cloudinary
    
    Args:
        image_file: File object from request.files
        folder: Cloudinary folder name (optional)
    
    Returns:
        dict: {'url': 'https://...', 'public_id': '...'}
        or None if upload fails
    """
    try:
        # Verify Cloudinary is configured
        if not is_cloudinary_configured():
            print("❌ Cloudinary not configured! Missing environment variables.")
            return None
        
        print(f"📤 Attempting Cloudinary upload to folder: {folder}")
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            image_file,
            folder=folder,
            resource_type="auto",  # Auto-detect image type
            transformation=[
                {'width': 1200, 'height': 1200, 'crop': 'limit'},  # Max size
                {'quality': 'auto'},  # Auto optimize quality
                {'fetch_format': 'auto'}  # Auto format (WebP when supported)
            ]
        )
        
        print(f"☁️ Cloudinary upload SUCCESS: {result['secure_url']}")
        print(f"   Public ID: {result['public_id']}")
        print(f"   Format: {result.get('format', 'unknown')}")
        print(f"   Size: {result.get('bytes', 0)} bytes")
        
        return {
            'url': result['secure_url'],
            'public_id': result['public_id']
        }
    except Exception as e:
        print(f"❌ Cloudinary upload FAILED!")
        print(f"   Error type: {type(e).__name__}")
        print(f"   Error message: {str(e)}")
        import traceback
        print(f"   Traceback: {traceback.format_exc()}")
        return None

def delete_image_from_cloudinary(public_id):
    """
    Delete an image from Cloudinary
    
    Args:
        public_id: Cloudinary public_id of the image
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        print(f"🗑️ Cloudinary delete: {public_id} - {result}")
        return result.get('result') == 'ok'
    except Exception as e:
        print(f"❌ Cloudinary delete failed: {str(e)}")
        return False

def is_cloudinary_configured():
    """Check if Cloudinary credentials are configured"""
    return all([
        os.environ.get('CLOUDINARY_CLOUD_NAME'),
        os.environ.get('CLOUDINARY_API_KEY'),
        os.environ.get('CLOUDINARY_API_SECRET')
    ])
