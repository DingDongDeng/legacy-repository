package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class FailDownLoadFileException extends CustomRuntimeException {
    public FailDownLoadFileException(){
        super("file.fail.download");
    }
    public FailDownLoadFileException(String msg){
        super(msg);
    }
}
