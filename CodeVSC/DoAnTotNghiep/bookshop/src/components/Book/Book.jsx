import React, { useEffect, useState } from "react";
import { Rate } from 'antd';
import { useNavigate } from "react-router-dom";
import "./Book.css";

const Book = ({ id,imageUrl, title, price, rate, sold }) => {
    const navigate = useNavigate();
    return (
        <div className="book-container" onClick={() => navigate(`/Book/${id}`)}>
            <div>
                <img className="book-img" src={imageUrl} alt={title} />
            </div>
            <div className="book-title" title={title}>{title}</div>
            <div className="book-rate-icon">
                <Rate style={{fontSize:"12px"}} disabled allowHalf value={rate} />
                &nbsp;
                ({sold})
            </div>
            <div className="book-price">
                ${price}
            </div>
        </div>
    )
}





export default Book;