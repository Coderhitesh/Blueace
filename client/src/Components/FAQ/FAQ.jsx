import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FAQ() {
  const [faqBanner, setFaqBanner] = useState([]);
  const [faqContent, setFaqContent] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null); // To track the active accordion item

  const fetchFaqBanner = async () => {
    try {
      const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-faq-banner');
      const data = res.data.data;
      const filterData = data.filter((item) => item.active === true);
      setFaqBanner(filterData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFaqContent = async () => {
    try {
      const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-faq-content');
      const data = res.data.data;
      setFaqContent(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFaqContent();
    fetchFaqBanner();
  }, []);

  const toggleAccordion = (index) => {
    // If the clicked item is already active, close it; otherwise, open it
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      {/* =========================== FAQ Start ======================= */}
      <section className='faq-top'>
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12">
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-6 col-md-12 col-12">
              <div className="faq-image">
                {faqBanner && faqBanner.slice(0, 1).map((item, index) => (
                  <img key={index} src={item.bannerImage?.url} alt="faq-img" className="rounded img-fluid" />
                ))}
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-12">
              <div className="sec_title position-relative mb-4">
                <h6 className="theme-cl">Ask Questions</h6>
                <h2 className="ft-bold">Frequently Asked Questions</h2>
              </div>

              <div id="accordion2" className="accordion">
                {faqContent && faqContent.map((item, index) => (
                  <div className="card" key={index}>
                    <div className="card-header" id={`h${index}`}>
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link"
                          onClick={() => toggleAccordion(index)} // Toggle accordion on click
                          aria-expanded={activeIndex === index}
                          aria-controls={`ord${index}`}
                        >
                          {item.question}
                        </button>
                      </h5>
                    </div>

                    <div
                      id={`ord${index}`}
                      className={`collapse ${activeIndex === index ? 'show' : ''}`} // Apply 'show' class based on activeIndex
                      aria-labelledby={`h${index}`}
                      data-parent="#accordion2"
                    >
                      <div className="card-body">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =========================== FAQ End ===================== */}
    </>
  );
}

export default FAQ;
