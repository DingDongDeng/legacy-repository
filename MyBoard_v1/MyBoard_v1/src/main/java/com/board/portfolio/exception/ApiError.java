package com.board.portfolio.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

@AllArgsConstructor
@Getter
public class ApiError {
    private HttpStatus status;
    private List<ErrorContent> errorContent;
}
