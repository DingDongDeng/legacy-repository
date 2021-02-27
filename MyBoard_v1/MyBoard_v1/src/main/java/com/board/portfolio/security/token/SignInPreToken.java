package com.board.portfolio.security.token;

import com.board.portfolio.domain.dto.AccountDTO;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public class SignInPreToken extends UsernamePasswordAuthenticationToken {

    public SignInPreToken(String email, String password) {
        super(email, password);
    }

    public SignInPreToken(AccountDTO.SignIn dto) {
        this(dto.getEmail(), dto.getPassword());
    }

    public String getEmail(){
        return (String)super.getPrincipal();
    }
    public String getPassword(){
        return (String)super.getCredentials();
    }
}
