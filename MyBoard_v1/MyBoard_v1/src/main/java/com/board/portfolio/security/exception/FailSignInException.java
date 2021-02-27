package com.board.portfolio.security.exception;

import org.springframework.security.core.AuthenticationException;

public class FailSignInException extends AuthenticationException {
    public FailSignInException(){
        super("signin.fail");
    }
    public FailSignInException(String msg, Throwable t) {
        super(msg, t);
    }

    public FailSignInException(String msg) {
        super(msg);
    }
}
