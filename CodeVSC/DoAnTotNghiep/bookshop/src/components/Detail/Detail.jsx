import { useOutlet, useOutletContext, useParams, useNavigate, useLocation } from "react-router-dom";
import "./Detail.css";
import { useEffect, useState } from "react";
import { getAsync ,postAsync} from "../../Apis/axios";
import { Rate, Button, Input, Pagination } from "antd";
import Comment from "../Comment/Comment";
import Book from "../Book/Book";
import { useUser } from "../../UserContext";
import { toast } from "react-toastify";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";

const Detail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [count, setCount] = useState(1);
  const [bookList, setBookList] = useState([]);
  const [seletedRate, setSelectedRate] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [commentList, setCommentList] = useState([]);
  const [commentTotal, setCommentTotal] = useState(0);
  const {user, isAuthenticated} = useUser(); 
  const [searchText,fetchCartData] = useOutletContext();
  const location = useLocation();
  const [book, setBook] = useState({
    id: 0,
    title: "",
    description: "",
    author: "",
    avatarUrl: "",
    soldNumber: 0,
    quantity: 0,
    rate: "",
    categoryId: 0,
    price: 0,
    creatorId: 0,
    createdDate: "",
    updaterId: 0,
    updatedDate: "",
    commentCount: 0,
  });

  const starIndexes = [
    { star: 'All', index:0},
    { star: '5 Stars', index: 5 },
    { star: '4 Stars', index: 4 },
    { star: '3 Stars', index: 3 },
    { star: '2 Stars', index: 2 },
    { star: '1 Star', index: 1 }
];
    const setPageData = ( current,pageSize) => {
        setCurrentPage(current);
        setPageSize(pageSize);
    }

  const minusCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const fetchBookData = async () => {
    try {
      var res = await getAsync(`/api/Book/Detail?id=${id}`);
      setBook(res);
    } catch (error) {}
  };

  const fetchBooksInThisCategory = async () => {
    try {
      var res = await getAsync(
        `/api/Book/GetBooksByCategoryId?categoryId=${book.categoryId}&currentId=${id}`
      );
      setBookList(res);
    } catch (error) {}
  };

  const fetchComments = async () => {
    try {
        var data = {
            BookId : id,
            CurrentPage: currentPage,
            PageSize: pageSize,
            SelectedRate : seletedRate
        }
        var res = await getAsync(
          `/api/Comment/GetAllByBookId`,data
        );
        setCommentList(res.comments);
        setCommentTotal(res.count);
      } catch (error) {}
  }

  const addToCart = async() => {
    
    if(!isAuthenticated){
      localStorage.setItem("redirectPath", location.pathname);
      navigate("/signin");
      return;
    }
    try {
      var data = {
          BookId : id,
          UserId : user.id,
          Count : count
      }
      var res = await postAsync (
        `/api/CartItem/Add`,data
      );
      toast.success("Add book to cart successfully", {
        autoClose: 1000,
      });
      fetchCartData();
    } catch (error) {}
  }

  useEffect(() => {
    fetchBookData();
  }, [id]);

  useEffect(() => {
    fetchComments();
  },[seletedRate,currentPage, pageSize,id]);

  useEffect(() => {
    fetchBooksInThisCategory();
  }, [book.categoryId,id]);
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setCount(value);
    }
  };
  return (
    <div className="detail-container">
      <div className="detail-book">
        <div className="avatar-container">
          <img className="book-avatar" src={book.avatarUrl} alt="" />
        </div>
        <div className="book-specifiction">
          <div className="book-title-detail">
            {book.title} by <span className="author-name">{book.author}</span>
            (Author)
          </div>
          <div className="specification-row">
            {book.rate} &nbsp;
            <Rate
              style={{ fontSize: "12px" }}
              disabled
              allowHalf
              value={book.rate}
            />
            <span className="divider"></span>
            <span>{book.commentCount} Comments</span>
            <span className="divider"></span>
            <span>{book.soldNumber} Solded</span>
          </div>
          <div className="detail-price">${book.price}</div>
          <div className="book-count">
            Count: &nbsp;
            <Button onClick={() => setCount(count + 1)}>
              <PlusOutlined />
            </Button>
            <Input
              type="number"
              value={count}
              min={1}
              onChange={handleInputChange}
              class="[&::-webkit-inner-spin-button]:appearance-none" 
              style={{ width: "140px", textAlign: "center" }}
            />
            <Button onClick={minusCount}>
              <MinusOutlined />
            </Button>
            &nbsp;
            <span>{book.quantity} products available</span>
          </div>
          <div className="button-row">
            <Button type="primary" danger>
              Buy Now
            </Button>
            <Button type="primary" onClick={() => addToCart()}>
              <ShoppingCartOutlined />
              Add To Cart
            </Button>
          </div>
        </div>
      </div>
      <div className="book-description">
        <div className="partion-title">DESCRIPTION</div>
        {book.description}
      </div>

      <div className="books-in-this-category">
        <div className="partion-title">BOOKS IN THIS CATEGORY</div>

        <div className="reference-book">
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
      </div>

      <div className="Comments">
        <span className="partion-title">Comments</span>
        <div className="comment-specification">
          <div className="comment-specification-left">
            <div>{book.rate}/5</div>
            <Rate
              style={{ fontSize: "20px" }}
              disabled
              allowHalf
              value={book.rate}
            />
          </div>
          <div className="selection-star-row">
          {starIndexes.map((item, index) => (
                <Button key={index} type="default" className={seletedRate === item.index? "selected-rate":""} onClick={() => setSelectedRate(item.index)}>
                    {item.star}
                </Button>
            ))}
          </div>
        </div>
        {commentList!= null && commentList.map((comment) => (
           <Comment comment={comment} />
        ))}
        <Pagination
            onChange={(pageSize, current) => setPageData(pageSize, current)}
            className="book-pagination"
            defaultCurrent={1}
            total={commentTotal}
          />
      </div>
    </div>
  );
};

export default Detail;
