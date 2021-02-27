package com.board.portfolio.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FieldErrorContent implements ValidErrorContent{
    private String field;
    private String message;
    private Object rejectedValue;
}
