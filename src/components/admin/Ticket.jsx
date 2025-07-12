import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTicketApi,
  updateTicketApi,
  getListTicketApi,
  deleteTicketByIdApi,
} from "../../api/ticket";
import { Button, Form, Input, Table, Modal, Dropdown, Upload, Popconfirm } from "antd";
import { SearchOutlined, MoreOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import UseCookie from "../../hooks/UseCookie";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { uploadTicketProductApi } from "../../api/ticketproduct";

const Ticket = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [typeModal, setTypeModal] = useState("create");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { removeToken } = UseCookie();
  const queryClient = useQueryClient();

  // Fetch tickets
  const {
    data: listTicket,
    isLoading: isLoadingTickets,
    error,
  } = useQuery({
    queryKey: ["listTicket"],
    queryFn: () =>
      getListTicketApi({}).then((res) => {
        return res.data.content || res.data;
      }),
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch tickets";
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login");
      }
    },
  });

  // Create ticket mutation
  const { mutateAsync: createTicket, isLoading: isLoadingCreateTicket } =
    useMutation({
      mutationKey: ["createTicket"],
      mutationFn: createTicketApi,
      onSuccess: () => {
        toast.success("Ticket created successfully");
        queryClient.invalidateQueries(["listTicket"]);
        form.resetFields();
        closeModal();
      },
      onError: (err) => {
        const errorMessage =
          err.response?.data?.message || "Failed to create ticket";
        toast.error(errorMessage);
        if (err.response?.status === 401) {
          removeToken();
          navigate("/login");
        }
      },
    });

  // Update ticket mutation
  const { mutateAsync: updateTicket, isLoading: isLoadingUpdateTicket } =
    useMutation({
      mutationKey: ["updateTicket"],
      mutationFn: updateTicketApi,
      onSuccess: () => {
        toast.success("Ticket updated successfully");
        queryClient.invalidateQueries(["listTicket"]);
        form.resetFields();
        closeModal();
      },
      onError: (err) => {
        const errorMessage =
          err.response?.data?.message || "Failed to update ticket";
        toast.error(errorMessage);
        if (err.response?.status === 401) {
          removeToken();
          navigate("/login");
        }
      },
    });

  // Upload file mutation
  const { mutate: uploadFile, isLoading: isUploadingFile } = useMutation({
    mutationFn: ({ id, file }) => {
      const formData = new FormData();
      formData.append("file", file);
      return uploadTicketProductApi(formData, id);
    },
    onSuccess: () => {
      toast.success("File uploaded successfully");
      queryClient.invalidateQueries(["listTicket"]);
      closeUploadModal();
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to upload file";
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login");
      }
    },
  });

  // Delete ticket mutation
  const { mutate: deleteTicket, isLoading: isLoadingDelete } = useMutation({
    mutationFn: (id) => deleteTicketByIdApi(id),
    onSuccess: () => {
      toast.success("Ticket deleted successfully");
      queryClient.invalidateQueries(["listTicket"]);
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to delete ticket";
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login");
      }
    },
  });

  const handleSubmit = (values) => {
    if (typeModal === "create") {
      createTicket({ title: values.title });
    } else {
      updateTicket({ id: selectedTicket.id, title: values.title });
    }
  };

  const handleSetForm = (type, ticket = null) => {
    setTypeModal(type);
    setSelectedTicket(ticket);
    if (type === "update" && ticket) {
      form.setFieldsValue({ title: ticket.title });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    form.resetFields();
  };

  const openUploadModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedTicket(null);
    setSelectedFile(null);
  };

  const handleFileChange = (info) => {
    if (info.fileList.length > 0) {
      setSelectedFile(info.fileList[0].originFileObj);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }
    if (!selectedTicket?.id) {
      toast.error("No ticket selected.");
      return;
    }

    uploadFile({ id: selectedTicket.id, file: selectedFile });
  };

  const handleDelete = (id) => {
    deleteTicket(id);
  };

  const filteredTickets = listTicket?.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
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
              {
                label: (
                  <p onClick={() => openUploadModal(record)}>Upload File</p>
                ),
                key: "1",
              },
              {
                label: (
                  <Popconfirm
                    title="Are you sure to delete this ticket?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <p style={{ color: "red" }}>Delete</p>
                  </Popconfirm>
                ),
                key: "2",
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
          placeholder="Search tickets by title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => handleSetForm("create")}>
          Create Ticket
        </Button>
      </div>

      {error && (
        <div className="text-red-500">
          Error: {error.response?.data?.message || "Failed to load tickets"}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={filteredTickets}
        rowKey="id"
        loading={isLoadingTickets || isLoadingDelete}
        pagination={{ pageSize: 10 }}
      />

      {/* Create/Update Modal */}
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        title={typeModal === "create" ? "Create New Ticket" : "Update Ticket"}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ minWidth: "100%" }}
        >
          <Form.Item
            label="Ticket Title"
            name="title"
            rules={[{ required: true, message: "Please input ticket title!" }]}
          >
            <Input />
          </Form.Item>
          <div className="flex justify-end gap-2 pt-2 border-t border-t-[#ccc]">
            <Button danger onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={
                typeModal === "create"
                  ? isLoadingCreateTicket
                  : isLoadingUpdateTicket
              }
            >
              {typeModal === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Upload File Modal */}
      <Modal
        open={isUploadModalOpen}
        onCancel={closeUploadModal}
        footer={null}
        title="Upload File for Ticket"
      >
        <div className="mb-4">
          <p>
            Uploading file for: {selectedTicket?.title || "Selected Ticket"}
          </p>
        </div>
        <Upload
          beforeUpload={() => false} // Prevent auto-upload
          onChange={handleFileChange}
          fileList={
            selectedFile ? [{ name: selectedFile.name, status: "done" }] : []
          }
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
          <Button danger onClick={closeUploadModal}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleUpload}
            loading={isUploadingFile}
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Ticket;