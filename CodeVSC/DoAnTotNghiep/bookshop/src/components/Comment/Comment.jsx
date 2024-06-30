import "./Comment.css";
import { Rate } from "antd";

const Comment = ({comment}) => {
    const commentInfo = comment.comment;
  return (
    <div className="comment-container">
      <img
        className="commented-user-avatar"
        src={comment.userImg}
        alt=""
        srcset=""
      />
      <div className="comment-content">
        <div>{comment.username}</div>
        <Rate
          style={{ fontSize: "12px" }}
          disabled
          allowHalf
          value={commentInfo.rate}
        />
        <div>{comment.createdDate}</div>
        <div className="comment-content">{commentInfo.content}</div>
      </div>
    </div>
  );
};

export default Comment;