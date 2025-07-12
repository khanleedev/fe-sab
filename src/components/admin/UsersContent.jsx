import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  Table,
  Modal,
  message,
  Dropdown,
  InputNumber,
} from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import UseCookie from "../../hooks/UseCookie";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getListAccountsApi, updateAccountApi } from "../../api/account";

const UsersContent = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { removeToken } = UseCookie();

  const queryClient = useQueryClient();

  const {
    data: listAccounts,
    isLoading: isLoadingAccounts,
    error,
  } = useQuery({
    queryKey: ["listAccounts"],
    queryFn: () =>
      getListAccountsApi().then((res) => {
        return res.data.content || res.data;
      }),
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch accounts";
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login");
      }
    },
  });

  const { mutateAsync: updateAccount, isLoading: isLoadingUpdateAccount } =
    useMutation({
      mutationKey: ["updateAccount"],
      mutationFn: updateAccountApi,
      onSuccess: () => {
        toast.success("Account updated successfully");
        queryClient.invalidateQueries("listAccounts");
        form.resetFields();
        closeModal();
      },
      onError: (err) => {
        const errorMessage =
          err.response?.data?.message || "Failed to update account";
        toast.error(errorMessage);
        if (err.response?.status === 401) {
          removeToken();
          navigate("/login");
        }
      },
    });

  const handleSubmit = (values) => {
    updateAccount({
      id: selectedAccount.id,
      userName: values.userName,
      phoneNo: values.phoneNo,
      balance: values.balance, // Include balance in the payload
    });
  };

  const handleSetForm = (account) => {
    setSelectedAccount(account);
    form.setFieldsValue({
      userName: account.username,
      phoneNo: account.phoneNo,
      balance: account.balance, // Prepopulate balance
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
    form.resetFields();
  };

  const filteredAccounts = listAccounts?.filter(
    (account) =>
      account.username.toLowerCase().includes(searchText.toLowerCase()) ||
      account.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNo",
      key: "phoneNo",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (text) => `$${text?.toFixed(2) || "0.00"}`, // Format balance as currency
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                label: <p onClick={() => handleSetForm(record)}>Edit</p>,
                key: "0",
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: 24,
        minHeight: 360,
        background: "white",
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-row justify-between items-center">
        <Input
          placeholder="Search accounts by username or email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
      </div>

      {error && (
        <div className="text-red-500">
          Error: {error.response?.data?.message || "Failed to load accounts"}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={filteredAccounts}
        rowKey="id"
        loading={isLoadingAccounts}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        title="Update Account"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ minWidth: "100%" }}
        >
          <Form.Item
            label="Username"
            name="userName"
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNo"
            rules={[{ required: true, message: "Please input phone number!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Balance"
            name="balance"
            rules={[{ required: true, message: "Please input balance!" }]}
          >
            <InputNumber
              min={0} // Prevent negative balance
              step={0.01} // Allow decimal values
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$|\,/g, "")}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <div className="flex justify-end gap-2 pt-2 border-t border-t-[#ccc]">
            <Button danger onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoadingUpdateAccount}
            >
              Update
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersContent;
