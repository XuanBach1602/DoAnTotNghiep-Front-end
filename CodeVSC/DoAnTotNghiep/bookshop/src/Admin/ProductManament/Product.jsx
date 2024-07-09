import React, { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import "./Product.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useApi from "../../Apis/useApi";
import {
  EditFilled,
  UploadOutlined,
  PlusCircleOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { Button, Modal, Input, Space, Select, Popconfirm, Image } from "antd";
import { toast } from "react-toastify";
import { useLoading } from "../../LoadingContext";
const { Search } = Input;
const { Option } = Select;
const Product = () => {
  const { setIsLoading } = useLoading();
  let isDescriptionChange = false;
  const { deleteAsync, getAsync, postAsync, putAsync } = useApi();
  const [bookList, setBookList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "30"],
    total: 0,
  });
  const quillRef = useRef(null);
  const [params, setParams] = useState({
    search: "",
    categoryId: "",
    sortOrder: "",
    sortBy: "",
  });
  const defaultFormData = {
    id: 0,
    title: "",
    author: "",
    categoryId: "",
    description: "",
    quantity: "",
    soldNumber: 0,
    avatarUrl: "",
    categoryName: "",
  };
  const [formData, setFormData] = useState({ ...defaultFormData });
  const handleSearchChange = (value) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: value,
    }));
  };

  //   const getEditorContent = () => {
  //     if (quillRef.current) {
  //         const editor = quillRef.current.getEditor();
  //         const content = editor.root.innerHTML;
  //         return content;
  //     }
  // };

  const handleSortChange = (column, sortDirection) => {
    console.log(column, sortDirection);
    setParams((prevParams) => ({
      ...prevParams,
      sortBy: column.name,
      sortOrder: sortDirection,
    }));
  };
  useEffect(() => {
    fetchBookList();
  }, [pagination.current, pagination.pageSize, params]); // Fetch data when current page or page size changes

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const fetchBookList = async () => {
    try {
      let url = `/api/Book/GetBookList?pageSize=${pagination.pageSize}&currentPage=${pagination.current}`;
      if (params.search) {
        url += `&search=${params.search}`;
      }
      if (params.categoryId) {
        url += `&categoryId=${params.categoryId}`;
      }
      if (params.sortBy && params.sortOrder) {
        url += `&sortBy=${params.sortBy}&sortOrder=${params.sortOrder}`;
      }
      const res = await getAsync(url);
      setBookList(res.data);
      setPagination((prevPagination) => ({
        ...prevPagination,
        total: res.total,
      }));
    } catch (error) {
      console.error("Error fetching book list:", error);
    }
  };
  const fetchCategoryList = async () => {
    try {
      var res = await getAsync("/api/Category/GetAll");
      setCategoryList(res);
    } catch (error) {
      console.log(error);
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

  const deleteBook = async (id) => {
    try {
      await deleteAsync("/api/Book/Delete?id=" + id);
      fetchBookList();
      toast.success("Delete the book successfully", {
        autoClose: 1000,
      });
    } catch (error) {}
  };

  const customAvatarCell = (row) => (
    <img
      src={row.avatarUrl}
      alt="Avatar"
      style={{ width: "40px", height: "40px", borderRadius: "50%" }}
    />
  );
  const customActionCell = (row) => (
    <div>
      <Space>
        <Button
          type="normal"
          icon={
            <EditFilled style={{ color: "#1897D7" }} className="edit-icon" />
          }
          onClick={() => handleEdit(row)}
        />
        <Popconfirm
          title="
Are you sure you want to delete?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => deleteBook(row.id)}
        >
          <Button
            type="danger"
            icon={<DeleteFilled style={{ color: "red" }} />}
          />
        </Popconfirm>
      </Space>
    </div>
  );

  const customTitleCell = (row) => {
    return (
      <div className="title-cell" title={row.title}>
        {row.title}
      </div>
    );
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
      name: "Title",
      cell: customTitleCell,
      sortable: true,
      width: "200px",
    },
    {
      name: "Author",
      selector: (row) => row.author,
      sortable: true,
      width: "200px",
    },
    {
      name: "Category",
      selector: (row) => row.categoryName,
      sortable: false,
      width: "200px",
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      width: "80px",
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: true,
      width: "80px",
    },
    {
      name: "Sold Number",
      selector: (row) => row.soldNumber,
      sortable: true,
      width: "80px",
    },
    {
      name: "Avatar",
      selector: (row) => row.avatarUrl,
      sortable: true,
      width: "100px",
      cell: customAvatarCell,
    },
    {
      name: "Actions",
      cell: customActionCell,
      width: "100px",
    },
  ];

  //Modal
  const [modalDetailVisible, setModalDetailVisible] = useState(false);
  const [formError, setFormError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, avatarUrl: imageUrl });
    }
  };
  const isFormDataValid = (formData) => {
    const fieldsToCheck = [
      "title",
      "author",
      "categoryId",
      "description",
      "quantity",
      "avatarUrl",
      "price",
    ];
    for (const key of fieldsToCheck) {
      if (!formData[key]) {
        return false;
      }
    }
    return true;
  };
  const cancelDetailView = () => {
    quillRef.current.getEditor().setContents("");
    setModalDetailVisible(false);
    setFormError("");
  };
  const handleEdit = (record) => {
    isDescriptionChange = false;
    setFormData(record);
    setUploadedFile(null);
    setModalDetailVisible(true);
  };
  const handleSave = async () => {
    console.log(formData);
    if (isFormDataValid(formData)) {
      setFormError("");
      const formDataToSend = new FormData();
      formDataToSend.append("Id", formData.id);
      formDataToSend.append("Title", formData.title);
      formDataToSend.append("Description", formData.description);
      formDataToSend.append("Author", formData.author);
      formDataToSend.append("Quantity", formData.quantity);
      formDataToSend.append("Price", formData.price);
      formDataToSend.append("Avatar", uploadedFile);
      formDataToSend.append("CategoryId", formData.categoryId);
      if (formData.id !== 0) {
        try {
          setIsLoading(true);
          await putAsync("/api/Book/Update", formDataToSend);
          setModalDetailVisible(false);
          fetchBookList();
          toast.success("Update the book successfully", {
            autoClose: 1000,
          });
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      } else {
        try {
          setIsLoading(true);
          await postAsync("/api/Book/Add", formDataToSend);
          setModalDetailVisible(false);
          fetchBookList();
          toast.success("Add new book successfully", {
            autoClose: 1000,
          });
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      }
    } else {
      setFormError("Please fill full the form and upload the avatar");
    }
  };
  const handleChange = (key, value) => {
    // console.log(key,value)
    setFormData({ ...formData, [key]: value });
  };
  const handleCategoryChange = (value) => {
    console.log(value);
    var category = categoryList.find((x) => x.id == value);
    setFormData({
      ...formData,
      categoryId: value,
      categoryName: category.name,
    });
  };

  const showAddForm = () => {
    if (quillRef.current) {
      quillRef.current.getEditor().setContents("");
          }
    setFormData({ ...defaultFormData });
    setModalDetailVisible(true);
  };

  const [displayCategoryList, setDisplayCategoryList] = useState([]);
  useEffect(() => {
    const updatedCategoryList = [...categoryList];
    const newCategoryElement = {
      id: null,
      name: "All",
    };
    updatedCategoryList.unshift(newCategoryElement);
    setDisplayCategoryList(updatedCategoryList);
  }, [categoryList]);

  const estilos = {
    table: {
      style: {
        minHeight: "450px",
      },
    },
  };
  const handleChangeQuill = (content, delta, source, editor) => {
    handleChange("description", content);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <DataTable
        title="Book List"
        columns={columns}
        data={bookList}
        pagination
        paginationServer
        customStyles={estilos}
        paginationTotalRows={pagination.total}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        subHeader
        subHeaderComponent={
          <div>
            <label htmlFor="">Category</label>
            <Select
              id="categoryId"
              style={{
                minWidth: "200px",
                marginRight: "20px",
                marginLeft: "10px",
              }}
              onChange={(value) =>
                setParams((prevParams) => ({
                  ...prevParams,
                  categoryId: value,
                }))
              }
            >
              {displayCategoryList.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
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
        className="detail-book-modal"
        width={"1200px"}
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
              <label htmlFor="title">Title*</label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="author">Author*</label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
              />
            </div>
            <div>
              <label style={{ marginRight: "20px" }} htmlFor="categoryId">
                Category*
              </label>
              <br />
              <Select
                id="categoryId"
                value={formData.categoryName}
                style={{ minWidth: "250px" }}
                onChange={(value) => handleCategoryChange(value)}
              >
                {categoryList.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="description">Description*</label>
              <ReactQuill
                id="description"
                value={formData.description}
                onChange={handleChangeQuill}
                ref={quillRef}
                theme="snow"
              />

              {/* <Input
                id="description"
                type="text"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              /> */}
            </div>
            <div>
              <label htmlFor="price">Price*</label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="price">Rate</label>
              <Input
                id="price"
                type="number"
                value={formData.rate}
                onChange={(e) => handleChange("rate", e.target.value)}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="quantity">Quantity*</label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sold">Sold</label>
              <Input
                id="sold"
                type="number"
                value={formData.soldNumber}
                onChange={(e) => handleChange("sold", e.target.value)}
              />
            </div>
            <span style={{ color: "red" }}>{formError}</span>
          </div>
          <div className="form-right">
            {formData.avatarUrl && (
              <Image
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "100%",
                  margin: "15px",
                }}
                src={formData.avatarUrl}
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

export default Product;
