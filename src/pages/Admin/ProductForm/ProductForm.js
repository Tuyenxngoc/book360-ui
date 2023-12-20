import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Style from './ProductForm.module.scss';
import classNames from 'classnames/bind';

import { getAllCategories } from '~/services/categoryService';
import images from '~/assets';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import * as yup from 'yup';
import { useFormik } from 'formik';

import { uploadImage } from '~/services/customerService';
import { createProduct, getDetailProduct } from '~/services/productService';

import { FormHelperText } from '@mui/material';
import { Input, Select } from 'antd';

import FixedBox from './FixedBox';

const { TextArea } = Input;

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

function inputProps(isError) {
    if (isError) {
        return {
            status: 'error'
        };
    }
}

const defaultValue = {
    name: '',
    price: '',
    description: '',
    images: [],
    discount: '',
    author: '',
    size: '',
    quantity: '',
    cate_id: 0,
}
function ProductForm() {

    const navigate = useNavigate();
    const { productId } = useParams();
    const [categories, setCategories] = useState([]);
    const [countImagesLoad, setCountImagesLoad] = useState([]);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: defaultValue,
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
        } else {
            formik.setValues(defaultValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    useEffect(() => {
        getAllCategories()
            .then((response) => { setCategories(response.data.data) })
            .catch((error) => { console.log(error); });
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
                toast.error('Bạn chỉ có thể tải lên không quá 9 file');
            }
            e.target.value = null;
        }
    };

    console.log(formik.values.cate_id);

    const handleRemoveImage = (image) => {
        const newImages = formik.values.images.filter(item => item !== image);
        formik.setFieldValue('images', newImages);
    };

    const handleSubmit = (values) => {
        setLoading(true);
        createProduct(productId || -1, values)
            .then(() => { navigate('/admin/products', { replace: true }); })
            .catch((error) => { console.log(error); })
            .finally(() => { setLoading(false); });
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
                                                    <Link to={image} target='_blank' className={cx('view-image')}>
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </Link>
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
                                    <Input
                                        id='inputName'
                                        name='name'
                                        size='large'
                                        showCount
                                        maxLength={120}
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.name && Boolean(formik.errors.name))}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <FormHelperText error>{formik.errors.name}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='cate_id'><span>*</span>Danh mục</label>
                                <div className={cx('form-input')}>
                                    <Select
                                        id='cate_id'
                                        name='cate_id'
                                        size='large'
                                        placeholder="Vui lòng chọn"
                                        style={{ width: '100%' }}
                                        value={formik.values.cate_id || null}
                                        onChange={(value) => formik.setFieldValue('cate_id', value)}
                                        onBlur={formik.handleBlur}
                                        options={categories.map(category => ({ value: category.id, label: category.name, }))}
                                        {...inputProps(formik.touched.cate_id && Boolean(formik.errors.cate_id))}
                                    />
                                    {formik.touched.cate_id && formik.errors.cate_id && (
                                        <FormHelperText error>{formik.errors.cate_id}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='formControlTextarea'><span>*</span>Mô tả sản phẩm</label>
                                <div className={cx('form-input')}>
                                    <TextArea
                                        id='formControlTextarea'
                                        name='description'
                                        showCount
                                        maxLength={3000}
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.description && Boolean(formik.errors.description))}
                                        style={{ height: 200, resize: 'none', }}
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
                                            <Input
                                                id='inputAuthor'
                                                name='author'
                                                size='large'
                                                placeholder='Vui lòng nhập vào'
                                                value={formik.values.author}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                {...inputProps(formik.touched.author && Boolean(formik.errors.author))}
                                            />
                                            {formik.touched.author && formik.errors.author && (
                                                <FormHelperText error>{formik.errors.author}</FormHelperText>
                                            )}
                                        </div>
                                    </div>

                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputSize'><span>*</span>Kích thước</label>
                                        <div className={cx('form-input')}>
                                            <Input
                                                id='inputSize'
                                                name='size'
                                                size='large'
                                                placeholder="Vui lòng điền vào"
                                                value={formik.values.size}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                {...inputProps(formik.touched.size && Boolean(formik.errors.name))}
                                            />
                                            {formik.touched.size && formik.errors.size && (
                                                <FormHelperText error>{formik.errors.size}</FormHelperText>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputBookPublisher'>Nhà xuất bản</label>
                                        <div className={cx('form-input')}>
                                            <Input
                                                id='inputBookPublisher'
                                                name='BookPublisher'
                                                size='large'
                                                placeholder="Vui lòng điền vào"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputPageNumber'>Số trang</label>
                                        <div className={cx('form-input')}>
                                            <Input
                                                id='inputPageNumber'
                                                name='pageNumber'
                                                size='large'
                                                placeholder="Vui lòng điền vào"
                                            />
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputBookWeight'>Trọng lượng</label>
                                        <div className={cx('form-input')}>
                                            <Input
                                                id='inputBookWeight'
                                                name='bookWeight'
                                                size='large'
                                                placeholder="Vui lòng điền vào"
                                            />
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputBookFormat'>Định dạng</label>
                                        <div className={cx('form-input')}>
                                            <Input
                                                id='inputBookFormat'
                                                name='bookFormat'
                                                size='large'
                                                placeholder="Vui lòng điền vào"
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
                                    <Input
                                        id='inputPrice'
                                        name='price'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.price && Boolean(formik.errors.price))}
                                    />
                                    {formik.touched.price && formik.errors.price && (
                                        <FormHelperText error>{formik.errors.price}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputDiscount'><span>*</span>Giảm giá %</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputDiscount'
                                        name='discount'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.discount}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.discount && Boolean(formik.errors.name))}
                                    />
                                    {formik.touched.discount && formik.errors.discount && (
                                        <FormHelperText error>{formik.errors.discount}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputQuantity'><span>*</span>Số lượng</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputQuantity'
                                        name='quantity'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.quantity}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.quantity && Boolean(formik.errors.name))}
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
                    <FixedBox handleSubmit={formik.handleSubmit} loading={loading} />
                </div>
            </div>
        </div>
    );
}

export default ProductForm;