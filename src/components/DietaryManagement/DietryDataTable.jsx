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
import CSVUploadModal from './CSVUploadModal';


const { Option } = Select;

const DietaryDataTable = () => {
    const [btnLoading, setBtnLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedIddsiLevel, setSelectedIddsiLevel] = useState('');
    const [foodItemsList, setFooditemsList] = useState([]);
    const [searchData, setsearchData] = useState("");
    const [search, setSearch] = useState([]);
    const [pending, setPending] = useState(true);
    const [displayModal, setDisplayModal] = useState(false);
    const [viewData, setViewData] = useState('');
    const [isViewMode, setIsViewMode] = useState(false);
    const [id, setId] = useState('');

    /* Onload function call fetch all food items start */

    const getAllFoodItems = async() => {
        try {
            setPending(true);
            const response = await apiPost('/get-all-food-items', {});
            if(response.status === 'success'){
                setFooditemsList(response.data);
                setSearch(response.data);
                setPending(false);
            } else {
                setFooditemsList([]);
                setSearch([]);
                setPending(false);
            }
        } catch (error) {
            console.error("Submission failed:", error);
            setFooditemsList([]);
            setSearch([]);
            setPending(false);
            ErrorNotificationMsg("Something went wrong!!");
        }
    }

    useEffect(() => {
        getAllFoodItems();
    }, []);

    /* Onload function call fetch all food items end */

    /* Search functionality for datatable start */

    useEffect(() => {
        const result = foodItemsList?.filter(itemName => {
            return itemName.name.toLowerCase().match(searchData.toLowerCase());
        })
        setSearch(result);
    }, [foodItemsList , searchData]);

    /* Search functionality for datatable end */

    const columns = [
        {
            name: "Food Item Name",
            selector: row => row.name,
            sortable: true,
            width: '220px',
        },
        {
            name: "Category",
            selector: row => row.category,
            sortable: true,
            width: '220px',
        },
        {
            name: "Type",
            selector: row => row.iddsi_level,
            sortable: true,
            width: '220px',
        },
        {
            name: "IDDSI Level",
            selector: row => row.measurement,
            sortable: true,
            width: '220px',
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
            width: '220px',
        },
    ]

    /* function for store food items data start */

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setBtnLoading(true);
            const response = await apiPost('/store-food-items', values);
            if(response.status === 'success'){
                resetForm();
                SuccessNotificationMsg("Success",response.message);
                setBtnLoading(false);
                setIsModalVisible(false);
                getAllFoodItems();
            } else {
                ErrorNotificationMsg(response.message);
                setSubmitting(false);
                setBtnLoading(false);
            }
        } catch (error) {
            console.error("Submission failed:", error);
            setBtnLoading(false);
            ErrorNotificationMsg("Something went wrong!!");
        }
    };

    /* function for store food items data end */


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
                getAllFoodItems();
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

    /* React formik for form validation start */ 

    const validationSchema = Yup.object({
        foodName: Yup.string().required('Food name is required'),
        category: Yup.string().required('Category is required'),
        iddsiLevel: Yup.string().required('Type is required'),
        textureLevel: Yup.string().when("iddsiLevel", {
            is: "Food",
            then: (schema) => schema.required('Texture level is required for Food items'),
            otherwise: (schema) => schema.nullable()
        }),
        consistencyLevel: Yup.string().when("iddsiLevel", {
            is: "Drink",
            then: (schema) => schema.required('Consistency level is required for Food items'),
            otherwise: (schema) => schema.nullable()
        }),
    });

    /* React formik for form validation end */ 

    const handleCSVModalCancel = () => {
        setDisplayModal(false);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleView = (row) => {
        setViewData(row);
        setSelectedIddsiLevel(row.iddsi_level);
        setIsViewMode(true);
        setIsModalVisible(true);
    };

    const handleEdit = (row) => {
        setViewData(row);
        setSelectedIddsiLevel(row.iddsi_level);
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
                    getAllFoodItems();
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
            placeholder="Search by food item"
            value={searchData}
            onChange={(e) => { setsearchData(e.target.value) }}
            style={{ marginBottom: '10px', width: '300px' }}
        />
    );

    return (
        <>
            <StyleSheetManager shouldForwardProp={isPropValid}>
            <div id="panel-1" className="panel">
                <div className="panel-hdr">
                    <h2>Food Items List</h2>
                    <div className="panel-toolbar">
                        <Link
                            to="#"
                            onClick={showModal}
                            className="btn btn-sm btn-primary waves-effect waves-themed mr-2"
                        >
                            <i className="fal fa-plus"></i> Create Food Items
                        </Link>
                        <Link
                            to="#"
                            onClick={() => setDisplayModal(true)}
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

            {/* Modal for CSV Upload */}
            <CSVUploadModal
                showModal={displayModal} 
                handleCancel={handleCSVModalCancel}
                getAllFoodItems={getAllFoodItems}
            />

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
                        foodName: viewData?.name || '',
                        category: viewData?.category || '',
                        iddsiLevel: viewData?.iddsi_level || '',
                        textureLevel: viewData?.measurement || '',
                        consistencyLevel: viewData?.measurement || '',
                    }}
                    
                    validationSchema={validationSchema}
                    onSubmit={id ? handleFormEdit : handleSubmit}
                >
                
                {({ setFieldValue, handleChange, handleSubmit, values, touched, errors }) => (
                    <AntForm layout="vertical" onFinish={handleSubmit}>
                        <AntForm.Item 
                            label="Name of the Food Item" 
                            name="foodName"
                            validateStatus={touched.foodName && errors.foodName ? 'error' : ''}
                            help={touched.foodName && errors.foodName ? errors.foodName : ''}
                        >
                            <div style={{display:'none'}}>{values.foodName}</div>
                            <Input
                                name="foodName" 
                                placeholder="Enter food item name"
                                onChange={handleChange}
                                value={values.foodName}
                                type="text"
                                disabled={isViewMode}
                            />
                        </AntForm.Item>
                        <br/>
                        <AntForm.Item
                            label="Category" 
                            name="category"
                            validateStatus={touched.category && errors.category ? 'error' : ''}
                            help={touched.category && errors.category ? errors.category : ''}
                        >
                            <div style={{display:'none'}}>{values.category}</div>
                            <Select 
                                placeholder="Select Category"
                                onChange={(value) => setFieldValue('category', value)}
                                value={values.category}
                                disabled={isViewMode}
                            >
                                <Option value="Chicken">Chicken</Option>
                                <Option value="Pork">Pork</Option>
                                <Option value="Fish">Fish</Option>
                                <Option value="Veg">Veg</Option>
                            </Select>
                        </AntForm.Item>
                        <br/>
                        <AntForm.Item 
                            label="Food Type" 
                            name="iddsiLevel"
                            validateStatus={touched.iddsiLevel && errors.iddsiLevel ? 'error' : ''}
                            help={touched.iddsiLevel && errors.iddsiLevel ? errors.iddsiLevel : ''}
                        >
                            <div style={{display:'none'}}>{values.iddsiLevel}</div>
                            <Select
                                name="iddsiLevel"
                                placeholder="Select Food Type"
                                onChange={(value) => {
                                    setFieldValue('iddsiLevel', value)
                                    setSelectedIddsiLevel(value);
                                }}
                                value={selectedIddsiLevel || values.iddsiLevel}
                                disabled={isViewMode}
                            >
                                <Option value="Food">Food</Option>
                                <Option value="Drink">Drink</Option>
                            </Select>
                        </AntForm.Item>
                        <br/>
                        {/* Conditionally render Texture Level or Consistency Level dropdown */}
                        {selectedIddsiLevel && selectedIddsiLevel === 'Food' && (
                            <AntForm.Item 
                                label="Texture Level" 
                                name="textureLevel"
                                validateStatus={touched.textureLevel && errors.textureLevel ? 'error' : ''}
                                help={touched.textureLevel && errors.textureLevel ? errors.textureLevel : ''}
                            >
                                <div style={{display:'none'}}>{values.textureLevel}</div>
                                <Select 
                                    placeholder="Select Texture Level"
                                    onChange={(value) => setFieldValue('textureLevel', value)}
                                    value={values.textureLevel}
                                    disabled={isViewMode}
                                >
                                    <Option value="Liquidised">Liquidised</Option>
                                    <Option value="Pureed">Pureed</Option>
                                    <Option value="Minced & Moist">Minced & Moist</Option>
                                    <Option value="Soft & Bite-Sized">Soft & Bite-Sized</Option>
                                    <Option value="Easy to Chew">Easy to Chew</Option>
                                    <Option value="Regular">Regular</Option>
                                </Select>
                            </AntForm.Item>
                        )}
                        {selectedIddsiLevel && selectedIddsiLevel === 'Drink' && (
                            <AntForm.Item 
                                label="Consistency Level" 
                                name="consistencyLevel"
                                validateStatus={touched.consistencyLevel && errors.consistencyLevel ? 'error' : ''}
                                help={touched.consistencyLevel && errors.consistencyLevel ? errors.consistencyLevel : ''}
                            >
                                <div style={{display:'none'}}>{values.consistencyLevel}</div>
                                <Select 
                                    placeholder="Select Consistency Level"
                                    onChange={(value) => setFieldValue('consistencyLevel', value)}
                                    value={values.consistencyLevel}
                                    disabled={isViewMode}
                                >
                                    <Option value="Thin">Thin</Option>
                                    <Option value="Slightly-Thick">Slightly-Thick</Option>
                                    <Option value="Mildly-Thick">Mildly-Thick</Option>
                                    <Option value="Moderately-Thick">Moderately-Thick</Option>
                                    <Option value="Extremely-Thick">Extremely-Thick</Option>
                                </Select>
                            </AntForm.Item>
                        )}
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
        </>
    );
    
}

export default DietaryDataTable;