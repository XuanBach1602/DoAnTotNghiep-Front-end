import React, { useState, useEffect, Component } from "react";
import DataTable from "react-data-table-component";
import { deleteAsync, getAsync, postAsync, putAsync } from "../../Apis/axios";
import { toast } from "react-toastify";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Modal, Input, Space, Popconfirm, DatePicker, Select, Rate } from "antd";
import "./Discount.css";
const Discount = () => {
  const { Search } = Input;
  const { Option } = Select;
  const [discountList, setDiscountList] = useState([]);
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
  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD";
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

  const fetchDiscountList = async () => {
    try {
      let url = `/api/Discount/GetDiscountList?pageSize=${pagination.pageSize}&currentPage=${pagination.current}`;
      if (params.search) {
        url += `&search=${params.search}`;
      }
      if (params.sortBy && params.sortOrder) {
        url += `&sortBy=${params.sortBy}&sortOrder=${params.sortOrder}`;
      }
      const res = await getAsync(url);
      setDiscountList(res.data);
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
      fetchDiscountList();
      toast.success("Delete the category successfully", {
        autoClose: 1000,
      });
    } catch (error) {}
  };

  //Modal
  const defaultFormData = {
    id: 0,
    name: "",
    status: 1,
    type: 1,
    discount: 0,
    rate: 0,
    maxDiscount: 0,
    expire: "2024-12-31",
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
    fetchDiscountList();
  }, [params, pagination.current, pagination.pageSize]);

  const statusArr = [
    {
      value:1,
      label:"Using",
    },
    {
      value:0,
      label:"Stop using",
    }
  ]

  const typeArr = [
    {
      value:1,
      label:"Fixed Amount Discount"
    },
    {
      value:2,
      label:"Percentage Discount"
    }
  ]

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

  const customStatusCell = (row) => {
    if (row.status == 1) {
      return <div>Using</div>;
    } else if (row.status == 0) {
      return <div>Stop using</div>;
    }
  };

  const customTypeStatus = (row) => {
    if (row.type == 1) {
      return <div>Fixed Amount Discount</div>;
    } else if (row.type == 2) {
      return <div>Percentage Discount</div>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const columns = [
    {
      name: "Index",
      selector: (row, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
      sortable: false,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Status",
      cell: customStatusCell,
      sortable: false,
      width: "100px",
    },
    {
      name: "Type",
      cell: customTypeStatus,
      sortable: false,
      width: "150px",
    },
    {
      name: "Discount",
      selector: (row) => row.discount,
      sortable: true,
      width: "100px",
    },
    {
      name: "Rate",
      selector: (row) => row.rate,
      sortable: true,
      width: "100px",
    },
    {
      name: "Max Discount",
      selector: (row) => row.maxDiscount,
      sortable: true,
      width: "130px",
    },
    {
      name: "Expire",
      selector: (row) => formatDate(row.expire),
      sortable: true,
      width: "150px",
    },
    {
      name: "Actions",
      cell: customActionCell,
      sortable: false,
      width: "100",
    },
  ];
  const cancelDetailView = () => {
    setModalDetailVisible(false);
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
    if (isFormDataValid()) {
      setFormError("");
      var formDataToSend = {
        Id: formData.id,
        Name: formData.name.trim(),
        Status:formData.status,
        Type: formData.type,
        Discount: formData.discount,
        MaxDiscount:formData.maxDiscount,
        Expire: formData.expire,
        Rate: formData.rate
      };
      if (formData.id !== 0) {
        try {
          await putAsync("/api/Discount/Update", formDataToSend);
          setModalDetailVisible(false);
          fetchDiscountList();
          toast.success("Update the discount successfully", {
            autoClose: 1000,
          });
        } catch (error) {
          setFormError(error.response.data);
        }
      } else {
        try {
          await postAsync("/api/Discount/Add", formDataToSend);
          setModalDetailVisible(false);
          fetchDiscountList();
          toast.success("Add new discount successfully", {
            autoClose: 1000,
          });
        } catch (error) {
          setFormError(error.response.data);
        }
      }
    } 
  };
  const isFormDataValid = () => {
    if(!formData.name){
      setFormError("The name is required")
      return false;
    }
    if(formData.type === 1){
      if(formData.discount <= 0){
        setFormError("The discount must greater 0");
        return false;
      }
    }
    if(formData.type === 2){
      if(formData.rate <= 0){
        setFormError("The rate must greater 0");
        return false;
      }
      if(formData.maxDiscount <= 0){
        setFormError("The max discount must greater 0");
        return false;
      }
    }
    return true;

  };
  return (
    <div>
      <DataTable
        title="Discount List"
        columns={columns}
        data={discountList}
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
         
          <div style={{gap:0}} className="form-left">
          <div style={{fontSize:"24px",fontWeight:"500"}}>Discount information</div>
            <div>
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            {formData.id != 0 &&
            <div>
            <label htmlFor="status">Status</label>
            <br />
            <Select
              id="status"
              style={{minWidth:"200px"}}
              onChange={(value) => handleChange("status",value)}
              defaultValue={formData.status}
            >
              {statusArr.map((status) => (
                <Option key={status.value}  value={status.value}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </div>
            }

            <div>
              <label htmlFor="type">Type</label>
              <br />
              <Select
                id="type"
                style={{minWidth:"200px"}}
                onChange={(value) => handleChange("type",value)}
                defaultValue={formData.type}
              >
                {typeArr.map((type) => (
                  <Option key={type.value}  value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </div>

            {formData.type ===1 &&
            <div>
            <label htmlFor="discount">Discount($)</label>
            <Input
              id="discount"
              value={formData.discount}
              type="number"
              min={1}
              onChange={(e) => handleChange("discount", e.target.value)}
            />
          </div>
            }

            {formData.type === 2 &&
            <div>
              <div>
            <label htmlFor="rate">Rate(%)</label>
            <Input
              id="rate"
              value={formData.rate}
              type="number"
              min={1}
              max={100}
              onChange={(e) => handleChange("rate", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="maxDiscount">Max Discount($)</label>
            <Input
              id="maxDiscount"
              value={formData.maxDiscount}
              type="number"
              min={1}
              onChange={(e) => handleChange("maxDiscount", e.target.value)}
            />
          </div>
            </div>

            }

            <div>
              <label className="account-label" htmlFor="expire">
                Expire
              </label>
              <br />
              <DatePicker
                id="expire"
                value={
                  formData?.expire ? dayjs(formData.expire, dateFormat) : dayjs("2024-12-31")
                }
                onChange={(date, dateString) =>
                  handleChange("expire", dateString)
                }
                format={dateFormat}
              />
            </div>

            <span style={{ color: "red" }}>{formError}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Discount;
