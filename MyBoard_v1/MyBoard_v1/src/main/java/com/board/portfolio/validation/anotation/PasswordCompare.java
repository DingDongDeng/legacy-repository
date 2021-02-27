package com.board.portfolio.validation.anotation;

import com.board.portfolio.validation.validator.constraint.PasswordCompareValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordCompareValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordCompare {
    String message() default "not same password and password-check";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
