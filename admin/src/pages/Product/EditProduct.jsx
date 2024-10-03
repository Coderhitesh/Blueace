import React, { useState, useRef, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import JoditEditor from 'jodit-react';
import axios from 'axios'
import Loader from '../../components/loader/Loader';

const EditProduct = () => {
    const [categoryData, setCategoryData] = useState([])
    const url = new URLSearchParams(window.location.search)
    const id = url.get('id')
    const editor = useRef(null);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        ProductName: '',
        Category: '',
        DetailsDataL: '',
        BrandName: '',
        SuitedFor: '',
        Flavours: '',
        BreedSize: '',
        ItemForm: '',
        PetType: '',
        inStock: false,
        PackSizes: [],
        imageUpdateData: [
            {
                publicId: ''
            }

        ],
        alreadyUploadImages: [],
        imagesForUpload: []
    });

    const fetchCategory = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/Product/Get-All-category`);
            console.log(response.data.data)
            if (response.data.data) {
                setCategoryData(response.data.data)
            } else {
                toast.error("No Category Found")
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Get-Single-Product
    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/Product/Get-Single-Product/${id}`);
            const dataFormUrl = data.data
            console.log(dataFormUrl)
            setFormData({
                ProductName: dataFormUrl?.ProductName || '',
                Category: categoryData.find(item => item._id === dataFormUrl?.Category?._id)?.CategoryTitle || '',
                DetailsDataL: dataFormUrl?.DetailsData || '',
                BrandName: dataFormUrl?.BrandName || '',
                SuitedFor: dataFormUrl?.SuitedFor || '',
                Flavours: dataFormUrl?.Flavours || '',
                BreedSize: dataFormUrl?.BreedSize || '',
                ItemForm: dataFormUrl?.ItemForm || '',
                PetType: dataFormUrl?.PetType || '',
                inStock: dataFormUrl?.inStock || false,
                PackSizes: dataFormUrl?.PackSizes?.map((item) => ({
                    WeightAndPack: item.WeightAndPack || '',
                    MrpPrice: item.MrpPrice || '',
                    DiscountPrize: item.DiscountPrize || '',
                    SizeStock: item.SizeStock || '',
                    SizeAvailable: item.SizeAvailable || false
                })) || [],
                alreadyUploadImages: dataFormUrl.ProductImages.map((item) => (
                    { image: item.ImageUrl, publicId: item.PublicId }
                ))

            });

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchCategory()
        fetchProduct()
    }, [id])


    const config = useMemo(
        () => ({
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        }),
        []
    );

    // Handle changes in the form fields
    const handleChange = (e, PublicId) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else if (type === 'file' && name === 'images') {
            // If it's the images field, handle the uploads
            const updatedImageData = {
                publicId: PublicId,
            };

            // Update imageUpdateData to include the new publicId
            setFormData((prevFormData) => ({
                ...prevFormData,
                imageUpdateData: [...(prevFormData.imageUpdateData || []), updatedImageData],
                imagesForUpload: [...(prevFormData.imagesForUpload || []), ...Array.from(files)], // Ensure this is always an array
            }));
            console.log(formData)
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    // Add new pack size
    const addPackSize = () => {
        setFormData({
            ...formData,
            PackSizes: [...formData.PackSizes, { WeightAndPack: '', MrpPrice: '', DiscountPrize: '', SizeStock: '', SizeAvailable: false }]
        });
    };

    // Remove a pack size
    const removePackSize = (index) => {
        const updatedPackSizes = formData.PackSizes.filter((_, i) => i !== index);
        setFormData({ ...formData, PackSizes: updatedPackSizes });
    };



    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // setLoading(true); // Uncomment if using loading state
        console.log("I am Hit")
        const newErrors = {};

        // Validate required fields
        if (!formData.ProductName) newErrors.ProductName = 'Product name is required.';
        if (!formData.Category) newErrors.Category = 'Category is required.';
        if (!formData.BrandName) newErrors.BrandName = 'Brand name is required.';
        if (!formData.SuitedFor) newErrors.SuitedFor = 'Suited for is required.';
        if (!formData.Flavours) newErrors.Flavours = 'Flavours are required.';
        if (!formData.BreedSize) newErrors.BreedSize = 'Breed size is required.';
        if (!formData.ItemForm) newErrors.ItemForm = 'Item form is required.';
        if (!formData.PetType) newErrors.PetType = 'Pet type is required.';
        if (!formData.DetailsDataL) newErrors.DetailsDataL = 'Product details are required.';

        // Validate Pack Sizes
        formData.PackSizes.forEach((size, index) => {
            if (!size.WeightAndPack) newErrors[`PackSizes_${index}_WeightAndPack`] = 'Weight and pack is required.';
            if (size.MrpPrice === '' || size.MrpPrice <= 0) newErrors[`PackSizes_${index}_MrpPrice`] = 'MRP Price must be a positive number.';
            if (size.DiscountPrize === '' || size.DiscountPrize < 0) newErrors[`PackSizes_${index}_DiscountPrize`] = 'Discount Price must be a non-negative number.';
            if (size.SizeStock === '' || size.SizeStock < 0) newErrors[`PackSizes_${index}_SizeStock`] = 'Size Stock must be a non-negative number.';
        });

        if (Object.keys(newErrors).length) {
            // Convert the newErrors object into a string
            const errorMessage = Object.values(newErrors).join(', ');
            
            // Display the error message in the toast notification
            toast.error(errorMessage);
            
            // Set the errors to display them in the form if needed
            setErrors(newErrors);
            
            return;
        }
        
        // Create FormData and append validated data
        const newData = new FormData();
        newData.append('ProductName', formData.ProductName);
        newData.append('Category', formData.Category);
        newData.append('BrandName', formData.BrandName);
        newData.append('SuitedFor', formData.SuitedFor);
        newData.append('Flavours', formData.Flavours);
        newData.append('BreedSize', formData.BreedSize);
        newData.append('ItemForm', formData.ItemForm);
        newData.append('PetType', formData.PetType);
        newData.append('DetailsData', formData.DetailsDataL);

        // Append Pack Sizes
        formData.PackSizes.forEach((size, index) => {
            newData.append(`PackSizes[${index}][WeightAndPack]`, size.WeightAndPack);
            newData.append(`PackSizes[${index}][MrpPrice]`, size.MrpPrice);
            newData.append(`PackSizes[${index}][DiscountPrize]`, size.DiscountPrize);
            newData.append(`PackSizes[${index}][SizeStock]`, size.SizeStock);
        });

        // Append images for upload
        if (Array.isArray(formData.imagesForUpload) && formData.imagesForUpload.length > 0) {
            Array.from(formData.imagesForUpload).forEach((file) => {
                newData.append('images', file);
            });
        }

        // Add imagesToUpdate if exists
        if (formData.imageUpdateData) {
            newData.append('imagesToUpdate', JSON.stringify(formData.imageUpdateData));
        }

        // for (const [key, value] of newData.entries()) {
        //     console.log(key, value);
        // }

        try {
            // API call to update product
           const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/Product/Update-Product?productId=${id}`,
                newData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log(res.data)
            setLoading(false);
            toast.success('Product updated successfully!');
            setErrors({});
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
            setErrors({ global: error.message });
            setLoading(false);
        } finally {
            setLoading(false); // Ensure loading state is reset
        }
    };



    // Handle Jodit Editor change
    const handleEditorChange = (newContent) => {
        setFormData({ ...formData, DetailsDataL: newContent });
    };

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            <div className="page-body">
                <div className="container-fluid">
                    <div className="page-title">
                        <div className="row">
                            <div className="col-sm-6 col-12">
                                <h2>Edit Create</h2>
                            </div>
                            <div className="col-sm-6 col-12">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="index.html"><i className="iconly-Home icli svg-color"></i></a></li>
                                    <li className="breadcrumb-item">Product</li>
                                    <li className="breadcrumb-item active">Product Edit</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form className="form theme-form basic-form" onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <h5 className="f-w-600 mb-2">Product Name</h5>
                                                    <input
                                                        className={`form-control ${errors.ProductName ? 'border-danger' : ''}`}
                                                        type="text"
                                                        placeholder="Product name *"
                                                        name="ProductName"
                                                        value={formData.ProductName}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.ProductName && <div className="invalid-feedback d-block">{errors.ProductName}</div>}
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <h5 className="f-w-600 mb-2">Category</h5>
                                                    <select
                                                        className={`form-select ${errors.Category ? 'border-danger' : ''}`}
                                                        name="Category"
                                                        value={formData.Category}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">{formData.Category || 'Select Your Category'}</option>
                                                        {categoryData.map((category) => (
                                                            <option key={category.id} value={category._id}>
                                                                {category.CategoryTitle}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.Category && <div className="invalid-feedback d-block">{errors.Category}</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <h5 className="f-w-600 mb-2">Brand Name</h5>
                                                    <input
                                                        className={`form-control ${errors.BrandName ? 'border-danger' : ''}`}
                                                        type="text"
                                                        placeholder="Brand name *"
                                                        name="BrandName"
                                                        value={formData.BrandName}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.BrandName && <div className="invalid-feedback d-block">{errors.BrandName}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <h5 className="f-w-600 mb-2">Suited For</h5>
                                                    <input
                                                        className={`form-control ${errors.SuitedFor ? 'border-danger' : ''}`}
                                                        type="text"
                                                        placeholder="Suited for *"
                                                        name="SuitedFor"
                                                        value={formData.SuitedFor}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.SuitedFor && <div className="invalid-feedback d-block">{errors.SuitedFor}</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <h5 className="f-w-600 mb-2">Flavours</h5>
                                                    <input
                                                        className={`form-control ${errors.Flavours ? 'border-danger' : ''}`}
                                                        type="text"
                                                        placeholder="Flavours *"
                                                        name="Flavours"
                                                        value={formData.Flavours}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.Flavours && <div className="invalid-feedback d-block">{errors.Flavours}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <h5 className="f-w-600 mb-2">Breed Size</h5>
                                                    <input
                                                        className={`form-control ${errors.BreedSize ? 'border-danger' : ''}`}
                                                        type="text"
                                                        placeholder="Breed size *"
                                                        name="BreedSize"
                                                        value={formData.BreedSize}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.BreedSize && <div className="invalid-feedback d-block">{errors.BreedSize}</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <h5 className="f-w-600 mb-2">Item Form</h5>
                                                    <input
                                                        className={`form-control ${errors.ItemForm ? 'border-danger' : ''}`}
                                                        type="text"
                                                        placeholder="Item form *"
                                                        name="ItemForm"
                                                        value={formData.ItemForm}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.ItemForm && <div className="invalid-feedback d-block">{errors.ItemForm}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <h5 className="f-w-600 mb-2">Pet Type</h5>
                                                    <input
                                                        className={`form-control ${errors.PetType ? 'border-danger' : ''}`}
                                                        type="text"
                                                        placeholder="Pet type *"
                                                        name="PetType"
                                                        value={formData.PetType}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.PetType && <div className="invalid-feedback d-block">{errors.PetType}</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col">
                                                <h5 className="f-w-600 mb-2">Pack Sizes</h5>
                                                {formData.PackSizes.map((size, index) => (
                                                    <div key={index} className="row mb-3">
                                                        <div className="col-md-6">
                                                            <input
                                                                className={`form-control mb-2 ${errors[`PackSizes_${index}_WeightAndPack`] ? 'border-danger' : ''}`}
                                                                type="text"
                                                                placeholder="Weight and Pack"
                                                                value={size.WeightAndPack}
                                                                onChange={(e) => {
                                                                    const updatedPackSizes = [...formData.PackSizes];
                                                                    updatedPackSizes[index].WeightAndPack = e.target.value;
                                                                    setFormData({ ...formData, PackSizes: updatedPackSizes });
                                                                }}
                                                            />
                                                            {errors[`PackSizes_${index}_WeightAndPack`] && <div className="invalid-feedback d-block">{errors[`PackSizes_${index}_WeightAndPack`]}</div>}
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input
                                                                className={`form-control mb-2 ${errors[`PackSizes_${index}_MrpPrice`] ? 'border-danger' : ''}`}
                                                                type="number"
                                                                placeholder="MRP Price"
                                                                value={size.MrpPrice}
                                                                onChange={(e) => {
                                                                    const updatedPackSizes = [...formData.PackSizes];
                                                                    updatedPackSizes[index].MrpPrice = e.target.value;
                                                                    setFormData({ ...formData, PackSizes: updatedPackSizes });
                                                                }}
                                                            />
                                                            {errors[`PackSizes_${index}_MrpPrice`] && <div className="invalid-feedback d-block">{errors[`PackSizes_${index}_MrpPrice`]}</div>}
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input
                                                                className={`form-control mb-2 ${errors[`PackSizes_${index}_DiscountPrize`] ? 'border-danger' : ''}`}
                                                                type="number"
                                                                placeholder="Discount Price"
                                                                value={size.DiscountPrize}
                                                                onChange={(e) => {
                                                                    const updatedPackSizes = [...formData.PackSizes];
                                                                    updatedPackSizes[index].DiscountPrize = e.target.value;
                                                                    setFormData({ ...formData, PackSizes: updatedPackSizes });
                                                                }}
                                                            />
                                                            {errors[`PackSizes_${index}_DiscountPrize`] && <div className="invalid-feedback d-block">{errors[`PackSizes_${index}_DiscountPrize`]}</div>}
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input
                                                                className={`form-control mb-2 ${errors[`PackSizes_${index}_SizeStock`] ? 'border-danger' : ''}`}
                                                                type="number"
                                                                placeholder="Size Stock"
                                                                value={size.SizeStock}
                                                                onChange={(e) => {
                                                                    const updatedPackSizes = [...formData.PackSizes];
                                                                    updatedPackSizes[index].SizeStock = e.target.value;
                                                                    setFormData({ ...formData, PackSizes: updatedPackSizes });
                                                                }}
                                                            />
                                                            {errors[`PackSizes_${index}_SizeStock`] && <div className="invalid-feedback d-block">{errors[`PackSizes_${index}_SizeStock`]}</div>}
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={size.SizeAvailable}
                                                                onChange={(e) => {
                                                                    const updatedPackSizes = [...formData.PackSizes];
                                                                    updatedPackSizes[index].SizeAvailable = e.target.checked;
                                                                    setFormData({ ...formData, PackSizes: updatedPackSizes });
                                                                }}
                                                            />
                                                            <label className="form-check-label ms-2">Size Available</label>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger mt-2"
                                                                onClick={() => removePackSize(index)}
                                                            >
                                                                Remove Pack Size
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="btn btn-primary mt-2"
                                                    onClick={addPackSize}
                                                >
                                                    Add Pack Size
                                                </button>
                                            </div>
                                        </div>
                                        <div className='row pt-5 pb-2'>
                                            <h5 className="f-w-600 mb-2">Old images</h5>
                                            {formData.alreadyUploadImages.map((item, index) => (
                                                <div style={{ cursor: 'pointer' }} key={index} className=' col-md-2'>
                                                    <img src={item.image} className='img-fluid' width={100} alt="" />
                                                    <input type="file" name="images"
                                                        multiple
                                                        onChange={(e) => handleChange(e, item.publicId)} />
                                                </div>
                                            ))}

                                        </div>


                                        <div className="row">
                                            <div className="col">
                                                <h5 className="f-w-600 mb-2">Details</h5>
                                                <JoditEditor
                                                    ref={editor}
                                                    value={formData.DetailsDataL}
                                                    config={config}
                                                    onChange={handleEditorChange}
                                                />
                                                {errors.DetailsDataL && <div className="invalid-feedback d-block">{errors.DetailsDataL}</div>}
                                            </div>
                                        </div>

                                        <div className="row mt-5">
                                            <div className="col">
                                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                                    {loading ? 'Submitting...' : 'Submit'}
                                                </button>
                                                {errors.global && <p className="text-danger mt-2">{errors.global}</p>}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
