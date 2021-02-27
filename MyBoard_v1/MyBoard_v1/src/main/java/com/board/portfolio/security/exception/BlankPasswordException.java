package com.board.portfolio.security.exception;

import org.springframework.security.core.AuthenticationException;

public class BlankPasswordException extends AuthenticationException {
    public BlankPasswordException(){
        super("password.not.blank");
    }
    public BlankPasswordException(String msg, Throwable t) {
        super(msg, t);
    }

    public BlankPasswordException(String msg) {
        super(msg);
    }
}
