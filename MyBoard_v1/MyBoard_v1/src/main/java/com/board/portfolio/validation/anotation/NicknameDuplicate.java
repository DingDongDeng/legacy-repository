package com.board.portfolio.validation.anotation;

import com.board.portfolio.validation.validator.constraint.NicknameDuplicateValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = NicknameDuplicateValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface NicknameDuplicate {
    String message() default "Nickname is exist";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
