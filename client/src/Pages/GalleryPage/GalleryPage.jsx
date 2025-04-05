import React, { useEffect, useState } from 'react';
import './GalleryPage.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import MetaTag from '../../Components/Meta/MetaTag';

function GalleryPage() {
    const [images, setImages] = useState([]);
    const [galleryNames, setGalleryNames] = useState([]);
    const [modalImage, setModalImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const fetchGalleryName = async () => {
        try {
            const res = await axios.get('http://localhost:7987/api/v1/get-all-gallery-category-name');
            setGalleryNames(res.data.data);
        } catch (error) {
            console.error("Error fetching gallery names:", error);
        }
    };

    const fetchImages = async () => {
        try {
            const res = await axios.get('http://localhost:7987/api/v1/get-all-gallery-image');
            setImages(res.data.data);
        } catch (error) {
            console.error("Error fetching gallery images:", error);
        }
    };

    useEffect(() => {
        fetchGalleryName();
        fetchImages();
    }, []);

    const handleImageClick = (imageUrl) => {
        setModalImage(imageUrl);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalImage(null);
    };

    return (
        <>
        <MetaTag title={'Blueace india gallery'} />
            <div className="gallery-section">
                <div className="gallery-container container">
                    <ul className="nav nav-tabs forbg" id="galleryTab" role="tablist">
                        {galleryNames.map((gallery, index) => (
                            <li className="nav-item" role="presentation" key={gallery._id}>
                                <button
                                    className={`nav-link forbtbg ${activeTab === index ? 'active' : ''}`}
                                    onClick={() => setActiveTab(index)}
                                    aria-controls={`gallery-tab-${index}`}
                                    role="tab"
                                    aria-selected={activeTab === index}
                                >
                                    {gallery.name}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="tab-content mt-4" id="galleryTabContent">
                        {galleryNames.map((gallery, index) => (
                            <div
                                className={`tab-pane fade ${activeTab === index ? 'show active' : ''}`}
                                id={`gallery-tab-${index}`}
                                role="tabpanel"
                                key={gallery._id}
                            >
                                <div className="row">
                                    {images
                                        .filter(image => image.galleryCategoryId._id === gallery._id)
                                        .map((filteredImage, imageIndex) => (
                                            <div className="col-md-3 mb-4 galleryImage" key={filteredImage._id}>
                                                <img
                                                    src={filteredImage.image.url}
                                                    alt={`Gallery ${imageIndex}`}
                                                    onClick={() => handleImageClick(filteredImage.image.url)}
                                                    className="img-fluid"
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Image Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalImage && <img src={modalImage} alt="Preview" className="img-fluid" />}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default GalleryPage;
