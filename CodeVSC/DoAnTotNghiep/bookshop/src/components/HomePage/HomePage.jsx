import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { getAsync } from "../../Apis/axios";
import { Input, Pagination } from "antd";
import Book from "../Book/Book";
import { useOutletContext } from "react-router-dom";
const HomePage = () => {
  const [searchText,fetchCartData] = useOutletContext();
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
    setSortModel((prevSortModel) => ({ ...prevSortModel, CategoryId: value }));
  };
  const setSearchString = (value) => {
    setSortModel((prevSortModel) => ({
      ...prevSortModel,
      SearchString: value,
    }));
  };
  const setSortOrder = (value) => {
    setSortModel((prevSortModel) => ({ ...prevSortModel, SortOrder: value }));
  };
  const setFromPrice = (value) => {
    setSortModel((prevSortModel) => ({ ...prevSortModel, FromPrice: value }));
  };
  const setEndPrice = (value) => {
    setSortModel((prevSortModel) => ({ ...prevSortModel, EndPrice: value }));
  };
  const setPageSize = (value) => {
    setSortModel((prevSortModel) => ({ ...prevSortModel, PageSize: value }));
  };
  const setCurrentPage = (value) => {
    setSortModel((prevSortModel) => ({ ...prevSortModel, CurrentPage: value }));
  };

  const validateFromPriceInput = (value) => {
    if(sortModel.FromPrice !== value){
      setFromPrice(value);
    }
  }

  const validateEndPriceInput = (value) => {
    if(sortModel.EndPrice !== value){
      setEndPrice(value);
    }
  }

  const fetchCategoryData = async () => {
    try {
      var res = await getAsync("/api/Category/GetAll");
      setCategoryList(res);
    } catch (error) {}
  };

  const fetchBookListData = async () => {
    try {
      var res = await getAsync("/api/Book/GetAll", sortModel);
      setBookList(res);
    } catch (error) {}
  };

  const getCountBook = async () => {
    try {
      var total = await getAsync("/api/Book/Count");
      setTotal(total);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategoryData();
    getCountBook();
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
  return (
    <div className="homepage-container">
      <div className="category-container">
        <div className="category-title">Category</div>
        <div className="category-list">
          {categoryList.map((category ) => (
            <div key={category.id} className="category-item" onClick={() => setCategoryId(category.id)}>
              <p>{category.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="booklist-container">
        <div className="sort-navbar">
          {sortOptions.map((option) => (
            <div
              key={option.id}
              className={`sort-box ${sortModel.SortOrder === option.id? "selected-option":""}`}
              onClick={() => setSortOrder(option.id)}
            >
              {option.name}
            </div>
          ))}
          <div className="input-sort-box">
            <Input type="number" placeholder="From" onBlur={(e) => validateFromPriceInput(e.target.value) } />
            <span style={{ margin: "0 15px" }}>-</span>
            <Input type="number" placeholder="To" onBlur={(e) => validateEndPriceInput(e.target.value) } />
          </div>
        </div>
        <div className="book-list">
          {bookList.map((product) => (
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
        </div>
        <div style={{ position: "relative" }}>
          <Pagination
            onChange={(pageSize, current) => setPageData(pageSize, current)}
            className="book-pagination"
            defaultCurrent={1}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
