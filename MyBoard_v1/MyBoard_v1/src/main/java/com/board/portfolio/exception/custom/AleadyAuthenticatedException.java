package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class AleadyAuthenticatedException extends CustomRuntimeException {
    public AleadyAuthenticatedException(){
        super("email.aleady.authenticate");
    }
    public AleadyAuthenticatedException(String msg){
        super(msg);
    }
}
