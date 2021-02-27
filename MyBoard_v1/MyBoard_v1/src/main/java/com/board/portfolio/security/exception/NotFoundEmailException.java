package com.board.portfolio.security.exception;

import org.springframework.security.core.AuthenticationException;

public class NotFoundEmailException extends AuthenticationException {
    public NotFoundEmailException(){
        super("email.exist");
    }
    public NotFoundEmailException(String msg, Throwable t) {
        super(msg, t);
    }

    public NotFoundEmailException(String msg) {
        super(msg);
    }
}
