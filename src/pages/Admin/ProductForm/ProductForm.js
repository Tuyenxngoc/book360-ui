import { useEffect, useState } from 'react';

import Style from './ProductForm.module.scss';
import classNames from 'classnames/bind';

import { getAllCategories } from '~/services/categoryService';
import images from '~/assets';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { uploadImage } from '~/services/customerService';
import { FormHelperText } from '@mui/material';
import { createProduct, getDetailProduct } from '~/services/productService';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FixedBox from './FixedBox';

const cx = classNames.bind(Style);

const validationSchema = yup.object().shape({
    name: yup.string()
        .min(10, 'Tên sản phẩm của bạn quá ngắn. Vui lòng nhập ít nhất 10 kí tự.')
        .max(120, 'Tên sản phẩm của bạn quá dài. Vui lòng nhập tối đa 120 kí tự.')
        .required('Không được để trống ô'),

    price: yup.number()
        .min(1, 'Giá sản phẩm phải lớn hơn 0')
        .required('Không được để trống ô'),

    description: yup.string()
        .min(10, 'Mô tả sản phẩm của bạn quá ngắn. Vui lòng nhập ít nhất 10 kí tự.')
        .max(3000, 'Mô tả sản phẩm của bạn quá dài. Vui lòng nhập tối đa 3000 kí tự.')
        .required('Không được để trống ô'),

    images: yup.array()
        .min(1, 'Hình ảnh đã bị thiếu, hãy chắc chắn rằng sản phẩm này có ít nhất một hình đại diện.'),

    discount: yup.number()
        .min(0, 'Giảm giá không thể âm')
        .max(100, 'Giảm giá không thể lớn hơn 100')
        .required('Không được để trống ô'),

    author: yup.string()
        .required('Không được để trống ô'),

    size: yup.string()
        .required('Không được để trống ô'),

    quantity: yup.number()
        .min(0, 'Số lượng sản phẩm không thể âm')
        .integer('Số lượng sản phẩm phải là số nguyên')
        .required('Không được để trống ô'),

    cate_id: yup.number()
        .min(1, 'Vui lòng chọn danh mục sản phẩm'),
});

function inputProps(isError, formSelect) {
    if (formSelect) {
        return {
            className: `form-select ${isError ? 'is-invalid' : ''}`
        };
    }
    return {
        className: `form-control ${isError ? 'is-invalid' : ''}`
    };
}

function ProductForm() {

    const navigate = useNavigate();
    const { productId } = useParams();
    const [categories, setCategories] = useState([]);
    const [countImagesLoad, setCountImagesLoad] = useState([]);

    const formik = useFormik({
        initialValues: {
            name: '',
            price: '',
            description: '',
            images: [],
            discount: '',
            author: '',
            size: '',
            quantity: '',
            cate_id: 0
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        if (productId) {
            getDetailProduct(productId)
                .then((response) => {
                    const { name, price, description, images, discount, author, size, quantity, category } = response.data.data;
                    formik.setValues({
                        name,
                        price,
                        description,
                        images: images.map((image) => image.url),
                        discount,
                        author,
                        size,
                        quantity,
                        cate_id: category.id,
                    })
                })
                .catch((error) => { console.log(error); })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    useEffect(() => {
        getAllCategories()
            .then((response) => {
                setCategories(response.data.data)
            })
            .catch((error) => { console.log(error); })
    }, []);

    const handleImageChange = async (e) => {
        const files = e.target.files;
        if (files) {
            if (files.length <= 9) {
                setCountImagesLoad(files.length);
                const newImages = [];
                try {
                    await Promise.all(Array.from(files).map(async (file) => {
                        const response = await uploadImage(file);
                        newImages.push(response.data.data);
                    }));
                    formik.setFieldValue('images', [...formik.values.images, ...newImages]);
                    setCountImagesLoad(0);
                } catch (error) {
                    console.error(error);
                }
            } else {
                toast.error('Bạn chỉ có thể tải lên không quá 9 file', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
            e.target.value = null;
        }
    };

    const handleRemoveImage = (image) => {
        const newImages = formik.values.images.filter(item => item !== image);
        formik.setFieldValue('images', newImages);
    };

    const handleSubmit = (values) => {
        createProduct(productId || -1, values)
            .then(() => {
                navigate('/admin/products', { replace: true });
            })
            .catch((error) => { console.log(error); })
    }

    return (
        <div className='container mt-3'>
            <div className='row gy-3 justify-content-center'>
                <div className='col-10'>
                    <div className={cx('panel-wrapper')}>
                        <div className={cx('panel-header')}>
                            <div className={cx('panel-title')}>
                                Thông tin cơ bản
                            </div>
                        </div>
                        <div className='panel-content'>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}><span>*</span>Hình ảnh sản phẩm</label>
                                <div className={cx('form-input')}>
                                    <div className={cx('form-upload-image')}>
                                        {formik.values.images.map((image, index) => (
                                            <div key={index} className={cx('form-preview-image')}>
                                                <img src={image} alt={`Uploaded ${index}`} />
                                                {index === 0 && (
                                                    <div className={cx('image-desc', 'image-tools')}>
                                                        <span className={cx('image-desc-icon')}>*</span>
                                                        <span className={cx('image-desc-text')}>Ảnh bìa</span>
                                                    </div>
                                                )}
                                                <div className={cx('image-tools')}>
                                                    <button onClick={() => handleRemoveImage(image)} className={cx('delete-image')}>
                                                        <FontAwesomeIcon icon={faTrashCan} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {Array.from({ length: countImagesLoad }, (_, index) => (
                                            <div key={index} className={cx('form-preview-image')}>
                                                <img src={images.loading} alt={`Uploaded ${index}`} />
                                            </div>
                                        ))}

                                        {formik.values.images.length < 9 && (
                                            <label htmlFor='uploadImage' className={cx('upload-wrapper')}>
                                                <input
                                                    id='uploadImage'
                                                    type='file'
                                                    name='file'
                                                    accept='image/*'
                                                    multiple
                                                    aspect={1}
                                                    className={cx('upload-input')}
                                                    onChange={handleImageChange}
                                                />
                                                <div className={cx('upload-content')}>
                                                    <div className={cx('upload-content-icon')} >
                                                        <img src={images.uploadImage} alt='upload img' />
                                                    </div>
                                                    <div className={cx('upload-content-text')} >Thêm hình ảnh ({formik.values.images.length}/9)</div>
                                                </div>
                                            </label>
                                        )}
                                    </div>
                                    {formik.touched.images && formik.errors.images && (
                                        <FormHelperText style={{ display: 'inline-block' }} error>{formik.errors.images}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputName'><span>*</span>Tên sản phẩm</label>
                                <div className={cx('form-input')}>
                                    <input
                                        type='text'
                                        {...inputProps(formik.touched.name && Boolean(formik.errors.name))}
                                        id='inputName'
                                        name='name'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <FormHelperText error>{formik.errors.name}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='formControlSelect'><span>*</span>Danh mục</label>
                                <div className={cx('form-input')}>
                                    <select
                                        id='formControlSelect'
                                        className='form-select'
                                        {...inputProps(formik.touched.cate_id && Boolean(formik.errors.cate_id), true)}
                                        name='cate_id'
                                        value={formik.values.cate_id}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value={0}>Vui lòng chọn</option>
                                        {categories.map((category, i) => (
                                            <option key={i} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                    {formik.touched.cate_id && formik.errors.cate_id && (
                                        <FormHelperText error>{formik.errors.cate_id}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='formControlTextarea'><span>*</span>Mô tả sản phẩm</label>
                                <div className={cx('form-input')}>
                                    <textarea
                                        id='formControlTextarea'
                                        {...inputProps(formik.touched.description && Boolean(formik.errors.description))}
                                        rows={5}
                                        name='description'
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.description && formik.errors.description && (
                                        <FormHelperText error>{formik.errors.description}</FormHelperText>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-10'>
                    <div className={cx('panel-wrapper')}>
                        <div className={cx('panel-header')}>
                            <div className={cx('panel-title')}>
                                Thông tin chi tiết
                            </div>
                        </div>
                        <div className='panel-content'>
                            <div className='row'>
                                <div className='col-6'>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputAuthor'><span>*</span>Tác giả</label>
                                        <div className={cx('form-input')}>
                                            <input
                                                type='text'
                                                {...inputProps(formik.touched.author && Boolean(formik.errors.author))}
                                                id='inputAuthor'
                                                name='author'
                                                placeholder='Vui lòng nhập vào'
                                                value={formik.values.author}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.author && formik.errors.author && (
                                                <FormHelperText error>{formik.errors.author}</FormHelperText>
                                            )}
                                        </div>
                                    </div>

                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputSize'><span>*</span>Kích thước</label>
                                        <div className={cx('form-input')}>
                                            <input
                                                type='text'
                                                {...inputProps(formik.touched.size && Boolean(formik.errors.name))}
                                                id='inputSize'
                                                name='size'
                                                placeholder='Vui lòng nhập vào'
                                                value={formik.values.size}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.size && formik.errors.size && (
                                                <FormHelperText error>{formik.errors.size}</FormHelperText>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputBookPublisher'>Nhà xuất bản</label>
                                        <div className={cx('form-input')}>
                                            <input
                                                type='text'
                                                className='form-control'
                                                id='inputBookPublisher'
                                                name='BookPublisher'
                                                placeholder='Vui lòng nhập vào'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputPageNumber'>Số trang</label>
                                        <div className={cx('form-input')}>
                                            <input
                                                type='text'
                                                className='form-control'
                                                id='inputPageNumber'
                                                name='pageNumber'
                                                placeholder='Vui lòng nhập vào'
                                            />
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputBookWeight'>Trọng lượng</label>
                                        <div className={cx('form-input')}>
                                            <input
                                                type='text'
                                                className='form-control'
                                                id='inputBookWeight'
                                                name='bookWeight'
                                                placeholder='Vui lòng nhập vào'
                                            />
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputBookFormat'>Định dạng</label>
                                        <div className={cx('form-input')}>
                                            <input
                                                type='text'
                                                className='form-control'
                                                id='inputBookFormat'
                                                name='bookFormat'
                                                placeholder='Vui lòng nhập vào'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-10'>
                    <div className={cx('panel-wrapper')}>
                        <div className={cx('panel-header')}>
                            <div className={cx('panel-title')}>
                                Thông tin bán hàng
                            </div>
                        </div>
                        <div className='panel-content'>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputPrice'><span>*</span>Giá bán</label>
                                <div className={cx('form-input')}>
                                    <input
                                        type='text'
                                        {...inputProps(formik.touched.price && Boolean(formik.errors.price))}
                                        id='inputPrice'
                                        name='price'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.price && formik.errors.price && (
                                        <FormHelperText error>{formik.errors.price}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputDiscount'><span>*</span>Giảm giá %</label>
                                <div className={cx('form-input')}>
                                    <input
                                        type='text'
                                        {...inputProps(formik.touched.discount && Boolean(formik.errors.name))}
                                        id='inputDiscount'
                                        name='discount'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.discount}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.discount && formik.errors.discount && (
                                        <FormHelperText error>{formik.errors.discount}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputQuantity'><span>*</span>Số lượng</label>
                                <div className={cx('form-input')}>
                                    <input
                                        type='text'
                                        {...inputProps(formik.touched.quantity && Boolean(formik.errors.name))}
                                        id='inputQuantity'
                                        name='quantity'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.quantity}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.quantity && formik.errors.quantity && (
                                        <FormHelperText error>{formik.errors.quantity}</FormHelperText>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-10 mt-0'>
                    <FixedBox handleSubmit={formik.handleSubmit} />
                </div>
            </div>
        </div>
    );
}

export default ProductForm;