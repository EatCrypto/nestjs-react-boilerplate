import { Button, Col, Layout, Row, Typography } from "antd";
import FoodSection from "../components/FoodSection";
import { useAuthContext } from "../contexts/AuthContext";
const { Header, Content } = Layout;

const Dashboard = () => {
  const { authUser, onLogout } = useAuthContext();

  return authUser ? (
    <Layout>
      <Header>
        <Row align="middle" gutter={24}>
          <Col>
            <Typography style={{ color: "white" }}>
              Welcome {authUser?.username}!
            </Typography>
          </Col>
          <Col>
            <Button onClick={onLogout}>Logout</Button>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: "50px" }}>
        <FoodSection user={authUser} />
      </Content>
    </Layout>
  ) : null;
};

export default Dashboard;
