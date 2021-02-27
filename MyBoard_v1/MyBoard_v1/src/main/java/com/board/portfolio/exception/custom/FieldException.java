package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class FieldException extends CustomRuntimeException {
    private String fieldName;
    private String rejectedValue;

    public FieldException(String fieldName, String rejectedValue) {
        this.fieldName = fieldName;
        this.rejectedValue = rejectedValue;
    }

    public FieldException(String msg, String fieldName, String rejectedValue) {
        super(msg);
        this.fieldName = fieldName;
        this.rejectedValue = rejectedValue;
    }
}
