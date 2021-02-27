package com.board.portfolio.validation.anotation;

import com.board.portfolio.validation.validator.constraint.EmailExistValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = EmailExistValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface EmailExist {
    String message() default "Email isn't exist";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
