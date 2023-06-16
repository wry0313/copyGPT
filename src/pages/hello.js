import { useState } from "react";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          // Handle the parsed data or perform further actions
        } else {
          console.error("Error uploading the file:", response.status);
        }
      } catch (error) {
        console.error("Error uploading the file:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file"  onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadForm;
