import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Container, Form, Button, Row, Col, Card, Spinner, Overlay } from 'react-bootstrap';
import { FaMicrophone, FaPaperPlane, FaPaperclip, FaUserCircle, FaStar } from 'react-icons/fa';
// import { useAuth } from '../context/AuthContext';
import '../css/App.css'


// Assuming these are defined globally or passed as props if truly variable
const BACKEND_URL = 'http://localhost:5000';

const ChatContent = ({ userName, userEmail, currentMessages, onSaveChat, activeChatId }) => {
    
    // const { currentUser } = useAuth
    // const userEmail = currentUser?.email;
    // const userName = currentUser?.displayName || userEmail?.split('@')[0] || 'User'; // Fallback to email or a generic name
    const USER_EMAIL =  userName

    // ChatContent now manages its own messages state, initialized from currentMessages prop
    // This makes it the source of truth for the *currently active chat's* messages
    const [messages, setMessages] = useState(currentMessages);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [recording, setRecording] = useState(0); // Use a number for recording time directly
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState(null); // URL for immediate playback

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioPlayerRef = useRef(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const timerRef = useRef(null);

    
    const [showProfile, setShowProfile] = useState(false);
    const [profileTarget, setProfileTarget] = useState(null);

    // Effect to update internal messages state when currentMessages prop changes (e.g., chat switch)
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ type: 'bot', text: `Hi, ${userName}! How can I assist you today?` }]);
        }
        setMessages(currentMessages);
        // Clear input states when switching chats
        setInput('');
        setRecordedAudioBlob(null);
        setRecordedAudioUrl(null);
        setSelectedFile(null);
        setRecording(0); // Stop recording if active
        setLoading(false);
        // Clear any ongoing recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (timerRef.current) clearInterval(timerRef.current);
    }, [activeChatId, currentMessages, userName]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]); // Also scroll when loading state changes (for typing indicator)

    // Cleanup for audio URLs and recorder
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
            if (recordedAudioUrl) {
                URL.revokeObjectURL(recordedAudioUrl); // Revoke URL to prevent memory leaks
            }
        };
    }, [recordedAudioUrl]); // Dependency includes recordedAudioUrl for proper cleanup

    // Timer for recording duration
    useEffect(() => {
        if (recording > 0) { // Check if recording is active (time > 0)
            timerRef.current = setInterval(() => {
                setRecording(t => t + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [recording]);

    const handleSend = async (e) => {
        e?.preventDefault(); // Prevent default form submission if called from form
        const messageToSend = input.trim();
        // Don't send empty text messages and don't send anything if a file or audio isn't ready
        if (!messageToSend && !selectedFile && !recordedAudioBlob) {
            return;
        }
        setLoading(true);
        let userMessageText = messageToSend;
        let formDataToSend = new FormData();
        let currentAudioUrl = null;

        // if (loading) return;
        // let userMessageText = input.trim();
        // let formDataToSend = new FormData();
        // let currentAudioUrl = null; // Temporary URL for immediate message display

        if (recordedAudioBlob) {
            console.log("Preparing to send recorded audio Blob.");
            formDataToSend.append("audio", recordedAudioBlob, "recorded_audio.webm"); // Use webm for browser compatibility
            currentAudioUrl = URL.createObjectURL(recordedAudioBlob); // Create URL for display
            // If user typed additional text with audio, send it too
            if (userMessageText) {
                formDataToSend.append("text_prompt", userMessageText);
                userMessageText = `🎤 Voice message: "${userMessageText}"`; // Combined display text
            } else {
                userMessageText = "🎤 Voice message";
            }
            formDataToSend.append("answer_format", "Give response in bullet points with proper indentation");
            setRecordedAudioBlob(null); // Clear the stored blob after preparing it for send
            setRecordedAudioUrl(null); // Clear the URL after processing
        } else if (selectedFile) {
            console.log("Preparing to send selected file.");
            formDataToSend.append("audio", selectedFile, selectedFile.name);
            // If user typed additional text with file, send it too
            if (userMessageText) {
                formDataToSend.append("text_prompt", userMessageText);
                userMessageText = `📎 Uploaded file: ${selectedFile.name} ("${userMessageText}")`; // Combined display text
            } else {
                userMessageText = `📎 Uploaded file: ${selectedFile.name}`;
            }
            formDataToSend.append("answer_format", "Give response in bullet points with proper indentation");
            setSelectedFile(null); // Clear selected file after preparing for send
            if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
        } else {
            if (!userMessageText) return; // Don't send empty messages
            formDataToSend.append("message", userMessageText);
            // No answer_format for text input if LLM handles it dynamically based on prompt
        }

        const newUserMessage = {
            type: 'user',
            text: userMessageText,
            audioSrc: currentAudioUrl, // Store the URL for immediate playback in the message bubble
        };

        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages); // Update internal state for immediate display
        onSaveChat(activeChatId, updatedMessages); // Propagate changes up to parent Chat component

        setInput(''); // Clear input field
        // setLoading(true); // Show loading spinner

        try {
            const response = await fetch(`${BACKEND_URL}/api/dashboard/chat`, {
                method: 'POST',
                body: formDataToSend,
                credentials: "include"
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown server error.' }));
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            console.log("Received data from backend:", data);

            let botResponseCombined = "";
            if (data.transcribedAudio) {
                botResponseCombined += `**Transcribed Audio:** "${data.transcribedAudio}"\n\n`;
            }
            botResponseCombined += data.aiResponse || "🤖 I'm sorry, I couldn't generate a response.";

            setMessages(prev => {
                const finalMessages = [...prev, { type: 'bot', text: botResponseCombined }];
                onSaveChat(activeChatId, finalMessages); // Save final state including bot response
                return finalMessages;
            });

        } catch (error) {
            console.error('Error sending message/audio to backend:', error);
            setMessages(prev => {
                const errorMessages = [...prev, { type: 'bot', text: `🤖 Oops! My apologies, there was an error: ${error.message}. Please try again.` }];
                onSaveChat(activeChatId, errorMessages);
                return errorMessages;
            });
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Allow shift+enter for new line
            e.preventDefault(); // Prevent default new line behavior
            handleSend();
        }
    };

    const startRecording = async () => {
        setRecording(1); // Start time at 1 second
        setInput(''); // Clear previous text input
        setRecordedAudioBlob(null); // Clear any previously recorded audio
        setRecordedAudioUrl(null); // Clear previous URL
        audioChunksRef.current = []; // Clear previous audio chunks

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // For cross-browser compatibility, consider different mimeTypes:
            // audio/webm;codecs=opus (most modern)
            // audio/mp4 (for Safari if needed)
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                console.log("Recorded audio Blob:", audioBlob);
                setRecordedAudioBlob(audioBlob); // Store the Blob in state
                setRecordedAudioUrl(URL.createObjectURL(audioBlob)); // Create URL for immediate playback
                stream.getTracks().forEach(track => track.stop()); // Clean up stream tracks
            };

            mediaRecorderRef.current.start();
            console.log("MediaRecorder started.");

        } catch (error) {
            console.error("Error starting recording:", error);
            alert("Could not start recording. Please ensure microphone access is granted.");
            setRecording(0); // Reset recording time
        }
    };

    const stopRecording = () => {
        setRecording(0); // Reset recording time
        if (timerRef.current) clearInterval(timerRef.current);

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            console.log("MediaRecorder stopped.");
        }
    };

    const handleVoiceInput = () => {
        if (recording > 0) { // If currently recording
            stopRecording();
        } else { // If not recording
            startRecording();
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('audio/')) {
            alert('Please select an audio file (e.g., .mp3, .wav, .m4a).');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        setSelectedFile(file);
        setInput(''); // Clear text input if a file is selected
        setRecordedAudioBlob(null); // Clear recorded audio if a file is selected
        setRecordedAudioUrl(null); // Clear recorded audio URL
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Profile dropdown handlers
    const handleProfileClick = (event) => {
        setShowProfile(!showProfile);
        setProfileTarget(event.target);
    };

    // Function to clear recorded audio (e.g., if user decides not to send it)
    const clearRecordedAudio = () => {
        setRecordedAudioBlob(null);
        if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
        setRecordedAudioUrl(null);
        setInput(''); // Clear the "Voice message ready to send" text
    };

    // Function to clear selected file
    const clearSelectedFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setInput('');
    };

    //     // Determine if the send button should be disabled
    // const isSendDisabled = loading || (recording > 0) || (!input.trim() && !selectedFile && !recordedAudioBlob);
    // // Determine if other input methods (text, file, mic button itself) should be disabled
    // const isInputMethodDisabled = loading || (recording > 0) || selectedFile || recordedAudioBlob;



    return (
        <Container fluid className="chat-main-content px-3 py-2">
            <h3 className="centered-greeting text-primary fw-bold">
                {"Welcome, ".split('').map((char, index) => (
                    <span key={`Welcome-${index}`} className="waving-char" style={{ animationDelay: `${index * 0.1}s` }}>
                        {char}
                    </span>
                ))}
                {userName.split('').map((char, index) => (
                    <span key={`user-${index}`} className="waving-char" style={{ animationDelay: `${(index + 7) * 0.1}s` }}>
                        {char}
                    </span>
                ))}
                {"!".split('').map((char, index) => (
                    <span key={`exclamation-${index}`} className="waving-char" style={{ animationDelay: `${(userName.length + 7 + index) * 0.1}s` }}>
                        {char}
                    </span>
                ))}
            </h3>
            {/* Profile Icon and Dropdown */}
            <button
                className="profile-icon-btn"
                onClick={handleProfileClick}
                aria-label="User Profile"
                type="button"
            >
                <FaUserCircle size={30} color="#0072ff" />
            </button>
            <Overlay
                show={showProfile}
                target={profileTarget}
                placement="bottom-end"
                containerPadding={20}
                rootClose
                onHide={() => setShowProfile(false)}
            >
                {({ ...props }) => (
                    <div
                        {...props}
                        className="profile-popover shadow"
                        style={{
                            ...props.style,
                            position: 'fixed',
                            top: 20,
                            right: 12,
                            zIndex: 1052,
                        }}
                    >
                        <div className="profile-email">
                            <FaUserCircle size={22} className="me-2" />
                            {userEmail}
                        </div>
                        <Button className="upgrade-btn" size="sm">
                            <FaStar color="#ffb700" />
                            Upgrade
                        </Button>
                    </div>
                )}
            </Overlay>

            <h3 className="text-center fw-bold mb-2 text-primary chat-title">
                {/* {decodeURIComponent(userName)} */}
                 {/* Chat Assistant */} Voice Mentor
            </h3>

            <Card className="mb-2 shadow flex-grow-1 chat-messages-card">
                <Card.Body className="p-3 chat-messages-body" style={{ height: 420, overflowY: 'auto', }}>
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`d-flex ${msg.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            <span className={`chat-bubble ${msg.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                                {msg.text}
                                {msg.audioSrc && ( // Render audio player if message contains audio source
                                    <audio controls src={msg.audioSrc} className="p-1 mt-2 w-100" />
                                )}
                            </span>
                        </div>
                    ))}
                    {loading && (
                        <div className="d-flex justify-content-center align-items-center mt-2">
                            <Spinner animation="border" variant="info" size="sm" />
                            <span className="ms-2 text-info">Typing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </Card.Body>
            </Card>

            {/* Chat Input Form */}
            <Form onSubmit={handleSend} className=" rounded shadow-sm p-2 chat-input-form">
                <Row className="align-items-center g-2">
                    <Col xs={1} className="d-flex justify-content-center">
                        <Button
                            variant="outline-info"
                            onClick={() => fileInputRef.current.click()}
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '45px', height: '45px' }}
                            disabled={loading || recording > 0 || recordedAudioBlob || selectedFile} // Adjust disabled logic // Disable file upload while recording or if recorded audio is ready
                            title="Attach File"
                        >
                            <FaPaperclip size={20} />
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="file-input-hidden"
                            accept="audio/*"
                        />
                    </Col>
                    <Col xs={8}>
                        <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder={
                                recording > 0
                                    ? `Recording... ${formatTime(recording)}`
                                    : (recordedAudioBlob ? "Add text for AI (optional)" : (selectedFile ? `File: ${selectedFile.name}. Add text for AI (optional)` : "Type your message..."))
                            }
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={loading || recording > 0} // Disable typing only while actively recording
                            style={{ resize: 'none', overflowY: 'hidden' }}
                        />
                        {recordedAudioBlob && recordedAudioUrl && ( // Display recorded audio preview
                            <div className="mt-2 d-flex align-items-center justify-content-between">
                                <audio controls src={recordedAudioUrl} className="w-75" />
                                <Button
                                    size="sm"
                                    variant="link"
                                    className="text-danger p-0 ms-2"
                                    onClick={clearRecordedAudio}
                                    disabled={loading}
                                    style={{ textDecoration: 'none' }}
                                >
                                    &times; Clear Audio
                                </Button>
                            </div>
                        )}
                        {selectedFile && !recordedAudioBlob && ( // Display selected file name
                            <div className="mt-2 d-flex align-items-center justify-content-between">
                                <span className="text-secondary small">Selected: {selectedFile.name}</span>
                                <Button
                                    size="sm"
                                    variant="link"
                                    className="text-danger p-0 ms-2"
                                    onClick={clearSelectedFile}
                                    disabled={loading}
                                    style={{ textDecoration: 'none' }}
                                >
                                    &times; Clear File
                                </Button>
                            </div>
                        )}
                    </Col>
                    <Col xs={1} className="d-flex justify-content-center">
                        <Button
                            variant={recording > 0 ? "danger" : "outline-primary"}
                            onClick={handleVoiceInput}
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '45px', height: '45px' }}
                            disabled={loading || selectedFile} // Disable if loading or file selected
                            title={recording > 0 ? "Stop Recording" : "Start Recording"}
                        >
                            <FaMicrophone size={20} />
                        </Button>
                    </Col>
                    <Col xs={2} sm={1}>
                        <Button
                            onClick={handleSend}
                            className="w-100 btn-primary"
                            title="Send"
                            disabled={loading || (recording > 0 && !input.trim()) || (!input.trim() && !selectedFile && !recordedAudioBlob)}
                        >
                            {loading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                <FaPaperPlane size={20} />
                            )}
                        </Button>
                    </Col>
                </Row>
            </Form>
            <span className='d-flex justify-content-center m-1 owner'>Develop by <strong className='ownerSname'>, Akash Gupta</strong></span>
        </Container>
    );
};

export default ChatContent;