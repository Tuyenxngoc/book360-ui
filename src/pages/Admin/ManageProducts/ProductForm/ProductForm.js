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

import { uploadImage, uploadImages } from '~/services/customerService';
import { createProduct, getProduct } from '~/services/productService';
import { getAllBookSet } from '~/services/bookSetService';
import { getAllAuthors } from '~/services/authorService';

import { FormHelperText } from '@mui/material';
import { Input, Select, message } from 'antd';

import FixedBox from './FixedBox';
import DropdownRender from '~/components/DropdownRender';
import { ages, coverTypes, publishers, sizes } from '~/config/contans';

const { TextArea } = Input;

const cx = classNames.bind(Style);

const coverTypeKey = 'coverType';
const publisherKey = 'publisher';
const sizeKey = 'size';

const defaultValue = {
    name: '',
    description: '',
    isbn: null,
    publisher: null,
    size: null,
    coverType: null,
    ageClassifications: [],
    weight: null,
    pageCount: null,
    categoryId: null,
    bookSetId: null,
    stockQuantity: null,
    price: null,
    discount: null,
    imageURLs: [],
    authorIds: []
}

const validationSchema = yup.object().shape({
    name: yup.string().trim()
        .min(10, 'Tên sản phẩm của bạn quá ngắn. Vui lòng nhập ít nhất 10 kí tự.')
        .max(120, 'Tên sản phẩm của bạn quá dài. Vui lòng nhập tối đa 120 kí tự.')
        .required('Không được để trống ô'),

    description: yup.string().trim()
        .min(10, 'Mô tả sản phẩm của bạn quá ngắn. Vui lòng nhập ít nhất 10 kí tự.')
        .max(3000, 'Mô tả sản phẩm của bạn quá dài. Vui lòng nhập tối đa 3000 kí tự.')
        .required('Không được để trống ô'),

    isbn: yup.string().nullable(),

    publisher: yup.string().nullable(),

    size: yup.string().nullable(),

    coverType: yup.string().nullable(),

    ageClassifications: yup.array().of(yup.string().trim()).nullable(),

    weight: yup.number().typeError('Trọng lượng phải là một số').nullable()
        .min(0, 'Trọng lượng sản phẩm không thể âm'),

    pageCount: yup.number().typeError('Số trang phải là một số').nullable()
        .min(0, 'Số trang không thể âm')
        .integer('Số trang phải là số nguyên'),

    categoryId: yup.number().typeError('Danh mục phải là một số')
        .required('Vui lòng chọn danh mục sản phẩm'),

    bookSetId: yup.number().typeError('Bộ sách phải là một số').nullable(),

    stockQuantity: yup.number().typeError('Số lượng sản phẩm phải là một số')
        .min(0, 'Số lượng sản phẩm không thể âm')
        .integer('Số lượng sản phẩm phải là số nguyên')
        .required('Không được để trống ô'),

    price: yup.number().typeError('Giá sản phẩm phải là một số')
        .min(1, 'Giá sản phẩm phải lớn hơn 0')
        .required('Không được để trống ô'),

    discount: yup.number().typeError('Giảm giá sản phẩm phải là một số')
        .min(0, 'Giảm giá không thể âm')
        .max(100, 'Giảm giá không thể lớn hơn 100')
        .required('Không được để trống ô'),

    imageURLs: yup.array().of(yup.string().trim())
        .min(1, 'Hình ảnh đã bị thiếu, hãy chắc chắn rằng sản phẩm này có ít nhất một hình đại diện.'),

    authorIds: yup.array().of(yup.number())
        .min(1, 'Tác giả đã bị thiếu'),
});

function inputProps(isError) {
    if (isError) { return { status: 'error' }; }
}

function ProductForm() {

    const navigate = useNavigate();
    const { productId } = useParams();
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [bookSets, setBookSets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [countImagesLoad, setCountImagesLoad] = useState([]);

    const [customSizes, setCustomSizes] = useState([]);
    const [customPublishers, setCustomPublishers] = useState([]);
    const [customCoverTypes, setCustomCoverTypes] = useState([]);

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        if (productId) {
            getProduct(productId)
                .then((response) => {
                    const {
                        name,
                        description,
                        price,
                        discount,
                        isbn,
                        publisher,
                        size,
                        weight,
                        coverType,
                        ageClassifications,
                        pageCount,
                        stockQuantity,
                        images,
                        category,
                        bookSet,
                        authors,
                    } = response.data.data;
                    formik.setValues({
                        name,
                        description,
                        isbn,
                        publisher,
                        size,
                        coverType,
                        ageClassifications,
                        weight,
                        pageCount,
                        categoryId: category.id,
                        bookSetId: bookSet?.id,
                        stockQuantity,
                        price,
                        discount,
                        imageURLs: images.map(img => img.url),
                        authorIds: authors.map(author => author.id)
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
        } else {
            formik.setValues(defaultValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    const handleImageChange = async (e) => {
        const files = e.target.files;
        if (files) {
            if (countImagesLoad > 0) {
                toast.error("Vui lòng chờ cho quá trình tải ảnh hoàn tất.");
                return;
            }
            if (files.length > 9) {
                toast.error('Bạn chỉ có thể tải lên không quá 9 file');
                return;
            }

            setCountImagesLoad(files.length);
            try {
                const response = await uploadImages(files);
                formik.setFieldValue('imageURLs', [...formik.values.imageURLs, ...response.data.data]);
                message.success('Tải tập tin thành công.');
            } catch (error) {
                console.error(error);
                message.error('Tải tập tin thất bại.');
            }

            setCountImagesLoad(0);
            e.target.value = null;
        }
    };

    const handleRemoveImage = (image) => {
        const newImages = formik.values.imageURLs.filter(item => item !== image);
        formik.setFieldValue('imageURLs', newImages);
    };

    const handleSubmit = (values) => {
        setLoading(true);
        createProduct(productId || null, values)
            .then(() => {
                navigate('/admin/product', { replace: true });
                toast.success('Thành công');
            })
            .catch((error) => { toast.error('Đã có lỗi xảy ra khi lưu sản phẩm') })
            .finally(() => { setLoading(false); });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, authorsResponse, bookSetsResponse] = await Promise.all([
                    getAllCategories(),
                    getAllAuthors(),
                    getAllBookSet()
                ]);

                const categoriesData = categoriesResponse.data.data.map(item => ({ value: item.id, label: item.name }));
                const authorsData = authorsResponse.data.data.map(item => ({ value: item.id, label: item.fullName }));
                const bookSetsData = bookSetsResponse.data.data.map(item => ({ value: item.id, label: item.name }));

                setCategories(categoriesData);
                setAuthors(authorsData);
                setBookSets(bookSetsData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const savedSizes = localStorage.getItem(sizeKey);
        if (savedSizes) {
            setCustomSizes(JSON.parse(savedSizes));
        }

        const savedPublishers = localStorage.getItem(publisherKey);
        if (savedPublishers) {
            setCustomPublishers(JSON.parse(savedPublishers));
        }

        const savedCoverTypes = localStorage.getItem(coverTypeKey);
        if (savedCoverTypes) {
            setCustomCoverTypes(JSON.parse(savedCoverTypes));
        }
    }, []);

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
                                        {formik.values.imageURLs.map((image, index) => (
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
                                        {formik.values.imageURLs.length < 9 && (
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
                                                    <div className={cx('upload-content-text')} >Thêm hình ảnh ({formik.values.imageURLs.length}/9)</div>
                                                </div>
                                            </label>
                                        )}
                                    </div>
                                    {formik.touched.imageURLs && formik.errors.imageURLs && (
                                        <FormHelperText style={{ display: 'inline-block' }} error>{formik.errors.imageURLs}</FormHelperText>
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
                                <label className={cx('form-label')} htmlFor='categoryId'><span>*</span>Danh mục</label>
                                <div className={cx('form-input')}>
                                    <Select
                                        id='categoryId'
                                        name='categoryId'
                                        size='large'
                                        placeholder='Vui lòng chọn'
                                        style={{ width: '100%' }}
                                        value={formik.values.categoryId || null}
                                        onChange={(value) => formik.setFieldValue('categoryId', value)}
                                        onBlur={formik.handleBlur}
                                        options={categories}
                                        {...inputProps(formik.touched.categoryId && Boolean(formik.errors.categoryId))}
                                    />
                                    {formik.touched.categoryId && formik.errors.categoryId && (
                                        <FormHelperText error>{formik.errors.categoryId}</FormHelperText>
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
                                        <label className={cx('form-label')} htmlFor='inputAuthorIds'><span>*</span>Tác giả</label>
                                        <div className={cx('form-input')}>
                                            <Select
                                                allowClear
                                                maxTagCount='responsive'
                                                mode='multiple'
                                                id='inputAuthorIds'
                                                name='authorIds'
                                                size='large'
                                                placeholder='Vui lòng chọn'
                                                style={{ width: '100%' }}
                                                value={formik.values.authorIds}
                                                onChange={(value) => formik.setFieldValue('authorIds', value)}
                                                onBlur={formik.handleBlur}
                                                options={authors}
                                                {...inputProps(formik.touched.authorIds && Boolean(formik.errors.authorIds))}
                                            />
                                            {formik.touched.authorIds && formik.errors.authorIds && (
                                                <FormHelperText error>{formik.errors.authorIds}</FormHelperText>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputageClassifications'>Độ tuổi</label>
                                        <div className={cx('form-input')}>
                                            <Select
                                                allowClear
                                                maxTagCount='responsive'
                                                mode='multiple'
                                                id='inputageClassifications'
                                                name='ageClassifications'
                                                size='large'
                                                placeholder='Vui lòng chọn'
                                                style={{ width: '100%' }}
                                                value={formik.values.ageClassifications}
                                                onChange={(value) => formik.setFieldValue('ageClassifications', value)}
                                                onBlur={formik.handleBlur}
                                                options={ages}
                                                {...inputProps(formik.touched.ageClassifications && Boolean(formik.errors.ageClassifications))}
                                            />
                                            {formik.touched.ageClassifications && formik.errors.ageClassifications && (
                                                <FormHelperText error>{formik.errors.ageClassifications}</FormHelperText>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='selectBookSetId'>Bộ sách</label>
                                        <div className={cx('form-input')}>
                                            <Select
                                                allowClear
                                                id='selectBookSetId'
                                                name='bookSetId'
                                                size='large'
                                                placeholder='Vui lòng chọn'
                                                style={{ width: '100%' }}
                                                value={formik.values.bookSetId || null}
                                                onChange={(value) => formik.setFieldValue('bookSetId', value)}
                                                onBlur={formik.handleBlur}
                                                options={bookSets}
                                                {...inputProps(formik.touched.bookSetId && Boolean(formik.errors.bookSetId))}
                                            />
                                            {formik.touched.bookSetId && formik.errors.bookSetId && (
                                                <FormHelperText error>{formik.errors.bookSetId}</FormHelperText>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='selectSize'>Kích thước (cm)</label>
                                        <div className={cx('form-input')}>
                                            <Select
                                                allowClear
                                                id='selectSize'
                                                name={sizeKey}
                                                size='large'
                                                placeholder='Vui lòng chọn'
                                                style={{ width: '100%' }}
                                                value={formik.values.size}
                                                onChange={(value) => formik.setFieldValue(sizeKey, value)}
                                                onBlur={formik.handleBlur}
                                                options={
                                                    customSizes.length > 0
                                                        ? [
                                                            {
                                                                label: 'Có sẵn',
                                                                options: sizes,
                                                            },
                                                            {
                                                                label: 'Tự điền',
                                                                options: customSizes,
                                                            },
                                                        ]
                                                        : sizes
                                                }
                                                {...inputProps(formik.touched.size && Boolean(formik.errors.size))}
                                                dropdownRender={(menu) =>
                                                    <DropdownRender
                                                        menu={menu}
                                                        field={sizeKey}
                                                        setFieldValue={formik.setFieldValue}
                                                        options={sizes}
                                                        customValues={customSizes}
                                                        setCustomValues={setCustomSizes}
                                                    />
                                                }
                                            />
                                            {formik.touched.size && formik.errors.size && (
                                                <FormHelperText error>{formik.errors.size}</FormHelperText>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='selectPublisher'>Nhà xuất bản</label>
                                        <div className={cx('form-input')}>
                                            <Select
                                                allowClear
                                                id='selectPublisher'
                                                name={publisherKey}
                                                size='large'
                                                placeholder='Vui lòng chọn'
                                                style={{ width: '100%' }}
                                                value={formik.values.publisher}
                                                onChange={(value) => formik.setFieldValue(publisherKey, value)}
                                                onBlur={formik.handleBlur}
                                                options={
                                                    customPublishers.length > 0
                                                        ? [
                                                            {
                                                                label: 'Có sẵn',
                                                                options: publishers,
                                                            },
                                                            {
                                                                label: 'Tự điền',
                                                                options: customPublishers,
                                                            },
                                                        ]
                                                        : publishers
                                                }
                                                {...inputProps(formik.touched.publisher && Boolean(formik.errors.publisher))}
                                                dropdownRender={(menu) =>
                                                    <DropdownRender
                                                        menu={menu}
                                                        field={publisherKey}
                                                        setFieldValue={formik.setFieldValue}
                                                        options={publishers}
                                                        customValues={customPublishers}
                                                        setCustomValues={setCustomPublishers}
                                                    />
                                                }
                                            />
                                            {formik.touched.publisher && formik.errors.publisher && (
                                                <FormHelperText error>{formik.errors.publisher}</FormHelperText>
                                            )}
                                        </div>
                                    </div>

                                </div>
                                <div className='col-6'>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputIsbn'>Mã số sách quốc tế</label>
                                        <div className={cx('form-input')}>
                                            <Input
                                                id='inputIsbn'
                                                name='isbn'
                                                size='large'
                                                placeholder='Vui lòng điền vào'
                                                value={formik.values.isbn}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                {...inputProps(formik.touched.isbn && Boolean(formik.errors.isbn))}
                                            />
                                            {formik.touched.isbn && formik.errors.isbn && (
                                                <FormHelperText error>{formik.errors.isbn}</FormHelperText>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='selectCoverType'>Loại bìa</label>
                                        <div className={cx('form-input')}>
                                            <Select
                                                allowClear
                                                id='selectCoverType'
                                                name={coverTypeKey}
                                                size='large'
                                                placeholder='Vui lòng chọn'
                                                style={{ width: '100%' }}
                                                value={formik.values.coverType}
                                                onChange={(value) => formik.setFieldValue(coverTypeKey, value)}
                                                onBlur={formik.handleBlur}
                                                options={
                                                    customCoverTypes.length > 0
                                                        ? [
                                                            {
                                                                label: 'Có sẵn',
                                                                options: coverTypes,
                                                            },
                                                            {
                                                                label: 'Tự điền',
                                                                options: customCoverTypes,
                                                            },
                                                        ]
                                                        : coverTypes
                                                }
                                                {...inputProps(formik.touched.coverType && Boolean(formik.errors.coverType))}
                                                dropdownRender={(menu) =>
                                                    <DropdownRender
                                                        menu={menu}
                                                        field={coverTypeKey}
                                                        setFieldValue={formik.setFieldValue}
                                                        options={coverTypes}
                                                        customValues={customCoverTypes}
                                                        setCustomValues={setCustomCoverTypes}
                                                    />
                                                }
                                            />
                                            {formik.touched.coverType && formik.errors.coverType && (
                                                <FormHelperText error>{formik.errors.coverType}</FormHelperText>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputPageCount'>Số trang</label>
                                        <div className={cx('form-input')}>
                                            <Input
                                                id='inputPageCount'
                                                name='pageCount'
                                                size='large'
                                                placeholder='Vui lòng điền vào'
                                                value={formik.values.pageCount}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                {...inputProps(formik.touched.pageCount && Boolean(formik.errors.pageCount))}
                                            />
                                            {formik.touched.pageCount && formik.errors.pageCount && (
                                                <FormHelperText error>{formik.errors.pageCount}</FormHelperText>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor='inputBookWeight'>Trọng lượng (g)</label>
                                        <div className={cx('form-input')}>
                                            <Input
                                                id='inputBookWeight'
                                                name='weight'
                                                size='large'
                                                placeholder='Vui lòng điền vào'
                                                value={formik.values.weight}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                {...inputProps(formik.touched.weight && Boolean(formik.errors.weight))}
                                            />
                                            {formik.touched.weight && formik.errors.weight && (
                                                <FormHelperText error>{formik.errors.weight}</FormHelperText>
                                            )}
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
                                        {...inputProps(formik.touched.discount && Boolean(formik.errors.discount))}
                                    />
                                    {formik.touched.discount && formik.errors.discount && (
                                        <FormHelperText error>{formik.errors.discount}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputStockQuantity'><span>*</span>Số lượng</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputStockQuantity'
                                        name='stockQuantity'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.stockQuantity}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.stockQuantity && Boolean(formik.errors.stockQuantity))}
                                    />
                                    {formik.touched.stockQuantity && formik.errors.stockQuantity && (
                                        <FormHelperText error>{formik.errors.stockQuantity}</FormHelperText>
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