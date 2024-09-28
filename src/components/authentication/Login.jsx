import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Form as AntForm } from "antd";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from "../../context/UserContext";
import { apiPost } from '../../hooks/Api';
import { SuccessNotificationMsg, ErrorNotificationMsg } from "../../hooks/NotificationHelper";

const Login = () => {
    const { login } = useContext(UserContext);
    const [btnLoading, setBtnLoading] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setBtnLoading(true);
            const response = await apiPost('/login', values);
            if(response.success === true){
                login(response.userData);
                resetForm();
                SuccessNotificationMsg("Success", response.message);
                setBtnLoading(false);
                navigate('/dashboard');
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
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
            {({ isSubmitting, handleChange, handleSubmit, values, touched, errors }) => (
                <AntForm onFinish={handleSubmit} style={{ maxWidth: '300px', margin: '0 auto' }} layout="vertical">
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
                <br/>
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
                <div style={{ marginTop: '16px' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={isSubmitting}
                        loading={btnLoading}
                    >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                </div>
                </AntForm>
            )}
            </Formik>
            </div>
        </>
    );
};

export default Login;
