import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Tabs } from 'react-bootstrap';
import { Tab } from 'bootstrap';

const host = "https://provinces.open-api.vn/api/";

function LocationSelector() {

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

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
        setSelectedProvince(event.target.value);
        callApiDistrict(host + "p/" + event.target.value + "?depth=2");
    };

    const handleDistrictChange = (event) => {
        setSelectedDistrict(event.target.value);
        callApiWard(host + "d/" + event.target.value + "?depth=2");
    };

    const handleWardChange = (event) => {
        setSelectedWard(event.target.value);
    };

    const printResult = () => {
        if (selectedProvince !== "" && selectedDistrict !== "" && selectedWard !== "") {
            const provinceName = provinces.find((p) => p.code === selectedProvince)?.name || "";
            const districtName = districts.find((d) => d.code === selectedDistrict)?.name || "";
            const wardName = wards.find((w) => w.code === selectedWard)?.name || "";

            const result = `${provinceName} | ${districtName} | ${wardName}`;
            return result;
        }
        return "";
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-4'>
                    <FormControl fullWidth size="small">
                        <InputLabel id="province-label">Tỉnh/Thành phố</InputLabel>
                        <Select
                            labelId="province-label"
                            id="province"
                            value={selectedProvince}
                            onChange={handleProvinceChange}
                            label="Tỉnh/Thành phố"
                        >
                            {renderData(provinces)}
                        </Select>
                    </FormControl>
                </div>
                <div className='col-4'>
                    <FormControl fullWidth size="small">
                        <InputLabel id="district-label">Quận/Huyện</InputLabel>
                        <Select
                            labelId="district-label"
                            id="district"
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                            label="Quận/Huyện"
                        >
                            {renderData(districts)}
                        </Select>
                    </FormControl>
                </div>
                <div className='col-4'>
                    <FormControl fullWidth size="small">
                        <InputLabel id="ward-label">Phường/Xã</InputLabel>
                        <Select
                            labelId="ward-label"
                            id="ward"
                            value={selectedWard}
                            onChange={handleWardChange}
                            label="Phường/Xã"
                        >
                            {renderData(wards)}
                        </Select>
                    </FormControl>
                </div>
            </div>
        </div>
    );
};

export default LocationSelector;
