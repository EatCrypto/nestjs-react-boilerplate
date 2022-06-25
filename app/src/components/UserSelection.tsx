import { Space, Typography, Button } from "antd";
import { AverageEntriesAddedPerUser } from "../models/food";
import { User } from "../models/user";

const UserSelection = ({
  users,
  averageCaloriesPerUser,
  onSelect,
}: {
  users: User[];
  averageCaloriesPerUser: AverageEntriesAddedPerUser;
  onSelect: (userId: number) => void;
}) => {
  return (
    <Space direction="vertical">
      <Typography.Title level={4}>Select user to manage.</Typography.Title>
      <Space wrap>
        {users.map((user) => (
          <Button key={user.id} onClick={() => onSelect(user.id)}>
            {user.username} (Average Calories:{" "}
            {(averageCaloriesPerUser[user.id] ?? 0).toFixed(2)})
          </Button>
        ))}
      </Space>
    </Space>
  );
};

export default UserSelection;
