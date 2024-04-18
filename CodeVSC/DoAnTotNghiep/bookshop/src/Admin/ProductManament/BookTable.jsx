import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined,UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Input, Space, Table, Select,message,Popconfirm,Upload,Image    } from 'antd';
import Highlighter from 'react-highlight-words';
import "./BookTable.css";
import { getAsync, postAsync, putAsync, deleteAsync } from "../../Apis/axios";
const BookTable = () => {
  const [bookList, setBookList] = useState();
  const [search, setSearch] = useState(null);
  const [categoryList, setCategoryList] = useState();
  const [selectedBook, setSelectedBook] = useState();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    categoryId: '',
    description: '',
    quantity: '',
    soldNumber: '',
    avatarUrl: '',
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };
  const handleSave = () => {
    // Xử lý logic khi lưu form, ví dụ: gửi dữ liệu qua API
    console.log('Form data:', formData);
  };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true, 
    pageSizeOptions: ['10', '20', '30'],
    total: 0
  });
  const { Option } = Select;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    // Nếu muốn lọc dữ liệu ngay khi giá trị category thay đổi, bạn có thể gọi fetchBookList() ở đây.
  };
  const fetchBookList = async () => {
    try {
      var res = await getAsync(`/api/Book/GetBookList?pageSize=${pagination.pageSize}&currentPage=${pagination.current}`);
      setBookList(res.data);
      setPagination(prevPagination => ({
        ...prevPagination,
        total: res.total, // Cập nhật tổng số bản ghi từ kết quả nhận được từ API
      }));
    } catch (error) {
      
    }
  }

  const fetchCategoryList = async () => {
    try {
      var res = await getAsync("/api/Category/GetAll");
      setCategoryList(res);
    } catch (error) {
      console.log(error)
    }
  }

  //modal
  const [modalDetailVisible, setModalDetailVisible] = useState(false);
  const cancelDetailView = () => {
    setModalDetailVisible(false);
  }

  const handleEdit = (record) => {
    // Xử lý logic khi click vào biểu tượng sửa
    setFormData(record);
    setModalDetailVisible(true);
    console.log(record)
  };

  const handleDelete = (record) => {
    // Xử lý logic khi click vào biểu tượng xóa
    message.error(`Xóa sách: ${record.title}`);
  };

  useEffect(() => {
    fetchBookList();
  },[pagination.current, pagination.pageSize, search]);

  useEffect(() => {
    console.log("?")
    fetchCategoryList();
  },[])
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    console.log('Trường đang tìm kiếm:', dataIndex);
  // Lấy giá trị được tìm kiếm
  console.log('Giá trị tìm kiếm:', selectedKeys[0]);
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    if (sorter && sorter.field) {
      console.log(`Đã sắp xếp theo cột ${sorter.field} theo hướng ${sorter.order}`);
      // Thực hiện xử lý dữ liệu theo sắp xếp ở đây
    }
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
        
        </Space>
        {dataIndex === 'categoryName' && ( // Thêm điều kiện chỉ hiển thị dropdown cho cột "Category"
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a category"
            optionFilterProp="children"
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            {categoryList.map((category) => (
              <Option key={category.id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Select>
        )}
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1, // Tạo index bắt đầu từ 1
      width: '5%',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: '10%',
      ...getColumnSearchProps('author'),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '5%',
      ...getColumnSearchProps('price'),
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Avatar',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      width: '10%',
      render: (avatarUrl) => <img src={avatarUrl} alt="Avatar" style={{ width: '40px',height:"40px", borderRadius: '100%' }} />,
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: '10%',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (text, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      <Table columns={columns} dataSource={bookList} pagination={{
    ...pagination,
    showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} bản ghi`,
  }}  // Chỉ định phân trang
  onChange={handleTableChange} />;
  <Modal
        open={modalDetailVisible}
        //   onCancel={onDetailViewCancel}
        className="detail-book-modal"
        width={"1000px"}
        height={"1000px"}
        footer={[
          <Button key="cancel" onClick={cancelDetailView}>
            Close
          </Button>,
          <Button key="confirm" type="primary" >
            Save
          </Button>,
        ]}
      >
         <div className="book-form">
      <div className="form-left">
        <div>
          <label htmlFor="title">Title</label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">Author</label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => handleChange('author', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="categoryId">Category</label>
          <Select
            id="categoryId"
            value={formData.categoryId}
            onChange={(value) => handleChange('categoryId', value)}
          >
            <Option value="1">Category 1</Option>
            <Option value="2">Category 2</Option>
            {/* Thêm các Option cho các category khác */}
          </Select>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <Input.TextArea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity</label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="sold">Sold</label>
          <Input
            id="sold"
            type="number"
            value={formData.soldNumber}
            onChange={(e) => handleChange('sold', e.target.value)}
          />
        </div>
        <Button type="primary" onClick={handleSave}>Save</Button>
      </div>
      <div className="form-right">
      {formData.avatarUrl && (
          <Image style={{width:"150px",height:"150px",borderRadius:"100%",margin:"15px"}} src={formData.avatarUrl} alt="Avatar" />
        )}
        <Upload
          name="avatar"
          listType="picture"
          className="avatar-uploader"
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload Avatar</Button>
        </Upload>
        
      </div>
    </div>
      </Modal>
    </div>
  )
};
export default BookTable;