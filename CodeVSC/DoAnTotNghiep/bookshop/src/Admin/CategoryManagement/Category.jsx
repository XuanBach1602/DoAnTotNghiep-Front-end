import React, { useState, useEffect, Component } from "react";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import {
  EditFilled,
  DeleteFilled,
  UploadOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Input, Space, Popconfirm, Image } from "antd";
import "./Category.css";
import useApi from "../../Apis/useApi";
import { useLoading } from "../../LoadingContext";
const Category = () => {
  const { setIsLoading } = useLoading();
  const { deleteAsync, getAsync, postAsync, putAsync } = useApi();
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
  }, [params, pagination.current, pagination.pageSize]);

  const customActionCell = (row) => (
    <div>
      <Space>
        <Button
          type="normal"
          icon={<EditFilled className="edit-icon" />}
          onClick={() => handleEdit(row)}
        />
        <Popconfirm
          title="
Are you sure you want to delete?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => deleteCategory(row.id)}
        >
          <Button
            type="danger"
            icon={<DeleteFilled className="delete-icon" />}
          />
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
    setUploadedFile(null);
  };
  const handleChange = (key, value) => {
    console.log(key, value);
    setFormData({ ...formData, [key]: value });
  };
  const handleSave = async () => {
    console.log(formData);
    if (formData.displayOrder <= 0) {
      setFormError("Display Order must be greater than 0");
      return;
    }
    if(!uploadedFile && !formData.iconUrl){
      setFormError("Please upload icon file");
      return;
    }
    if (isFormDataValid(formData)) {
      setFormError("");
      if (formData.id !== 0) {
        try {
          setIsLoading(true);
          const formDataToSend = new FormData();
          formDataToSend.append("Id",formData.id);
          formDataToSend.append("Name",formData.name.trim());
          formDataToSend.append("DisplayOrder",formData.displayOrder);
          formDataToSend.append("UpdateIcon", uploadedFile);
          await putAsync("/api/Category/Update", formDataToSend);
          setModalDetailVisible(false);
          fetchCategoryList();
          toast.success("Update the category successfully", {
            autoClose: 1000,
          });
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          setFormError(error?.response?.data);
        }
      } else {
        try {
          setIsLoading(true);
          const formDataToSend1 = new FormData();
          formDataToSend1.append("Id",formData.id);
          formDataToSend1.append("Name",formData.name.trim());
          formDataToSend1.append("DisplayOrder",formData.displayOrder);
          formDataToSend1.append("Icon", uploadedFile);
          await postAsync("/api/Category/Add", formDataToSend1);
          setModalDetailVisible(false);
          fetchCategoryList();
          toast.success("Add new category successfully", {
            autoClose: 1000,
          });
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          setFormError(error?.response?.data);
        }
      }
    } else {
      setFormError("Please fill full the form");
    }
  };
  const isFormDataValid = (formData) => {
    const fieldsToCheck = ["displayOrder", "name"];
    for (const key of fieldsToCheck) {
      if (formData[key] === null || formData[key] === undefined) {
        return false;
      }
    }
    return true;
  };

  const [uploadedFile, setUploadedFile] = useState(null);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if(file){
        setUploadedFile(file); 
    const imageUrl = URL.createObjectURL(file);
    setFormData({...formData, iconUrl: imageUrl})
    }
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
            <Button onClick={showAddForm} className="plus-button" type="normal">
              <PlusCircleOutlined className="plus-icon" />
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
        height={"400px"}
        
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
        <div className="book-form" style={{height:"200px"}}>
          <div className="form-left">
            <div>
              <label htmlFor="title">Name*</label>
              <Input
                id="title"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="display order">Display Order*</label>
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
          <div className="form-right">
            {formData.iconUrl && (
              <Image
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "100%",
                  margin: "15px",
                }}
                src={formData.iconUrl}
                alt="Avatar"
              />
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="upload-avatar"
              />
              <Button
                icon={<UploadOutlined />}
                onClick={() => {
                  document.getElementById("upload-avatar").click();
                }}
              >
                Upload Avatar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Category;
