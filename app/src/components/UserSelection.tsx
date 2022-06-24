import { Space, Typography, Button } from "antd";
import { User } from "../models/user";

const UserSelection = ({
  users,
  onSelect,
}: {
  users: User[];
  onSelect: (userId: number) => void;
}) => {
  return (
    <Space direction="vertical">
      <Typography>Select user to manage.</Typography>
      <Space>
        {users.map((user) => (
          <Button key={user.id} onClick={() => onSelect(user.id)}>
            {user.username}
          </Button>
        ))}
      </Space>
    </Space>
  );
};

export default UserSelection;
