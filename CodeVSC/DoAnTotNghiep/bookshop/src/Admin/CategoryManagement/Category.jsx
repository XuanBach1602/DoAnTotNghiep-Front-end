import React, { useState, useEffect, Component } from "react";
import DataTable from "react-data-table-component";
import { deleteAsync, getAsync, postAsync, putAsync } from "../../Apis/axios";
import { toast } from "react-toastify";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Modal, Input, Space, Popconfirm } from "antd";
import "./Category.css";
const Category = () => {
  const { Search } = Input;
  const [categoryList, setCategoryList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "30"],
    total: 0,
  });
  const [params, setParams] = useState({
    search: "",
    sortOrder: "",
    sortBy: "",
  });

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

  const handleEdit = (record) => {
    setFormData(record);
    setFormError("");
    setModalDetailVisible(true);
  };

  const fetchCategoryList = async () => {
    try {
      let url = `/api/Category/GetCategoryManagementData?pageSize=${pagination.pageSize}&currentPage=${pagination.current}`;
      if (params.search) {
        url += `&search=${params.search}`;
      }
      if (params.sortBy && params.sortOrder) {
        url += `&sortBy=${params.sortBy}&sortOrder=${params.sortOrder}`;
      }
      const res = await getAsync(url);
      setCategoryList(res.data);
      setPagination((prevPagination) => ({
        ...prevPagination,
        total: res.total,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteAsync("/api/Category/Delete?id=" + id);
      fetchCategoryList();
      toast.success("Delete the category successfully", {
        autoClose: 1000,
      });
    } catch (error) {}
  };

  //Modal
  const defaultFormData = {
    id: 0,
    name: "",
    displayOrder: null,
  };
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [modalDetailVisible, setModalDetailVisible] = useState(false);
  const [formError, setFormError] = useState("");
  const showAddForm = () => {
    setFormError("");
    setFormData({ ...defaultFormData });
    setModalDetailVisible(true);
  };
  useEffect(() => {
    fetchCategoryList();
  }, [params,pagination.current, pagination.pageSize]);

  const customActionCell = (row) => (
    <div>
      <Space>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(row)}
        />
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => deleteCategory(row.id)}
        >
          <Button type="danger" icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    </div>
  );
  const columns = [
    {
      name: "Index",
      selector: (row, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
      sortable: false,
      width: "200px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "500px",
    },
    {
      name: "Display Order",
      selector: (row) => row.displayOrder,
      sortable: true,
      width: "200px",
    },
    {
      name: "Actions",
      cell: customActionCell,
      width: "100px",
    },
  ];
  const cancelDetailView = () => {
    setModalDetailVisible(false);
  };
  const handleChange = (key, value) => {
    console.log(key,value)
    setFormData({ ...formData, [key]: value });
  };
  const handleSave = async () => {
    console.log(formData);
    if(formData.displayOrder <= 0) {
      setFormError("Display Order must be greater than 0");
      return;
    }
    if (isFormDataValid(formData)) {
        setFormError("");
        var formDataToSend = {
          Id: formData.id,
          Name: formData.name.trim(),
          DisplayOrder: formData.displayOrder
        }
      if(formData.id !== 0){
        try {
          await putAsync("/api/Category/Update", formDataToSend);
          setModalDetailVisible(false);
          fetchCategoryList();
          toast.success("Update the category successfully", {
            autoClose: 1000,
          });
        } catch (error) {
         setFormError(error.response.data);
        }
      }
      else {
        try {
          await postAsync("/api/Category/Add",formDataToSend);
          setModalDetailVisible(false);
          fetchCategoryList();
          toast.success("Add new category successfully", {
            autoClose: 1000,
          });
        } catch (error) {
          setFormError(error.response.data);
        }
      }
    } else {
        setFormError("Please fill full the form");
    }
  };
  const isFormDataValid = (formData) => {
    const fieldsToCheck = ['displayOrder','name'];
    for (const key of fieldsToCheck) {

        if (formData[key] === null || formData[key] === undefined) {
            return false;
        }
    }
    return true;
};
  return (
    <div>
      <DataTable
        title="Category List"
        columns={columns}
        data={categoryList}
        pagination
        paginationServer
        paginationTotalRows={pagination.total}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        subHeader
        subHeaderComponent={
          <div>
            <Button
              onClick={showAddForm}
              style={{ marginRight: "15px" }}
              type="default"
            >
              <PlusOutlined />
            </Button>
            <Search
              style={{ width: "250px" }}
              placeholder="Search by title"
              onSearch={handleSearchChange}
              enterButton
            />
          </div>
        }
        onSort={handleSortChange}
        sortServer
      />

      <Modal
        open={modalDetailVisible}
        onCancel={cancelDetailView}
        width={"1000px"}
        height={"1200px"}
        footer={[
          <div
            key="buttons"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              key="cancel"
              onClick={cancelDetailView}
              style={{ marginRight: "8px" }}
            >
              Close
            </Button>
            <Button key="confirm" type="primary" onClick={handleSave}>
              Save
            </Button>
          </div>,
        ]}
      >
        <div className="book-form">
          <div className="form-left">
            <div>
              <label htmlFor="title">Name</label>
              <Input
                id="title"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="display order">Display Order</label>
              <Input
                min={0}
                id="display order"
                value={formData.displayOrder}
                type="number"
                onChange={(e) => handleChange("displayOrder", e.target.value)}
              />
            </div>
            <span style={{ color: "red" }}>{formError}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Category;
