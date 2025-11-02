// src/components/ImageUpload.jsx
import { useState } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';

const cld = new Cloudinary({ cloud: { cloudName: 'dbqapcw0r' } });

export default function ImageUpload({ onImageUploaded }) {
  const [preview, setPreview] = useState(null);
  const [publicId, setPublicId] = useState(null);

  async function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));   // preview local

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'yamaha_products');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dbqapcw0r/image/upload`,
      { method: 'POST', body: formData }
    );

    const data = await res.json();
    console.log('Cloudinary answer:', data); // 👈 respuesta completa

    if (!res.ok) {
      console.error('Error subiendo a Cloudinary:', data);
      return;
    }

    const imageUrl = data.secure_url;
    setPreview(null);
    setPublicId(data.public_id);
    onImageUploaded(imageUrl); // devolvemos la URL al padre
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yamaha-blue file:text-white hover:file:bg-yamaha-dark"
      />
      {preview && (
        <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg" />
      )}
      {publicId && (
        <AdvancedImage
          cldImg={cld.image(publicId).resize(fill().width(300).height(300))}
          className="w-48 h-48 object-cover rounded-lg"
        />
      )}
    </div>
  );
}