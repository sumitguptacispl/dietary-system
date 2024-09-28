import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Input, Button, Space, Tag, Form, Select, Modal, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import UserDocumentUpload from './UserDocumentUpload';

const { Option } = Select;

const UserDataTable = (props) => {
    const { data } = props;

    // Transform the incoming data to fit the column structure
    const dataSource = data.map((item) => ({
        key: item.user_id, // Unique key for each row
        name: `${item.first_name} ${item.last_name}`, // Combine first and last name
        email: item.email,
        phone: item.phone,
        role_name: item.role_name,
        is_active: item.is_active === 1 ? 'Active' : 'Inactive', // Convert active/inactive to string
    }));

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
    const [form] = Form.useForm();
    const [state, setState] = useState({
        projectDocuments: [],
        
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        console.log(searchText);
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        render: (text) =>
            searchedColumn === dataIndex ? (
                <span style={{ backgroundColor: '#ffc069', padding: 0 }}>{text}</span>
            ) : (
                text
            ),
    });

    const handleView = (record) => {
        console.log('View record:', record);
    };

    const handleEdit = (record) => {
        console.log('Edit record:', record);
    };

    const handleDelete = (record) => {
        console.log('Delete record:', record);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                console.log('Form Values: ', values);
                // Perform the user creation logic here
                setIsModalVisible(false);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    // Document Upload Code
    const handleProjectDocumentChange = (images) => {
        setState({ ...state, projectDocuments: images });
    };
    
    const handleDocumentDelete = (doc) => {
        let documents = state.projectDocuments;
        let documentIndex = documents.findIndex(
        (res) => res.file.uid === doc.file.uid
        );
        documents.splice(documentIndex, 1);
        setState({ ...state, projectDocuments: documents });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'), // Searchable
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'), // Searchable
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            ...getColumnSearchProps('phone'), // Searchable
        },
        {
            title: 'Role',
            dataIndex: 'role_name',
            key: 'role_name',
            ...getColumnSearchProps('role_name'), // Searchable
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Inactive', value: 'Inactive' },
            ],
            onFilter: (value, record) => record.is_active.indexOf(value) === 0,
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button 
                        type="primary" 
                        size="small" 
                        onClick={() => handleView(record)}
                    >
                        View
                    </Button>
                    <Button 
                        type="default" 
                        size="small" 
                        onClick={() => handleEdit(record)} 
                        style={{ backgroundColor: '#52c41a', color: '#fff' }} // Green button for Edit
                    >
                        Edit
                    </Button>
                    <Button 
                        type="default" 
                        size="small" 
                        onClick={() => handleDelete(record)} 
                        style={{ backgroundColor: '#ff4d4f', color: '#fff' }} // Red button for Delete
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div id="panel-1" className="panel">
                <div className="panel-hdr">
                    <h2>Users List</h2>
                    <div className="panel-toolbar">
                        <Link
                            to="#"
                            onClick={showModal}
                            className="btn btn-sm btn-primary waves-effect waves-themed mr-2"
                        >
                            <i className="fal fa-plus"></i> Create User
                        </Link>
                    </div>
                </div>
            </div>

            {/* User Create Modal */}
            <Modal
                title="Create User"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Submit"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="createUserForm"
                    initialValues={{ status: 'active', role: 'Superadmin' }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="First Name"
                                name="first_name"
                                rules={[{ required: true, message: 'Please enter the first name!' }]}
                            >
                                <Input placeholder="Enter first name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Last Name"
                                name="last_name"
                                rules={[{ required: true, message: 'Please enter the last name!' }]}
                            >
                                <Input placeholder="Enter last name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Row for Email and Phone */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter a valid email!' },
                                    { type: 'email', message: 'The input is not a valid email!' },
                                ]}
                            >
                                <Input placeholder="Enter email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[{ required: true, message: 'Please enter the phone number!' }]}
                            >
                                <Input placeholder="Enter phone number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Row for Status and Role */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Status"
                                name="status"
                                rules={[{ required: true, message: 'Please select a status!' }]}
                            >
                                <Select placeholder="Select status">
                                    <Option value="active">Active</Option>
                                    <Option value="inactive">Inactive</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Role"
                                name="role"
                                rules={[{ required: true, message: 'Please select a role!' }]}
                            >
                                <Select placeholder="Select role">
                                    <Option value="Superadmin">Superadmin</Option>
                                    <Option value="Admin">Admin</Option>
                                    <Option value="User">User</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16]}>
                        <Col xs={24} sm={24} lg={24}>
                            <UserDocumentUpload
                                stateValues={state}
                                handleProjectDocumentChange={
                                handleProjectDocumentChange
                            }
                            handleDocumentDelete={handleDocumentDelete}
                        />
                      </Col>
                    </Row>
                </Form>
            </Modal>

            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
                pagination={{ pageSize: 5 }} // Pagination control
            />
        </>
    );
};

// Add PropTypes to validate the `data` prop
UserDataTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            user_id: PropTypes.number.isRequired,
            first_name: PropTypes.string.isRequired,
            last_name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            phone: PropTypes.string.isRequired,
            role_name: PropTypes.string.isRequired,
            is_active: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default UserDataTable;
