import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Input, Button, Modal, Select, Form as AntForm } from 'antd';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { apiPost } from '../../hooks/Api';
import { SuccessNotificationMsg, ErrorNotificationMsg } from "../../hooks/NotificationHelper";
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
const { Option } = Select;

const NursingHomeDatatable = () => {
    const [btnLoading, setBtnLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [residentList, setResidentlist] = useState([]);
    const [searchData, setsearchData] = useState("");
    const [search, setSearch] = useState([]);
    const [pending, setPending] = useState(true);
    //const [displayModal, setDisplayModal] = useState(false);
    const [viewData, setViewData] = useState('');
    const [isViewMode, setIsViewMode] = useState(false);
    const [id, setId] = useState('');
    const [foodItemsList, setFooditemsList] = useState([]);

    const fetchFoodItems = async() => {
        try {
            const response = await apiPost('/get-all-food-items', {});
            if(response.status === 'success'){
                setFooditemsList(response.data);
            } else {
                setFooditemsList([]);
            }
        } catch {
            ErrorNotificationMsg("Something went wrong!!");
        }
    }

    const getAllResidentData = async() => {
        try {
            setPending(true);
            const response = await apiPost('/get-all-resident-data', {});
            if(response.status === 'success'){
                console.log(response.data);
                setResidentlist(response.data);
                setSearch(response.data);
                setPending(false);
            } else {
                setResidentlist([]);
                setSearch([]);
                setPending(false);
            }
        } catch {
            setResidentlist([]);
            setSearch([]);
            setPending(false);
            ErrorNotificationMsg("Something went wrong!!");
        }
    }

    useEffect(() => {
        getAllResidentData();
        fetchFoodItems();
    }, []);

    /* Search functionality for datatable start */

    useEffect(() => {
        const result = residentList?.filter(itemName => {
            return itemName.resident_name.toLowerCase().match(searchData.toLowerCase());
        })
        setSearch(result);
    }, [residentList , searchData]);

    /* Search functionality for datatable end */


    const columns = [
        {
            name: "Resident Name",
            selector: row => row.resident_name,
            sortable: true,
            width: '180px',
        },
        {
            name: "Food Item",
            selector: row => row.name,
            sortable: true,
            width: '180px',
        },
        {
            name: "Category",
            selector: row => row.category,
            sortable: true,
            width: '180px',
        },
        {
            name: "Type",
            selector: row => row.iddsi_level,
            sortable: true,
            width: '180px',
        },
        {
            name: "IDDSI Level",
            selector: row => row.measurement,
            sortable: true,
            width: '180px',
        },
        {
            name: 'Actions',
            cell: row => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="primary" icon={<FaEye />} onClick={() => handleView(row)}>View</Button>
                    <Button type="default" style={{ backgroundColor: '#52c41a', color: '#fff' }} icon={<FaEdit />} onClick={() => handleEdit(row)}>Edit</Button>
                    <Button type="danger" style={{ backgroundColor: '#ff4d4f', color: '#fff' }} icon={<FaTrashAlt />} onClick={() => handleDelete(row)}>Delete</Button>
                </div>
            ),
            ignoreRowClick: true,
            $allowOverflow: true, 
            $button: true,
            width: '180px',
        },
    ]

    /* function for store residential data start */

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setBtnLoading(true);
            const response = await apiPost('/store-resident-data', values);
            if(response.status === 'success'){
                resetForm();
                SuccessNotificationMsg("Success",response.message);
                setBtnLoading(false);
                setIsModalVisible(false);
                getAllResidentData();
            } else {
                ErrorNotificationMsg(response.message);
                setSubmitting(false);
                setBtnLoading(false);
            }
        } catch {
            setBtnLoading(false);
            ErrorNotificationMsg("Something went wrong!!");
        }
    };

    /* function for store residential data end */

    const handleFormEdit = async(values, { setSubmitting, resetForm }) => {
        try {
            setBtnLoading(true);
            values.id = id;
            if(values.iddsiLevel === "Food"){
                values.consistencyLevel = "";
            } else if(values.iddsiLevel === "Drink"){
                values.textureLevel = "";
            }
            const response = await apiPost('/update-food-items', values);
            if(response.status === 'success'){
                resetForm();
                SuccessNotificationMsg("Success",response.message);
                setBtnLoading(false);
                setIsModalVisible(false);
                getAllResidentData();
            } else {
                ErrorNotificationMsg(response.message);
                setSubmitting(false);
                setBtnLoading(false);
            }
        } catch {
            setBtnLoading(false);
            ErrorNotificationMsg("Something went wrong!!");
        }
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleView = (row) => {
        setViewData(row);
        setIsViewMode(true);
        setIsModalVisible(true);
    };

    const handleEdit = (row) => {
        setViewData(row);
        setIsViewMode(false);
        setIsModalVisible(true);
        setId(row.id);
    };

    const handleDelete = async(row) => {
        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
            try {
                const response = await apiPost('/delete-food-items', {row});
                if(response.status === 'success'){
                    SuccessNotificationMsg("Success",response.message);
                    getAllResidentData();
                } else {
                    ErrorNotificationMsg(response.message);
                }
            } catch {
                ErrorNotificationMsg("Something went wrong!!");
            }
        }
    };

    const searchComponent = (
        <Input
            placeholder="Search by title"
            value={searchData}
            onChange={(e) => { setsearchData(e.target.value) }}
            style={{ marginBottom: '10px', width: '300px' }}
        />
    );

    /* React formik for form validation start */ 

    const validationSchema = Yup.object({
        residentName: Yup.string().required('Resident name is required'),
        foodItem: Yup.string().required('Food Item is required'),
    });

    /* React formik for form validation end */ 

    return (
        <StyleSheetManager shouldForwardProp={isPropValid}>
            <div id="panel-1" className="panel">
                <div className="panel-hdr">
                    <h2>Residents List</h2>
                    <div className="panel-toolbar">
                        <Link
                            to="#"
                            onClick={showModal}
                            className="btn btn-sm btn-primary waves-effect waves-themed mr-2"
                        >
                            <i className="fal fa-plus"></i> Create Resident
                        </Link>
                        <Link
                            to="#"
                            //onClick={() => setDisplayModal(true)}
                            className="btn btn-sm waves-effect waves-themed"
                            style={{ backgroundColor: '#52c41a', color: '#fff' }}
                        >
                            <i className="fal fa-upload"></i> CSV Upload
                        </Link>
                    </div>
                </div>
            </div>
            <div>
                <DataTable
                    noDataComponent="No Data Available"
                    columns={columns}
                    data={search}
                    progressPending={pending}
                    subHeader
                    subHeaderComponent={search && search.length > 0 ? searchComponent : ''}
                    pagination
                />
            </div>

            {/* Modal for Create Food Items */}
            <Modal
                className='ant-modal-custom-width'
                title={isViewMode ? "View Food Item" : "Create/Edit Food Item"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel} style={{ backgroundColor: '#ff4d4f', color: '#fff' }}>
                        Cancel
                    </Button>,
                ]}
            >
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        residentName: viewData?.resident_name || '',
                        foodItem: viewData?.food_items_id || '',
                    }}
                    
                    validationSchema={validationSchema}
                    onSubmit={id ? handleFormEdit : handleSubmit}
                >
                
                {({ setFieldValue, handleChange, handleSubmit, values, touched, errors }) => (
                    <AntForm layout="vertical" onFinish={handleSubmit}>
                        <AntForm.Item 
                            label="Name of the resident" 
                            name="residentName"
                            validateStatus={touched.residentName && errors.residentName ? 'error' : ''}
                            help={touched.residentName && errors.residentName ? errors.residentName : ''}
                        >
                            <div style={{display:'none'}}>{values.residentName}</div>
                            <Input
                                name="residentName" 
                                placeholder="Enter resident name"
                                onChange={handleChange}
                                value={values.residentName}
                                type="text"
                                disabled={isViewMode}
                            />
                        </AntForm.Item>
                        <br/>
                        <AntForm.Item
                            label="Food Item" 
                            name="foodItem"
                            validateStatus={touched.foodItem && errors.foodItem ? 'error' : ''}
                            help={touched.foodItem && errors.foodItem ? errors.foodItem : ''}
                        >
                            <div style={{display:'none'}}>{values.foodItem}</div>
                            <Select 
                                placeholder="Select food item"
                                onChange={(value) => setFieldValue('foodItem', value)}
                                value={values.foodItem}
                                disabled={isViewMode}
                            >
                                <Option value="" disabled>
                                    Please select food items
                                </Option>
                                {foodItemsList.length > 0 ? (
                                    foodItemsList.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                        {item.name}
                                        </Option>
                                    ))
                                ) : (
                                    <Option value="">No food items available</Option>
                                )}
                            </Select>
                        </AntForm.Item>
                        <br/>
                        {!isViewMode && (
                            id ? (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={btnLoading}
                                    loading={btnLoading}
                                >
                                    {btnLoading ? 'Updating...' : 'Update'}
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={btnLoading}
                                    loading={btnLoading}
                                >
                                    {btnLoading ? 'Saving...' : 'Save'}
                                </Button>
                            )
                        )}
                    </AntForm>
                )}
                </Formik>
            </Modal>
        </StyleSheetManager>
    )
}

export default NursingHomeDatatable;