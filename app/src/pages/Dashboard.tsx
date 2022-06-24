import { Button, Col, Layout, Row, Typography } from "antd";
import { useAuthContext } from "../contexts/AuthContext";
import { useUserFoods } from "../hooks/api/food";
const { Header, Content } = Layout;

const Dashboard = () => {
  const { authUser, onLogout } = useAuthContext();
  const { data } = useUserFoods();

  console.log(data);

  return (
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
      <Content style={{ padding: "0 50px" }}></Content>
    </Layout>
  );
};

export default Dashboard;
