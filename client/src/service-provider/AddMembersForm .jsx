import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const AddMembersForm = () => {
    const { id } = useParams();
    const vendorId = id;
    const [members, setMembers] = useState([]); // State to hold members
    const [loading,setLoading] = useState(false)

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
        updatedMembers[index].memberAdharImage = event.target.files[0]; // Just store the first file
        setMembers(updatedMembers);
    };

    // Function to add a new member input field
    const addMemberField = () => {
        setMembers([...members, { name: '', memberAdharImage: null }]);
    };

    // Function to remove a member input field
    const removeMemberField = (index) => {
        const updatedMembers = members.filter((_, i) => i !== index); // Remove member at the specified index
        setMembers(updatedMembers);
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        const formData = new FormData();
        

        // Loop through members and append each file under the correct name
        members.forEach((member, index) => {
            formData.append(`members[${index}][name]`, member.name);
            if (member.memberAdharImage) {
                formData.append(`memberAdharImage`, member.memberAdharImage); // Append file under 'memberAdharImage'
            }
        });

        try {
            const response = await axios.post(
                `http://localhost:7000/api/v1/register-vendor-member/${vendorId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toast.success(response.data.message); // Success message
            setMembers([]); // Clear form
            window.location.href = `/membership-plan/${vendorId}`
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.message || 'Error occurred');
        }finally{
            setLoading(false)
        }
    };

    return (
        <>
        <Toaster />
            <section className="gray">
                <div className="container">
                    <div className="row align-items-start justify-content-center">
                        <div className="col-xl-6 col-lg-8 col-md-12">
                            <div className="signup-screen-wrap">
                                <div className="signup-screen-single light">
                                    <div className="text-center mb-4">
                                        <h4 className="m-0 fw-bold">Add Members</h4>
                                    </div>
                                    <form className="submit-form" onSubmit={handleSubmit}>
                                        {members.map((member, index) => (
                                            <div className='row mt-2' key={index}>
                                                <h4>Member {index + 1}</h4>
                                                <div className='col-6'>
                                                    <label className=''>Name:</label> <br />
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
                                                    <input
                                                        className='form-control'
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(index, e)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-12 text-right mt-2">
                                                    <button
                                                        type="button"
                                                        className='btn btn-danger btn-sm'
                                                        onClick={() => removeMemberField(index)}
                                                    >
                                                        Remove Member
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="form-group mt-4">
                                            <button type="button" className='btn btn-md full-width theme-bg text-light rounded ft-medium' onClick={addMemberField}>
                                                Add Another Member
                                            </button>
                                        </div>
                                        <div className="form-group">
                                        <button type="submit" className="btn btn-md full-width theme-bg text-light rounded ft-medium" disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AddMembersForm;
