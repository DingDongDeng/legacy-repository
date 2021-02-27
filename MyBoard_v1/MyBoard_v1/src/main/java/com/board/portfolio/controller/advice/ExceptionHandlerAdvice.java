package com.board.portfolio.controller.advice;

import com.board.portfolio.exception.ApiError;
import com.board.portfolio.exception.ErrorContent;
import com.board.portfolio.exception.FieldErrorContent;
import com.board.portfolio.exception.GlobalErrorContent;
import com.board.portfolio.exception.custom.CustomRuntimeException;
import com.board.portfolio.exception.custom.FieldException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@RestControllerAdvice
public class ExceptionHandlerAdvice extends ResponseEntityExceptionHandler {
    private final MessageSource validMessageSource;
    @Override
    protected ResponseEntity<Object> handleBindException(BindException ex, HttpHeaders headers, HttpStatus status, WebRequest req) {
        List<ErrorContent> contentList = getErrorContentList(ex, BindException.class);
        return responseWithBody(ex, new ApiError(HttpStatus.BAD_REQUEST, contentList), req);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest req) {
        List<ErrorContent> contentList = getErrorContentList(ex, MethodArgumentNotValidException.class);
        return responseWithBody(ex,new ApiError(HttpStatus.BAD_REQUEST,contentList), req);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> constraintViolationException(ConstraintViolationException ex, WebRequest req, Locale locale){
        List<ErrorContent> contentList = getErrorContentList(ex, ConstraintViolationException.class);
        return responseWithBody(ex,new ApiError(HttpStatus.BAD_REQUEST,contentList),req);
    }


    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> accessDeniedException(AccessDeniedException ex, WebRequest req, Locale locale){
        String message = validMessageSource.getMessage("signin.need", null,locale);
        return responseWithBody(ex, new ApiError(HttpStatus.BAD_REQUEST,Arrays.asList(new GlobalErrorContent(message))), req);
    }
    @ExceptionHandler(FieldException.class)
    public ResponseEntity fieldException(FieldException ex, WebRequest req, Locale locale){
        String message = validMessageSource.getMessage(ex.getMessage(), null,locale);
        return responseWithBody(ex, new ApiError(HttpStatus.BAD_REQUEST,Arrays.asList(new FieldErrorContent(ex.getFieldName(),message,ex.getRejectedValue()))), req);
    }

    @ExceptionHandler(CustomRuntimeException.class)
    public ResponseEntity customRuntimeException(CustomRuntimeException ex, WebRequest req, Locale locale){
        String message = validMessageSource.getMessage(ex.getMessage(), null,locale);
        return responseWithBody(ex, new ApiError(HttpStatus.BAD_REQUEST,Arrays.asList(new GlobalErrorContent(message))), req);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity runtimeException(RuntimeException ex, WebRequest req){
        log.error("runtimeException ", ex);
        String message = ex.getMessage();
        return responseWithBody(ex, new ApiError(HttpStatus.BAD_REQUEST,Arrays.asList(new GlobalErrorContent(message))), req);
    }

    private ResponseEntity<Object> responseWithBody(Exception ex, ApiError body, WebRequest request){
        return super.handleExceptionInternal(ex, body, new HttpHeaders(), body.getStatus(), request);
    }

    private List<ErrorContent> getErrorContentList(Exception e,Class aClass){

        List<ErrorContent> contentList = new ArrayList<>();
        if(MethodArgumentNotValidException.class.isAssignableFrom(aClass)){
            MethodArgumentNotValidException ex = (MethodArgumentNotValidException) e;
            addFieldErrors(contentList, ex.getBindingResult().getFieldErrors());
            addGlobalErrors(contentList, ex.getBindingResult().getGlobalErrors());
        }
        else if(BindException.class.isAssignableFrom(aClass)){
            BindException ex = (BindException) e;
            addFieldErrors(contentList, ex.getBindingResult().getFieldErrors());
            addGlobalErrors(contentList, ex.getBindingResult().getGlobalErrors());
        }
        else if(ConstraintViolationException.class.isAssignableFrom(aClass)){
            ConstraintViolationException ex = (ConstraintViolationException) e;
            addGlobalErrors(contentList, ex.getConstraintViolations());
        }


        return contentList;
    }

    private void addFieldErrors(List<ErrorContent> contentList, List<FieldError> fieldErrorList){
        for(FieldError error : fieldErrorList){
            contentList.add(new FieldErrorContent(
                    error.getField(),
                    error.getDefaultMessage(),
                    error.getRejectedValue()
            ));
        }
    }

    private void addGlobalErrors(List<ErrorContent> contentList, List<ObjectError> globalErrorList){
        for(ObjectError error : globalErrorList){
            contentList.add(new GlobalErrorContent(
                    error.getDefaultMessage()
            ));
        }
    }

    private void addGlobalErrors(List<ErrorContent> contentList, Set<ConstraintViolation<?>> constraintViolations){
        List constraintViolationList = constraintViolations.stream().collect(Collectors.toList());
        for(Object object : constraintViolationList){
            ConstraintViolation constraintViolation = (ConstraintViolation)object;
            contentList.add(new GlobalErrorContent(
                    constraintViolation.getMessage()
            ));
        }
    }

}
