package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class InvalidAuthAccountException extends CustomRuntimeException {
    public InvalidAuthAccountException(){
        super("email.invalid");
    }
    public InvalidAuthAccountException(String msg){
        super(msg);
    }
}
