package com.board.portfolio.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class StaticUtils {
    public static ModelMapper modelMapper;
    public static ObjectMapper objectMapper;
    public static PasswordEncoder passwordEncoder;
    @Autowired
    public StaticUtils(ModelMapper modelMapper,
                       ObjectMapper objectMapper,
                       PasswordEncoder passwordEncoder){
        this.modelMapper = modelMapper;
        this.objectMapper = objectMapper;
        this.passwordEncoder = passwordEncoder;
    }
}
