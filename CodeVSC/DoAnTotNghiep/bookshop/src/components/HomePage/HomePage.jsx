import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Input, Pagination } from "antd";
import Book from "../Book/Book";
import { useOutletContext } from "react-router-dom";
import { FireOutlined, MoneyCollectFilled } from "@ant-design/icons";
import useApi from "../../Apis/useApi";
const HomePage = () => {
  const { deleteAsync, getAsync, postAsync, putAsync } = useApi();
  const [searchText, fetchCartData] = useOutletContext();
  const [categoryList, setCategoryList] = useState([]);
  const [sortModel, setSortModel] = useState({
    CategoryId: null,
    SearchString: searchText,
    SortOrder: null,
    FromPrice: null,
    EndPrice: null,
    PageSize: 10,
    CurrentPage: 1,
  });
  const [total, setTotal] = useState(0);
  const [bookList, setBookList] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [hotCategories, setHotCategories] = useState([]);
  const sortOptions = [
    { id: 1, name: "Best seller" },
    { id: 2, name: "New Books" },
    { id: 3, name: "Low to high price" },
    { id: 4, name: "High to low price" },
  ];

  const setPageData = (current, pagesize) => {
    setCurrentPage(current);
    setPageSize(pagesize);
  };
  const setCategoryId = (value) => {
    setSortModel((prevSortModel) => ({
      ...prevSortModel,
      CategoryId: value,
      CurrentPage: 1,
    }));
  };
  const setSearchString = (value) => {
    setSortModel((prevSortModel) => ({
      ...prevSortModel,
      SearchString: value,
      CurrentPage: 1,
    }));
  };
  const setSortOrder = (value) => {
    setSortModel((prevSortModel) => ({
      ...prevSortModel,
      SortOrder: value,
      CurrentPage: 1,
    }));
  };
  const setFromPrice = (value) => {
    setSortModel((prevSortModel) => ({
      ...prevSortModel,
      FromPrice: value,
      CurrentPage: 1,
    }));
  };
  const setEndPrice = (value) => {
    setSortModel((prevSortModel) => ({
      ...prevSortModel,
      EndPrice: value,
      CurrentPage: 1,
    }));
  };
  const setPageSize = (value) => {
    setSortModel((prevSortModel) => ({ ...prevSortModel, PageSize: value }));
  };
  const setCurrentPage = (value) => {
    setSortModel((prevSortModel) => ({ ...prevSortModel, CurrentPage: value }));
  };

  const validateFromPriceInput = (value) => {
    if (sortModel.FromPrice !== value) {
      setFromPrice(value);
    }
  };

  const validateEndPriceInput = (value) => {
    if (sortModel.EndPrice !== value) {
      setEndPrice(value);
    }
  };

  const fetchCategoryData = async () => {
    try {
      var res = await getAsync("/api/Category/GetAll");
      setCategoryList(res);
    } catch (error) {}
  };

  const fetchBookListData = async () => {
    try {
      var res = await getAsync("/api/Book/GetAll", sortModel);
      setBookList(res.books);
      setTotal(res.count);
    } catch (error) {}
  };

  const fetchHotProducts = async () => {
    try {
      var res = await getAsync("/api/Book/GetHotProducts");
      setHotProducts(res);
    } catch (error) {}
  };

  const fetchHotCategories = async () => {
    try {
      var res = await getAsync("/api/Book/GetHotCategories");
      setHotCategories(res);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategoryData();
    // getCountBook();
    fetchHotCategories();
    fetchHotProducts();
    console.log(searchText)
  }, []);

  useEffect(() => {
    setSearchString(searchText);
    console.log(searchText);

    const interval = setInterval(() => {
      console.log(searchText);
    }, 5000);

    return () => clearInterval(interval);
  }, [searchText]);

  useEffect(() => {
    fetchBookListData();
  }, [sortModel]);

  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    if (startIndex < hotProducts.length - 5) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const intervalDuration = 3000;
  useEffect(() => {
    const id = setInterval(() => {
      setStartIndex((prevIndex) => (prevIndex + 1) % hotProducts.length);
    }, intervalDuration);
    return () => clearInterval(id); // Xóa interval khi component bị unmount
  }, [hotProducts.length]);
  const getDisplayedProducts = () => {
    const displayedProducts = [];
    for (let i = 0; i < 5; i++) {
      displayedProducts.push(
        hotProducts[(startIndex + i) % hotProducts.length]
      );
    }
    return displayedProducts;
  };
  return (
    <div className="homepage-container">
      <div>
        <div className="category-container">
          <div
            style={{ color: "red", fontWeight: "500" }}
            className="category-title"
          >
            Hot Categories
          </div>
          <div className="category-list">
            {hotCategories.map((category, key) => (
              <div
                key={key}
                className={`category-item ${
                  category.id === sortModel.CategoryId
                    ? "selected-category"
                    : ""
                }`}
                onClick={() => setCategoryId(category.id)}
              >
                <div className="category-content">
                  <img
                    style={{ width: "25px", width: "25px" }}
                    src={category.iconUrl}
                    alt=""
                  />
                  {category.name}{" "}
                  <FireOutlined
                    style={{ color: "red",float:"right" }}
                    className="blinking-icon"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="category-container">
          <div className="category-title">Category</div>
          <div className="category-list">
            <div className="category-item" onClick={() => setCategoryId("")}>
              All
            </div>
            {categoryList.map((category) => (
              <div
                key={category.id}
                className={`category-item ${
                  category.id === sortModel.CategoryId
                    ? "selected-category"
                    : ""
                }`}
                onClick={() => setCategoryId(category.id)}
              >
                <div className="category-content">
                  <img
                    style={{ width: "25px", width: "25px" }}
                    src={category.iconUrl}
                    alt=""
                  />
                  {category.name}{" "}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="booklist-container">
        <div
          style={{
            backgroundColor: "white",
            padding: "15px",
            fontWeight: "500",
            fontSize: "24px",
            color: "red",
          }}
        >
          Hot Products
        </div>
        <div className="hot-product-container">
          <div className="hot-product-list">
            {getDisplayedProducts().length > 0 &&
              getDisplayedProducts().map((product, key) => (
                <Book
                  className="book"
                  key={key}
                  id={product?.id}
                  imageUrl={product?.avatarUrl}
                  title={product?.title}
                  price={product?.price}
                  rate={product?.rate}
                  sold={product?.soldNumber}
                />
              ))}
          </div>
        </div>
        <div className="sort-navbar">
          {sortOptions.map((option) => (
            <div
              key={option.id}
              className={`sort-box ${
                sortModel.SortOrder === option.id ? "selected-option" : ""
              }`}
              onClick={() => setSortOrder(option.id)}
            >
              {option.name}
            </div>
          ))}
          <div className="input-sort-box">
            <Input
              type="number"
              placeholder="From"
              onBlur={(e) => validateFromPriceInput(e.target.value)}
            />
            <span style={{ margin: "0 15px" }}>-</span>
            <Input
              type="number"
              placeholder="To"
              onBlur={(e) => validateEndPriceInput(e.target.value)}
            />
          </div>
        </div>
        {
            bookList.length == 0 && <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '250px',
              backgroundColor: '#f0f0f0', // màu nền để dễ nhìn thấy
            }}>No suitable product</div> 
          }
        {bookList.length > 0 && <div className="book-list">
          { bookList.map((product) => (
            <Book
              className="book"
              key={product.id}
              id={product.id}
              imageUrl={product.avatarUrl}
              title={product.title}
              price={product.price}
              rate={product.rate}
              sold={product.soldNumber}
            />
          ))}
          
        </div>}
        <div style={{ position: "relative" }}>
          <Pagination
            onChange={(pageSize, current) => setPageData(pageSize, current)}
            className="book-pagination"
            defaultCurrent={1}
            current={sortModel.CurrentPage}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
