import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Form as AntForm } from "antd";
//import Password from "antd/lib/input/Password";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { apiPost } from '../../hooks/Api';
import { SuccessNotificationMsg, ErrorNotificationMsg } from "../../hooks/NotificationHelper";

const Registration = () => {
    const [btnLoading, setBtnLoading] = useState(false);
    const navigate = useNavigate();
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
        phone: Yup.number().required('Phone number is required')
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setBtnLoading(true);
            const response = await apiPost('/register', values);
            if(response.status === 'success'){
                resetForm();
                SuccessNotificationMsg("Success",response.message);
                setBtnLoading(false);
                navigate('/login');
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

    return (
        <>
            <div className="card p-4 border-top-left-radius-0 border-top-right-radius-0">
            <Formik
                initialValues={{ name: '', email: '', password: '', phone: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
            {({ isSubmitting, handleChange, handleSubmit, values, touched, errors }) => (
                <AntForm onFinish={handleSubmit} style={{ maxWidth: '300px', margin: '0 auto' }} layout="vertical">
                <AntForm.Item
                    label="Name"
                    name="name"
                    validateStatus={touched.name && errors.name ? 'error' : ''}
                    help={touched.name && errors.name ? errors.name : ''}
                >
                    <Input
                        name="name"
                        placeholder="Full name"
                        size="large"
                        onChange={handleChange}
                        value={values.name}
                        type="text"
                    />
                </AntForm.Item>
                <AntForm.Item
                    label="Email"
                    name="email"
                    validateStatus={touched.email && errors.email ? 'error' : ''}
                    help={touched.email && errors.email ? errors.email : ''}
                >
                    <Input
                        name="email"
                        placeholder="Email"
                        size="large"
                        onChange={handleChange}
                        value={values.email}
                        type="email"
                    />
                </AntForm.Item>
                <AntForm.Item
                    label="Password"
                    name="password"
                    validateStatus={touched.password && errors.password ? 'error' : ''}
                    help={touched.password && errors.password ? errors.password : ''}
                >
                    <Input.Password
                        name="password"
                        placeholder="Password"
                        size="large"
                        onChange={handleChange}
                        value={values.password}
                        maxLength={10}
                    />
                </AntForm.Item>
                <br/>
                <AntForm.Item
                    label="Phone"
                    name="phone"
                    validateStatus={touched.phone && errors.phone ? 'error' : ''}
                    help={touched.phone && errors.phone ? errors.phone : ''}
                >
                    <Input
                        name="phone"
                        placeholder="Phone number"
                        size="large"
                        onChange={handleChange}
                        value={values.phone}
                        maxLength={10}
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                e.preventDefault();
                            }
                        }}
                    />
                </AntForm.Item>
                <br/>
                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={isSubmitting}
                        loading={btnLoading}
                    >
                    {isSubmitting ? 'Registering...' : 'Register'}
                    </Button>

                    <Button
                        type="default"
                        style={{ backgroundColor: '#52c41a', color: '#fff' }} // Green button for Login
                    >
                        <Link to="/login" style={{ color: '#fff' }}>Login</Link>
                    </Button>
                </div>
                </AntForm>
            )}
            </Formik>
            </div>
        </>
    );
};

export default Registration;
