import { Button, Col, Form, Input, Row } from "antd";
import { useCallback } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { LoginPayload } from "../models/user";

const Login = () => {
  const { onLogin } = useAuthContext();

  const onFinish = useCallback(
    (payload: LoginPayload) => {
      onLogin(payload);
    },
    [onLogin]
  );

  return (
    <Row justify="center" align="middle" style={{ height: "100%" }}>
      <Col span={6}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
