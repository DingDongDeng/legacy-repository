package com.board.portfolio.security.exception;

import org.springframework.security.core.AuthenticationException;

public class BlankEmailException extends AuthenticationException {
    public BlankEmailException(){
        super("email.not.blank");
    }
    public BlankEmailException(String msg, Throwable t) {
        super(msg, t);
    }

    public BlankEmailException(String msg) {
        super(msg);
    }
}
