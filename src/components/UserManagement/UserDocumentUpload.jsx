import React from "react";
import { Upload, Button, Row, Col } from "antd";
import CropModal from "../common/CropModal";
import imageCompression from 'browser-image-compression';
import { InboxOutlined, DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import { isImageOrFile } from "../../hooks/Helpers";
import { ErrorNotificationMsg } from "../../hooks/NotificationHelper";
import PropTypes from "prop-types";

const { Dragger } = Upload;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
class UserDocumentUpload extends React.Component {
  state = {
    isModalVisible: false,
    myFile: null
  };

  toggleCropModal = (status, myFile) => {
    this.setState({ isModalVisible: status, myFile: myFile });
  };

  uploadProductFile = async (file) => {
    // console.log('originalFile instanceof Blob', file instanceof Blob); // true
    // console.log(`originalFile size ${file.size / 1024 / 1024} MB`);
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true };
    const compressedFile = await imageCompression(file, options)
    // console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
    // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`);
    if (compressedFile.size > 1048576) {
      ErrorNotificationMsg("Maximum size for file upload is 1MB.");
      return false;
    }

    let uploadImageStat = this.props.stateValues.projectDocuments;
    let docObj = {
      file_name: compressedFile.name,
      ext: "." + compressedFile.name.split(".").pop(),
      file: compressedFile,
    };

    getBase64(compressedFile, (imageUrl) => (docObj.furl = imageUrl));
    await sleep(300);
    uploadImageStat.push(docObj);
    this.props.handleProjectDocumentChange(uploadImageStat);
  };

  beforeCropFeature = (file) => {
    return new Promise((resolve, reject) => {
      if (isImageOrFile(file.type)) {
        resolve(true);
      } else {
        ErrorNotificationMsg("Supported file types are jpg, jpeg, png.");
        reject(false);
      }
    })
  };

  render() {
    const { projectDocuments } = this.props.stateValues;
    const uploadProps = {
      multiple: false,
      listType: "picture-card",
      showUploadList: false,
      accept: ".jpg,.jpeg,.png",
      maxCount: 10,
      disabled: projectDocuments.length >= 10 ? true : false,
      projectDocuments,
    };
    return (
      <>
        <div className="secction-title" id="area3">
          <h3>Attachment(s)</h3>
        </div>

        <div className="upload-document">
          <Dragger
            {...uploadProps}
            customRequest={(e) => {
              this.beforeCropFeature(e.file).then(res => {
                console.log(res);
                this.toggleCropModal(true, e.file);
              });
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Supported file types are
              jpg, jpeg, png. File upload limit is 10.
            </p>
          </Dragger>
          {this.state.isModalVisible ?
            <CropModal
              myFile={this.state.myFile}
              isModalopen={this.state.isModalVisible}
              onOk={() => { this.toggleCropModal(false, null) }}
              onCancle={() => { this.toggleCropModal(false, null) }}
              handleSubmit={(file) => { this.uploadProductFile(file) }}
            /> : ""}
        </div>

        <div className="documents_wrap">
          <div className="documents">
            <Row gutter={[16]}>
              {projectDocuments &&
                projectDocuments.map((document, index) => {
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
                      <div className="imgdiv photo img-thumbnail">
                        <div className="img_wrap">
                          {isImageOrFile(document.file.type) ? (
                            <img src={document.furl} alt={document.url}></img>
                          ) : (
                            <FileTextOutlined />
                          )}
                        </div>
                        <h5>{document.file_name}</h5>
                        <div className="btnwrp">
                          <Button
                            type="primary"
                            htmlType="button"
                            size="small"
                            icon={<DeleteOutlined />}
                          ></Button>
                        </div>
                      </div>
                    </Col>
                  );
                })}
            </Row>
          </div>
        </div>
      </>
    );
  }
}

UserDocumentUpload.propTypes = {
    stateValues: PropTypes.shape({
        projectDocuments: PropTypes.object,
    }).isRequired,
    handleProjectDocumentChange: PropTypes.func.isRequired,
    handleDocumentDelete: PropTypes.func.isRequired,
};

export default UserDocumentUpload;
