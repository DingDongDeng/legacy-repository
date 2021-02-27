package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class NotAllowAccessException extends CustomRuntimeException {
    public NotAllowAccessException(){
        super("not.allow");
    }
    public NotAllowAccessException(String msg){
        super(msg);
    }
}
