package com.board.portfolio.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.board.portfolio.security.account.AccountDetails;
import com.board.portfolio.security.account.AccountSecurityDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.util.Date;

@Slf4j
@Component
public class JwtFactory {
    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(AccountSecurityDTO dto) {

        String token = null;
        try {
            token = JWT.create()
                    .withIssuer("kong")
                    .withClaim("email", dto.getEmail())
                    .withClaim("nickname", dto.getNickname())
                    .withClaim("role", dto.getRole().toString())
                    .withClaim("isSocial",dto.isSocial())
                    .withClaim("gen-time", new Date())
                    .sign(generateAlgorithm());

        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return token;
    }

    private Algorithm generateAlgorithm() throws UnsupportedEncodingException {
        return Algorithm.HMAC256(secret);
    }

}
