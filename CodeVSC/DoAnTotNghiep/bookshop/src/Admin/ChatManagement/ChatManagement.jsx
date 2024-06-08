import { Input, Space } from "antd";
import "./ChatManagement.css";
import { useEffect, useState, useRef } from "react";
import { getAsync, putAsync } from "../../Apis/axios";
import { useUser } from "../../UserContext";
import * as signalR from "@microsoft/signalr";
import { SmileOutlined, SendOutlined } from "@ant-design/icons";
import Cookies from 'js-cookie';
import moment from 'moment';
const { Search } = Input;
const ChatManagement = () => {
  const [conversationList, setConversationList] = useState([]);
  const {user} = useUser();
  const chatContentRef = useRef(null);
  const [conversation, setConversation] = useState({
    id : 0
  });
  const [messages, setMessages] =useState([])
    useEffect(() => {
        // Cuộn xuống cuối cùng mỗi khi messages thay đổi
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);
    const [tempMessage, setTempMessage] = useState("");
    const [connection, setConnection] = useState(null);

    const fetchMessage = async () => {
      console.log(conversation?.id)
        if(conversation?.id === 0) return;
        try {
            var result = await getAsync("/api/Chat/Detail?id=" + conversation?.id);
            setMessages(result);
        } catch (error) {
            
        }
    }

    const receiveMessage = (chat) => {
      setMessages((prevMessages) => [...prevMessages, chat]);
  };

    const sendMessageToUser = async () => {
        if (tempMessage.trim() === "") return;
        try {
            await connection.invoke("SendMessageToUser", conversation.userId, tempMessage);
            const newMessage = {
                id: messages.length + 1,
                message: tempMessage,
                senderId: user.id
            };
            setMessages([...messages, newMessage]);
            setConversationList(prevList => prevList.map(conv => 
              conv.id === conversation.id ? { ...conv, lastMessage: tempMessage,lastMessageTime:new Date() } : conv
          ));
            setTempMessage("");
            console.log("Message sent successfully!");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const formatDateTime = (dateString) => {
      const date = moment(dateString);
      if (date.isSame(moment(), 'day')) {
          return date.format('HH:mm');
      } else {
          return date.format('HH:mm DD-MM-YYYY');
      }
  };

    useEffect(() => {
        // Establish SignalR connection
        const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7239/api/chatHub", {
          accessTokenFactory: () => {
            // Lấy token từ storage hoặc các nguồn khác
            return Cookies.get("token");;
          }
        })
        .withAutomaticReconnect()
        .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    console.log("Connected to SignalR hub");

                    connection.on("ReceiveMessage", (chat) => {
                      receiveMessage(chat);
                    });
                })
                .catch((err) => console.error("Error establishing connection:", err));
        }
    }, [connection]);
  const fetchConversation = async () => {
    try {
      var res = await getAsync("/api/Chat/GetConversationList");
      setConversationList(res);
    } catch (error) {}
  };

  const updateSeenStatus = async (conversation) => {
    try {
      await putAsync("/api/Chat/UpdateSeenStatus?conversationId=" + conversation.id);
      setConversationList(prevList => prevList.map(conv => 
        conv.id === conversation.id ? { ...conv, isSeen: true } : conv
    ));
    } catch (error) {
      
    }
  }

  useEffect(() => {
    fetchConversation();
  }, []);

  useEffect(() => {
    fetchMessage();
  },[conversation?.id])

  const onSearch = (value, _e, info) => console.log(info?.source, value);
  return (
    <div className="chat-managemnet-controller">
      <div className="chat-left">
        <div style={{ fontSize: "24px", fontWeight: "500",marginBottom:"10px" }}>Chats</div>
        <Search
          placeholder="Fill name"
          onSearch={onSearch}
          enterButton
        />
        <div className="list-chat">
          {conversationList.map((conversation) => (
            <div className={`chat-box ${conversation.isSeen ?"":"not-seen"}`} onClick={() =>{
                setConversation(conversation);
                updateSeenStatus(conversation);
                console.log(conversation)
            }}>
              <img
                style={{ width: "40px", height: "40px", borderRadius: "100%" }}
                src={conversation.imgUrl}
                alt=""
              />
              <div>
                <div style={{ fontSize: "18px", fontWeight: "500" }}>
                  {conversation.name}
                </div>
                <div style={{ overflow: "hidden" }}>{conversation.lastMessage}</div>
                <div style={{fontSize:"12px"}}>{formatDateTime(conversation.lastMessageTime)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-right">
        {conversation?.id === 0 && 
            <div className="default-chat">
                Choose the conversation and chat
            </div>
        }
        {conversation?.id !== 0 &&
                <div style={{margin:"20px", height:"100%"}}>
            {/* <hr className="crossbar" style={{marginTop:"0"}}/> */}
            <div className="chat-navbar">
                <img className="admin-img" src={conversation.imgUrl} alt="" />
                <div>{conversation.name}</div>
            </div>
            <hr className="crossbar"/>

            <div className="chat-content-1" ref={chatContentRef}>
                {messages.map((message,key) => (
                    <div key={key} className={`message ${message.senderId == user.id?"sender":"receiver"}`}>
                        {message.message}
                    </div>
                ))}
            </div>
            <hr className="crossbar"/>
            <div className="send-message-container">
                <SmileOutlined style={{cursor:"pointer", color:"#0ED9F5"}} />
                <Input value={tempMessage} placeholder="Write something to send" onChange={(e) => setTempMessage(e.target.value)}/>
                <SendOutlined style={{cursor:"pointer", color:"#0ED9F5"}} className={`${!tempMessage?"unactive":""}`} onClick={sendMessageToUser}/>
            </div>
            {/* <hr className="crossbar"/> */}
        </div>
        }
      </div>
    </div>
  );
};

export default ChatManagement;
