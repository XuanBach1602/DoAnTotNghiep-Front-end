import "./Chat.css";
import React, { useEffect, useState,useRef  } from "react";
import { Input } from "antd";
import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import { getAsync } from "../../../Apis/axios";
import { useUser } from "../../../UserContext";
import * as signalR from "@microsoft/signalr";
import Cookies from 'js-cookie';
const Chat = () => {
    const {user} = useUser();
    const [messages, setMessages] =useState([
        { id: 1, text: "Hello!", type: "receiver" },
        { id: 2, text: "Hi! How are you?", type: "sender" },
        { id: 3, text: "I'm good, thanks! How about you?", type: "receiver" },
        { id: 4, text: "I'm doing well, too.", type: "sender" },
    ]);
    const chatContentRef = useRef(null);

    useEffect(() => {
        // Cuộn xuống cuối cùng mỗi khi messages thay đổi
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);
    const [tempMessage, setTempMessage] = useState("");
    const [connection, setConnection] = useState(null);

    const fetchMessage = async () => {
        try {
            var result = await getAsync("/api/Chat/GetAllByUserId");
            setMessages(result);
        } catch (error) {
            
        }
    }

    const receiveMessage = (chat) => {
        setMessages((prevMessages) => [...prevMessages, chat]);
    };

    const sendMessageToAdmin = async () => {
        if (tempMessage.trim() === "") return;
        try {
            await connection.invoke("SendMessageToAdmin", user.id, tempMessage);
            const newMessage = {
                id: messages.length + 1,
                message: tempMessage,
                senderId: user.id
            };
            setMessages([...messages, newMessage]);
            setTempMessage("");
            console.log("Message sent successfully!");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        fetchMessage();
    },[])

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
                        console.log("rêcive")
                        receiveMessage(chat);
                    });
                })
                .catch((err) => console.error("Error establishing connection:", err));
        }
    }, [connection]);
    return (
        <div className="chat-container">
            {/* <hr className="crossbar" style={{marginTop:"0"}}/> */}
            <div className="chat-navbar">
                <img className="admin-img" src="../admin.png" alt="" />
                <div>Admin</div>
            </div>
            <hr className="crossbar"/>

            <div className="chat-content" ref={chatContentRef}>
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
                <SendOutlined style={{cursor:"pointer", color:"#0ED9F5"}} className={`${!tempMessage?"unactive":""}`} onClick={sendMessageToAdmin}/>
            </div>
            {/* <hr className="crossbar"/> */}
        </div>
    )
}

export default Chat;