import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { Row, Col, Card, Typography, Button, Image } from "antd";
import Loader from "../common/Loader";
import dietaryImg from "../../images/dietary.webp";
import residentImg from "../../images/resident.webp";

const { Title, Paragraph } = Typography;

const Dashboard = () => {
    const [loader, setLoader] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setLoader(false);
            navigate("/login");
        } else {
            setLoader(false);
        }
    }, [user, navigate]);

    return (
        <>
            {loader ? <Loader /> : ""}
            {user ? (
                <div style={{ padding: "24px" }}>
                    <Title level={3} style={{ textAlign: "center", marginBottom: "32px" }}>
                        Welcome to Dietary System
                    </Title>

                    <Row gutter={[24, 24]} justify="center">
                        {/* Dietary Management Section */}
                        <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                cover={
                                    <Image
                                        alt="Dietary Management"
                                        src={dietaryImg}
                                        preview={false}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                }
                            >
                                <Title level={4}>Dietary Management</Title>
                                <Paragraph>
                                    Manage the dietary plans for the residents. Ensure balanced nutrition and meal planning.
                                </Paragraph>
                                <Link to="/dietary-management">
                                    <Button type="primary">Go to Dietary Management</Button>
                                </Link>
                            </Card>
                        </Col>

                        {/* Resident Management Section */}
                        <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                cover={
                                    <Image
                                        alt="Resident Management"
                                        src={residentImg}
                                        preview={false}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                }
                            >
                                <Title level={4}>Resident Management</Title>
                                <Paragraph>
                                    Oversee the resident&aposs profiles, health status, and personal information with ease.
                                </Paragraph>
                                <Link to="/resident-management">
                                    <Button type="primary">Go to Resident Management</Button>
                                </Link>
                            </Card>
                        </Col>
                    </Row>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
};

export default Dashboard;
