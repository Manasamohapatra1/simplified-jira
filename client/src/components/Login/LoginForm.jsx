import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useVisibility } from "../../contexts/VisibilityContext";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from '@mui/icons-material';


const LoginForm = () => {
    const { handleSubmit, control, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { setVisibleButton } = useVisibility();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setVisibleButton("signup"); // Show only the Sign Up button
        return () => setVisibleButton("both"); // Reset on unmount
    }, [setVisibleButton]);

    const onSubmit = async (data) => {
        try {
            console.log("Login Data:", data);
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
        });
        navigate("/landingPage");
        if (response.ok) {
            const result = await response.json();
            console.log("Login Successful:", result);
            // Redirect to the dashboard or home page
            
        } else {
            console.error("Login Failed");
            setError("Invalid email or password" );      }
        } catch (error) {
        console.error("Error during login:", error);
        setError("Something went wrong. Please try again.");
        }
    };

    return (
        <Box
        sx={{
            maxWidth: 400,
            mx: "auto",
            mt: 5,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "white",
        }}
        >
        <Typography variant="h5" gutterBottom align="center">
            Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
            >
            <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                    required: "Email is required",
                    pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                    },
                }}
                render={({ field }) => (
                <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                )}
            />
            <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                    required: "Password is required",
                    minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                    },
                }}
                render={({ field }) => (
                <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    required
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                        input: {
                          endAdornment:(
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                    }}
                />
                )}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
            </Button>
            {error && <Typography color="error">{error}</Typography>}
            <Typography variant="body2" align="center">
                Don’t have an account? <Link href="/register">Register</Link>
            </Typography>
            </Box>
        </form>
        </Box>
    );
};

export default LoginForm;
