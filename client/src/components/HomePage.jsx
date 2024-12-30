import {
    Typography,
    Button,
    Container,
    Box,
} from "@mui/material";
import { Link } from "react-router-dom";


const HomePage = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column"}}>

            {/* Main Section */}
            <Container
                maxWidth="md"
                sx={{ textAlign: "center", marginTop: 8, marginBottom: "auto" }}
            >
                <Typography variant="h3" gutterBottom>
                    Welcome to Simplified Jira
                </Typography>
                <Typography variant="subtitle1" paragraph>
                    A lightweight project management tool for your team.
                </Typography>
                {/* Replacing Grid with Box */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2, // Space between buttons
                        marginTop: 4,
                    }}
                >
                    <Button variant="contained" color="primary" size="large">
                        <Link to="/projects" className="white-link">Get Started</Link>
                    </Button>
                    <Button variant="outlined" color="primary" size="large">
                        Learn More
                    </Button>
                </Box>
            </Container>
        </div>
    );
};

export default HomePage;
