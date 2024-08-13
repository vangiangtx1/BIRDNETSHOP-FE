import React, { useState, useRef } from "react";
import './../assets/css/chatbox.css';

const ChatBox = () => {
    const [show, setShow] = useState(false);

    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]); // Added state for chat history
    const answerRef = useRef(null);

    const questions = [
        { id: 1, question: "Tổ yến này có nguồn gốc từ đâu?", answer: "Tổ yến của chúng tôi được thu hái từ các vùng đảo nổi tiếng ở Đông Nam Á, đảm bảo chất lượng và độ tinh khiết cao." },
        { id: 2, question: "Chất lượng tổ yến có được đảm bảo không?", answer: "Chúng tôi cam kết cung cấp tổ yến đạt tiêu chuẩn chất lượng cao và đã được kiểm nghiệm kỹ lưỡng trước khi đến tay khách hàng." },
        { id: 3, question: "Chính sách bảo hành sản phẩm như thế nào?", answer: "Tổ yến của chúng tôi không có chính sách bảo hành, nhưng chúng tôi cam kết đổi trả nếu có lỗi do nhà sản xuất trong vòng 7 ngày." },
        { id: 4, question: "Tổ yến có những đặc điểm nổi bật nào?", answer: "Tổ yến của chúng tôi có màu sắc tự nhiên, không chứa hóa chất độc hại, và giữ nguyên giá trị dinh dưỡng." },
        { id: 5, question: "Hiện có chương trình khuyến mãi nào không?", answer: "Chúng tôi đang có chương trình giảm giá đặc biệt cho đơn hàng đầu tiên và nhiều ưu đãi khác trong các dịp lễ tết." },
        { id: 6, question: "Thời gian giao hàng là bao lâu?", answer: "Chúng tôi sẽ giao tổ yến trong khoảng 3 đến 5 ngày làm việc, tùy thuộc vào địa chỉ nhận hàng." },
        { id: 7, question: "Có thể đổi trả sản phẩm không?", answer: "Bạn có thể đổi trả tổ yến trong vòng 7 ngày nếu sản phẩm bị lỗi hoặc không đúng mô tả." },
        { id: 8, question: "Những phương thức thanh toán nào được chấp nhận?", answer: "Chúng tôi chấp nhận thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng, và thanh toán khi nhận hàng." }
    ];
   
    const handleClick = (id) => {
        setSelectedQuestion(id);
        setTimeout(() => {
            answerRef.current.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleShow = () => {
        setShow(!show);
    };
  const handleSendMessage = () => {
        if (message.trim()) {
            const userMessage = { type: 'user', content: message };
            const botResponse = { type: 'bot', content: "Xin vui lòng liên hệ hotline 123 456 789" };
            setChatHistory([chatHistory, userMessage, botResponse]);
            setMessage("");
        }
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
                            <img src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/236864609_2056131947895671_6452063846381198076_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGGNQUe1_XCSHOdTvop3R3vAYjvhH-jRDUBiO-Ef6NENZFFEPEBMg3N2v09pvB2A9sOYbylYFfWw9ezQIVHD7u3&_nc_ohc=L9wNaEaHnM0Q7kNvgE8rle5&_nc_ht=scontent.fsgn2-9.fna&oh=00_AYC60hWyB3RtYg-teS_5FZIXMa3sx_gBQDdNtxRqwWMv1w&oe=669FECA7" width="50" height="50" className="chat-avatar" />
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
                                <div className="d-flex flex-column align-items-start p-3 chat-response-wrapper" ref={answerRef}>
                                    <div className="chat-response-header d-flex align-items-center">
                                        <img src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/236864609_2056131947895671_6452063846381198076_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGGNQUe1_XCSHOdTvop3R3vAYjvhH-jRDUBiO-Ef6NENZFFEPEBMg3N2v09pvB2A9sOYbylYFfWw9ezQIVHD7u3&_nc_ohc=L9wNaEaHnM0Q7kNvgE8rle5&_nc_ht=scontent.fsgn2-9.fna&oh=00_AYC60hWyB3RtYg-teS_5FZIXMa3sx_gBQDdNtxRqwWMv1w&oe=669FECA7" height="50" className="chat-avatar" />
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
                                <div key={index} className={`d-flex p-3 ${chat.type === 'user' ? 'justify-content-end' : ''}`}>
                                    <div className={`chat-${chat.type}`}>
                                        {chat.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="chat-input-container">
                            <input
                                type="text"
                                className="chat-form-control"
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <i className="fa fa-paper-plane icon-send" onClick={handleSendMessage}></i>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default ChatBox;
