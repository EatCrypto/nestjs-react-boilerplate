import { Space, Typography, DatePicker } from "antd";
import { Moment } from "moment";

const FoodFilter = ({
  range,
  onChange,
}: {
  range: [Moment | null, Moment | null];
  onChange: (range: [Moment | null, Moment | null]) => void;
}) => {
  return (
    <Space align="center">
      <Typography.Paragraph style={{ margin: 0 }}>
        Filter by date range
      </Typography.Paragraph>

      <DatePicker.RangePicker
        value={range}
        onChange={(values) =>
          onChange([values?.[0] || null, values?.[1] || null])
        }
      />
    </Space>
  );
};

export default FoodFilter;
