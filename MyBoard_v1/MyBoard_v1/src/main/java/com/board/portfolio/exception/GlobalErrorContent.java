package com.board.portfolio.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GlobalErrorContent implements ValidErrorContent{
    private String message;
}
