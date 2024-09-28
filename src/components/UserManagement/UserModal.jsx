import { useState } from 'react';
import { Input, Button, Modal, Form, Select } from 'antd';

const { Option } = Select;

const UserModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

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


    return (
        <>
            <Button
                type="primary"
                onClick={showModal}
                style={{ marginBottom: '16px', backgroundColor: '#1890ff', color: '#fff' }} // Light blue button
            >
                Create User
            </Button>
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
                    <Form.Item
                        label="First Name"
                        name="first_name"
                        rules={[{ required: true, message: 'Please enter the first name!' }]}
                    >
                        <Input placeholder="Enter first name" />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="last_name"
                        rules={[{ required: true, message: 'Please enter the last name!' }]}
                    >
                        <Input placeholder="Enter last name" />
                    </Form.Item>

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

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            { required: true, message: 'Please enter the phone number!' },
                        ]}
                    >
                        <Input placeholder="Enter phone number" />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please select a status!' }]}
                    >
                        <Select>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Select>
                            <Option value="Superadmin">Superadmin</Option>
                            <Option value="Admin">Admin</Option>
                            <Option value="User">User</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UserModal;