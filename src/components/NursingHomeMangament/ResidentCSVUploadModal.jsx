import { useState } from "react";
import { Modal, Button, Form, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { apiPost } from '../../hooks/Api';
import { SuccessNotificationMsg, ErrorNotificationMsg } from "../../hooks/NotificationHelper";
import Papa from "papaparse";
import PropTypes from 'prop-types';

const ResidentCSVUploadModal = ({ showModal, handleCancel, getAllResidentData }) => {
    const [csvData, setCsvData] = useState(null);

    /* Define validation schema with Yup for Formik start */

    const validationSchema = Yup.object().shape({
        file: Yup.mixed()
            .required("CSV file is required")
            .test(
                "fileType",
                "Only CSV files are allowed",
                (value) => value && value.type === "text/csv"
            ),
    });

    /* Define validation schema with Yup for Formik end */


    /* code for CSV Upload start */
    const handleCSVParse = (file) => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                complete: (result) => {
                    setCsvData(result.data);
                    resolve(result.data);
                },
                header: true,
                skipEmptyLines: true,
                error: (err) => {
                    reject(err);
                }
            });
        });
    };

    const handleCSVSubmit = async (values, { resetForm }) => {
        if (csvData) {
            try {
                const response = await apiPost('/upload-resident-details', {csvData});
                if(response.status === 'success'){
                    setCsvData(null);
                    resetForm();
                    SuccessNotificationMsg("Success",response.message);
                    getAllResidentData();
                    handleCancel();
                } else {
                    setCsvData(null);
                    resetForm();
                    ErrorNotificationMsg(response.message);
                }
            } catch {
                setCsvData(null);
                resetForm();
                ErrorNotificationMsg("Error uploading CSV");
            }
        }
    };

    /* code for CSV Upload end */

    return (
        <Modal
            className='ant-modal-custom-width'
            title="Upload Only CSV Files"
            open={showModal}
            onCancel={handleCancel}
            footer={null}
        >
            <Formik
                initialValues={{
                    file: null,
                }}
                validationSchema={validationSchema}
                onSubmit={handleCSVSubmit}
            >
                {({ handleSubmit, errors, touched, isSubmitting }) => (
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            validateStatus={touched.file && errors.file ? "error" : ""}
                            help={touched.file && errors.file ? errors.file : null}
                        >
                            <Field name="file">
                                {({ form }) => (
                                    <Upload
                                        name="file"
                                        maxCount={1}
                                        beforeUpload={(file) => {
                                            if (file.type !== "text/csv") {
                                                ErrorNotificationMsg(`${file.name} is not a CSV file`);
                                                return Upload.LIST_IGNORE;
                                            }
                                            form.setFieldValue("file", file);
                                            handleCSVParse(file);
                                            return false;
                                        }}
                                        accept=".csv"
                                    >
                                        <Button icon={<UploadOutlined />}>Select File</Button>
                                    </Upload>
                                )}
                            </Field>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isSubmitting || !csvData}
                            >
                                Submit
                            </Button>
                            <Button
                                style={{ marginLeft: "8px", backgroundColor: '#ff4d4f', color: '#fff'}}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

ResidentCSVUploadModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    getAllResidentData: PropTypes.func.isRequired
};

export default ResidentCSVUploadModal;