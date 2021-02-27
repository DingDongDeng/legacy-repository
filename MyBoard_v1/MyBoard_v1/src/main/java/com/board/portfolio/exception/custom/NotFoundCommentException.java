package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class NotFoundCommentException extends CustomRuntimeException {
    public NotFoundCommentException(){
        super("comment.exist");
    }
    public NotFoundCommentException(String msg){
        super(msg);
    }
}
