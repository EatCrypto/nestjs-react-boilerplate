import { LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Descriptions,
  Layout,
  Row,
  Space,
  Typography,
} from "antd";
import { useMemo, useState } from "react";
import FoodSection from "../components/FoodSection";
import UserSelection from "../components/UserSelection";
import { useAuthContext } from "../contexts/AuthContext";
import {
  useAverageEntriesPerUserReport,
  useEntriesPerWeekReport,
} from "../hooks/api/food";
import { useAllUsers } from "../hooks/api/user";
const { Header, Content } = Layout;

const AdminDashboard = () => {
  const { authUser, onLogout } = useAuthContext();
  const { data: users } = useAllUsers();
  const { data: entriesPerWeekReport } = useEntriesPerWeekReport();
  const { data: averageEntriesPerUserReport } =
    useAverageEntriesPerUserReport();

  const [selectedUserId, setSelectedUserId] = useState<number>();
  const selectedUser = useMemo(
    () => users?.find((u) => u.id === selectedUserId),
    [selectedUserId, users]
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
          {selectedUserId && (
            <Button
              type="link"
              icon={<LeftOutlined />}
              onClick={() => setSelectedUserId(undefined)}
            >
              Back
            </Button>
          )}

          {selectedUser ? (
            <Space direction="vertical">
              <Typography.Title level={4}>
                Average calories:{" "}
                {(
                  (averageEntriesPerUserReport ?? {})[selectedUser.id] ?? 0
                ).toFixed(2)}
              </Typography.Title>

              <FoodSection user={selectedUser} editable />
            </Space>
          ) : (
            <Space direction="vertical">
              <Descriptions title="Entries Report">
                <Descriptions.Item label="Entries in the last 7 days">
                  <Typography.Title level={5}>
                    {entriesPerWeekReport?.lastWeekEntries ?? 0}
                  </Typography.Title>
                </Descriptions.Item>
                <Descriptions.Item label="Entries the week before last 7 days">
                  <Typography.Title level={5}>
                    {entriesPerWeekReport?.priorToLastWeekEntries ?? 0}
                  </Typography.Title>
                </Descriptions.Item>
              </Descriptions>

              <UserSelection
                users={users ?? []}
                onSelect={setSelectedUserId}
                averageCaloriesPerUser={averageEntriesPerUserReport ?? {}}
              />
            </Space>
          )}
        </Space>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
