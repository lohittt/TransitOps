package com.example.transitops.auth.mapper;

import com.example.transitops.auth.dto.LoginResponse;
import com.example.transitops.auth.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role", expression = "java(user.getRole().getRoleName())")
    @Mapping(target = "token", ignore = true)
    LoginResponse toLoginResponse(User user);
}
