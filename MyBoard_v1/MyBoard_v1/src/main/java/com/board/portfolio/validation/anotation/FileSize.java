package com.board.portfolio.validation.anotation;

import com.board.portfolio.validation.validator.constraint.FileSizeValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = FileSizeValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface FileSize {
    String message() default "file size too much";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    int fileSize();
    boolean nullable();
}

