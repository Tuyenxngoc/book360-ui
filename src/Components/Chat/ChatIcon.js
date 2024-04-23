import { Box, Container, Typography } from "@mui/material";
import Style from "./Chat.module.scss";
import classNames from "classnames/bind";
import ForumIcon from '@mui/icons-material/Forum';
import { useState } from "react";

const cx = classNames.bind(Style);

function ChatIcon() {

    const [showChat, setShowChat] = useState(false);


    const handleClick = () => {
        setShowChat(!showChat);
    };


    return (
        showChat ? (
            <div>
                1
                <button onClick={handleClick}>x</button>
            </div>
        ) : (
            <Box component="div" sx={{
                height: "100%",
                color: "rgb(255, 255, 255)",
                backgroundColor: "rgb(219, 47, 23)",
                paddingLeft: "30px",
                paddingRight: "8px",
                cursor: "pointer",
                position: 'fixed',
                // left: "100%",
                // transform: "translateX(-600px)",
                top: "50%",
                zIndex: "99"

            }} onClick={handleClick}>
                <Box sx={{
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                }}>
                    <ForumIcon fontSize="small" />
                </Box>

                <Box sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    WebkitBoxPack: "center",
                    justifyContent: "center",
                }}>
                    <Typography variant="body1">
                        Chat với nhân viên tư vấn
                    </Typography>
                </Box>
                <Container maxWidth="sm"></Container>
            </Box>
        )
    );
}

export default ChatIcon;

