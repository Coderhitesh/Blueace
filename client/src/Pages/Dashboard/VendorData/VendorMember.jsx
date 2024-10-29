import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VendorMember = ({ userData }) => {
  const userId = userData?._id;
  console.log("userid",userId)
  const [members, setMembers] = useState([]); // State to hold members
  const [loading, setLoading] = useState(false);

  // Function to handle input change for member details
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedMembers = [...members];
    updatedMembers[index][name] = value; // Update member's name
    setMembers(updatedMembers);
  };

  // Function to handle file upload for member Aadhar image
  const handleFileChange = (index, event) => {
    const updatedMembers = [...members];
    const file = event.target.files[0]; // Get the selected file
    updatedMembers[index].memberAdharImage = file; // Store the selected file
    updatedMembers[index].memberAdharImageUrl = URL.createObjectURL(file); // Create a local URL for preview
    setMembers(updatedMembers);
  };

  // Function to fetch existing member data
  const handleFetchExistingMember = async () => {
    try {
      const res = await axios.get(`https://api.blueace.co.in/api/v1/get-vendor-member/${userId}`);
      const existingMembers = res.data.data.map((member) => ({
        name: member.name || '',
        memberAdharImageUrl: member.memberAdharImage?.url || '', // For displaying the image URL
        memberAdharImage: null, // Keep the file input empty initially
        _id: member._id // Store the member ID to update later
      }));
      setMembers(existingMembers); // Set the existing members in state
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch existing members.');
    }
  };

  useEffect(() => {
    handleFetchExistingMember();
  }, [userId]);

  // Function to handle form submission for updating members
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      for (let index = 0; index < members.length; index++) {
        const member = members[index];
        const formData = new FormData();

        formData.append('name', member.name);

        // Only append the new file if it's been changed
        if (member.memberAdharImage) {
          formData.append('memberAdharImage', member.memberAdharImage); // Append updated file
        }

        // Update the member
        await axios.put(
          `https://api.blueace.co.in/api/v1/update-vendor-member/${userId}/${member._id}`, // Ensure userId and memberId are passed correctly
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      toast.success('Members updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update members.');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="goodup-dashboard-content">
        <div className="dashboard-tlbar d-block mb-5">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <h1 className="ft-medium">Members</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item text-muted"><a href="#">Home</a></li>
                  <li className="breadcrumb-item text-muted"><a href="/vendor-dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item"><a className="theme-cl">Members</a></li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        <div className="dashboard-widg-bar d-block">
          <form className="submit-form" onSubmit={handleSubmit}>
            {members.map((member, index) => (
              <div className="dashboard-list-wraps bg-white rounded mb-4" key={index}>
                <div className="dashboard-list-wraps-head br-bottom py-3 px-3">
                  <div className="dashboard-list-wraps-flx">
                    <h4 className="mb-0 ft-medium fs-md">
                      <i className="fa fa-user-check me-2 theme-cl fs-sm"></i>
                      {`Member ${index + 1}`}
                    </h4>
                  </div>
                </div>

                <div className="dashboard-list-wraps-body py-3 px-3">
                  <div className='row mt-2'>
                    <div className='col-6'>
                      <label>Name:</label>
                      <input
                        className='form-control rounded'
                        type="text"
                        name="name"
                        value={member.name}
                        onChange={(e) => handleInputChange(index, e)}
                        required
                      />
                    </div>
                    <div className='col-6'>
                      <label>Aadhar Image:</label>
                      {member.memberAdharImageUrl && (
                        <div>
                          <img
                            src={member.memberAdharImageUrl}
                            alt="Aadhar"
                            style={{ width: '100px', height: '100px' }}
                          />
                        </div>
                      )}
                      <input
                        className='form-control'
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(index, e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="row mt-4">
              <div className="col-md-12">
                <button type="submit" className="btn btn-md full-width theme-bg text-light rounded ft-medium" disabled={loading}>
                  {loading ? 'Loading...' : 'Update Members'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VendorMember;
