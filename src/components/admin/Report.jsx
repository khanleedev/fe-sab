import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  Table,
  Modal,
  Dropdown,
  Tag,
} from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import UseCookie from "../../hooks/UseCookie";
import {
  createReportApi,
  getListReportPendingApi,
  getListReportResolvedApi,
} from "../../api/report";

const Report = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeModal, setTypeModal] = useState("create");
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { removeToken } = UseCookie();

  const { data: allReports = [], isLoading } = useQuery({
    queryKey: ["allReports"],
    queryFn: async () => {
      const [pendingRes, resolvedRes] = await Promise.all([
        getListReportPendingApi(),
        getListReportResolvedApi(),
      ]);
      const pendingData = (pendingRes.data.content || pendingRes.data).map(
        (r) => ({
          ...r,
          status: "pending",
        })
      );
      const resolvedData = (resolvedRes.data.content || resolvedRes.data).map(
        (r) => ({
          ...r,
          status: "resolved",
        })
      );
      return [...pendingData, ...resolvedData];
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to fetch reports");
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login");
      }
    },
  });

  const handleSetForm = (type, report = null) => {
    setTypeModal(type);
    setSelectedReport(report);
    if (type === "update" && report) {
      form.setFieldsValue({ content: report.content });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const getStatusTag = (status) => {
    const color = status === "resolved" ? "green" : "orange";
    const label = status === "resolved" ? "Resolved" : "Pending";
    return <Tag color={color}>{label}</Tag>;
  };

  const columns = [
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Username",
      dataIndex: ["account", "username"],
      key: "username",
    },
    {
      title: "Email",
      dataIndex: ["account", "email"],
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: ["account", "phone"],
      key: "phone",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => getStatusTag(record?.status),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                label: (
                  <p onClick={() => handleSetForm("update", record)}>Edit</p>
                ),
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

  const filteredReports = allReports?.filter((report) =>
    report?.account?.username
      ?.toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: "white",
          margin: "24px",
          borderRadius: "8px",
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-row justify-between items-center">
          <Input
            placeholder="Search reports by username"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </div>

        <h2 className="text-lg font-semibold mt-4">All Reports</h2>
        <Table
          columns={columns}
          dataSource={filteredReports}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 7 }}
        />

        {/* Modal không cần nếu không tạo report ở đây */}
        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          title={typeModal === "create" ? "Create New Report" : "Update Report"}
        >
          <Form form={form} layout="vertical" style={{ minWidth: "100%" }}>
            <Form.Item
              label="Report Content"
              name="content"
              rules={[
                { required: true, message: "Please input report content!" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <div className="flex justify-end gap-2 pt-2 border-t border-t-[#ccc]">
              <Button danger onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {typeModal === "create" ? "Create" : "Update"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Report;
