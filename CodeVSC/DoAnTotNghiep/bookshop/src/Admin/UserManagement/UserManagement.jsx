import React, { useState, useEffect, Component } from "react";
import DataTable from "react-data-table-component";
import "./UserManagement.css";
import { deleteAsync, getAsync, postAsync, putAsync } from "../../Apis/axios";
import { toast } from "react-toastify";
import { Button, Input, Space, Select, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
const UserManagement = () => {
  const { Search } = Input;
  const { Option } = Select;
  const [userList, setUserList] = useState();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "30"],
    total: 0,
  });
  const [params, setParams] = useState({
    search: "",
    categoryId: "",
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

  const fetchUserData = async () => {
    try {
      let url = `/api/User/GetAll?pageSize=${pagination.pageSize}&currentPage=${pagination.current}`;
      if (params.search) {
        url += `&search=${params.search}`;
      }
      if (params.sortBy && params.sortOrder) {
        url += `&sortBy=${params.sortBy}&sortOrder=${params.sortOrder}`;
      }
      const res = await getAsync(url);
      setUserList(res.data);
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

  const deleteUser = async (id) => {
    try {
      await deleteAsync("/api/user/delete?id=" + id);
      toast.success("Delete the user successfully", {
        autoClose: 1000,
      });
    } catch (error) {}
  };

  const lock = async (id) => {
    try {
      await putAsync("/api/user/Lock?userId=" + id);
      toast.success("Lock the user successfully", {
        autoClose: 1000,
      });
      fetchUserData();
    } catch (error) {}
  };

  const unLock = async (id) => {
    try {
      await putAsync("/api/user/UnLock?userId=" + id);
      toast.success("Unlock the user successfully", {
        autoClose: 1000,
      });
      fetchUserData();
    } catch (error) {}
  };

  const customAvatarCell = (row) =>
    row.avatarUrl && (
      <img
        src={row.avatarUrl}
        alt="Avatar"
        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
      />
    );
  const customActionCell = (row) => (
    <div>
      <Space>
        {row.status === 1 && (
          <Popconfirm
            title="Are you sure you want to lock this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => lock(row.id)}
          >
            <Button type="danger" icon={<LockOutlined />} />
          </Popconfirm>
        )}

        {row.status === 0 && (
          <Popconfirm
            title="Are you sure you want to unlock this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => unLock(row.id)}
          >
            <Button type="danger" icon={<UnlockOutlined />} />
          </Popconfirm>
        )}

        <Popconfirm
          title="Are you sure you want to delete this user?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => deleteUser(row.id)}
        >
          <Button type="danger" icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    </div>
  );
  useEffect(() => {
    fetchUserData();
  }, [pagination.current, pagination.pageSize, params]);
  const columns = [
    {
      name: "Index",
      selector: (row, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
      sortable: false,
      width: "80px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "200px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Address",
      selector: (row) => row.address,
      width: "200px",
    },
    {
        name: "Phone Number",
        selector: (row) => row.phoneNumber,
        width: "100px",
      },
    {
      name: "Date of birth",
      selector: (row) => {
        // Chuyển đổi ngày sinh thành đối tượng Date
        const dob = new Date(row.dateOfBirth);
    
        // Lấy các thành phần của ngày tháng để format
        const day = dob.getDate().toString().padStart(2, '0'); // Lấy ngày và thêm số 0 ở đầu nếu cần
        const month = (dob.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng (tháng trong JavaScript bắt đầu từ 0)
        const year = dob.getFullYear();
    
        // Trả về chuỗi đã được format
        return `${day}-${month}-${year}`;
      },
      sortable: true,
      width: "100px",
    },
    {
      name: "Avatar",
      selector: (row) => row.avatarUrl,
      sortable: false,
      width: "100px",
      cell: customAvatarCell,
    },
    {
      name: "Actions",
      cell: customActionCell,
      width: "100px",
    },
  ];
  return (
    <div>
      <DataTable
        title="User List"
        columns={columns}
        data={userList}
        pagination
        paginationServer
        paginationTotalRows={pagination.total}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        subHeader
        subHeaderComponent={
          <div>
            <Search
              style={{ width: "250px" }}
              placeholder="Search by name"
              onSearch={handleSearchChange}
              enterButton
            />
          </div>
        }
        onSort={handleSortChange}
        sortServer
      />
    </div>
  );
};

export default UserManagement;
