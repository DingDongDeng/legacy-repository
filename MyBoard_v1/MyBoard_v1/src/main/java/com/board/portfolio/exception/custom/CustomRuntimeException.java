package com.board.portfolio.exception.custom;


public class CustomRuntimeException extends RuntimeException {
    public CustomRuntimeException(){
        super("CustomRuntimeException");
    }
    public CustomRuntimeException(String msg){
        super(msg);
    }
}
