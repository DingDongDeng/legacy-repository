package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class NotSamePasswordException extends CustomRuntimeException {
    public NotSamePasswordException(){
        super("password.compare");
    }
    public NotSamePasswordException(String msg){
        super(msg);
    }
}
