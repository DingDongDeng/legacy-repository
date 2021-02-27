package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class NotFoundPostException extends CustomRuntimeException {
    public NotFoundPostException(){
        super("board.exist");
    }
    public NotFoundPostException(String msg){
        super(msg);
    }
}
