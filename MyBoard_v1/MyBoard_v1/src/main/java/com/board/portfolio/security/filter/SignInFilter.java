package com.board.portfolio.security.filter;

import com.board.portfolio.domain.dto.AccountDTO;
import com.board.portfolio.security.cookie.JwtCookieUtil;
import com.board.portfolio.security.handler.JwtFilterFailureHandler;
import com.board.portfolio.security.handler.JwtFilterSuccessHandler;
import com.board.portfolio.security.handler.SignInFilterFailureHandler;
import com.board.portfolio.security.handler.SignInFilterSuccessHandler;
import com.board.portfolio.security.token.JwtPreToken;
import com.board.portfolio.security.token.SignInPreToken;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class SignInFilter extends AbstractAuthenticationProcessingFilter {

    private SignInFilterSuccessHandler successHandler;
    private SignInFilterFailureHandler failureHandler;

    public SignInFilter(String defaultUrl){
       super(defaultUrl);
    }
    public SignInFilter(String defaultUrl,
                        SignInFilterSuccessHandler successHandler,
                        SignInFilterFailureHandler failureHandler){
        this(defaultUrl);
        this.successHandler = successHandler;
        this.failureHandler = failureHandler;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res) throws AuthenticationException, IOException, ServletException {

        AccountDTO.SignIn dto = new ObjectMapper().readValue(req.getReader(),AccountDTO.SignIn.class);
        SignInPreToken token = new SignInPreToken(dto);

        return super.getAuthenticationManager().authenticate(token);
    }
    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        this.successHandler.onAuthenticationSuccess(req,res,authResult);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest req, HttpServletResponse res, AuthenticationException failed) throws IOException, ServletException {
        this.failureHandler.onAuthenticationFailure(req,res,failed);
    }

}
