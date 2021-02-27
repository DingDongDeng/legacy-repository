package com.board.portfolio.security.token;

import com.board.portfolio.domain.dto.AccountDTO;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public class JwtPreToken extends UsernamePasswordAuthenticationToken {

    public JwtPreToken(String token) {
        super(token, token.length());
    }

    public String getToken(){
        return (String)super.getPrincipal();
    }
    public int getTokenLength(){
        return getToken().length();
    }
}
