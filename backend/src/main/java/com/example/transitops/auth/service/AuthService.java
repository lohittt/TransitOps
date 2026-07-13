package com.example.transitops.auth.service;

import com.example.transitops.auth.dto.LoginRequest;
import com.example.transitops.auth.dto.LoginResponse;
import com.example.transitops.auth.dto.RegisterRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse register(RegisterRequest request);
}
