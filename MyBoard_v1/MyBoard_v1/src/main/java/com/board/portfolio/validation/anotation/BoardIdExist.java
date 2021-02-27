package com.board.portfolio.validation.anotation;

import com.board.portfolio.validation.validator.constraint.BoardIdExistValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = BoardIdExistValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface BoardIdExist {
    String message() default "{board.exist}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
