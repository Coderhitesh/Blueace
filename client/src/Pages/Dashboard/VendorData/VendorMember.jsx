import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VendorMember = ({ userData }) => {
  const userId = userData?._id;
  const [members, setMembers] = useState([]); // State to hold members
  const [loading, setLoading] = useState(false);

  // Function to handle input change for member details
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedMembers = [...members];
    updatedMembers[index][name] = value;
    setMembers(updatedMembers);
  };

  // Function to handle file upload for member Aadhar image
  const handleFileChange = (index, event) => {
    const updatedMembers = [...members];
    const file = event.target.files[0];
    updatedMembers[index].memberAdharImage = file;
    updatedMembers[index].memberAdharImageUrl = URL.createObjectURL(file);
    setMembers(updatedMembers);
  };

  // Function to fetch existing member data
  const handleFetchExistingMember = async () => {
    try {
      const res = await axios.get(`https://api.blueaceindia.com/api/v1/get-vendor-member/${userId}`);
      const existingMembers = res.data.data.map((member) => ({
        name: member.name || '',
        memberAdharImageUrl: member.memberAdharImage?.url || '',
        memberAdharImage: null,
        _id: member._id
      }));
      setMembers(existingMembers);
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

        if (member.memberAdharImage) {
          formData.append('memberAdharImage', member.memberAdharImage);
        }

        await axios.put(
          `https://api.blueaceindia.com/api/v1/update-vendor-member/${userId}/${member._id}`,
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

  // Function to remove a member
  const handleRemoveMember = async (index, memberId) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this member?');
    if (!confirmDelete) return;

    try {
      // Optional: Send delete request to the backend
      if (memberId) {
        await axios.delete(`https://api.blueaceindia.com/api/v1/delete-vendor-member/${userId}/${memberId}`);
        toast.success('Member removed successfully!');
      }

      // Remove member from the state
      const updatedMembers = members.filter((_, i) => i !== index);
      setMembers(updatedMembers);
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member.');
    }
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
                  <div className="dashboard-list-wraps-flx d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 ft-medium fs-md">
                      <i className="fa fa-user-check me-2 theme-cl fs-sm"></i>
                      {`Member ${index + 1}`}
                    </h4>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveMember(index, member._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="dashboard-list-wraps-body py-3 px-3">
                  <div className="row mt-2">
                    <div className="col-6">
                      <label>Name:</label>
                      <input
                        className="form-control rounded"
                        type="text"
                        name="name"
                        value={member.name}
                        onChange={(e) => handleInputChange(index, e)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label>Aadhar Image:</label>
                      <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(index, e)}
                      />
                      {member.memberAdharImageUrl && (
                        <div className="mt-2">
                          <img
                            src={member.memberAdharImageUrl}
                            alt="Aadhar"
                            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                            data-bs-toggle="modal"
                            data-bs-target={`#aadharModal${index}`}
                          />
                        </div>
                      )}
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
