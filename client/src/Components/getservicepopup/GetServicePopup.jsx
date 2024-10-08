import React from 'react'

function GetServicePopup() {
    return (
        <>
            <button type="button" class="btn bg-primary text-light rounded mt-4 w-100" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">GET SERVICE</button>

            <div class="modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Get Enquiry</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body bg-light px-4 py-4">
                            <form action='' method='POST'>
                                <div className='row'>
                                    <div class="mb-3 col-lg-6">
                                        <label for="recipient-name" class="col-form-label">Name</label>
                                        <input type="text" value="" class="form-control" id="Name" />
                                    </div>
                                    <div class="mb-3 col-lg-6">
                                        <label for="recipient-name" class="col-form-label">Email</label>
                                        <input type="email" value="" class="form-control" id="email" />
                                    </div>
                                    <div class="mb-3 col-lg-6">
                                        <label for="recipient-name" class="col-form-label">Phone</label>
                                        <input type="tel" value="" class="form-control" id="Phone" />
                                    </div>
                                    <div class="mb-3 col-lg-6">
                                        <label for="recipient-name" class="col-form-label">Services</label>
                                        <select class="form-control">
                                                <option> ---Select Service--- </option>
                                                <option>Ac Uninstall</option>
                                                <option>Ac Install</option>
                                                <option>Gass Leackage</option>
                                                <option>Ac Not Working</option>
                                                <option> Ac Replacement</option>
                                                <option>Window Ac Service</option>
                                                <option>Split Ac Service</option>
                                        </select>
                                    </div>
                                    <div class="mb-3 col-lg-12">
                                        <label for="message-text" class="col-form-label">Message</label>
                                        <textarea class="form-control" rows={2}  id="message-text"></textarea>
                                    </div>
                                    <div class="mb-3 col-lg-12">
                                      <button type="button" class="btn btn-primary rounded">Send Message</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {/* <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Send message</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>


    )
}

export default GetServicePopup