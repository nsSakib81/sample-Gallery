import React, { useState } from "react";

const ImageUpload = ({ onImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload({
          src: event.target.result,
          title: selectedFile.name,
          id: Date.now(), // Generate a unique ID
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="upload-container">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button className="upload-button" onClick={handleUpload}>
    Upload Image
  </button>
    </div>
  );
};

export default ImageUpload;
