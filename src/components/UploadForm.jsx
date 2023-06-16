import { useState } from "react";

const UploadForm = ({handleSetContent}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSet, setIsSet] = useState(false);

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
          handleSetContent(data.content)
          setIsSet(true);
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
    <div className="border rounded shadow p-2">
    <form className=" flex flex-row w-[100%] justify-between" onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button className="shadow px-1 border rounded ml-3" type="submit">Submit</button>
    </form>
    {isSet ? (
        <p>Your training data is set successfully ✅</p>
      ) : (
        <p>Training data not set 🥱</p>
      )}
    </div>
  );
};

export default UploadForm;
