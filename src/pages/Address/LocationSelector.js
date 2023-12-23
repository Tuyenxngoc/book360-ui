import PropTypes from 'prop-types';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, InputLabel, MenuItem, Select, TextField, FormHelperText, Button } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';

const host = "https://provinces.open-api.vn/api/";

const validationSchema = yup.object({
    selectedProvince: yup.string().required('Trường này là bắt buộc'),
    selectedDistrict: yup.string().required('Trường này là bắt buộc'),
    selectedWard: yup.string().required('Trường này là bắt buộc'),
    detailedAddress: yup.string().required('Trường này là bắt buộc'),
});

function LocationSelector({ onSelectAddress, onClose }) {

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const formik = useFormik({
        initialValues: {
            selectedProvince: '',
            selectedDistrict: '',
            selectedWard: '',
            detailedAddress: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        callAPI(host);
    }, []);

    const callAPI = (api) => {
        axios.get(api)
            .then((response) => {
                setProvinces(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const callApiDistrict = (api) => {
        axios.get(api)
            .then((response) => {
                setDistricts(response.data.districts);
            })
            .catch((error) => {
                console.error("Error fetching districts:", error);
            });
    };

    const callApiWard = (api) => {
        axios.get(api)
            .then((response) => {
                setWards(response.data.wards);
            })
            .catch((error) => {
                console.error("Error fetching wards:", error);
            });
    };

    const renderData = (array) => {
        return (
            array.map((element) => (
                <MenuItem key={element.code} value={element.code}>
                    {element.name}
                </MenuItem>
            ))
        );
    };

    const handleProvinceChange = (event) => {
        callApiDistrict(host + "p/" + event.target.value + "?depth=2");
    };

    const handleDistrictChange = (event) => {
        callApiWard(host + "d/" + event.target.value + "?depth=2");
    };

    const handleSubmit = (values) => {
        const provinceName = provinces.find((p) => p.code === values.selectedProvince)?.name || "";
        const districtName = districts.find((d) => d.code === values.selectedDistrict)?.name || "";
        const wardName = wards.find((w) => w.code === values.selectedWard)?.name || "";
        const result = `${values.detailedAddress} ${wardName} ${districtName} ${provinceName}`;
        onSelectAddress(result);
        onClose();
    };

    return (
        <div className='container mt-2'>
            <form onSubmit={formik.handleSubmit}>
                <div className='row gy-2'>
                    <div className='col-12'>
                        <div className='row align-items-center'>
                            <div className='col-4'>Tỉnh/Thành phố</div>
                            <div className='col-8'>
                                <FormControl fullWidth size="small" error={formik.touched.selectedProvince && Boolean(formik.errors.selectedProvince)}>
                                    <InputLabel id="province-label">Tỉnh/Thành phố</InputLabel>
                                    <Select
                                        labelId="province-label"
                                        id="province"
                                        name="selectedProvince"
                                        value={formik.values.selectedProvince}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            handleProvinceChange(e);
                                        }}
                                        label="Tỉnh/Thành phố"
                                        onBlur={formik.handleBlur}
                                    >
                                        {renderData(provinces)}
                                    </Select>
                                    {formik.touched.selectedProvince && formik.errors.selectedProvince && (
                                        <FormHelperText>{formik.errors.selectedProvince}</FormHelperText>
                                    )}
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className='col-12'>
                        <div className='row align-items-center'>
                            <div className='col-4'>Quận/Huyện</div>
                            <div className='col-8'>
                                <FormControl fullWidth size="small" error={formik.touched.selectedDistrict && Boolean(formik.errors.selectedDistrict)}>
                                    <InputLabel id="district-label">Quận/Huyện</InputLabel>
                                    <Select
                                        labelId="district-label"
                                        id="district"
                                        name="selectedDistrict"
                                        value={formik.values.selectedDistrict}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            handleDistrictChange(e);
                                        }}
                                        label="Quận/Huyện"
                                        onBlur={formik.handleBlur}
                                    >
                                        {renderData(districts)}
                                    </Select>
                                    {formik.touched.selectedDistrict && formik.errors.selectedDistrict && (
                                        <FormHelperText>{formik.errors.selectedDistrict}</FormHelperText>
                                    )}
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className='col-12'>
                        <div className='row align-items-center'>
                            <div className='col-4'>Phường/Xã</div>
                            <div className='col-8'>
                                <FormControl fullWidth size="small" error={formik.touched.selectedWard && Boolean(formik.errors.selectedWard)}>
                                    <InputLabel id="ward-label">Phường/Xã</InputLabel>
                                    <Select
                                        labelId="ward-label"
                                        id="ward"
                                        name="selectedWard"
                                        value={formik.values.selectedWard}
                                        onChange={formik.handleChange}
                                        label="Phường/Xã"
                                        onBlur={formik.handleBlur}
                                    >
                                        {renderData(wards)}
                                    </Select>
                                    {formik.touched.selectedWard && formik.errors.selectedWard && (
                                        <FormHelperText>{formik.errors.selectedWard}</FormHelperText>
                                    )}
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className='col-12'>
                        <div className='row align-items-center'>
                            <div className='col-4'>Địa chỉ cụ thể</div>
                            <div className='col-8'>
                                <TextField
                                    fullWidth
                                    label='Địa chỉ cụ thể'
                                    id="detailedAddress"
                                    name="detailedAddress"
                                    size='small'
                                    value={formik.values.detailedAddress}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.detailedAddress && Boolean(formik.errors.detailedAddress)}
                                    helperText={formik.touched.detailedAddress && formik.errors.detailedAddress}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-12 d-flex justify-content-end mt-4'>
                        <Button sx={{ minWidth: 140 }} onClick={onClose}>Trở lại</Button>
                        <Button sx={{ minWidth: 140 }} type='submit' autoFocus variant="contained">Hoàn thành</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

LocationSelector.propTypes = {
    onSelectAddress: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default LocationSelector;
