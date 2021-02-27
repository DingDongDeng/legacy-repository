package com.board.portfolio.security.filter;

import com.board.portfolio.security.cookie.JwtCookieUtil;
import com.board.portfolio.security.handler.JwtFilterFailureHandler;
import com.board.portfolio.security.handler.JwtFilterSuccessHandler;
import com.board.portfolio.security.token.JwtPreToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtFilter extends AbstractAuthenticationProcessingFilter {

    private JwtFilterSuccessHandler successHandler;
    private JwtFilterFailureHandler failureHandler;

    public JwtFilter(RequestMatcher requestMatcher){
       super(requestMatcher);
    }
    public JwtFilter(RequestMatcher requestMatcher,
                     JwtFilterSuccessHandler successHandler,
                     JwtFilterFailureHandler failureHandler){
        this(requestMatcher);
        this.successHandler = successHandler;
        this.failureHandler = failureHandler;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res) throws AuthenticationException, IOException, ServletException {
        String jwtToken = JwtCookieUtil.getJwtCookieValue(req);
        return super.getAuthenticationManager().authenticate(new JwtPreToken(jwtToken));
    }
    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        this.successHandler.onAuthenticationSuccess(req,res,authResult);
        chain.doFilter(req,res);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest req, HttpServletResponse res, AuthenticationException failed) throws IOException, ServletException {
        this.failureHandler.onAuthenticationFailure(req,res,failed);
    }

}
