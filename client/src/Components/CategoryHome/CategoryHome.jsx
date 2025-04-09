import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';
import "./style.css"

function CategoryHome() {
  const [allSubCategory, setSubCategory] = useState([])

  const fetchData = async () => {
    try {
      const res = await axios.get('https://api.blueaceindia.com/api/v1/get-all-service-category')
      const data = res.data.data
      console.log(data)
      const filterData = data.filter((item) => item?.mainCategoryId?.name === 'AC')
      setSubCategory(filterData)
    } catch (error) {
      console.log('Internal server error in fetching subcategory', error)
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      {/* <!-- ======================= Listing Categories ======================== --> */}
      <section className="space min category-top-p">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="sec_title position-relative text-center mb-5">
                {/* <h6 className="mb-0 theme-cl">Categories</h6> */}
                <h2 className="ft-bold">Our Services</h2>
              </div>
            </div>
          </div>

          {/* <!-- row --> */}
          <div className="hbs-box pb-4">
            {allSubCategory && allSubCategory.map((category, index) => (
              <div
                key={index}
                className="hbs-inner-box"
              >
                <div className="cats-wrap text-center">
                  <Link to={`/service/${category.name.replace(/\s+/g, '-').toLowerCase()}`} className="Goodup-catg-wrap">
                    <div className="Goodup-catg-icon">
                      {/* <i className={`fas ${category.icon}`}></i> */}
                      <img style={{ width: '70%', height: '70%', objectFit: 'cover' }} src={category?.icon?.url} alt="" />
                    </div>
                    <div className="Goodup-catg-caption">
                      <Link to={`/service/${category.name.replace(/\s+/g, '-').toLowerCase()}`} className="services-box-title mb-3 ft-medium m-catrio">
                        {category.name}
                      </Link>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

export default CategoryHome;
