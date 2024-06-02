import DataTable from "react-data-table-component";
import "./OrderManagement.css";
import { deleteAsync, getAsync, postAsync, putAsync } from "../../Apis/axios";
import { toast } from "react-toastify";
import { Button, Input, Space, Select, Popconfirm, Search } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderManagement = () => {
  const [orderList, setOrderList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "30"],
    total: 0,
  });
  const navigate = useNavigate();
  const { Search } = Input;
  const { Option } = Select;
  const statusArr = [
    {
      value: "",
      name: "All",
    },
    {
      value: -1,
      name: "Canceled",
    },
    {
      value: 1,
      name: "Wait for pay",
    },
    {
      value: 2,
      name: "Not shipped yet",
    },
    {
      value: 3,
      name: "Shipping",
    },
    {
      value: 4,
      name: "Shipped",
    },
  ];
  const [params, setParams] = useState({
    search: "",
    status: "",
    sortOrder: "",
    sortBy: "",
  });
  const handleSearchChange = (value) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: value,
    }));
  };

  const handleSortChange = (column, sortDirection) => {
    console.log(column, sortDirection);
    setParams((prevParams) => ({
      ...prevParams,
      sortBy: column.name,
      sortOrder: sortDirection,
    }));
  };
  useEffect(() => {
    fetchOrderList();
  }, [pagination.current, pagination.pageSize, params]); // Fetch data when current page or page size changes

  const fetchOrderList = async () => {
    try {
      let url = `/api/Order/GetAll?pageSize=${pagination.pageSize}&currentPage=${pagination.current}`;
      if (params.search) {
        url += `&search=${params.search}`;
      }
      if (params.status) {
        url += `&status=${params.status}`;
      }
      if (params.sortBy && params.sortOrder) {
        url += `&sortBy=${params.sortBy}&sortOrder=${params.sortOrder}`;
      }
      const res = await getAsync(url);
      setOrderList(res.data);
      setPagination((prevPagination) => ({
        ...prevPagination,
        total: res.total,
      }));
    } catch (error) {
      console.error("Error fetching book list:", error);
    }
  };

  const handlePageChange = (page) => {
    console.log(page);
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: page,
    }));
  };

  const handlePerRowsChange = async (perPage, page) => {
    console.log(perPage, page);
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: page,
      pageSize: perPage,
    }));
  };

  const customActionCell = (row) => (
    <div>
      <Space>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/Admin/Order/${row.id}`)}
        />
        {/* <Popconfirm
          title="Bạn có chắc chắn muốn xóa?"
          okText="Yes"
          cancelText="No"
          // onConfirm={() => deleteBook(row.id)}
        >
          <Button type="danger" icon={<DeleteOutlined />} />
        </Popconfirm> */}
      </Space>
    </div>
  );

  const customStatusCell = (row) => {
    if (row.status === -1) {
      return <div>Canceled</div>;
    }
    if (row.status === 2 && row.shipStatus === 2) {
      return <div>Completed</div>;
    }
    if (row.status === 2 && row.shipStatus === 0) {
      return <div>Processing</div>;
    }
    if (row.status === 2 && row.shipStatus === 1) {
      return <div>Shipping</div>;
    }
    if (row.status === 1) {
      return <div>Wait for pay</div>;
    }
  };

  const columns = [
    {
      name: "Index",
      selector: (row, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
      sortable: false,
      width: "80px",
    },
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
      width: "100px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "200px",
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      sortable: true,
      width: "120px",
    },
    {
      name: "Status",
      cell: customStatusCell,
      width: "150px",
    },
    {
      name: "Created Date",
      selector: (row) => row.createdDate,
      sortable: true,
      width: "120px",
    },
    {
      name: "Shipped Date",
      selector: (row) => row.shippedDate,
      sortable: true,
      width: "120px",
    },
    {
      name: "Actions",
      cell: customActionCell,
      width: "100px",
    },
  ];
  return (
    <DataTable
      title="Order List"
      columns={columns}
      data={orderList}
      pagination
      paginationServer
      paginationTotalRows={pagination.total}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerRowsChange}
      subHeader
      subHeaderComponent={
        <div>
          <label htmlFor="">Status</label>
          <Select
            id="categoryId"
            style={{
              minWidth: "150px",
              marginRight: "20px",
              marginLeft: "10px",
            }}
            onChange={async (value) => {
              await setParams((prevParams) => ({
                ...prevParams,
                status: value,
              }));
              setPagination((prev) => ({
                ...prev,
                current: 1,
              }));
            }}
          >
            {statusArr.map((status) => (
              <Option key={status.value} value={status.id}>
                {status.name}
              </Option>
            ))}
          </Select>

          <Search
            style={{ width: "250px" }}
            placeholder="Search by title"
            onSearch={handleSearchChange}
            enterButton
          />
        </div>
      }
      onSort={handleSortChange}
    />
  );
};

export default OrderManagement;
