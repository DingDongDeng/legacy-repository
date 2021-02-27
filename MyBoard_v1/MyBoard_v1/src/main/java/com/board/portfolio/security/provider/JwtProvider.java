package com.board.portfolio.security.provider;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.board.portfolio.security.account.AccountDetails;
import com.board.portfolio.security.jwt.JwtDecoder;
import com.board.portfolio.security.token.JwtPreToken;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtProvider implements AuthenticationProvider {

    private final JwtDecoder jwtDecoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        JwtPreToken token = (JwtPreToken) authentication;
        if(isAnonymous(token)){
            return token;
        }
        DecodedJWT decodedJWT = jwtDecoder.decodeJwt(token.getToken());
        return AccountDetails.getPostToken(decodedJWT);
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return JwtPreToken.class.isAssignableFrom(aClass);
    }

    private boolean isAnonymous(JwtPreToken token){
        return token.getToken().equals("");
    }
}
