import { Button, Col, Layout, Modal, Row, Space, Typography } from "antd";
import { useCallback } from "react";
import FoodTable from "../components/FoodTable";
import NewFoodForm from "../components/NewFoodForm";
import { useAuthContext } from "../contexts/AuthContext";
import { useAddNewFood, useUserFoods } from "../hooks/api/food";
import { NewFoodEntry } from "../models/food";
const { Header, Content } = Layout;

const Dashboard = () => {
  const { authUser, onLogout } = useAuthContext();
  const { data } = useUserFoods();
  const addNewFoodMutation = useAddNewFood();

  const onAddNewFood = useCallback(
    (entry: NewFoodEntry) => {
      addNewFoodMutation.mutate(
        {
          ...entry,
          takenAt: entry.takenAt.toISOString(),
        },
        {
          onError: (error) => {
            Modal.error({
              title: "Something went wrong!",
              content: (error as Error).message,
            });
          },
        }
      );
    },
    [addNewFoodMutation]
  );

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
      <Content style={{ padding: "50px" }}>
        <Space direction="vertical">
          <NewFoodForm onSubmit={onAddNewFood} />

          <FoodTable foods={data || []} />
        </Space>
      </Content>
    </Layout>
  );
};

export default Dashboard;
