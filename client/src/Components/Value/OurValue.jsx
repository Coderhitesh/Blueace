import React from 'react'
import Customer from './customer.png'
import Quality from './quality.png'
import Intigrity from './integrity.png'

export default function OurValue() {
    return (
        <>
            <section className='our-value-section'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-3'>
                            <div className='section-title'>
                                <h2 class={`ft-bold mb-3 text-white mt-2 ${window.innerWidth >= 992 ? 'pt-5' : ''}`}>Our Values </h2>
                                <p className='text-white'>At Blueace India Limited, our values emphasize integrity, innovation, customer focus, sustainability, and teamwork, driving excellence and lasting partnerships.</p>
                            </div>
                        </div>
                        <div className='col-lg-9'>
                            <div className='row text-center'>
                                <div className='col-lg-4'>
                                    <div className='info-box'>
                                        <div className="card">
                                            <img src={Customer} className="card-img-top ml-auto" alt="..." />
                                            <div className="card-body text-center">
                                                <h5 className="card-title fw-bold text-white">Customer First</h5>
                                                <p className="card-text text-white">Your comfort and satisfaction are our top priorities. We listen to your needs, offer honest advice, and deliver solutions that meet your expectations.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-4'>
                                    <div className='info-box'>
                                        <div className="card">
                                            <img src={Quality} className="card-img-top ml-auto" alt="..." />
                                            <div className="card-body text-center">
                                                <h5 className="card-title fw-bold text-white">Quality Workmanship</h5>
                                                <p className="card-text text-white">We use the latest technology and best practices to ensure every job is done right the first time. Our attention to detail and dedication to quality set us apart.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-4'>
                                    <div className='info-box'>
                                        <div className="card">
                                            <img src={Intigrity} className="card-img-top ml-auto" alt="..." />
                                            <div className="card-body text-center">
                                                <h5 className="card-title fw-bold text-white">Integrity</h5>
                                                <p className="card-text text-white">We believe in transparency and fairness. From clear pricing to reliable service, we are committed to building trust with every customer.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>

    )
}
