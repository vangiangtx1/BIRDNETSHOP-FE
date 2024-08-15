import React, { useState, useRef, useEffect } from "react";
import './../assets/css/chatbox.css';
import BestSelling from "../components/BestSelling";


const ChatBox = () => {
    const [show, setShow] = useState(false);

    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]); // Added state for chat history
    const answerRef = useRef(null);
    const endOfChatRef = useRef(null);

    const questions = [
        { id: 1, question: "Sản phẩm có xuất xứ từ đâu?", answer: "Sản phẩm có nguồn gốc xuất xứ chủ yếu từ tổ yến tinh chất tại Khánh Hòa." },
        { id: 2, question: "Sản phẩm có chất lượng không?", answer: "Sản phẩm đảm bảo chất lượng, hàm lượng dinh dưỡng cao và đã được kiểm định." },
        { id: 3, question: "Top những sản phẩm bán chạy ở cửa hàng?", answer: <BestSelling /> },
        { id: 4, question: "Sản phẩm có những tính năng nổi bật nào?", answer: "Sản phẩm có nguồn gốc từ tổ yến tự nhiên, được chế biến theo công thức gia truyền và sử dụng công nghệ hiện đại." },
        { id: 5, question: "Sản phẩm có chương trình khuyến mãi không?", answer: "Hiện tại, sản phẩm đang có chương trình giảm giá cho một số mặt hàng có mã giảm giá." },
        { id: 6, question: "Thời gian giao hàng là bao lâu?", answer: "Thời gian giao hàng dự kiến là từ 3 đến 5 ngày làm việc." },
        { id: 7, question: "Có thể đổi trả sản phẩm không?", answer: "Bạn có thể đổi trả sản phẩm trong vòng 7 ngày nếu có lỗi từ nhà sản xuất." },
        { id: 8, question: "Thanh toán bằng những phương thức nào?", answer: "Chúng tôi chấp nhận thanh toán qua thẻ tín dụng, chuyển khoản, và thanh toán khi nhận hàng." },
    ];

    const handleClick = (id) => {
        setSelectedQuestion(id);
        setTimeout(() => {
            if (answerRef.current) {
                answerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    const handleShow = () => {
        setShow(!show);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            const userMessage = { type: 'user', content: message };
            let botResponse;

            // Đưa ra phản hồi dựa trên nội dung tin nhắn
            if (message.toLowerCase().includes("xin chào")) {
                botResponse = { type: 'bot', content: "tôi có thể giúp gì cho ngài" };
            } else if (message.toLowerCase().includes("số điện thoại đặt hàng")) {
                botResponse = { type: 'bot', content: "Số điện thoại bạn có thể gọi để đặt hàng là: 0852313572" };
            } else if (message.toLowerCase().includes("help me")) {
                botResponse = {
                    type: 'bot', content: questions.map((item) => (
                        <div key={item.id} className="d-flex p-3">
                            <div className="chat-request" onClick={() => handleClick(item.id)} style={{ cursor: "pointer" }}>
                                {item.question}
                            </div>
                        </div>
                    ))
                };
            } else if (message.toLowerCase().includes("giá")) {
                botResponse = { type: 'bot', content: "Giá của sản phẩm thay đổi tùy vào loại và kích thước. Vui lòng kiểm tra trên trang sản phẩm cụ thể." };
            } else {
                botResponse = { type: 'bot', content: "Xin vui lòng liên hệ hotline 0852313572 để được hỗ trợ thêm." };
            }

            // Cập nhật lịch sử trò chuyện
            setChatHistory(prevHistory => [...prevHistory, userMessage, botResponse]);
            setMessage("");

            setTimeout(() => {
                if (endOfChatRef.current) {
                    endOfChatRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của phím ENTER
            handleSendMessage();
        }
        setTimeout(() => {
            if (answerRef.current) {
                answerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    return (
        <>
            <div className="chat-button ml-3 mb-4">
                <button type="button" onClick={handleShow} className="btn-xl btn-info btn-circle">
                    <i className="fa fa-comment text-white"></i>
                </button>
            </div>
            {show &&
                <div className="container chat-container d-flex justify-content-center">
                    <div className="card chat-card">
                        <div className="chat-header d-flex flex-row adiv">
                            <img src="https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/301358564_2356174064558123_1914605898311611964_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGdoVzsBDf7C7HxFoS1Cev6CXmxFZfH3AgJebEVl8fcCJUM24AimozXwwonHgzp0UvW2FDHRtZAa1j6qx2Ludk6&_nc_ohc=k0mrY7I3ZFAQ7kNvgGewfI9&_nc_ht=scontent.fsgn2-4.fna&oh=00_AYDC6Z-wCJHVhz-5q0idcUI7sxJc1xUsgJdaIQxiXeqsdw&oe=66C135FC" width="50" height="50" className="chat-avatar" />
                            <div className="d-flex justify-content-between p-3 w-100 ps-0 text-white">
                                <span className="pb-3 ml-8">ChatBot LVG</span>
                                <i onClick={handleShow} className="close fa fa-times"></i>
                            </div>
                        </div>
                        <div className="chat-messages" id="chat-feed">
                            {questions.map((item) => (
                                <div key={item.id} className="d-flex p-3">
                                    <div className="chat-request" onClick={() => handleClick(item.id)} style={{ cursor: "pointer" }}>
                                        {item.question}
                                    </div>
                                </div>
                            ))}
                            {selectedQuestion && (
                                <div className="d-flex flex-column align-items-start chat-response-wrapper" ref={answerRef}>
                                    <div className="chat-response-header d-flex align-items-center">
                                        <img src="https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/301358564_2356174064558123_1914605898311611964_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGdoVzsBDf7C7HxFoS1Cev6CXmxFZfH3AgJebEVl8fcCJUM24AimozXwwonHgzp0UvW2FDHRtZAa1j6qx2Ludk6&_nc_ohc=k0mrY7I3ZFAQ7kNvgGewfI9&_nc_ht=scontent.fsgn2-4.fna&oh=00_AYDC6Z-wCJHVhz-5q0idcUI7sxJc1xUsgJdaIQxiXeqsdw&oe=66C135FC" height="50" className="chat-avatar" />
                                        <div className="ms-2">
                                            <strong>ChatBot LVG</strong>
                                        </div>
                                    </div>
                                    <div className="chat-response p-3">
                                        {questions.find((item) => item.id === selectedQuestion)?.answer}
                                    </div>
                                </div>
                            )}

                            {chatHistory.map((chat, index) => (
                                <>
                                    <div key={index} className={`d-flex p-3 ${chat.type === 'user' ? 'justify-content-end' : ''}`}>
                                        <div className={`chat-${chat.type}`}>
                                            {chat.content}
                                        </div>
                                    </div>
                                    <div ref={endOfChatRef} />
                                </>
                            ))}
                        </div>

                        <div className="chat-input-container">
                            <input
                                type="text"
                                className="chat-form-control"
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <i className="fa fa-paper-plane icon-send" onClick={handleSendMessage}></i>
                        </div>

                        <div ref={endOfChatRef} />
                    </div>
                </div>
            }
        </>
    );
};
export default ChatBox;