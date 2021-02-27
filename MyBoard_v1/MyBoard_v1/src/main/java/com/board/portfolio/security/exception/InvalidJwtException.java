package com.board.portfolio.security.exception;

import org.springframework.security.core.AuthenticationException;

public class InvalidJwtException extends AuthenticationException {
    public InvalidJwtException(){
        super("jwt.invalid");
    }
    public InvalidJwtException(String msg, Throwable t) {
        super(msg, t);
    }

    public InvalidJwtException(String msg) {
        super(msg);
    }
}
