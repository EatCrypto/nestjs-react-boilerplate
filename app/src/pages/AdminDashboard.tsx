import { LeftOutlined } from "@ant-design/icons";
import { Button, Col, Layout, Modal, Row, Space, Typography } from "antd";
import { useCallback, useMemo, useState } from "react";
import FoodTable from "../components/FoodTable";
import NewFoodForm from "../components/NewFoodForm";
import UserSelection from "../components/UserSelection";
import { useAuthContext } from "../contexts/AuthContext";
import {
  useAdminAddNewFood,
  useDeleteFood,
  useUpdateFood,
} from "../hooks/api/food";
import { useAllUsers } from "../hooks/api/user";
import { Food, NewFoodEntry } from "../models/food";
const { Header, Content } = Layout;

const AdminDashboard = () => {
  const { authUser, onLogout } = useAuthContext();
  const { data } = useAllUsers();
  const adminAddNewFoodMutation = useAdminAddNewFood();
  const updateFoodMutation = useUpdateFood();
  const deleteFoodMutation = useDeleteFood();
  const [selectedUserId, setSelectedUserId] = useState<number>();

  const onAddNewFood = useCallback(
    (entry: NewFoodEntry) => {
      if (selectedUserId) {
        adminAddNewFoodMutation.mutate(
          {
            ...entry,
            takenAt: entry.takenAt.toISOString(),
            userId: selectedUserId,
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
      }
    },
    [adminAddNewFoodMutation, selectedUserId]
  );

  const onUpdateFood = useCallback(
    (updatedFood: Food) => {
      updateFoodMutation.mutate(updatedFood, {
        onError: (error) => {
          Modal.error({
            title: "Something went wrong!",
            content: (error as Error).message,
          });
        },
      });
    },
    [updateFoodMutation]
  );

  const onDeleteFood = useCallback(
    (id: number) => {
      deleteFoodMutation.mutate(id);
    },
    [deleteFoodMutation]
  );

  const selectedUserFoods = useMemo(() => {
    if (selectedUserId && data) {
      return data.find((user) => user.id === selectedUserId)?.foods ?? [];
    }
    return [];
  }, [data, selectedUserId]);

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
          {selectedUserId && (
            <Button
              type="link"
              icon={<LeftOutlined />}
              onClick={() => setSelectedUserId(undefined)}
            >
              Back
            </Button>
          )}

          {selectedUserId ? (
            <Space direction="vertical">
              <NewFoodForm onSubmit={onAddNewFood} />

              <FoodTable
                foods={selectedUserFoods}
                editable
                onUpdate={onUpdateFood}
                onDelete={onDeleteFood}
              />
            </Space>
          ) : (
            <UserSelection users={data ?? []} onSelect={setSelectedUserId} />
          )}
        </Space>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
