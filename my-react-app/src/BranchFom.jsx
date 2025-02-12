import { useState, useEffect } from "react";
import axios from "axios";

const BranchForm = () => {
  const [branchName, setBranchName] = useState("");
  const [branchLocation, setBranchLocation] = useState("");
  const [branchLogo, setBranchLogo] = useState(null);
  const [branches, setBranches] = useState([]);

  // Fetch all branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Function to fetch all branches
  const fetchBranches = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/getAllBranches");
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error.response?.data || error.message);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("branchName", branchName);
    formData.append("branchLocation", branchLocation);
    formData.append("branchLogo", branchLogo);

    try {
      await axios.post("http://localhost:5001/api/createBranch", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Branch added successfully!");
      fetchBranches(); // Refresh branch list
    } catch (error) {
      console.error("Error adding branch:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-4">Create Branch</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block">Branch Name</label>
          <input
            type="text"
            className="w-full p-2 border"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block">Branch Location</label>
          <input
            type="text"
            className="w-full p-2 border"
            value={branchLocation}
            onChange={(e) => setBranchLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block">Branch Logo</label>
          <input
            type="file"
            className="w-full p-2 border"
            onChange={(e) => setBranchLogo(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>

      <h2 className="text-lg font-semibold mt-6">Branches</h2>
      <ul>
        {branches.map((branch) => (
          <li key={branch._id} className="p-2 border-b"><span>Branch Name--</span>{branch.branchName} <br/><span>Branch Location--</span>{branch.branchLocation}</li>
        ))}
      </ul>
    </div>
  );
};

export default BranchForm;
