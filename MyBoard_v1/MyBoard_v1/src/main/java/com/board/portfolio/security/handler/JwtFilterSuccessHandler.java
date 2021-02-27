package com.board.portfolio.security.handler;

import com.board.portfolio.security.cookie.JwtCookieUtil;
import com.board.portfolio.security.token.SignInPostToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtFilterSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res, Authentication auth) throws IOException, ServletException {
        if (!isAnonymous(auth)) {
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);
            String jwt = ((SignInPostToken) auth).getAccountSecurityDTO().getJwtToken();
            res.addCookie(JwtCookieUtil.createSignInCookie(jwt));
        }
    }

    private boolean isAnonymous(Authentication auth){
        return auth.getPrincipal().equals("");
    }
}
