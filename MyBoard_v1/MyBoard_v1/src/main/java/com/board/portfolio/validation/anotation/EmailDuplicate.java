package com.board.portfolio.validation.anotation;

import com.board.portfolio.validation.validator.constraint.EmailDuplicateValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = EmailDuplicateValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface EmailDuplicate {
    String message() default "Email is exist";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
