package com.board.portfolio.security.exception;

import org.springframework.security.core.AuthenticationException;

public class InvalidAuthAccountException extends AuthenticationException {
    public InvalidAuthAccountException(){
        super("email.invalid");
    }
    public InvalidAuthAccountException(String msg, Throwable t) {
        super(msg, t);
    }

    public InvalidAuthAccountException(String msg) {
        super(msg);
    }
}
