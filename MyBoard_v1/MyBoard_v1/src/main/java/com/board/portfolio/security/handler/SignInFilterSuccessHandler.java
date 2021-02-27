package com.board.portfolio.security.handler;

import com.board.portfolio.security.cookie.JwtCookieUtil;
import com.board.portfolio.security.jwt.JwtFactory;
import com.board.portfolio.security.token.SignInPostToken;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RequiredArgsConstructor
@Component
public class SignInFilterSuccessHandler implements AuthenticationSuccessHandler {
    private final JwtFactory jwtFactory;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res, Authentication auth) throws IOException, ServletException {
        String jwt = jwtFactory.generateToken(((SignInPostToken) auth).getAccountSecurityDTO());
        res.addCookie(JwtCookieUtil.createSignInCookie(jwt));
    }
}
