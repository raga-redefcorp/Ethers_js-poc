import "./App.css";
import "antd/dist/antd.css";
import "./index.css";
import { Button, Col, Form, Input, Row } from "antd";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const startPayment = async ({ setError, ether, address }) => {
  console.log("start payment", address, ether);
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    ethers.utils.getAddress(address);
    const tx = await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther(ether),
    });
    console.log({ ether, address });
    console.log("tx", tx);
  } catch (err) {
    setError(err.message);
  }
};

function App() {
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = async (values) => {
    console.log("data:", values);
    setError();
    await startPayment({
      setError,
      ether: values.ether,
      address: values.address,
    });
  };

  return (
    <div>
      <Row justify="center">
        <h2>EthersJs POC</h2>
      </Row>
      <Row align="center" justify="center">
        <Col xs={10} style={{ padding: 20, backgroundColor: "#CFF5E7" }}>
          <Form
            form={form}
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="address"
              rules={[
                { required: true, message: "Please input a valid address" },
              ]}
            >
              <Input placeholder="Account / Wallet Address" />
            </Form.Item>
            <Form.Item
              name="ether"
              rules={[{ required: true, message: "Please input a amount" }]}
            >
              <Input placeholder="Amount" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                block
              >
                Send Eth
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Row justify="center">{!!error && <p>{error}</p>}</Row>
    </div>
  );
}

export default App;
